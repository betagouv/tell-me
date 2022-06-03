import debounce from 'lodash/debounce'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { SURVEY_BLOCK_TYPE } from '../../../common/constants'
import hashCode from '../../helpers/hashCode'
import useApi from '../../hooks/useApi'
import useEquivalenceEffect from '../../hooks/useEquivalenceEffect'
import LegacySurveyManager from '../../libs/LegacySurveyManager/index'
import LegacyEditable from '../../molecules/LegacyEditable/index'
import Block from './Block'
import Title from './blocks/Title'
import Header from './Header'
import Loader from './Loader'
import Logo from './Logo'

const TitleRow = styled.div`
  padding: 0 13rem 0 7rem;
`

export default function LegacySurveyEditor() {
  const [, updateState] = useState()
  const forceUpdate = useCallback(() => updateState({} as any), [])
  const surveyManagerRef = useRef(new LegacySurveyManager())
  const [isLoading, setIsLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [coverUrl, setCoverUrl] = useState(null)
  const [logoUrl, setLogoUrl] = useState(null)
  const api = useApi()
  const router = useRouter()

  const { id } = router.query

  const surveyManager = surveyManagerRef.current

  const updateData = debounce(async () => {
    const data = {
      blocks: surveyManager.blocksData,
      title,
    }

    ;(async () => {
      await api.patch(`legacy/surveys/${id}`, data)
    })()
  }, 250)

  useEffect(() => {
    ;(async () => {
      const maybeBody = await api.get(`legacy/surveys/${id}`)
      if (maybeBody === null || maybeBody.hasError) {
        return
      }

      const {
        blocks,
        props: { coverUrl, logoUrl },
        title,
      } = maybeBody.data

      setTitle(title)
      setCoverUrl(coverUrl)
      setLogoUrl(logoUrl)
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
    api.patch(`legacy/surveys/${id}`, {
      title: newValue,
    })
  }

  const uploadCover = async formData => {
    await api.put(`legacy/surveys/${id}/upload?type=cover`, formData)
  }

  const uploadLogo = async formData => {
    await api.put(`legacy/surveys/${id}/upload?type=logo`, formData)
  }

  const changeBlockTypeAt = (index, newType) => {
    surveyManager.changeBlockTypeAt(index, newType)
    surveyManager.setFocusAt(index)

    forceUpdate()
  }

  const toggleObligationAt = index => {
    surveyManager.toggleBlockObligationAt(index)

    forceUpdate()
  }

  const toggleBlockVisibilityAt = index => {
    surveyManager.toggleBlockVisibilityAt(index)

    forceUpdate()
  }

  const setIfSelectedThenShowQuestionIdAt = (index: number, questionBlockId: Common.Nullable<string>) => {
    surveyManager.setIfSelectedThenShowQuestionIdAt(index, questionBlockId)

    forceUpdate()
  }

  const appendNewBlockAt = (index: number = -1, type: string = SURVEY_BLOCK_TYPE.CONTENT.TEXT) => {
    surveyManager.appendNewBlockAt(index, type)

    forceUpdate()
  }

  const updateBlockValueAt = (index, newValue) => {
    surveyManager.changeBlockValueAt(index, newValue)

    updateData()
  }

  const removeBlockAt = index => {
    surveyManager.removeBlockAt(index)

    forceUpdate()
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
      <Header onChange={uploadCover} url={coverUrl} />
      <Logo onChange={uploadLogo} url={logoUrl} />

      <TitleRow>
        <LegacyEditable
          as={Title}
          defaultValue={title}
          isFocused={isTitleFocused}
          isRichText={false}
          onChange={updateTitle}
          onDownKeyDown={focusNextBlock}
          onEnterKeyDown={appendNewBlockAt}
          onFocus={surveyManager.unsetFocus}
        />
      </TitleRow>

      {surveyManager.blocks.map((block, index) => (
        <Block
          // eslint-disable-next-line react/no-array-index-key
          key={`${index}.${block.type}.${hashCode(block.value)}`}
          block={block}
          index={index}
          isFocused={index === surveyManager.focusedBlockIndex}
          onAppendBlockAt={appendNewBlockAt}
          onChangeAt={updateBlockValueAt}
          onChangeConditionAt={setIfSelectedThenShowQuestionIdAt}
          onChangeTypeAt={changeBlockTypeAt}
          onDownKeyDown={focusNextBlock}
          onFocus={surveyManager.setFocusAt}
          onRemove={removeFocusedBlock}
          onRemoveAt={removeBlockAt}
          onToggleObligation={toggleObligationAt}
          onToggleVisibility={toggleBlockVisibilityAt}
          onUpKeyDown={focusPreviousBlock}
          questionBlockAsOptions={surveyManager.questionBlockAsOptions}
        />
      ))}
    </>
  )
}
