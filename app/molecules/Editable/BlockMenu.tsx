import { Fragment, useEffect, useState } from 'react'
import { usePopper } from 'react-popper'
import styled, { css } from 'styled-components'

import { BlockMenuItem } from './types'

const Box = styled.div<any>`
  background-color: ${p => p.theme.color.primary.default};
  display: flex;
  flex-direction: column;
  z-index: 1;
`

const Category = styled.div`
  background-color: ${p => p.theme.color.primary.background};
  color: ${p => p.theme.color.primary.default};
  font-size: 75%;
  font-weight: 700;
  padding: ${p => p.theme.padding.layout.tiny} ${p => p.theme.padding.layout.small};
  text-transform: uppercase;
`

const Item = styled.div<any>`
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
      background-color: ${p.theme.color.primary.active};
    `}
`

export type BlockMenuProps = {
  anchor: HTMLElement
  defaultSelectedIndex: number
  items: BlockMenuItem[]
  onCancel: () => void
  onSelect: (blockType: string) => void
}
export function BlockMenu({ anchor, defaultSelectedIndex, items, onCancel, onSelect }: BlockMenuProps) {
  const [popperElement, setPopperElement] = useState(null)

  const popper = usePopper(anchor, popperElement, {
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
    placement: 'bottom-start',
  })

  const detectPropagatedClick = (): void => {
    window.addEventListener('click', onCancel, {
      once: true,
    })
  }

  const handleSelect = (event: MouseEvent): void => {
    event.stopPropagation()

    window.removeEventListener('click', onCancel)

    const selectedIndex = Number((event.currentTarget as HTMLElement).dataset.index)
    const selectedBlockType = items[selectedIndex].type

    onSelect(selectedBlockType)
  }

  useEffect(() => {
    setImmediate(detectPropagatedClick)

    return () => {
      window.removeEventListener('click', onCancel)
    }
  }, [])

  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Box ref={setPopperElement} style={popper.styles.popper} {...popper.attributes.popper}>
        {items.map(({ category, label }, index) => (
          <Fragment key={label}>
            {(index === 0 || category !== items[index - 1].category) && <Category>{category}</Category>}

            <Item data-index={index} isSelected={index === defaultSelectedIndex} onClick={handleSelect}>
              {/* <Icon fontSize="small" /> */}
              {label}
            </Item>
          </Fragment>
        ))}
      </Box>
    </>
  )
}
