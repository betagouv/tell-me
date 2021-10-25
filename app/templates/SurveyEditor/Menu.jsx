import { css, styled } from '@singularity-ui/core'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'

import { SURVEY_BLOCK_TYPE } from '../../../common/constants'

const MENU_ITEMS = [
  {
    blockType: SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
    // Icon: HelpIcon,
    label: 'Question',
  },
  {
    blockType: SURVEY_BLOCK_TYPE.INPUT.CHOICE,
    // Icon: DoneAllIcon,
    label: 'Multiple choice',
  },
  {
    blockType: SURVEY_BLOCK_TYPE.INPUT.CHECKBOX,
    // Icon: DoneIcon,
    label: 'Checkboxes',
  },
  {
    blockType: SURVEY_BLOCK_TYPE.INPUT.SHORT_ANSWER,
    // Icon: ShortTextIcon,
    label: 'Short Answer',
  },
  {
    blockType: SURVEY_BLOCK_TYPE.INPUT.LONG_ANSWER,
    // Icon: ViewHeadlineIcon,
    label: 'Long Answer',
  },
]
const MENU_ITEMS_LENGTH = MENU_ITEMS.length

const Box = styled.div`
  position: relative;
`

const FocusInput = styled.input`
  height: 0;
  opacity: 0;
  position: absolute;
  width: 0;
`

const FloatingMenu = styled.div`
  background-color: ${p => p.theme.color.primary.default};
  display: flex;
  flex-direction: column;
  position: absolute;
  top: -2rem;
`

const MenuItem = styled.div`
  color: ${p => p.theme.color.body.white};
  cursor: pointer;
  display: inline-block;
  padding: ${p => p.theme.padding.button.medium};

  :hover {
    background-color: ${p => p.theme.color.primary.active};
  }

  ${p =>
    p.isSelected &&
    css`
      background-color: ${p => p.theme.color.primary.active};
    `}
`

export default function Menu({ onClose, onSelect }) {
  const $focusInput = useRef(null)
  // const [isMounted, setIsMounted] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const moveUp = () => {
    if (selectedIndex === 0) {
      setSelectedIndex(MENU_ITEMS_LENGTH - 1)

      return
    }

    setSelectedIndex(selectedIndex - 1)
  }

  const moveDown = () => {
    if (selectedIndex === MENU_ITEMS_LENGTH - 1) {
      setSelectedIndex(0)

      return
    }

    setSelectedIndex(selectedIndex + 1)
  }

  const controlKey = event => {
    if (event.keyCode === 13) {
      event.preventDefault()
      onSelect(MENU_ITEMS[selectedIndex].blockType)

      return
    }

    if (event.keyCode === 27) {
      event.preventDefault()
      onClose()

      return
    }

    if (event.keyCode === 38) {
      event.preventDefault()
      moveUp()

      return
    }

    if (event.keyCode === 40) {
      moveDown()
    }
  }

  useEffect(() => {
    // setIsMounted(true)

    $focusInput.current.focus()
  }, [])

  return (
    <Box>
      <FocusInput ref={$focusInput} onKeyDown={controlKey} type="text" />

      <FloatingMenu>
        {MENU_ITEMS.map(({ label }, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <MenuItem
            key={label}
            isSelected={index === selectedIndex}
            onClick={() => onSelect(MENU_ITEMS[index].blockType)}
          >
            {/* <Icon fontSize="small" /> */}
            {label}
          </MenuItem>
        ))}
      </FloatingMenu>
    </Box>
  )
}

Menu.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
}
