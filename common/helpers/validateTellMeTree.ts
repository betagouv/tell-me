import TellMeTreeSchema from '@schemas/1.0.0/TellMe.Tree.schema.json'

import { ajv } from '../libs/ajv'

import type TellMe from '@schemas/1.0.0/TellMe'

type ValidationError = {
  instancePath: string
  keyword: string
  message?: string
  params: Record<string, string>
  schemaPath: string
}

export async function validateTellMeTree(
  tree: TellMe.Tree,
): Promise<{
  errors: ValidationError[]
  isValid: boolean
}> {
  const validate = await ajv.compileAsync(TellMeTreeSchema)

  const isValid = validate(tree)

  const errors = Array.isArray(validate.errors) ? validate.errors : []

  return {
    errors,
    isValid,
  }
}
