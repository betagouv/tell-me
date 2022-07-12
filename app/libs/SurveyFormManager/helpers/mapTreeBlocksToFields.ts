import { reduce } from 'ramda'

import { Field } from '../Field'
import { getFieldsWithNewInputBlock } from './getFieldsWithNewInputBlock'

import type { TellMe } from '@schemas/1.0.0/TellMe'

export function mapTreeBlocksToFields(treeBlocks: TellMe.TreeBlock[]): Field[] {
  return reduce<TellMe.TreeBlock, Field[]>((previousFields, treeBlock) => {
    switch (treeBlock.type) {
      case 'question':
        return [...previousFields, new Field(treeBlock, previousFields)]

      case 'input_checkbox':
      case 'input_choice':
      case 'input_email':
      case 'input_file':
      case 'input_linear_scale':
      case 'input_link':
      case 'input_long_answer':
      case 'input_multiple_choice':
      case 'input_number':
      case 'input_phone':
      case 'input_rating':
      case 'input_short_answer':
        return getFieldsWithNewInputBlock(previousFields, treeBlock)

      default:
        return previousFields
    }
  }, [])(treeBlocks)
}
