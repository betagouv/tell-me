import * as Yup from 'yup'

import type { Block } from '../libs/SurveyEditorManager/Block'

export function generateValidationSchema(blocks: Block[], message: string) {
  const shape = blocks.reduce((schema, block) => {
    if (!block.isQuestion || !block.isRequired) {
      return schema
    }

    const neededBlocks: Block[] = block.isHidden
      ? blocks.filter(
          _block =>
            _block.isInput &&
            _block.questionId !== null &&
            _block.ifTruethyThenShowQuestionIds.includes(block.id as string),
        )
      : []

    if (block.questionInputType === 'input_multiple_choice') {
      const validation = Yup.array(Yup.string())

      if (!block.isHidden) {
        return {
          ...schema,
          [block.id]: validation.min(1, message).required(message),
        }
      }

      return {
        ...schema,
        [block.id]: neededBlocks.reduce(
          (prevValidation, neededBlock) =>
            prevValidation.when(neededBlock.questionId as string, {
              is: (valueOrValues: string | string[]) => {
                switch (neededBlock.type) {
                  case 'input_choice':
                    return valueOrValues === neededBlock.value

                  case 'input_multiple_choice':
                    return valueOrValues.includes(neededBlock.value)

                  default:
                    return typeof valueOrValues === 'string' && valueOrValues.trim().length > 0
                }
              },
              then: Yup.array(Yup.string()).min(1, message).required(message),
            }),
          validation,
        ),
      }
    }

    const validation = Yup.string().trim()

    if (!block.isHidden) {
      return {
        ...schema,
        [block.id]: validation.required(message),
      }
    }

    return {
      ...schema,
      [block.id]: neededBlocks.reduce(
        (prevValidation, neededBlock) =>
          prevValidation.when(neededBlock.questionId as string, {
            is: (valueOrValues?: string | string[] | null) => {
              if (valueOrValues === undefined || valueOrValues === null) {
                return false
              }

              switch (neededBlock.type) {
                case 'input_choice':
                  return valueOrValues === neededBlock.value

                case 'input_multiple_choice':
                  return Array.isArray(valueOrValues) && valueOrValues.includes(neededBlock.value)

                default:
                  return typeof valueOrValues === 'string' && valueOrValues.trim().length > 0
              }
            },
            then: Yup.string().trim().required(message),
          }),
        validation,
      ),
    }
  }, {})

  const schema = Yup.object().shape(shape)

  return schema
}
