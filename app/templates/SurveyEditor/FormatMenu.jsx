import { Button, Dialog, styled, TextInput } from '@singularity-ui/core'
import PropTypes from 'prop-types'
import { useRef, useState } from 'react'
import { Bold, Italic, Link } from 'react-feather'
import { usePopper } from 'react-popper'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import { unified } from 'unified'
import unistUtilReduce from 'unist-util-reduce'

const Box = styled.div`
  align-items: center;
  background-color: black;
  border-radius: ${p => p.theme.appearance.borderRadius.small};
  display: flex;

  > button:not(:nth-child(3)) {
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

/**
 * @param {{ anchor: MouseEvent, selection: Selection }} props
 *
 * @returns {JSX.Element}
 */
export default function FormatMenu({ anchor, onChange, selection, source }) {
  const linkInputRef = useRef(null)
  const transitorySourceRef = useRef(null)
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

  /**
   * @param {string} newTagName
   * @param {*} newTagProperties
   *
   * @return {string}
   */
  const formatSelectionWithTag = async (newTagName, newTagProperties = {}) => {
    // https://github.com/rehypejs/rehype/tree/main/packages/rehype-parse#unifieduserehypeparse-options
    const tree = unified()
      .use(rehypeParse, {
        fragment: true,
      })
      .parse(source)

    const tagName = selection.anchorNode.parentNode.tagName.toLowerCase()
    const value = selection.anchorNode.textContent
    const newTree = unistUtilReduce(tree, node => {
      if (
        (tagName === 'p' && node.type === 'text' && node.value === value) ||
        (node.tagName === tagName && node.children.length > 0 && node.children[0].value === value)
      ) {
        if (node.tagName === newTagName) {
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

  /**
   * @param {string} htmlSource
   * @param {string} whereTagName
   * @param {string} newTagName
   * @param {*} newTagProperties
   *
   * @return {string}
   */
  const replaceHtmlTagWithTag = async (htmlSource, whereTagName, newTagName, newTagProperties = {}) => {
    // https://github.com/rehypejs/rehype/tree/main/packages/rehype-parse#unifieduserehypeparse-options
    const tree = unified()
      .use(rehypeParse, {
        fragment: true,
      })
      .parse(htmlSource)

    const newTree = unistUtilReduce(tree, node => {
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

    const newSource = await formatSelectionWithTag('b')

    onChange(newSource)
  }

  const formatSelectionAsItalic = async event => {
    event.stopPropagation()

    const newSource = await formatSelectionWithTag('i')

    onChange(newSource)
  }

  const prepareSelectionAndOpenLinkDialog = async event => {
    event.stopPropagation()

    transitorySourceRef.current = await formatSelectionWithTag('span')

    setIsLinkDialogOpen(true)
  }

  const formatSelectionAsLink = async event => {
    event.stopPropagation()

    const newSource = await replaceHtmlTagWithTag(transitorySourceRef.current, 'span', 'a', {
      href: linkInputRef.current.value,
      target: '_blank',
    })

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

        <Arrow ref={setArrowElement} style={popper.styles.arrow} />
      </Box>
    </>
  )
}

FormatMenu.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  anchor: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  selection: PropTypes.object.isRequired,
  source: PropTypes.string.isRequired,
}
