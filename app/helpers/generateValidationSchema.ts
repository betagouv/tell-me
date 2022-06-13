import * as Yup from 'yup'

import type { Block } from '../libs/SurveyEditorManager/Block'

export function generateValidationSchema(blocks: Block[], message: string) {
  const shape = blocks.reduce((schema, block) => {
    if (!block.isQuestion || !block.isRequired) {
      return schema
    }

    if (block.questionInputType === 'input_multiple_choice') {
      return {
        ...schema,
        [block.id]: Yup.array(Yup.string()).length(1, message).required(message),
      }
    }

    if (block.questionInputType === 'input_file') {
      return {
        ...schema,
        [block.id]: Yup.object()
          .shape({
            name: Yup.string().required(message),
          })
          .nullable(),
      }
    }

    return {
      ...schema,
      [block.id]: Yup.string().trim().required(message),
    }
  }, {})

  const schema = Yup.object().shape(shape)

  return schema
}
