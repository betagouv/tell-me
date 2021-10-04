import debounce from 'lodash/debounce'
import * as R from 'ramda'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { SURVEY_BLOCK_TYPE } from '../../../../common/constants'
import SurveyBlocksManager from '../../../../common/SurveyBlocksManager'
import useApi from '../../../hooks/useApi'
import useEquivalenceEffect from '../../../hooks/useEquivalenceEffect'
import Block from './Block'
import Title from './blocks/Title'
import Editable from './Editable'
import Header from './Header'
import Loader from './Loader'
import Logo from './Logo'

const TitleRow = styled.div`
  padding: 0 5rem;
`

export default function SurveyEditor() {
  const [, updateState] = useState()
  const forceUpdate = useCallback(() => updateState({}), [])
  const surveyBlocksManagerRef = useRef(new SurveyBlocksManager())
  const [title, setTitle] = useState('...')
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()
  const api = useApi()

  const surveyBlocksManager = surveyBlocksManagerRef.current

  const updateData = debounce(async () => {
    const data = {
      blocks: surveyBlocksManager.blocksData,
      title,
    }

    ;(async () => {
      await api.patch(`survey/${id}`, data)
    })()
  }, 250)

  useEffect(() => {
    ;(async () => {
      const maybeBody = await api.get(`survey/${id}`)
      if (maybeBody === null) {
        return
      }

      const { blocks, title } = maybeBody.data
      setTitle(title)
      if (blocks.length > 0) {
        surveyBlocksManager.blocks = blocks
      }
      setIsLoading(false)
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEquivalenceEffect(() => {
    // Let's not override existing survey data with the initialization one
    if (isLoading) {
      return
    }

    updateData()
  }, [surveyBlocksManager.blocks, title])

  const updateTitle = newValue => {
    api.patch(`survey/${id}`, {
      title: newValue,
    })
  }

  const changeFocusedBlockType = (index, newType) => {
    surveyBlocksManager.changeBlockTypeAt(index, newType)
    surveyBlocksManager.setFocusAt(index)

    forceUpdate()
  }

  const appendOrResetFocusedBlock = () => {
    const { focusedBlock } = surveyBlocksManager

    if (focusedBlock.isCountable && focusedBlock.value.length > 0) {
      surveyBlocksManager.addNewBlockAfterFocusedBlock(focusedBlock.type)
    } else if (focusedBlock.type === SURVEY_BLOCK_TYPE.CONTENT.TEXT || focusedBlock.value.length > 0) {
      surveyBlocksManager.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.CONTENT.TEXT)
    } else {
      surveyBlocksManager.changeFocusedBlockType(SURVEY_BLOCK_TYPE.CONTENT.TEXT)
    }

    forceUpdate()
  }

  const updateFocusedBlockValue = newValue => {
    surveyBlocksManager.changeFocusedBlockValue(newValue)

    updateData()
  }

  const removeFocusedBlock = () => {
    surveyBlocksManager.removeFocusedBlock()

    forceUpdate()
  }

  const focusAndUpdateAt = index => {
    surveyBlocksManager.setFocusAt(index)

    forceUpdate()
  }

  const focusPreviousBlock = () => {
    surveyBlocksManager.focusPreviousBlock()

    forceUpdate()
  }

  const focusNextBlock = () => {
    surveyBlocksManager.focusNextBlock()

    forceUpdate()
  }

  const isTitleFocused = surveyBlocksManager.focusedBlockIndex === -1

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      <Header />
      <Logo />

      <TitleRow>
        <Editable
          Component={Title}
          isFocused={isTitleFocused}
          onChange={updateTitle}
          onDown={focusNextBlock}
          onEnter={appendOrResetFocusedBlock}
          onFocus={surveyBlocksManager.unsetFocus}
          onUp={R.always()}
          value={title}
        />
      </TitleRow>

      {surveyBlocksManager.blocks.map((block, index) => (
        <Block
          // eslint-disable-next-line react/no-array-index-key
          key={`${index}_${block.type}`}
          block={block}
          blocks={surveyBlocksManager.blocks}
          index={index}
          isFocused={index === surveyBlocksManager.focusedBlockIndex}
          onChange={updateFocusedBlockValue}
          onChangeType={changeFocusedBlockType}
          onDown={focusNextBlock}
          onEnter={appendOrResetFocusedBlock}
          onFocus={surveyBlocksManager.setFocusAt}
          onFocusFromOutside={focusAndUpdateAt}
          onRemove={removeFocusedBlock}
          onUp={focusPreviousBlock}
        />
      ))}
    </>
  )
}
