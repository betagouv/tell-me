/* eslint-disable no-underscore-dangle */

import { SURVEY_BLOCK_TYPE } from '../constants'
import SurveyBlocksManager from '../SurveyBlocksManager'

describe('common/SurveyBlocksManager [CRUD Operations]', () => {
  /** @type SurveyBlocksManager */
  let instance

  beforeAll(() => {
    instance = new SurveyBlocksManager()
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