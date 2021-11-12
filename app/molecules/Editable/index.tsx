/* eslint-disable react/jsx-props-no-spreading */

import PropTypes from 'prop-types'
import {
  FocusEvent,
  FocusEventHandler,
  FunctionComponent,
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEvent,
  MutableRefObject,
  Reducer,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'

import { SURVEY_BLOCK_TYPE } from '../../../common/constants'
import getRandomId from '../../helpers/getRandomId'
import useIsMounted from '../../hooks/useIsMounted'
import usePrevious from '../../hooks/usePrevious'
import BlockMenu from './BlockMenu'
import blockMenuReducer, { BlockMenuReducerAction, BlockMenuReducerState } from './blockMenuReducer'
import FormatMenu, { FormatMenuProps } from './FormatMenu'

const MENU_ITEMS = [
  {
    category: 'Content',
    // Icon: HelpIcon,
    label: 'Question',
    type: SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
  },
  {
    category: 'Content',
    // Icon: HelpIcon,
    label: 'Paragraph',
    type: SURVEY_BLOCK_TYPE.CONTENT.TEXT,
  },
  {
    category: 'Input',
    // Icon: DoneAllIcon,
    label: 'Choice',
    type: SURVEY_BLOCK_TYPE.INPUT.CHOICE,
  },
  {
    category: 'Input',
    // Icon: DoneIcon,
    label: 'Checkboxes',
    type: SURVEY_BLOCK_TYPE.INPUT.CHECKBOX,
  },
  {
    category: 'Input',
    // Icon: ShortTextIcon,
    label: 'Short Answer',
    type: SURVEY_BLOCK_TYPE.INPUT.SHORT_ANSWER,
  },
  {
    category: 'Input',
    // Icon: ViewHeadlineIcon,
    label: 'Long Answer',
    type: SURVEY_BLOCK_TYPE.INPUT.LONG_ANSWER,
  },
]
const MENU_ITEMS_LENGTH = MENU_ITEMS.length

type EditableComponent<T = HTMLElement, P = Common.AnyProps> = FunctionComponent<
  P & {
    as: any
    defaultValue?: string
    isFocused?: boolean
    isRichText?: boolean
    onBackspaceKeyDown?: KeyboardEventHandler<T>
    onChange: (newValue: string) => void
    onChangeType?: (newType: string) => void
    onDownKeyDown?: KeyboardEventHandler<T>
    onEnterKeyDown?: KeyboardEventHandler<T>
    onFocus?: FocusEventHandler<T>
    onUpKeyDown?: KeyboardEventHandler<T>
  }
>

const stopPropagation = (event: MouseEvent) => {
  event.stopPropagation()
}

const Editable: EditableComponent = ({
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
  const lastValueBeforeOpeningBlockMenuRef = useRef(defaultValue) as MutableRefObject<string>
  const [isBlockMenuOpen, setIsBlockMenuOpen] = useState<boolean>(false)
  const isMounted = useIsMounted()
  const wasFocused = usePrevious(isFocused)

  // States used for rich text blocks
  const formatMenuAnchorRef = useRef(null) as MutableRefObject<Common.Nullable<FormatMenuProps['anchor']>>
  const selectionFocusNodeRef = useRef(null) as MutableRefObject<Common.Nullable<Node>>
  const selectionFocusOffsetRef = useRef<number>(defaultValue.length)
  const hasFormattedRef = useRef<boolean>(false)
  const [controlledIsFocused, setControlledIsFocused] = useState(false)
  const [controlledValue, setControlledValue] = useState(defaultValue)
  const [formatMenuKey, setFormatMenuKey] = useState<string>(getRandomId())
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState<boolean>(false)

  const Component = as
  const hasBlockMenu = MENU_ITEMS.length > 0
  // Used as content editable div prop for rich text blocks
  const innerHTML = { __html: controlledValue }

  const closeBlockMenu = () => {
    if (!isMounted()) {
      return
    }

    setIsBlockMenuOpen(false)
  }

  const closeFormatMenu = (event?: globalThis.MouseEvent) => {
    if (!isMounted()) {
      return
    }

    if (event === undefined) {
      window.removeEventListener('click', closeFormatMenu)
    }

    setIsFormatMenuOpen(false)
  }

  const detectUnselection = () => {
    if (!isMounted()) {
      return
    }

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

  const handleFocus = (event: FocusEvent<HTMLElement>): void => {
    setControlledIsFocused(true)

    if (onFocus !== null) {
      onFocus(event)
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

      onChange(componentRef.current.innerText)

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
    if (!isMounted()) {
      return
    }

    setIsBlockMenuOpen(true)
  }

  const openFormatMenu = () => {
    if (!isMounted()) {
      return
    }

    setIsFormatMenuOpen(true)
    setFormatMenuKey(getRandomId())
  }

  const updateControlledValue = async newValue => {
    if (!isMounted()) {
      return
    }

    setControlledValue(newValue)
    hasFormattedRef.current = true

    closeFormatMenu()
    onChange(newValue)
  }

  const controlKey = (event: KeyboardEvent<HTMLElement>) => {
    if (!isMounted()) {
      return
    }

    // eslint-disable-next-line default-case
    switch (event.code) {
      case 'ArrowDown':
        if (hasBlockMenu && isBlockMenuOpen) {
          event.preventDefault()

          dispatchToBlockMenu({ type: 'selectNext' })
        } else if (onDownKeyDown !== null) {
          event.preventDefault()

          onDownKeyDown(event)
        }

        return

      case 'ArrowUp':
        if (hasBlockMenu && isBlockMenuOpen) {
          event.preventDefault()

          dispatchToBlockMenu({ type: 'selectPrevious' })
        } else if (onUpKeyDown !== null) {
          event.preventDefault()

          onUpKeyDown(event)
        }

        return

      case 'Enter':
      case 'NumpadEnter':
        if (hasBlockMenu && isBlockMenuOpen) {
          event.preventDefault()

          handleBlockTypeChange(blockMenuState.visibleItems[blockMenuState.selectedIndex].type)
        } else if (onEnterKeyDown !== null) {
          event.preventDefault()

          onEnterKeyDown(event)
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

          onBackspaceKeyDown(event)
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

    setImmediate(() => {
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
      // setImmediate(() => setFormatMenuAnchor(event.currentTarget))
    })
  }

  useEffect(() => {
    if (!isMounted() || !isFocused || controlledIsFocused || componentRef.current === null) {
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
    if (!isMounted() || !isFormatMenuOpen) {
      return
    }

    setImmediate(detectUnselection)
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
          source={controlledValue}
        />
      )}

      <Component
        ref={componentRef}
        contentEditable
        dangerouslySetInnerHTML={innerHTML}
        onClick={stopPropagation}
        onFocus={handleFocus}
        onInput={handleInput}
        onKeyDown={controlKey}
        onMouseUp={handleSelection}
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

Editable.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  as: PropTypes.any.isRequired,
  defaultValue: PropTypes.string,
  isFocused: PropTypes.bool,
  isRichText: PropTypes.bool,
  onBackspaceKeyDown: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onChangeType: PropTypes.func,
  onDownKeyDown: PropTypes.func,
  onEnterKeyDown: PropTypes.func,
  onFocus: PropTypes.func,
  onUpKeyDown: PropTypes.func,
}

export default Editable
