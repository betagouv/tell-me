import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { SURVEY_BLOCK_TYPE } from '../../../../common/constants'
import useApi from '../../../hooks/useApi'
import useEquivalenceEffect from '../../../hooks/useEquivalenceEffect'
import Block from './Block'
import Title from './blocks/Title'
import Editable from './Editable'
import Header from './Header'
import {
  cleanBlockPositionIds,
  getNextBlockPositionAt,
  getPreviousBlockPositionAt,
  insertBlock,
  removeBlock,
  sortBlocksByPosition,
} from './helpers'
import isBlockTypeIndexable from './helpers/isBlockTypeIndexable'
import Loader from './Loader'
import Logo from './Logo'
import Row from './Row'

const INITIAL_BLOCKS = [
  {
    position: {
      page: 1,
      rank: 1,
    },
    type: SURVEY_BLOCK_TYPE.CONTENT.TEXT,
    value: 'This is some free text.',
  },
  {
    position: {
      page: 1,
      rank: 2,
    },
    type: SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
    value: `What's your first question?`,
  },
]

const NO_FOCUSED_BLOCK_POSITION = {
  page: 1,
  rank: -1,
}

export default function SurveyEditor() {
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS)
  const [title, setTitle] = useState('...')
  const [isLoading, setIsLoading] = useState(true)
  const [focusedBlockPosition, setFocusedBlockPosition] = useState(NO_FOCUSED_BLOCK_POSITION)
  const { id } = useParams()
  const api = useApi()

  useEffect(() => {
    ;(async () => {
      const maybeBody = await api.get(`survey/${id}`)
      if (maybeBody === null) {
        return
      }

      const { blocks, title } = maybeBody.data
      setTitle(title)
      if (blocks.length > 0) {
        setBlocks(cleanBlockPositionIds(blocks))
      }
      setIsLoading(false)
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEquivalenceEffect(() => {
    // Let's not override existing survey data with the initialization one
    if (isLoading) {
      return
    }

    ;(async () => {
      await api.patch(`survey/${id}`, {
        blocks,
        title,
      })
    })()
  }, [blocks, title])

  const focusPreviousBlockAt = position => {
    const previousPosition = getPreviousBlockPositionAt(position)

    setFocusedBlockPosition(previousPosition)
  }

  const focusNextBlockAt = position => {
    const nextPosition = getNextBlockPositionAt(position)

    setFocusedBlockPosition(nextPosition)
  }

  const updateTitle = newValue => {
    api.patch(`survey/${id}`, {
      title: newValue,
    })
  }

  const changeBlockType = (position, newType) => {
    const blockIndex = R.findIndex(R.propEq('position', position))(blocks)
    blocks[blockIndex].type = newType
    blocks[blockIndex].value = ''

    setBlocks([...blocks])
    setFocusedBlockPosition(position)
  }

  const appendOrResetBlockAt = position => {
    const fromBlock = R.find(R.propEq('position', position))(blocks)

    if (fromBlock !== undefined && fromBlock.type !== SURVEY_BLOCK_TYPE.CONTENT.TEXT && fromBlock.value.length === 0) {
      changeBlockType(position, SURVEY_BLOCK_TYPE.CONTENT.TEXT)

      return
    }

    const nextPosition = getNextBlockPositionAt(position)
    const nextType =
      fromBlock !== undefined && isBlockTypeIndexable(fromBlock.type) ? fromBlock.type : SURVEY_BLOCK_TYPE.CONTENT.TEXT

    const newBlock = {
      position: nextPosition,
      type: nextType,
      value: '',
    }

    const newBlocks = R.equals(position, R.last(blocks).position)
      ? [...blocks, newBlock]
      : sortBlocksByPosition(insertBlock(blocks, newBlock))

    setBlocks(newBlocks)
    setFocusedBlockPosition(newBlock.position)
  }

  const updateBlockValueAt = (position, newValue) => {
    const blockIndex = R.findIndex(R.propEq('position', position))(blocks)
    blocks[blockIndex].value = newValue

    api.patch(`survey/${id}`, {
      blocks,
      title,
    })
  }

  const removeBlockAt = position => {
    const oldBlock = R.find(R.propEq('position', position))(blocks)
    const newBlocks = removeBlock(blocks, oldBlock)
    const previousBlockPosition = getPreviousBlockPositionAt(position)

    setBlocks(newBlocks)
    setFocusedBlockPosition(previousBlockPosition)
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      <Header />
      <Logo />

      <Row isFixed>
        <Editable
          Component={Title}
          isFocused={blocks.length === 0 || R.equals(focusedBlockPosition, { page: 1, rank: 0 })}
          onChange={updateTitle}
          onDown={() => focusNextBlockAt({ page: 1, rank: 0 })}
          onEnter={() => appendOrResetBlockAt({ page: 1, rank: 0 })}
          value={title}
        />
      </Row>

      {blocks.map((block, index) => (
        <Block
          // eslint-disable-next-line react/no-array-index-key
          key={`${index}_${block.type}`}
          block={block}
          blocks={blocks}
          focusedBlockPosition={focusedBlockPosition}
          onChange={updateBlockValueAt}
          onChangeType={changeBlockType}
          onDown={focusNextBlockAt}
          onEnter={appendOrResetBlockAt}
          onRemove={removeBlockAt}
          onUp={focusPreviousBlockAt}
        />
      ))}
    </>
  )
}
