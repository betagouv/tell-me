import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'

import usePrevious from '../../hooks/usePrevious'
import FormatMenu from './FormatMenu'
import sanitizeRichText from './helpers/sanitizeRichText'

const KEY = {
  ARROW_DOWN: 40,
  ARROW_UP: 38,
  BACKSPACE: 8,
  ENTER: 13,
  NUMPAD_DIVIDE: 111,
  // NUMPAD_ENTER: 13,
  SLASH: 191,
}

const noop = () => undefined

export default function Editable({
  Component,
  countLetter,
  isFocused,
  isRichText,
  onBackspace,
  onChange,
  onDown,
  onEnter,
  onFocus,
  onSlash,
  onUp,
  placeholder,
  value,
}) {
  const componentRef = useRef(null)

  // States used for rich text blocks
  const selectionFocusNodeRef = useRef(null)
  const selectionFocusOffsetRef = useRef(value.length)
  const hasFormattedRef = useRef(false)
  const [controlledValue, setControlledValue] = useState(value)
  const [formatMenuProps, setFormatMenuProps] = useState(false)
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false)

  const wasFocused = usePrevious(isFocused)

  // Used as content editable div prop for rich text blocks
  const innerHTML = { __html: controlledValue }

  const closeFormatMenu = () => {
    setIsFormatMenuOpen(false)
  }

  const detectUnselection = () => {
    window.addEventListener('click', closeFormatMenu, {
      once: true,
    })
  }

  const handleInput = async () => {
    if (!isRichText) {
      onChange(componentRef.current.innerText)

      return
    }

    const selection = window.getSelection()
    selectionFocusNodeRef.current = selection.focusNode
    selectionFocusOffsetRef.current = selection.focusOffset

    const currentValue = componentRef.current.innerHTML
    const newValue = await sanitizeRichText(currentValue)

    onChange(newValue)

    if (newValue !== currentValue) {
      setControlledValue(newValue)
    }
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

  const controlKey = event => {
    switch (event.keyCode) {
      case KEY.ARROW_DOWN:
        if (onDown !== null) {
          event.preventDefault()
          onDown()
        }

        return

      case KEY.ARROW_UP:
        if (onUp !== null) {
          event.preventDefault()
          onUp()
        }

        return

      case KEY.ENTER:
        event.preventDefault()
        onEnter()

        return

      case KEY.NUMPAD_DIVIDE:
      case KEY.SLASH:
        if (onSlash !== null) {
          event.preventDefault()
          onSlash()
        }

        return

      default:
        break
    }

    if (componentRef.current.innerText.length > 0) {
      return
    }

    switch (event.keyCode) {
      case KEY.BACKSPACE:
        if (onBackspace !== null) {
          event.preventDefault()
          onBackspace()
        }

        // eslint-disable-next-line no-useless-return
        return

      default:
        break
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
    if (!isFocused) {
      return
    }

    const range = window.document.createRange()
    const selection = window.getSelection()

    // TODO Handle Rich Text caret positonning.
    if (isRichText) {
      range.setStart(componentRef.current, 0)
    } else if (componentRef.current.childNodes.length > 0) {
      range.setStart(componentRef.current.childNodes[0], selectionFocusOffsetRef.current)
    }

    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)

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
    selection.collapse(selectionFocusNodeRef.current, selectionFocusOffsetRef.current)
  }, [isFormatMenuOpen])

  useEffect(() => {
    if (!isFormatMenuOpen) {
      return
    }

    setImmediate(detectUnselection)
  }, [isFormatMenuOpen])

  return (
    <>
      <Component
        ref={componentRef}
        contentEditable
        countLetter={countLetter}
        dangerouslySetInnerHTML={innerHTML}
        onFocus={onFocus}
        onInput={handleInput}
        onKeyDown={controlKey}
        onMouseUp={controlMouse}
        placeholder={placeholder}
        spellCheck={false}
        style={{ outline: 0 }}
        suppressContentEditableWarning
      />

      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      {isFormatMenuOpen && <FormatMenu onChange={updateControlledValue} source={value} {...formatMenuProps} />}
    </>
  )
}

Editable.defaultProps = {
  countLetter: null,
  isRichText: false,
  onBackspace: noop,
  onSelect: noop,
  onSlash: noop,
  placeholder: null,
}

Editable.propTypes = {
  Component: PropTypes.elementType.isRequired,
  countLetter: PropTypes.string,
  isFocused: PropTypes.bool.isRequired,
  isRichText: PropTypes.bool,
  onBackspace: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onDown: PropTypes.func.isRequired,
  onEnter: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  onSlash: PropTypes.func,
  onUp: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
}
