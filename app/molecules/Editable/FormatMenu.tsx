import { Button, Dialog, styled, TextInput } from '@singularity-ui/core'
import PropTypes from 'prop-types'
import { FunctionComponent, MutableRefObject, useRef, useState } from 'react'
import { Bold, Italic, Link, X } from 'react-feather'
import { usePopper } from 'react-popper'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import { unified } from 'unified'
import unistUtilReduce from 'unist-util-reduce'

import { Node } from './types'

const Box = styled.div`
  align-items: center;
  background-color: black;
  border-radius: ${p => p.theme.appearance.borderRadius.small};
  display: flex;

  > button:not(:nth-child(4)) {
    border-right: solid 1px white;
  }
`

const MenuButton = styled(Button)`
  background-color: transparent;
  border: 0;
  border-radius: 0;
  display: inline-flex;

  :hover {
    background-color: transparent;
  }

  > svg {
    max-height: 1rem;
    max-width: 1rem;
  }
  :hover > svg {
    color: yellow;
  }
`
const Arrow = styled.div`
  background: inherit;
  height: 0.5rem;
  position: absolute;
  top: 1.5rem;
  visibility: hidden;
  width: 0.5rem;

  :before {
    background: inherit;
    content: '';
    height: 0.5rem;
    position: absolute;
    transform: rotate(45deg);
    visibility: visible;
    width: 0.5rem;
  }
`

const stopPropagation = event => {
  event.stopPropagation()
}

