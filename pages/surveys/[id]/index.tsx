import { generateTellMeTree } from '@app/helpers/generateTellMeTree'
import { useApi } from '@app/hooks/useApi'
import { SurveyEditorManager } from '@app/libs/SurveyEditorManager/index'
import { AdminBox } from '@app/organisms/AdminBox'
import { BlockEditor } from '@app/organisms/BlockEditor'
import { Loader } from '@app/organisms/BlockEditor/Loader'
import { HeaderEditor } from '@app/organisms/HeaderEditor'
import { LogoEditor } from '@app/organisms/LogoEditor'
import { TitleEditor } from '@app/organisms/TitleEditor'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import type { Survey } from '@prisma/client'
import type { TellMe } from '@schemas/1.0.0/TellMe'

const TitleRow = styled.div`
  padding: 0 13rem 0 10rem;
`

export default function SurveyEditorPage() {
  const $coverUri = useRef<string | null>(null)
  const $logoUri = useRef<string | null>(null)
  const $surveyEditorManager = useRef(new SurveyEditorManager())
  const $thankYouMessage = useRef<TellMe.Tree['data']['thankYouMessage']>(null)
  const $title = useRef('')
  const [, updateState] = useState()
  const forceUpdate = useCallback(() => updateState({} as any), [])
  const [isLoading, setIsLoading] = useState(true)
  const api = useApi()
  const intl = useIntl()
  const router = useRouter()

  const { id } = router.query

  const isTitleFocused = $surveyEditorManager.current.focusedBlockIndex === -1

  const appendNewBlockAt = useCallback((index: number = -1, type: TellMe.BlockType = 'content_text') => {
    $surveyEditorManager.current.appendNewBlockAt(index, type)

    forceUpdate()
    updateData()
  }, [])

  const focusNextBlock = useCallback(() => {
    $surveyEditorManager.current.focusNextBlock()

    forceUpdate()
  }, [])

  const focusPreviousBlock = useCallback(() => {
    $surveyEditorManager.current.focusPreviousBlock()

    forceUpdate()
  }, [])

  const removeBlockAt = useCallback((index: number) => {
    $surveyEditorManager.current.removeBlockAt(index)

    forceUpdate()
    updateData()
  }, [])

  const removeFocusedBlock = useCallback(() => {
    $surveyEditorManager.current.removeFocusedBlock()

    forceUpdate()
    updateData()
  }, [])

  const setIfSelectedThenShowQuestionIdsAt = useCallback((index: number, questionBlockIds: string[]) => {
    $surveyEditorManager.current.setIfSelectedThenShowQuestionIdsAt(index, questionBlockIds)

    forceUpdate()
    updateData()
  }, [])

  const toggleBlockVisibilityAt = useCallback((index: number) => {
    $surveyEditorManager.current.toggleBlockVisibilityAt(index)

    forceUpdate()
    updateData()
  }, [])

  const toggleObligationAt = useCallback((index: number) => {
    $surveyEditorManager.current.toggleBlockObligationAt(index)

    forceUpdate()
    updateData()
  }, [])

  const updateBlockKeyAt = useCallback((index: number, newKey: string | null) => {
    $surveyEditorManager.current.setBlockPropsAt(index, {
      key: newKey,
    })

    forceUpdate()
    updateData()
  }, [])

  const updateBlockTypeAt = useCallback((index: number, newType: TellMe.BlockType) => {
    $surveyEditorManager.current.setBlockTypeAt(index, newType)
    $surveyEditorManager.current.setFocusAt(index)

    forceUpdate()
    updateData()
  }, [])

  const updateBlockValueAt = useCallback((index: number, newValue: string) => {
    $surveyEditorManager.current.setBlockValueAt(index, newValue)

    updateData()
  }, [])

  const updateData = useCallback(
    debounce(async () => {
      if (id === undefined) {
        return
      }

      const tree = generateTellMeTree({
        backgroundUri: null,
        blocks: $surveyEditorManager.current.blocks,
        coverUri: $coverUri.current,
        id: String(id),
        language: intl.locale,
        logoUri: $logoUri.current,
        thankYouMessage: $thankYouMessage.current,
        title: $title.current,
      })

      ;(async () => {
        await api.patch(`surveys/${id}`, { tree })
      })()
    }, 250),
    [],
  )

  const updateTitle = useCallback((newTitle: string) => {
    $title.current = newTitle

    updateData()
  }, [])

  const uploadCover = useCallback(async (formData: FormData) => {
    const maybeBody = await api.put<{
      url: string | null
    }>(`assets`, formData)
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    const { url } = maybeBody.data

    $coverUri.current = url
    updateData()
  }, [])

  const uploadLogo = useCallback(async (formData: FormData) => {
    const maybeBody = await api.put<{
      url: string | null
    }>(`assets`, formData)
    if (maybeBody === null || maybeBody.hasError) {
      return
    }

    const { url } = maybeBody.data

    $logoUri.current = url
    updateData()
  }, [])

  useEffect(() => {
    ;(async () => {
      const maybeBody = await api.get<
        Survey & {
          tree: TellMe.Tree
        }
      >(`surveys/${id}`)
      if (maybeBody === null || maybeBody.hasError) {
        return
      }

      const {
        tree: {
          children,
          data: { coverUri, logoUri, thankYouMessage, title },
        },
      } = maybeBody.data

      $surveyEditorManager.current = new SurveyEditorManager(children)
      $thankYouMessage.current = thankYouMessage
      $coverUri.current = coverUri
      $logoUri.current = logoUri
      $title.current = title

      setIsLoading(false)
    })()
  }, [])

  if (isLoading) {
    return (
      <AdminBox>
        <Loader />
      </AdminBox>
    )
  }

  return (
    <AdminBox>
      <HeaderEditor onChange={uploadCover} url={$coverUri.current} />
      <LogoEditor onChange={uploadLogo} url={$logoUri.current} />

      <TitleRow>
        <TitleEditor
          defaultValue={$title.current}
          isFocused={isTitleFocused}
          onDownKeyDown={focusNextBlock}
          onEnterKeyDown={appendNewBlockAt}
          onFocus={$surveyEditorManager.current.unsetFocus}
          onValueChange={updateTitle}
        />
      </TitleRow>

      {$surveyEditorManager.current.blocks.map((block, index) => (
        <BlockEditor
          key={block.id}
          block={block}
          index={index}
          isFocused={index === $surveyEditorManager.current.focusedBlockIndex}
          onAppendBlockAt={appendNewBlockAt}
          onChangeAt={updateBlockValueAt}
          onChangeConditionAt={setIfSelectedThenShowQuestionIdsAt}
          onChangeKeyAt={updateBlockKeyAt}
          onChangeTypeAt={updateBlockTypeAt}
          onDownKeyDown={focusNextBlock}
          onFocusAt={$surveyEditorManager.current.setFocusAt}
          onRemove={removeFocusedBlock}
          onRemoveAt={removeBlockAt}
          onToggleObligation={toggleObligationAt}
          onToggleVisibility={toggleBlockVisibilityAt}
          onUpKeyDown={focusPreviousBlock}
          questionBlocksAsOptions={$surveyEditorManager.current.questionBlocksAsOptions}
        />
      ))}
    </AdminBox>
  )
}
