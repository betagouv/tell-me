import TellMeTreeSchema from '@schemas/1.0.0/TellMe.Tree.schema.json'

import { ajv } from '../libs/ajv'

import type { TellMe } from '@schemas/1.0.0/TellMe'
import type { ValidateFunction } from 'ajv'

type ValidationError = {
  instancePath: string
  keyword: string
  message?: string
  params: Record<string, string>
  schemaPath: string
}

const CACHE: {
  validate?: ValidateFunction
} = {
  validate: undefined,
}

export async function validateTellMeTree(tree: TellMe.Tree): Promise<{
  errors: ValidationError[]
  isValid: boolean
}> {
  const validate = await (async () => {
    if (CACHE.validate === undefined) {
      CACHE.validate = await ajv.compileAsync(TellMeTreeSchema)
    }

    return CACHE.validate
  })()

  const isValid = validate(tree)
  const errors = Array.isArray(validate.errors) ? validate.errors : []

  return {
    errors,
    isValid,
  }
}
