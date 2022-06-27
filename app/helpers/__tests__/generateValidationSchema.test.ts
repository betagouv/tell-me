/**
 * @jest-environment jsdom
 */

import { Block } from '@app/libs/SurveyEditorManager/Block'
import { fakeTreeBlock } from '@schemas/1.0.0/__tests__/__fakes__/fakeTreeBlock'

import { generateValidationSchema } from '../generateValidationSchema'

describe('app/helpers/generateValidationSchema()', () => {
  const message = 'A validation error message.'

  test('with no blocks', () => {
    const blocks = []

    const result = generateValidationSchema(blocks, message)

    expect(result.isValidSync({})).toStrictEqual(true)
  })

  test('with an unrequired question block', () => {
    const unrequiredShortAnswerQuestionTreeBlock = fakeTreeBlock('question', {
      id: 'unrequired_short_answer_question',
    })
    const unrequiredShortAnswerQuestionBlock = new Block(unrequiredShortAnswerQuestionTreeBlock, {
      isCountable: false,
      isHidden: false,
      questionId: null,
      questionInputType: 'input_multiple_choice',
    })
    const blocks = [unrequiredShortAnswerQuestionBlock]

    const result = generateValidationSchema(blocks, message)

    expect(result.isValidSync({})).toStrictEqual(true)
  })

  describe('with a required multiple choice question block', () => {
    const multipleChoiceQuestionTreeBlock = fakeTreeBlock(
      'question',
      {
        id: 'required_multiple_choice_question',
      },
      {
        isRequired: true,
      },
    )
    const requiredMultipleChoiceQuestionBlock = new Block(multipleChoiceQuestionTreeBlock, {
      isCountable: false,
      isHidden: false,
      questionId: null,
      questionInputType: 'input_multiple_choice',
    })

    test('and an undefined answer', () => {
      const blocks = [requiredMultipleChoiceQuestionBlock]

      const result = generateValidationSchema(blocks, message)

      expect(result.isValidSync({})).toStrictEqual(false)
    })

    test('and a null answer', () => {
      const blocks = [requiredMultipleChoiceQuestionBlock]

      const result = generateValidationSchema(blocks, message)

      expect(
        result.isValidSync({
          required_multiple_choice_question: null,
        }),
      ).toStrictEqual(false)
    })

    test('and an empty array answer', () => {
      const blocks = [requiredMultipleChoiceQuestionBlock]

      const result = generateValidationSchema(blocks, message)

      expect(
        result.isValidSync({
          required_multiple_choice_question: [],
        }),
      ).toStrictEqual(false)
    })

    test('and a one item array answer', () => {
      const blocks = [requiredMultipleChoiceQuestionBlock]

      const result = generateValidationSchema(blocks, message)

      expect(
        result.isValidSync({
          required_multiple_choice_question: ['A choice.'],
        }),
      ).toStrictEqual(true)
    })
  })

  describe('with a required short answer question', () => {
    const requiredShortAnswerQuestionTreeBlock = fakeTreeBlock(
      'question',
      {
        id: 'required_short_answer_question',
      },
      {
        isRequired: true,
      },
    )
    const requiredShortAnswerQuestionBlock = new Block(requiredShortAnswerQuestionTreeBlock, {
      isCountable: false,
      isHidden: false,
      questionId: null,
      questionInputType: 'input_short_answer',
    })

    test('and an undefined answer', () => {
      const blocks = [requiredShortAnswerQuestionBlock]

      const result = generateValidationSchema(blocks, message)

      expect(result.isValidSync({})).toStrictEqual(false)
    })

    test('and a null answer', () => {
      const blocks = [requiredShortAnswerQuestionBlock]

      const result = generateValidationSchema(blocks, message)

      expect(
        result.isValidSync({
          required_short_answer_question: null,
        }),
      ).toStrictEqual(false)
    })

    test('and an empty string answer', () => {
      const blocks = [requiredShortAnswerQuestionBlock]

      const result = generateValidationSchema(blocks, message)

      expect(
        result.isValidSync({
          required_short_answer_question: '',
        }),
      ).toStrictEqual(false)
    })

    test('and an empty-ish string answer', () => {
      const blocks = [requiredShortAnswerQuestionBlock]

      const result = generateValidationSchema(blocks, message)

      expect(
        result.isValidSync({
          required_short_answer_question: ' ',
        }),
      ).toStrictEqual(false)
    })

    test('and a filled answer', () => {
      const blocks = [requiredShortAnswerQuestionBlock]

      const result = generateValidationSchema(blocks, message)

      expect(
        result.isValidSync({
          required_short_answer_question: 'An short answer.',
        }),
      ).toStrictEqual(true)
    })
  })

  describe('with a hidden required short answer question', () => {
    const requiredHiddenShortAnswerQuestionTreeBlock = fakeTreeBlock(
      'question',
      {
        id: 'required_hidden_short_answer_question',
      },
      {
        isHidden: true,
        isRequired: true,
      },
    )
    const requiredHiddenShortAnswerQuestionBlock = new Block(requiredHiddenShortAnswerQuestionTreeBlock, {
      isCountable: false,
      isHidden: true,
      questionId: null,
      questionInputType: 'input_short_answer',
    })

    describe('conditioned by a choice', () => {
      const conditioningChoiceQuestionTreeBlock = fakeTreeBlock('question', {
        id: 'conditioning_choice_question',
      })
      const conditioningChoiceQuestionBlock = new Block(conditioningChoiceQuestionTreeBlock, {
        isCountable: false,
        isHidden: false,
        questionId: null,
        questionInputType: 'input_choice',
      })
      const conditioningChoiceFirstInputTreeBlock = fakeTreeBlock('input_choice', {
        id: 'conditioning_choice_first_input',
        value: 'A',
      })
      const conditioningChoiceFirstInputBlock = new Block(conditioningChoiceFirstInputTreeBlock, {
        isCountable: false,
        isHidden: false,
        questionId: 'conditioning_choice_question',
      })
      const conditioningChoiceSecondInputTreeBlock = fakeTreeBlock(
        'input_choice',
        {
          id: 'conditioning_choice_second_input',
          value: 'B',
        },
        {
          ifTruethyThenShowQuestionIds: ['required_hidden_short_answer_question'],
        },
      )
      const conditioningChoiceSecondInputBlock = new Block(conditioningChoiceSecondInputTreeBlock, {
        isCountable: false,
        isHidden: false,
        questionId: 'conditioning_choice_question',
      })

      test("when the conditioning answer is empty or doesn't match", () => {
        const blocks = [
          conditioningChoiceQuestionBlock,
          conditioningChoiceFirstInputBlock,
          conditioningChoiceSecondInputBlock,
          requiredHiddenShortAnswerQuestionBlock,
        ]

        const result = generateValidationSchema(blocks, message)

        expect(result.isValidSync({})).toStrictEqual(true)
        expect(
          result.isValidSync({
            conditioning_choice_question: null,
          }),
        ).toStrictEqual(true)
        expect(
          result.isValidSync({
            conditioning_choice_question: '',
          }),
        ).toStrictEqual(true)
        expect(
          result.isValidSync({
            conditioning_choice_question: ' ',
          }),
        ).toStrictEqual(true)
        expect(
          result.isValidSync({
            conditioning_choice_question: 'A',
          }),
        ).toStrictEqual(true)
      })

      test('when the conditioning answer is filled and match', () => {
        const blocks = [
          conditioningChoiceQuestionBlock,
          conditioningChoiceFirstInputBlock,
          conditioningChoiceSecondInputBlock,
          requiredHiddenShortAnswerQuestionBlock,
        ]

        const result = generateValidationSchema(blocks, message)

        expect(
          result.isValidSync({
            conditioning_choice_question: 'B',
          }),
        ).toStrictEqual(false)
        expect(
          result.isValidSync({
            conditioning_choice_question: 'B',
            required_hidden_short_answer_question: null,
          }),
        ).toStrictEqual(false)
        expect(
          result.isValidSync({
            conditioning_choice_question: 'B',
            required_hidden_short_answer_question: '',
          }),
        ).toStrictEqual(false)
        expect(
          result.isValidSync({
            conditioning_choice_question: 'B',
            required_hidden_short_answer_question: ' ',
          }),
        ).toStrictEqual(false)
        expect(
          result.isValidSync({
            conditioning_choice_question: 'B',
            required_hidden_short_answer_question: 'Another answer.',
          }),
        ).toStrictEqual(true)
      })
    })

    describe('conditioned by a multiple choice', () => {
      const conditioningMultipleChoiceQuestionTreeBlock = fakeTreeBlock('question', {
        id: 'conditioning_multiple_choice_question',
      })
      const conditioningMultipleChoiceQuestionBlock = new Block(conditioningMultipleChoiceQuestionTreeBlock, {
        isCountable: false,
        isHidden: false,
        questionId: null,
        questionInputType: 'input_multiple_choice',
      })
      const conditioningMultipleChoiceFirstInputTreeBlock = fakeTreeBlock('input_multiple_choice', {
        id: 'conditioning_multiple_choice_first_input',
        value: 'A',
      })
      const conditioningMultipleChoiceFirstInputBlock = new Block(conditioningMultipleChoiceFirstInputTreeBlock, {
        isCountable: false,
        isHidden: false,
        questionId: 'conditioning_multiple_choice_question',
      })
      const conditioningMultipleChoiceSecondInputTreeBlock = fakeTreeBlock(
        'input_multiple_choice',
        {
          id: 'conditioning_multiple_choice_second_input',
          value: 'B',
        },
        {
          ifTruethyThenShowQuestionIds: ['required_hidden_short_answer_question'],
        },
      )
      const conditioningMultipleChoiceSecondInputBlock = new Block(conditioningMultipleChoiceSecondInputTreeBlock, {
        isCountable: false,
        isHidden: false,
        questionId: 'conditioning_multiple_choice_question',
      })

      test("when the conditioning answer is empty or doesn't match", () => {
        const blocks = [
          conditioningMultipleChoiceQuestionBlock,
          conditioningMultipleChoiceFirstInputBlock,
          conditioningMultipleChoiceSecondInputBlock,
          requiredHiddenShortAnswerQuestionBlock,
        ]

        const result = generateValidationSchema(blocks, message)

        expect(result.isValidSync({})).toStrictEqual(true)
        expect(
          result.isValidSync({
            conditioning_multiple_choice_question: null,
          }),
        ).toStrictEqual(true)
        expect(
          result.isValidSync({
            conditioning_multiple_choice_question: [],
          }),
        ).toStrictEqual(true)
        expect(
          result.isValidSync({
            conditioning_multiple_choice_question: ['A'],
          }),
        ).toStrictEqual(true)
      })

      test('when the conditioning answer is filled and match', () => {
        const blocks = [
          conditioningMultipleChoiceQuestionBlock,
          conditioningMultipleChoiceFirstInputBlock,
          conditioningMultipleChoiceSecondInputBlock,
          requiredHiddenShortAnswerQuestionBlock,
        ]

        const result = generateValidationSchema(blocks, message)

        expect(
          result.isValidSync({
            conditioning_multiple_choice_question: ['B'],
          }),
        ).toStrictEqual(false)
        expect(
          result.isValidSync({
            conditioning_multiple_choice_question: ['B'],
            required_hidden_short_answer_question: null,
          }),
        ).toStrictEqual(false)
        expect(
          result.isValidSync({
            conditioning_multiple_choice_question: ['B'],
            required_hidden_short_answer_question: '',
          }),
        ).toStrictEqual(false)
        expect(
          result.isValidSync({
            conditioning_multiple_choice_question: ['B'],
            required_hidden_short_answer_question: ' ',
          }),
        ).toStrictEqual(false)
        expect(
          result.isValidSync({
            conditioning_multiple_choice_question: ['B'],
            required_hidden_short_answer_question: 'Another answer.',
          }),
        ).toStrictEqual(true)
      })
    })

    describe('conditioned by a short answer', () => {
      const conditioningShortAnswerQuestionTreeBlock = fakeTreeBlock('question', {
        id: 'conditioning_short_answer_question',
      })
      const conditioningShortAnswerQuestionBlock = new Block(conditioningShortAnswerQuestionTreeBlock, {
        isCountable: false,
        isHidden: false,
        questionId: null,
        questionInputType: 'input_short_answer',
      })
      const conditioningShortAnswerInputTreeBlock = fakeTreeBlock(
        'input_short_answer',
        {
          id: 'conditioning_short_answer_input',
        },
        {
          ifTruethyThenShowQuestionIds: ['required_hidden_short_answer_question'],
        },
      )
      const conditioningShortAnswerInputBlock = new Block(conditioningShortAnswerInputTreeBlock, {
        isCountable: false,
        isHidden: false,
        questionId: 'conditioning_short_answer_question',
      })

      test('when the conditioning answer is empty', () => {
        const blocks = [
          conditioningShortAnswerQuestionBlock,
          conditioningShortAnswerInputBlock,
          requiredHiddenShortAnswerQuestionBlock,
        ]

        const result = generateValidationSchema(blocks, message)

        expect(result.isValidSync({})).toStrictEqual(true)
        expect(
          result.isValidSync({
            conditioning_short_answer_question: null,
          }),
        ).toStrictEqual(true)
        expect(
          result.isValidSync({
            conditioning_short_answer_question: '',
          }),
        ).toStrictEqual(true)
        expect(
          result.isValidSync({
            conditioning_short_answer_question: ' ',
          }),
        ).toStrictEqual(true)
      })

      test('when the conditioning answer is filled', () => {
        const blocks = [
          conditioningShortAnswerQuestionBlock,
          conditioningShortAnswerInputBlock,
          requiredHiddenShortAnswerQuestionBlock,
        ]

        const result = generateValidationSchema(blocks, message)

        expect(
          result.isValidSync({
            conditioning_short_answer_question: 'An answer.',
          }),
        ).toStrictEqual(false)
        expect(
          result.isValidSync({
            conditioning_short_answer_question: 'An answer.',
            required_hidden_short_answer_question: null,
          }),
        ).toStrictEqual(false)
        expect(
          result.isValidSync({
            conditioning_short_answer_question: 'An answer.',
            required_hidden_short_answer_question: '',
          }),
        ).toStrictEqual(false)
        expect(
          result.isValidSync({
            conditioning_short_answer_question: 'An answer.',
            required_hidden_short_answer_question: ' ',
          }),
        ).toStrictEqual(false)
        expect(
          result.isValidSync({
            conditioning_short_answer_question: 'An answer.',
            required_hidden_short_answer_question: 'Another answer.',
          }),
        ).toStrictEqual(true)
      })
    })
  })
})
