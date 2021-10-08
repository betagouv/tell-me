/* eslint-disable no-underscore-dangle */

import * as R from 'ramda'

import { SURVEY_BLOCK_TYPE } from '../constants'
import SurveyBlocksManager from '../SurveyBlocksManager'

describe('common/SurveyBlocksManager [Form Operations]', () => {
  beforeAll(() => {
    const getRandomString = () => (Math.random() + 1).toString(36).substring(7)

    // eslint-disable-next-line func-names
    SurveyBlocksManager.prototype.fillWithFakeIds = function () {
      const blocksWithFakeIds = R.map(block => {
        const blockWithId = R.assoc('_id', getRandomString())(block)

        return blockWithId
      })(this.blocks)

      this.blocks = blocksWithFakeIds
    }
  })

  test('should conciliate form data with a checkbox question', () => {
    const instance = new SurveyBlocksManager()
    instance.setFocusAt(1)
    instance.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.CONTENT.QUESTION)
    instance.changeFocusedBlockValue('Checkbox question')
    instance.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.INPUT.CHECKBOX)
    instance.changeFocusedBlockValue('Choice 1')
    instance.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.INPUT.CHECKBOX)
    instance.changeFocusedBlockValue('Choice 2')
    instance.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.INPUT.CHECKBOX)
    instance.changeFocusedBlockValue('Choice 3')

    instance.fillWithFakeIds()

    const formData = {
      [instance._blocks[2].id]: ['Choice 1', 'Choice 3'],
    }

    const result = instance.conciliateFormData(formData)

    expect(result).toMatchObject([
      {
        answers: ['Choice 1', 'Choice 3'],
        question: 'Checkbox question',
        type: SURVEY_BLOCK_TYPE.INPUT.CHECKBOX,
      },
    ])
  })

  test('should conciliate form data with a choice question', () => {
    const instance = new SurveyBlocksManager()
    instance.setFocusAt(1)
    instance.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.CONTENT.QUESTION)
    instance.changeFocusedBlockValue('Choice question')
    instance.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.INPUT.CHOICE)
    instance.changeFocusedBlockValue('Option 1')
    instance.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.INPUT.CHOICE)
    instance.changeFocusedBlockValue('Option 2')
    instance.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.INPUT.CHOICE)
    instance.changeFocusedBlockValue('Option 3')

    instance.fillWithFakeIds()

    const formData = {
      [instance._blocks[2].id]: 'Option 2',
    }

    const result = instance.conciliateFormData(formData)

    expect(result).toMatchObject([
      {
        answers: ['Option 2'],
        question: 'Choice question',
        type: SURVEY_BLOCK_TYPE.INPUT.CHOICE,
      },
    ])
  })
})
