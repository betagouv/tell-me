import { SURVEY_BLOCK_TYPE } from '../../../common/constants'
import SurveyManager from '../SurveyManager'

describe('common/SurveyManager [CRUD Operations]', () => {
  let instance: SurveyManager

  beforeAll(() => {
    instance = new SurveyManager()
  })

  test('should add a text block after the first one', () => {
    instance.setFocusAt(0)
    instance.appendNewBlockToFocusedBlock(SURVEY_BLOCK_TYPE.CONTENT.TEXT)

    expect(instance.blocks).toHaveLength(3)
    expect(instance.blocks).toMatchObject([
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
    instance.appendNewBlockToFocusedBlock(SURVEY_BLOCK_TYPE.CONTENT.QUESTION)

    expect(instance.blocks).toHaveLength(4)
    expect(instance.blocks).toMatchObject([
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

    expect(instance.blocks).toHaveLength(3)
    expect(instance.blocks).toMatchObject([
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

    expect(instance.blocks).toHaveLength(2)
    expect(instance.blocks).toMatchObject([
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
