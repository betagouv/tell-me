import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'

import usePrevious from '../../hooks/usePrevious'
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
  const $component = useRef(value)
  const wasFocused = usePrevious(isFocused)

  const innerHTML = { __html: value }

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

    if ($component.current.innerText.length > 0) {
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

  useEffect(() => {
    if (isFocused) {
      const caretPosition = value.length
      const range = window.document.createRange()
      const selection = window.getSelection()

      // TODO Handle Rich Text caret positonning.
      if (isRichText) {
        range.setStart($component.current, 0)
      } else if ($component.current.childNodes.length > 0) {
        range.setStart($component.current.childNodes[0], caretPosition)
      } else {
        range.setStart($component.current, 0)
      }

      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)

      if (!wasFocused) {
        $component.current.scrollIntoView({
          behavior: 'auto',
          block: 'center',
          inline: 'center',
        })
      }
    }
  })

  return (
    <Component
      ref={$component}
      contentEditable
      countLetter={countLetter}
      dangerouslySetInnerHTML={innerHTML}
      onFocus={onFocus}
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
  countLetter: null,
  isRichText: false,
  onBackspace: null,
  onSlash: null,
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
  onSlash: PropTypes.func,
  onUp: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
}
