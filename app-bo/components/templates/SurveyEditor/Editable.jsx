import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'

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

export default function Editable({
  Component,
  index,
  isFocused,
  isRichText,
  onBackspace,
  onChange,
  onDown,
  onEnter,
  onSlash,
  onUp,
  placeholder,
  value,
}) {
  const $component = useRef(value)

  const handleNewValue = async () => {
    const value = isRichText ? await sanitizeRichText($component.current.innerHTML) : $component.current.innerText

    onChange(value)
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

      default:
        break
    }

    if ($component.current.innerText.length > 0) {
      return
    }

    switch (event.keyCode) {
      case KEY.BACKSPACE:
        if (onBackspace !== null) {
          event.preventDefault()
          onBackspace()
        }

        return

      case KEY.NUMPAD_DIVIDE:
      case KEY.SLASH:
        if (onSlash !== null) {
          event.preventDefault()
          onSlash()
        }

        // eslint-disable-next-line no-useless-return
        return

      default:
        break
    }
  }

  useEffect(() => {
    if (isFocused) {
      const caretPosition = value.length

      const range = window.document.createRange()
      const selection = window.getSelection()

      if ($component.current.childNodes.length > 0) {
        range.setStart($component.current.childNodes[0], caretPosition)
      } else {
        range.setStart($component.current, caretPosition)
      }

      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  const innerHTML = { __html: value }

  return (
    <Component
      ref={$component}
      contentEditable
      dangerouslySetInnerHTML={innerHTML}
      index={index}
      onInput={handleNewValue}
      onKeyDown={controlKey}
      placeholder={placeholder}
      spellCheck={false}
      style={{ outline: 0 }}
      suppressContentEditableWarning
    />
  )
}

Editable.defaultProps = {
  index: null,
  isFocused: false,
  isRichText: false,
  onBackspace: null,
  onDown: null,
  onSlash: null,
  onUp: null,
  placeholder: null,
}

Editable.propTypes = {
  Component: PropTypes.elementType.isRequired,
  index: PropTypes.number,
  isFocused: PropTypes.bool,
  isRichText: PropTypes.bool,
  onBackspace: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onDown: PropTypes.func,
  onEnter: PropTypes.func.isRequired,
  onSlash: PropTypes.func,
  onUp: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
}
