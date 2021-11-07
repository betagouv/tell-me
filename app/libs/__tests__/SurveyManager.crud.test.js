import { SURVEY_BLOCK_TYPE } from '../../../common/constants'
import SurveyManager from '../SurveyManager'

describe('common/SurveyManager [CRUD Operations]', () => {
  /** @type SurveyManager */
  let instance

  beforeAll(() => {
    instance = new SurveyManager()
  })

  test('should add a text block after the first one', () => {
    instance.setFocusAt(0)
    instance.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.CONTENT.TEXT)

    expect(instance._blocks).toHaveLength(3)
    expect(instance._blocks).toMatchObject([
      {
        position: { rank: 1 },
        props: {
          ifSelectedThenShowQuestionId: null,
          isHidden: false,
          isMandatory: false,
        },
        type: SURVEY_BLOCK_TYPE.CONTENT.TEXT,
      },
      {
        position: { rank: 2 },
        props: {
          ifSelectedThenShowQuestionId: null,
          isHidden: false,
          isMandatory: false,
        },
        type: SURVEY_BLOCK_TYPE.CONTENT.TEXT,
        value: '',
      },
      {
        position: { rank: 3 },
        props: {
          ifSelectedThenShowQuestionId: null,
          isHidden: false,
          isMandatory: true,
        },
        type: SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
      },
    ])
  })

  test('should add a question block after the last one', () => {
    instance.setFocusAt(2)
    instance.addNewBlockAfterFocusedBlock(SURVEY_BLOCK_TYPE.CONTENT.QUESTION)

    expect(instance._blocks).toHaveLength(4)
    expect(instance._blocks).toMatchObject([
      {
        position: { rank: 1 },
        props: {
          ifSelectedThenShowQuestionId: null,
          isHidden: false,
          isMandatory: false,
        },
        type: SURVEY_BLOCK_TYPE.CONTENT.TEXT,
      },
      {
        position: { rank: 2 },
        props: {
          ifSelectedThenShowQuestionId: null,
          isHidden: false,
          isMandatory: false,
        },
        type: SURVEY_BLOCK_TYPE.CONTENT.TEXT,
      },
      {
        position: { rank: 3 },
        props: {
          ifSelectedThenShowQuestionId: null,
          isHidden: false,
          isMandatory: true,
        },
        type: SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
      },
      {
        position: { rank: 4 },
        props: {
          ifSelectedThenShowQuestionId: null,
          isHidden: false,
          isMandatory: true,
        },
        type: SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
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
        props: {
          ifSelectedThenShowQuestionId: null,
          isHidden: false,
          isMandatory: false,
        },
        type: SURVEY_BLOCK_TYPE.CONTENT.TEXT,
        value: '',
      },
      {
        position: { rank: 2 },
        props: {
          ifSelectedThenShowQuestionId: null,
          isHidden: false,
          isMandatory: true,
        },
        type: SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
      },
      {
        position: { rank: 3 },
        props: {
          ifSelectedThenShowQuestionId: null,
          isHidden: false,
          isMandatory: true,
        },
        type: SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
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
        props: {
          ifSelectedThenShowQuestionId: null,
          isHidden: false,
          isMandatory: false,
        },
        type: SURVEY_BLOCK_TYPE.CONTENT.TEXT,
      },
      {
        position: { rank: 2 },
        props: {
          ifSelectedThenShowQuestionId: null,
          isHidden: false,
          isMandatory: true,
        },
        type: SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
      },
    ])
  })
})