export type FormatMenuProps = {
  anchor: HTMLElement
  onChange: (newSource: string) => void
  selection: Selection
  source: string
}
const FormatMenu: FunctionComponent<FormatMenuProps> = ({ anchor, onChange, selection, source }) => {
  const linkInputRef = useRef<HTMLInputElement>(null)
  const transitorySourceRef = useRef(null) as MutableRefObject<Common.Nullable<string>>
  const [arrowElement, setArrowElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)

  const popper = usePopper(anchor, popperElement, {
    modifiers: [
      {
        name: 'arrow',
        options: {
          element: arrowElement,
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
    placement: 'top',
  })

  const anchorClientRect = anchor.getClientRects()[0]
  const anchorScreenPositionCenterX = Math.round((anchorClientRect.x * 2 + anchorClientRect.width) / 2)
  const selectionRangeRect = selection.getRangeAt(0).getBoundingClientRect()
  const selectionScreenPositionCenterX = Math.round((selectionRangeRect.x * 2 + selectionRangeRect.width) / 2)
  const popperOffsetX = selectionScreenPositionCenterX - anchorScreenPositionCenterX
  const popperStyles = {
    ...popper.styles.popper,
    left: `${popperOffsetX}px`,
  }

  const closeLinkDialog = event => {
    event.stopPropagation()

    setIsLinkDialogOpen(false)
  }

  const toggleSelectionWithTag = async (newTagName: string, newTagProperties: any = {}): Promise<string> => {
    // https://github.com/rehypejs/rehype/tree/main/packages/rehype-parse#unifieduserehypeparse-options
    const tree = unified()
      .use<any[], import('hast').Root>(rehypeParse, {
        fragment: true,
      })
      .parse(source)

    const tagName = ((selection.anchorNode as Element).parentNode as Element).tagName.toLowerCase()
    const value = (selection.anchorNode as Element).textContent
    const newTree = unistUtilReduce(tree, (node: Node) => {
      if (
        (tagName === 'p' && node.type === 'text' && node.value === value) ||
        (node.tagName === tagName &&
          node.children !== undefined &&
          node.children.length > 0 &&
          node.children[0].value === value)
      ) {
        if (node.tagName === newTagName && node.children) {
          return node.children[0]
        }

        if (['root', 'text'].includes(node.type)) {
          const newBeforeValue = value.slice(0, selection.anchorOffset)
          const newChildValue = value.slice(selection.anchorOffset, selection.focusOffset)
          const newAfterValue = value.slice(selection.focusOffset)

          return [
            {
              type: 'text',
              value: newBeforeValue,
            },
            {
              children: [
                {
                  type: 'text',
                  value: newChildValue,
                },
              ],
              properties: newTagProperties,
              tagName: newTagName,
              type: 'element',
            },
            {
              type: 'text',
              value: newAfterValue,
            },
          ]
        }
      }

      return node
    })

    const newSource = await unified().use(rehypeStringify).stringify(newTree)

    return newSource
  }

  const replaceHtmlTagWithTag = async (
    htmlSource: string,
    whereTagName: string,
    newTagName: string,
    newTagProperties: any = {},
  ): Promise<string> => {
    // https://github.com/rehypejs/rehype/tree/main/packages/rehype-parse#unifieduserehypeparse-options
    const tree = unified()
      .use(rehypeParse, {
        fragment: true,
      })
      .parse(htmlSource)

    const newTree = unistUtilReduce(tree, (node: Node) => {
      if (node.tagName === whereTagName && node.type === 'element') {
        return {
          ...node,
          properties: newTagProperties,
          tagName: newTagName,
        }
      }

      return node
    })

    const newSource = await unified().use(rehypeStringify).stringify(newTree)

    return newSource
  }

  const formatSelectionAsBold = async event => {
    event.stopPropagation()

    const newSource = await toggleSelectionWithTag('b')

    onChange(newSource)
  }

  const formatSelectionAsItalic = async event => {
    event.stopPropagation()

    const newSource = await toggleSelectionWithTag('i')

    onChange(newSource)
  }

  const prepareSelectionAndOpenLinkDialog = async event => {
    event.stopPropagation()

    const newSource = await toggleSelectionWithTag('a')
    if (newSource.length < source.length) {
      onChange(newSource)

      return
    }

    transitorySourceRef.current = await toggleSelectionWithTag('span')

    setIsLinkDialogOpen(true)
  }

  const formatSelectionAsLink = async event => {
    event.stopPropagation()
    if (linkInputRef.current === null || transitorySourceRef.current === null) {
      return
    }

    const newSource = await replaceHtmlTagWithTag(transitorySourceRef.current, 'span', 'a', {
      href: linkInputRef.current.value,
      target: '_blank',
    })

    onChange(newSource)
  }

  const unformatSource = event => {
    event.stopPropagation()

    const newSource = source.replace(/<[^>]+>/g, '')

    onChange(newSource)
  }

  if (isLinkDialogOpen) {
    return (
      <Dialog>
        <Dialog.Body>
          <Dialog.Title>Edit link</Dialog.Title>
          <TextInput ref={linkInputRef} onClick={stopPropagation} placeholder="https://www.example.com" size="small" />
        </Dialog.Body>

        <Dialog.Action>
          <Button accent="secondary" onClick={closeLinkDialog}>
            Cancel
          </Button>

          <Button accent="primary" onClick={formatSelectionAsLink}>
            OK
          </Button>
        </Dialog.Action>
      </Dialog>
    )
  }

  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Box ref={setPopperElement} style={popperStyles} {...popper.attributes.popper}>
        <MenuButton onClick={formatSelectionAsBold} size="small">
          <Bold />
        </MenuButton>
        <MenuButton onClick={formatSelectionAsItalic} size="small">
          <Italic />
        </MenuButton>
        <MenuButton onClick={prepareSelectionAndOpenLinkDialog} size="small">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <Link />
        </MenuButton>
        <MenuButton onClick={unformatSource} size="small">
          <X />
        </MenuButton>

        <Arrow ref={setArrowElement} style={popper.styles.arrow} />
      </Box>
    </>
  )
}

FormatMenu.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  anchor: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  selection: PropTypes.any.isRequired,
  source: PropTypes.string.isRequired,
}

export default FormatMenu
