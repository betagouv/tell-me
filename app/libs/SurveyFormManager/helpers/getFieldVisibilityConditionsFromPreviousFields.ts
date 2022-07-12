import { B } from 'bhala'
import { empty, pathEq, prop, reduce } from 'ramda'

import type { Field } from '../Field'
import type { FieldVisibilityCondition } from '../types'

export function getFieldVisibilityConditionsFromPreviousFields(
  fieldId: string,
  previousFields: Field[],
): FieldVisibilityCondition[] {
  const hasFieldId = pathEq(['data', 'ifTruethyThenShowQuestionIds'], fieldId)

  return reduce<Field, FieldVisibilityCondition[]>((previousFieldVisibilityConditions, previousField) => {
    if (!previousField.inputType) {
      B.error(
        '[app/libs/SurveyFormManager/helpers/getFieldVisibilityConditionsFromPreviousFields()]',
        '`previousField.inputBlocks` is undefined.',
      )

      return previousFieldVisibilityConditions
    }

    if (!previousField.inputBlocks.length) {
      B.error(
        '[app/libs/SurveyFormManager/helpers/getFieldVisibilityConditionsFromPreviousFields()]',
        '`previousField.inputBlocks` is empty.',
      )

      return previousFieldVisibilityConditions
    }

    const matchingValues = previousField.inputBlocks.filter(hasFieldId).map(prop('value'))
    if (!matchingValues.length) {
      return previousFieldVisibilityConditions
    }

    if (previousField.inputType === 'input_choice') {
      const condition: FieldVisibilityCondition['condition'] = (rawValue: string | undefined) =>
        rawValue !== undefined && new RegExp(`(${matchingValues.join('|')})`).test(rawValue)
      const visibilityCondition: FieldVisibilityCondition = {
        condition,
        field: previousField,
      }

      return [...previousFieldVisibilityConditions, visibilityCondition]
    }

    if (previousField.inputType === 'input_multiple_choice') {
      const condition: FieldVisibilityCondition['condition'] = (rawValue: string | undefined) =>
        rawValue !== undefined && new RegExp(`(${matchingValues.join('|')})(,|$)`).test(rawValue)
      const visibilityCondition: FieldVisibilityCondition = {
        condition,
        field: previousField,
      }

      return [...previousFieldVisibilityConditions, visibilityCondition]
    }

    const condition: FieldVisibilityCondition['condition'] = (rawValue: string | undefined) =>
      rawValue !== undefined && !empty(rawValue.trim())
    const visibilityCondition: FieldVisibilityCondition = {
      condition,
      field: previousField,
    }

    return [...previousFieldVisibilityConditions, visibilityCondition]
  }, [])(previousFields)
}
