/* eslint-disable react/jsx-props-no-spreading */

import { useEffect, useReducer, useRef, useState } from 'react'

import { getRandomId } from '../../helpers/getRandomId'
import { useIsMounted } from '../../hooks/useIsMounted'
import { usePrevious } from '../../hooks/usePrevious'
import { BlockMenu } from './BlockMenu'
import { blockMenuReducer } from './blockMenuReducer'
import { FormatMenu } from './FormatMenu'

import type { BlockMenuReducerAction, BlockMenuReducerState } from './blockMenuReducer'
import type { FormatMenuProps } from './FormatMenu'
import type { BlockMenuItem } from './types'
import type { TellMe } from '@schemas/1.0.0/TellMe'
import type { KeyboardEvent, MouseEvent, MutableRefObject, Reducer } from 'react'

const MENU_ITEMS: BlockMenuItem[] = [
  {
    category: 'Content',
    // Icon: HelpIcon,
    label: 'Question',
    type: 'question',
  },
  {
    category: 'Content',
    // Icon: HelpIcon,
    label: 'Paragraph',
    type: 'content_text',
  },
  {
    category: 'Input',
    // Icon: DoneAllIcon,
    label: 'Choice',
    type: 'input_choice',
  },
  {
    category: 'Input',
    // Icon: DoneIcon,
    label: 'Multiple Choices',
    type: 'input_multiple_choice',
  },
  {
    category: 'Input',
    // Icon: DoneIcon,
    label: 'File Upload',
    type: 'input_file',
  },
  {
    category: 'Input',
    // Icon: ShortTextIcon,
    label: 'Short Answer',
    type: 'input_short_answer',
  },
  {
    category: 'Input',
    // Icon: ViewHeadlineIcon,
    label: 'Long Answer',
    type: 'input_long_answer',
  },
]
const MENU_ITEMS_LENGTH = MENU_ITEMS.length

