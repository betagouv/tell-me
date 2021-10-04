/* eslint-disable no-underscore-dangle */

import SurveyBlocksManager from '.'
import { SURVEY_BLOCK_TYPE } from '../constants'

expect.extend({
  toBeABlockOfType(received, type) {
    const pass = received.type === type

    if (pass) {
      return {
        message: () => `expected block NOT to be of type ${type} but received a block of type ${received?.type}`,
        pass: true,
      }
    }

    return {
      message: () => `expected block to be of type ${type} but received a block of type ${received?.type}`,
      pass: false,
    }
  },
})

describe('common/SurveyBlocksManager', () => {
  /** @type SurveyBlocksManager */
  let instance

  test('should instantiate', () => {
    instance = new SurveyBlocksManager()

    expect(instance._blocks).toHaveLength(2)
  })

  test('should focus', () => {
    instance.setFocusAt(1)

    expect(instance._focusedBlockIndex).toStrictEqual(1)
    expect(instance.focusedBlock).toMatchObject({
      position: { rank: 2 },
      type: SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
    })
  })

  test('should add another text block after the first one', () => {
    instance.setFocusAt(0)
    instance.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.CONTENT.TEXT)

    expect(instance._blocks).toHaveLength(3)
    expect(instance._blocks).toMatchObject([
      {
        position: { rank: 1 },
        type: SURVEY_BLOCK_TYPE.CONTENT.TEXT,
      },
      {
        position: { rank: 2 },
        type: SURVEY_BLOCK_TYPE.CONTENT.TEXT,
        value: '',
      },
      {
        position: { rank: 3 },
        type: SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
      },
    ])
  })

  test('should add another text block after the last one', () => {
    instance.setFocusAt(2)
    instance.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.CONTENT.TEXT)

    expect(instance._blocks).toHaveLength(4)
    expect(instance._blocks).toMatchObject([
      {
        position: { rank: 1 },
        type: SURVEY_BLOCK_TYPE.CONTENT.TEXT,
      },
      {
        position: { rank: 2 },
        type: SURVEY_BLOCK_TYPE.CONTENT.TEXT,
      },
      {
        position: { rank: 3 },
        type: SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
      },
      {
        position: { rank: 4 },
        type: SURVEY_BLOCK_TYPE.CONTENT.TEXT,
      },
    ])
  })

  test('should remove the first text block', () => {
    instance.setFocusAt(0)
    instance.removeFocusedBlock()

    expect(instance._blocks).toHaveLength(3)
    expect(instance._blocks).toMatchObject([
      {
        position: { rank: 1 },
        type: SURVEY_BLOCK_TYPE.CONTENT.TEXT,
        value: '',
      },
      {
        position: { rank: 2 },
        type: SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
      },
      {
        position: { rank: 3 },
        type: SURVEY_BLOCK_TYPE.CONTENT.TEXT,
      },
    ])
  })

  test('should remove the last text block', () => {
    instance.setFocusAt(2)
    instance.removeFocusedBlock()

    expect(instance._blocks).toHaveLength(2)
    expect(instance._blocks).toMatchObject([
      {
        position: { rank: 1 },
        type: SURVEY_BLOCK_TYPE.CONTENT.TEXT,
      },
      {
        position: { rank: 2 },
        type: SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
      },
    ])
  })
})
