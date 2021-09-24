import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'

import sanitizeRichText from './helpers/sanitizeRichText'

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
    if (event.keyCode === 13) {
      event.preventDefault()

      onEnter()

      return
    }

    if (event.keyCode === 38) {
      if (onBackspace !== null) {
        event.preventDefault()
        onUp()
      }

      return
    }

    if (event.keyCode === 40) {
      if (onDown !== null) {
        event.preventDefault()
        onDown()
      }

      return
    }

    if ($component.current.innerText.length > 0) {
      return
    }

    if (event.keyCode === 8) {
      if (onBackspace !== null) {
        event.preventDefault()
        onBackspace()
      }

      return
    }

    if (event.keyCode === 191) {
      if (onSlash !== null) {
        event.preventDefault()
        onSlash()
      }
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
