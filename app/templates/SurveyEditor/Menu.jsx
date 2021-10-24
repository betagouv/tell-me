import DoneAllIcon from '@mui/icons-material/DoneAllOutlined'
import DoneIcon from '@mui/icons-material/DoneOutlined'
import HelpIcon from '@mui/icons-material/HelpOutline'
import ShortTextIcon from '@mui/icons-material/ShortTextOutlined'
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadlineOutlined'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Popover from '@mui/material/Popover'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'

import { SURVEY_BLOCK_TYPE } from '../../../common/constants'

const MENU_ITEMS = [
  {
    blockType: SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
    Icon: HelpIcon,
    label: 'Question',
  },
  {
    blockType: SURVEY_BLOCK_TYPE.INPUT.CHOICE,
    Icon: DoneAllIcon,
    label: 'Multiple choice',
  },
  {
    blockType: SURVEY_BLOCK_TYPE.INPUT.CHECKBOX,
    Icon: DoneIcon,
    label: 'Checkboxes',
  },
  {
    blockType: SURVEY_BLOCK_TYPE.INPUT.SHORT_ANSWER,
    Icon: ShortTextIcon,
    label: 'Short Answer',
  },
  {
    blockType: SURVEY_BLOCK_TYPE.INPUT.LONG_ANSWER,
    Icon: ViewHeadlineIcon,
    label: 'Long Answer',
  },
]
const MENU_ITEMS_LENGTH = MENU_ITEMS.length

export default function Menu({ onClose, onSelect }) {
  const $anchor = useRef(null)
  const [isMounted, setIsMounted] = useState(false)
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
    setIsMounted(true)
  }, [])

  return (
    <>
      <div ref={$anchor} />

      <Popover
        anchorEl={$anchor.current}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom',
        }}
        onClose={onClose}
        onKeyDown={controlKey}
        open={isMounted}
        transformOrigin={{
          horizontal: 'left',
          vertical: 'top',
        }}
      >
        <MenuList>
          {MENU_ITEMS.map(({ Icon, label }, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <MenuItem
              key={label}
              onClick={() => onSelect(MENU_ITEMS[index].blockType)}
              selected={index === selectedIndex}
            >
              <ListItemIcon>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{label}</ListItemText>
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  )
}

Menu.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
}
