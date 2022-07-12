import { B } from 'bhala'
import { dropLast, last } from 'ramda'

import type { Field } from '../Field'
import type { TellMe } from '@schemas/1.0.0/TellMe'

/**
 * Returns a list of Fields with a new InputBlock injected into the last one.
 */
export function getFieldsWithNewInputBlock(fields: Field[], inputBlock: TellMe.InputBlock): Field[] {
  const fieldsWithoutLastField = dropLast(1, fields)
  const lastField = last(fields)
  if (!lastField) {
    B.error('[app/libs/SurveyFormManager/helpers/getFieldsWithNewLastFieldInputBlock()]', '`lastField` is undefined.')

    return fields
  }

  lastField.inputBlock = inputBlock

  return [...fieldsWithoutLastField, lastField]
}
