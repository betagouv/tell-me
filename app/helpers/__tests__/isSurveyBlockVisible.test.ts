/**
 * @jest-environment jsdom
 */

import { SurveyEditorManager } from '@app/libs/SurveyEditorManager'

import { isSurveyBlockVisible } from '../isSurveyBlockVisible'

describe('app/helpers/isSurveyBlockVisible()', () => {
  const surveyEditorManager = new SurveyEditorManager([
    {
      data: {
        isHidden: false,
        isRequired: false,
        key: null,
        pageIndex: 0,
        pageRankIndex: 0,
      },
      id: 'question_1',
      type: 'question',
      value: '',
    },
    {
      data: {
        ifTruethyThenShowQuestionIds: ['question_4'],
        pageIndex: 0,
        pageRankIndex: 1,
      },
      id: '',
      type: 'input_short_answer',
      value: '',
    },
    {
      data: {
        isHidden: false,
        isRequired: false,
        key: null,
        pageIndex: 0,
        pageRankIndex: 2,
      },
      id: 'question_2',
      type: 'question',
      value: '',
    },
    {
      data: {
        ifTruethyThenShowQuestionIds: [],
        pageIndex: 0,
        pageRankIndex: 3,
      },
      id: '',
      type: 'input_choice',
      value: 'question_2_choice_1',
    },
    {
      data: {
        ifTruethyThenShowQuestionIds: ['question_4'],
        pageIndex: 0,
        pageRankIndex: 4,
      },
      id: '',
      type: 'input_choice',
      value: 'question_2_choice_2',
    },
    {
      data: {
        isHidden: false,
        isRequired: false,
        key: null,
        pageIndex: 0,
        pageRankIndex: 5,
      },
      id: 'question_3',
      type: 'question',
      value: '',
    },
    {
      data: {
        ifTruethyThenShowQuestionIds: [],
        pageIndex: 0,
        pageRankIndex: 6,
      },
      id: '',
      type: 'input_multiple_choice',
      value: 'question_3_multiple_choice_1',
    },
    {
      data: {
        ifTruethyThenShowQuestionIds: ['question_4'],
        pageIndex: 0,
        pageRankIndex: 7,
      },
      id: '',
      type: 'input_multiple_choice',
      value: 'question_3_multiple_choice_2',
    },
    {
      data: {
        isHidden: true,
        isRequired: false,
        key: null,
        pageIndex: 0,
        pageRankIndex: 8,
      },
      id: 'question_4',
      type: 'question',
      value: '',
    },
    {
      data: {
        ifTruethyThenShowQuestionIds: [],
        pageIndex: 0,
        pageRankIndex: 9,
      },
      id: '',
      type: 'input_long_answer',
      value: '',
    },
  ])

  const aVisibleQuestionBlock = surveyEditorManager.blocks[0]
  const anAnswerBlock = surveyEditorManager.blocks[1]
  const aConditionalQuestionBlock = surveyEditorManager.blocks[8]

  test('when no question is answered', () => {
    const values = {}

    const resultA = isSurveyBlockVisible(aVisibleQuestionBlock, surveyEditorManager.blocks, values)
    const resultB = isSurveyBlockVisible(anAnswerBlock, surveyEditorManager.blocks, values)
    const resultC = isSurveyBlockVisible(aConditionalQuestionBlock, surveyEditorManager.blocks, values)

    expect(resultA).toStrictEqual(true)
    expect(resultB).toStrictEqual(true)
    expect(resultC).toStrictEqual(false)
  })

  test('when the first question is answered', () => {
    const values = {
      question_1: 'An answer.',
    }

    const result = isSurveyBlockVisible(aConditionalQuestionBlock, surveyEditorManager.blocks, values)

    expect(result).toStrictEqual(true)
  })

  test('when the second question is answered with the first choice', () => {
    const values = {
      question_2: 'question_2_choice_1',
    }

    const result = isSurveyBlockVisible(aConditionalQuestionBlock, surveyEditorManager.blocks, values)

    expect(result).toStrictEqual(false)
  })

  test('when the second question is answered with the second choice', () => {
    const values = {
      question_2: 'question_2_choice_2',
    }

    const result = isSurveyBlockVisible(aConditionalQuestionBlock, surveyEditorManager.blocks, values)

    expect(result).toStrictEqual(true)
  })

  test('when the third question is answered with the first multiple choice', () => {
    const values = {
      question_3: ['question_3_multiple_choice_1'],
    }

    const result = isSurveyBlockVisible(aConditionalQuestionBlock, surveyEditorManager.blocks, values)

    expect(result).toStrictEqual(false)
  })

  test('when the third question is answered with the second multiple choice', () => {
    const values = {
      question_3: ['question_3_multiple_choice_2'],
    }

    const result = isSurveyBlockVisible(aConditionalQuestionBlock, surveyEditorManager.blocks, values)

    expect(result).toStrictEqual(true)
  })
})
