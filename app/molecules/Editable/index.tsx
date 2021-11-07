/* eslint-disable react/jsx-props-no-spreading */

import PropTypes from 'prop-types'
import { ElementType, FunctionComponent, Reducer, RefObject, useEffect, useReducer, useRef, useState } from 'react'

import { SURVEY_BLOCK_TYPE } from '../../../common/constants'
import usePrevious from '../../hooks/usePrevious'
import BlockMenu from './BlockMenu'
import blockMenuReducer, { BlockMenuReducerAction, BlockMenuReducerState } from './blockMenuReducer'
import FormatMenu, { FormatMenuProps } from './FormatMenu'
import sanitizeRichText from './sanitizeRichText'

const MENU_ITEMS = [
  {
    // Icon: HelpIcon,
    label: 'Question',
    type: SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
  },
  {
    // Icon: DoneAllIcon,
    label: 'Choice',
    type: SURVEY_BLOCK_TYPE.INPUT.CHOICE,
  },
  {
    // Icon: DoneIcon,
    label: 'Checkboxes',
    type: SURVEY_BLOCK_TYPE.INPUT.CHECKBOX,
  },
  {
    // Icon: ShortTextIcon,
    label: 'Short Answer',
    type: SURVEY_BLOCK_TYPE.INPUT.SHORT_ANSWER,
  },
  {
    // Icon: ViewHeadlineIcon,
    label: 'Long Answer',
    type: SURVEY_BLOCK_TYPE.INPUT.LONG_ANSWER,
  },
]
const MENU_ITEMS_LENGTH = MENU_ITEMS.length

