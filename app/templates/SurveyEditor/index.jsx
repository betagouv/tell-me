import { styled } from '@singularity-ui/core'
import debounce from 'lodash/debounce'
import * as R from 'ramda'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { SURVEY_BLOCK_TYPE } from '../../../common/constants'
import hashCode from '../../helpers/hashCode'
import useApi from '../../hooks/useApi'
import useEquivalenceEffect from '../../hooks/useEquivalenceEffect'
import SurveyManager from '../../libs/SurveyManager'
import Block from './Block'
import Title from './blocks/Title'
import Editable from './Editable'
import Header from './Header'
import Loader from './Loader'
import Logo from './Logo'

const Body = styled.div`
  max-width: 79rem;
  padding-bottom: 50%;
`

const TitleRow = styled.div`
  padding: 0 5rem;
`

export default function SurveyEditor() {
  const [, updateState] = useState()
  const forceUpdate = useCallback(() => updateState({}), [])
  const surveyManagerRef = useRef(new SurveyManager())
  const [isLoading, setIsLoading] = useState(true)
  const [title, setTitle] = useState('...')
  const { id } = useParams()
  const api = useApi()

  const surveyManager = surveyManagerRef.current

  const updateData = debounce(async () => {
    const data = {
      blocks: surveyManager.blocksData,
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
        surveyManager.blocks = blocks
      }
      setIsLoading(false)
    })()
  }, [])

  useEquivalenceEffect(() => {
    // Let's not override existing survey data with the initialization one
    if (isLoading) {
      return
    }

    updateData()
  }, [surveyManager.blocks, title])

  const updateTitle = newValue => {
    api.patch(`survey/${id}`, {
      title: newValue,
    })
  }

  const uploadHeader = async formData => {
    await api.put(`survey/${id}/upload?type=header`, formData)
  }

  const uploadLogo = async formData => {
    await api.put(`survey/${id}/upload?type=logo`, formData)
  }

  const changeFocusedBlockType = (index, newType) => {
    surveyManager.changeBlockTypeAt(index, newType)
    surveyManager.setFocusAt(index)

    forceUpdate()
  }

  const toggleBlockVisibilityAt = index => {
    surveyManager.toggleBlockVisibilityAt(index)

    forceUpdate()
  }

  const setIfSelectedThenShowQuestionIdAt = (index, questionBlockId) => {
    surveyManager.setIfSelectedThenShowQuestionIdAt(index, questionBlockId)

    forceUpdate()
  }

  const appendOrResetFocusedBlock = () => {
    const { focusedBlock } = surveyManager

    if (focusedBlock.isCountable && focusedBlock.value.length > 0) {
      surveyManager.addNewBlockAfterFocusedBlock(focusedBlock.type)
    } else if (focusedBlock.type === SURVEY_BLOCK_TYPE.CONTENT.TEXT || focusedBlock.value.length > 0) {
      surveyManager.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.CONTENT.TEXT)
    } else {
      surveyManager.changeFocusedBlockType(SURVEY_BLOCK_TYPE.CONTENT.TEXT)
    }

    forceUpdate()
  }

  const updateFocusedBlockValue = newValue => {
    surveyManager.changeFocusedBlockValue(newValue)

    updateData()
  }

  const removeFocusedBlock = () => {
    surveyManager.removeFocusedBlock()

    forceUpdate()
  }

  const focusPreviousBlock = () => {
    surveyManager.focusPreviousBlock()

    forceUpdate()
  }

  const focusNextBlock = () => {
    surveyManager.focusNextBlock()

    forceUpdate()
  }

  const isTitleFocused = surveyManager.focusedBlockIndex === -1

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      <Header onChange={uploadHeader} surveyId={id} />
      <Logo onChange={uploadLogo} surveyId={id} />

      <Body>
        <TitleRow>
          <Editable
            Component={Title}
            isFocused={isTitleFocused}
            onChange={updateTitle}
            onDown={focusNextBlock}
            onEnter={appendOrResetFocusedBlock}
            onFocus={surveyManager.unsetFocus}
            onUp={R.always()}
            value={title}
          />
        </TitleRow>

        {surveyManager.blocks.map((block, index) => (
          <Block
            // eslint-disable-next-line react/no-array-index-key
            key={`${index}.${hashCode(block.value)}`}
            block={block}
            index={index}
            isFocused={index === surveyManager.focusedBlockIndex}
            onChange={updateFocusedBlockValue}
            onChangeCondition={setIfSelectedThenShowQuestionIdAt}
            onChangeType={changeFocusedBlockType}
            onDown={focusNextBlock}
            onEnter={appendOrResetFocusedBlock}
            onFocus={surveyManager.setFocusAt}
            onRemove={removeFocusedBlock}
            onToggleVisibility={toggleBlockVisibilityAt}
            onUp={focusPreviousBlock}
            questionBlockAsOptions={surveyManager.questionBlockAsOptions}
          />
        ))}
      </Body>
    </>
  )
}
