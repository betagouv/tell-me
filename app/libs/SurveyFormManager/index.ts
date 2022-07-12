import { TellMe } from '@schemas/1.0.0/TellMe'

import { Field } from './Field'
import { mapTreeBlocksToFields } from './helpers/mapTreeBlocksToFields'

import type * as SurveyFormManagerType from './types'

export { SurveyFormManagerType }

/**
 * Handle all the Survey Form behaviors for any given Tell Me Tree as defined in the JSON Schema.
 */
export class SurveyFormManager {
  #data: TellMe.Tree['data']
  #id: TellMe.Tree['id']
  #fields: Field[]

  constructor(tree: TellMe.Tree) {
    this.#data = tree.data
    this.#id = tree.id

    this.#fields = mapTreeBlocksToFields(tree.children)
  }
}