export type EditableProps = {
  as: ElementType
  defaultValue: string
  isFocused: boolean
  isRichText: boolean
  onBackspaceKeyDown: Common.Nullable<() => void>
  onChange: (newValue: string) => void
  onChangeType: Common.Nullable<(newBlockType: string) => void>
  onDownKeyDown: Common.Nullable<() => void>
  onEnterKeyDown: Common.Nullable<() => void>
  onFocus: Common.Nullable<(event: FocusEvent) => void>
  onUpKeyDown: Common.Nullable<() => void>

  // eslint-disable-next-line typescript-sort-keys/interface
  [key: string]: any
}
const Editable: FunctionComponent<EditableProps> = ({
  as,
  defaultValue,
  isFocused,
  isRichText,
  onBackspaceKeyDown,
  onChange,
  onChangeType,
  onDownKeyDown,
  onEnterKeyDown,
  onFocus,
  onUpKeyDown,
  ...props
}) => {
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
  const lastValueBeforeOpeningBlockMenuRef = useRef(defaultValue) as Common.Writeable<RefObject<string>>
  const [isBlockMenuOpen, setIsBlockMenuOpen] = useState<boolean>(false)
  const wasFocused = usePrevious(isFocused)

  // States used for rich text blocks
  const selectionFocusNodeRef = useRef(null) as Common.Writeable<RefObject<Node>>
  const selectionFocusOffsetRef = useRef<number>(defaultValue.length)
  const hasFormattedRef = useRef<boolean>(false)
  const [controlledIsFocused, setControlledIsFocused] = useState(false)
  const [controlledValue, setControlledValue] = useState(defaultValue)
  const [formatMenuProps, setFormatMenuProps] = useState<Pick<FormatMenuProps, 'anchor' | 'selection'> | null>(null)
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState<boolean>(false)

  const Component = as
  const hasBlockMenu = MENU_ITEMS.length > 0
  // Used as content editable div prop for rich text blocks
  const innerHTML = { __html: controlledValue }

  const closeBlockMenu = () => {
    setIsBlockMenuOpen(false)
  }

  const closeFormatMenu = () => {
    setIsFormatMenuOpen(false)
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

  const handleFocus = (event: FocusEvent): void => {
    setControlledIsFocused(true)

    if (onFocus !== null) {
      onFocus(event)
    }
  }

  const handleInput = async () => {
    if (componentRef.current === null) {
      return
    }

    if (!isRichText) {
      const newValue = componentRef.current.innerText

      if (hasBlockMenu && !isBlockMenuOpen) {
        lastValueBeforeOpeningBlockMenuRef.current = newValue
      }

      onChange(componentRef.current.innerText)

      return
    }

    const selection = window.getSelection()
    if (selection === null) {
      return
    }

    selectionFocusNodeRef.current = selection.focusNode
    selectionFocusOffsetRef.current = selection.focusOffset

    const currentValue = componentRef.current.innerHTML
    const newValue = await sanitizeRichText(currentValue)

    if (hasBlockMenu && !isBlockMenuOpen) {
      lastValueBeforeOpeningBlockMenuRef.current = newValue
    }

    onChange(newValue)

    if (newValue !== currentValue) {
      setControlledValue(newValue)
    }
  }

  const openBlockMenu = () => {
    setIsBlockMenuOpen(true)
  }

  const openFormatMenu = () => {
    setIsFormatMenuOpen(true)
  }

  const updateControlledValue = async newValue => {
    window.removeEventListener('click', closeFormatMenu)

    setControlledValue(newValue)
    hasFormattedRef.current = true

    closeFormatMenu()
    onChange(newValue)
  }

  const controlKey = (event: KeyboardEvent) => {
    // eslint-disable-next-line default-case
    switch (event.code) {
      case 'ArrowDown':
        if (hasBlockMenu && isBlockMenuOpen) {
          event.preventDefault()

          dispatchToBlockMenu({ type: 'selectNext' })
        } else if (onDownKeyDown !== null) {
          event.preventDefault()

          onDownKeyDown()
        }

        return

      case 'ArrowUp':
        if (hasBlockMenu && isBlockMenuOpen) {
          event.preventDefault()

          dispatchToBlockMenu({ type: 'selectPrevious' })
        } else if (onUpKeyDown !== null) {
          event.preventDefault()

          onUpKeyDown()
        }

        return

      case 'Enter':
      case 'NumpadEnter':
        if (hasBlockMenu && isBlockMenuOpen) {
          event.preventDefault()

          handleBlockTypeChange(blockMenuState.visibleItems[blockMenuState.selectedIndex].type)
        } else if (onUpKeyDown !== null) {
          event.preventDefault()

          onUpKeyDown()
        }

        return

      case 'Slash':
      case 'NumpadDivide':
        if (hasBlockMenu && !isBlockMenuOpen) {
          openBlockMenu()
        }

        return

      case 'Escape':
        if (hasBlockMenu && isBlockMenuOpen) {
          event.preventDefault()

          closeBlockMenu()
        }

        return

      case 'Backspace':
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

  /**
   * @param {MouseEvent} event
   */
  const controlMouse = event => {
    if (!isRichText) {
      return
    }

    const selection = window.getSelection()
    if (selection === null) {
      return
    }

    selectionFocusNodeRef.current = selection.focusNode
    selectionFocusOffsetRef.current = selection.focusOffset

    if (selection.isCollapsed) {
      return
    }

    // TODO Handle multi-node rich text formatting.
    if (selection.anchorNode !== selection.focusNode) {
      return
    }

    setFormatMenuProps({
      anchor: event.target,
      selection,
    })

    setImmediate(openFormatMenu)
  }

  useEffect(() => {
    if (!isFocused || controlledIsFocused || componentRef.current === null) {
      return
    }

    const range = window.document.createRange()
    // TODO Handle Rich Text caret positonning.
    if (isRichText) {
      range.setStart(componentRef.current, 0)
      // } else if (componentRef.current.innerText === defaultValue) {
      //   range.setStart(componentRef.current, componentRef.current.innerText.length)
    } else if (
      componentRef.current.childNodes.length > 0 &&
      (componentRef.current.childNodes[0] as HTMLElement).innerText !== undefined
    ) {
      range.setStart(
        componentRef.current.childNodes[0],
        (componentRef.current.childNodes[0] as HTMLElement).innerText.length,
      )
    }
    range.collapse(true)

    const selection = window.getSelection()
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
  })

  useEffect(() => {
    if (!isFormatMenuOpen) {
      return
    }

    setImmediate(detectUnselection)
  }, [isFormatMenuOpen])

  useEffect(() => {
    if (!isRichText || isFormatMenuOpen || !hasFormattedRef.current) {
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
      {isFormatMenuOpen && formatMenuProps !== null && formatMenuProps.anchor !== null && (
        <FormatMenu onChange={updateControlledValue} source={controlledValue} {...formatMenuProps} />
      )}

      <Component
        ref={componentRef}
        contentEditable
        dangerouslySetInnerHTML={innerHTML}
        onFocus={handleFocus}
        onInput={handleInput}
        onKeyDown={controlKey}
        onMouseUp={controlMouse}
        spellCheck={false}
        style={{ outline: 0 }}
        suppressContentEditableWarning
        {...props}
      />

      {isBlockMenuOpen && innerRef.current !== null && (
        <BlockMenu
          anchor={innerRef.current}
          items={blockMenuState.visibleItems}
          onCancel={closeBlockMenu}
          onSelect={handleBlockTypeChange}
          selectedIndex={blockMenuState.selectedIndex}
        />
      )}
    </div>
  )
}

Editable.defaultProps = {
  defaultValue: '',
  isFocused: false,
  isRichText: false,
  onBackspaceKeyDown: null,
  onChangeType: null,
  onDownKeyDown: null,
  onEnterKeyDown: null,
  onFocus: null,
  onUpKeyDown: null,
}

Editable.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  as: PropTypes.any.isRequired,
  defaultValue: PropTypes.string as any,
  isFocused: PropTypes.bool as any,
  isRichText: PropTypes.bool as any,
  onBackspaceKeyDown: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onChangeType: PropTypes.func,
  onDownKeyDown: PropTypes.func,
  onEnterKeyDown: PropTypes.func,
  onFocus: PropTypes.func,
  onUpKeyDown: PropTypes.func,
}

export default Editable
