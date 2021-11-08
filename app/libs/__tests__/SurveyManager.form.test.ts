import { SURVEY_BLOCK_TYPE } from '../../../common/constants'
import SurveyManager from '../SurveyManager'

describe('common/SurveyManager [Form Operations]', () => {
  test('should conciliate form data with a checkbox question', () => {
    const instance = new SurveyManager()
    instance.setFocusAt(1)
    instance.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.CONTENT.QUESTION)
    instance.changeFocusedBlockValue('Checkbox question')
    instance.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.INPUT.CHECKBOX)
    instance.changeFocusedBlockValue('Choice 1')
    instance.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.INPUT.CHECKBOX)
    instance.changeFocusedBlockValue('Choice 2')
    instance.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.INPUT.CHECKBOX)
    instance.changeFocusedBlockValue('Choice 3')

    const formData = {
      [instance.blocks[2]._id]: ['Choice 1', 'Choice 3'],
    }

    const result = instance.conciliateFormData(formData)

    expect(result).toMatchObject([
      {
        question: 'Checkbox question',
        type: SURVEY_BLOCK_TYPE.INPUT.CHECKBOX,
        values: ['Choice 1', 'Choice 3'],
      },
    ])
  })

  test('should conciliate form data with a choice question', () => {
    const instance = new SurveyManager()
    instance.setFocusAt(1)
    instance.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.CONTENT.QUESTION)
    instance.changeFocusedBlockValue('Choice question')
    instance.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.INPUT.CHOICE)
    instance.changeFocusedBlockValue('Option 1')
    instance.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.INPUT.CHOICE)
    instance.changeFocusedBlockValue('Option 2')
    instance.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.INPUT.CHOICE)
    instance.changeFocusedBlockValue('Option 3')

    const formData = {
      [instance.blocks[2]._id]: 'Option 2',
    }

    const result = instance.conciliateFormData(formData)

    expect(result).toMatchObject([
      {
        question: 'Choice question',
        type: SURVEY_BLOCK_TYPE.INPUT.CHOICE,
        values: ['Option 2'],
      },
    ])
  })
})