type EditableProps<P = Common.AnyProps> = P & {
  as: any
  defaultValue?: string
  isFocused?: boolean
  isRichText?: boolean
  onBackspaceKeyDown?: Common.Nullable<() => void>
  onChange: (newValue: string) => void
  onChangeType?: Common.Nullable<(newType: TellMe.BlockType) => void>
  onDownKeyDown?: Common.Nullable<() => void>
  onEnterKeyDown?: Common.Nullable<() => void>
  onFocus?: Common.Nullable<() => void>
  onUpKeyDown?: Common.Nullable<() => void>
}
export function Editable<P = Common.AnyProps>({
  as,
  defaultValue = '',
  isFocused = false,
  isRichText = false,
  onBackspaceKeyDown = null,
  onChange,
  onChangeType = null,
  onDownKeyDown = null,
  onEnterKeyDown = null,
  onFocus = null,
  onUpKeyDown = null,
  ...props
}: EditableProps<P>) {
  const [blockMenuState, dispatchToBlockMenu] = useReducer<Reducer<BlockMenuReducerState, BlockMenuReducerAction>>(
    blockMenuReducer,
    {
      items: MENU_ITEMS,
      length: MENU_ITEMS_LENGTH,
      query: '',
      selectedIndex: 0,
      visibleItems: MENU_ITEMS,
    },
  )
  const componentRef = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const lastValueBeforeOpeningBlockMenuRef = useRef(defaultValue) as MutableRefObject<string>
  const [isBlockMenuOpen, setIsBlockMenuOpen] = useState<boolean>(false)
  const isMounted = useIsMounted()
  const wasFocused = usePrevious(isFocused)

  // States used for rich text blocks
  const controlledValueRef = useRef(defaultValue) as MutableRefObject<string>
  const formatMenuAnchorRef = useRef(null) as MutableRefObject<Common.Nullable<FormatMenuProps['anchor']>>
  const selectionFocusNodeRef = useRef(null) as MutableRefObject<Common.Nullable<Node>>
  const selectionFocusOffsetRef = useRef<number>(defaultValue.length)
  const hasFormattedRef = useRef<boolean>(false)
  const [formatMenuKey, setFormatMenuKey] = useState<string>(getRandomId())
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState<boolean>(false)

  const Component = as
  const hasBlockMenu = MENU_ITEMS.length > 0
  // Used as content editable div prop for rich text blocks
  const innerHTML = { __html: controlledValueRef.current }

  const closeBlockMenu = () => {
    if (isMounted()) {
      setIsBlockMenuOpen(false)
    }
  }

  const closeFormatMenu = (event?: globalThis.MouseEvent) => {
    if (event === undefined) {
      window.removeEventListener('click', closeFormatMenu)
    }

    if (isMounted()) {
      setIsFormatMenuOpen(false)
    }
  }

  const detectUnselection = () => {
    window.addEventListener('click', closeFormatMenu, {
      once: true,
    })
  }

  const handleBlockTypeChange = newBlockType => {
    if (lastValueBeforeOpeningBlockMenuRef.current !== null) {
      onChange(lastValueBeforeOpeningBlockMenuRef.current)
    }

    if (onChangeType === null) {
      return
    }

    onChangeType(newBlockType)
  }

  const handleClick = () => {
    if (!isFormatMenuOpen) {
      return
    }

    closeFormatMenu()
  }

  const handleFocus = (): void => {
    if (onFocus !== null) {
      onFocus()
    }
  }

  const handleInput = () => {
    if (componentRef.current === null) {
      return
    }

    if (!isRichText) {
      const newValue = componentRef.current.innerText

      if (hasBlockMenu && !isBlockMenuOpen) {
        lastValueBeforeOpeningBlockMenuRef.current = newValue
      }

      onChange(newValue)

      return
    }

    const selection = window.getSelection()
    if (selection === null) {
      return
    }

    selectionFocusNodeRef.current = selection.focusNode
    selectionFocusOffsetRef.current = selection.focusOffset

    const newValue = componentRef.current.innerHTML

    if (hasBlockMenu && !isBlockMenuOpen) {
      lastValueBeforeOpeningBlockMenuRef.current = newValue
    }

    onChange(newValue)
  }

  const openBlockMenu = () => {
    if (isMounted()) {
      setIsBlockMenuOpen(true)
    }
  }

  const openFormatMenu = () => {
    if (isMounted()) {
      setIsFormatMenuOpen(true)
      setFormatMenuKey(getRandomId())
    }
  }

  const updateControlledValue = async (newValue: string) => {
    controlledValueRef.current = newValue
    hasFormattedRef.current = true

    closeFormatMenu()
    onChange(newValue)
  }

  const controlKey = (event: KeyboardEvent<HTMLElement>) => {
    if (!isMounted()) {
      return
    }

    // eslint-disable-next-line default-case
    switch (event.keyCode) {
      case 40:
        if (hasBlockMenu && isBlockMenuOpen) {
          event.preventDefault()

          dispatchToBlockMenu({ type: 'selectNext' })
        } else if (onDownKeyDown !== null) {
          event.preventDefault()

          onDownKeyDown()
        }

        return

      case 38:
        if (hasBlockMenu && isBlockMenuOpen) {
          event.preventDefault()

          dispatchToBlockMenu({ type: 'selectPrevious' })
        } else if (onUpKeyDown !== null) {
          event.preventDefault()

          onUpKeyDown()
        }

        return

      case 13:
        if (hasBlockMenu && isBlockMenuOpen) {
          event.preventDefault()

          handleBlockTypeChange(blockMenuState.visibleItems[blockMenuState.selectedIndex].type)
        } else if (onEnterKeyDown !== null) {
          event.preventDefault()

          onEnterKeyDown()
        }

        return

      case 191:
      case 111:
        if (hasBlockMenu && !isBlockMenuOpen) {
          openBlockMenu()
        }

        return

      case 27:
        if (hasBlockMenu && isBlockMenuOpen) {
          event.preventDefault()

          closeBlockMenu()
        }

        return

      case 8:
        if (isBlockMenuOpen) {
          if (blockMenuState.query.length === 0) {
            closeBlockMenu()

            return
          }

          dispatchToBlockMenu({
            payload: {
              query: blockMenuState.query.substr(0, blockMenuState.query.length - 1),
            },
            type: 'updateQuery',
          })
        } else if (
          componentRef.current !== null &&
          componentRef.current.innerText.length === 0 &&
          onBackspaceKeyDown !== null
        ) {
          event.preventDefault()

          onBackspaceKeyDown()
        }
    }

    if (isBlockMenuOpen && !event.metaKey && !event.ctrlKey && !event.altKey && /^[a-zA-Z]$/.test(event.key)) {
      dispatchToBlockMenu({
        payload: {
          query: `${blockMenuState.query}${event.key}`,
        },
        type: 'updateQuery',
      })
    }
  }

  const handleSelection = (event: MouseEvent<HTMLElement>) => {
    if (!isMounted() || !isRichText) {
      return
    }

    formatMenuAnchorRef.current = event.currentTarget

    setTimeout(() => {
      if (!isMounted()) {
        return
      }

      const selection = window.getSelection()
      if (selection === null || selection.isCollapsed) {
        if (isFormatMenuOpen) {
          closeFormatMenu()
        }

        return
      }

      selectionFocusNodeRef.current = selection.focusNode
      selectionFocusOffsetRef.current = selection.focusOffset

      // TODO Handle multi-node rich text formatting.
      if (selection.anchorNode !== selection.focusNode) {
        return
      }

      openFormatMenu()
    })
  }

  useEffect(() => {
    if (!isMounted() || !isFocused || componentRef.current === null) {
      return
    }

    const selection = window.getSelection()

    const range = window.document.createRange()
    const rangeOffset = Number(controlledValueRef.current.length > 0)
    range.setStart(componentRef.current, rangeOffset)
    range.collapse(true)

    if (selection !== null) {
      selection.removeAllRanges()
      selection.addRange(range)
    }

    if (!wasFocused) {
      componentRef.current.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center',
      })
    }
  }, [])

  useEffect(() => {
    if (!isMounted() || !isFormatMenuOpen) {
      return
    }

    setTimeout(detectUnselection)
  }, [isFormatMenuOpen])

  useEffect(() => {
    if (!isMounted() || !isRichText || isFormatMenuOpen || !hasFormattedRef.current) {
      return
    }

    hasFormattedRef.current = false

    const selection = window.getSelection()
    if (selection !== null) {
      selection.collapse(selectionFocusNodeRef.current, selectionFocusOffsetRef.current)
    }
  }, [isFormatMenuOpen])

  return (
    <div ref={innerRef}>
      {isFormatMenuOpen && formatMenuAnchorRef.current !== null && (
        <FormatMenu
          key={formatMenuKey}
          anchor={formatMenuAnchorRef.current}
          onChange={updateControlledValue}
          source={controlledValueRef.current}
        />
      )}

      <Component
        ref={componentRef}
        contentEditable
        dangerouslySetInnerHTML={innerHTML}
        onClick={handleClick}
        onFocus={handleFocus}
        onInput={handleInput}
        onKeyDown={controlKey}
        onMouseUp={handleSelection}
        spellCheck={false}
        suppressContentEditableWarning
        {...props}
      />

      {isBlockMenuOpen && innerRef.current !== null && (
        <BlockMenu
          anchor={innerRef.current}
          defaultSelectedIndex={blockMenuState.selectedIndex}
          items={blockMenuState.visibleItems}
          onCancel={closeBlockMenu}
          onSelect={handleBlockTypeChange}
        />
      )}
    </div>
  )
}
