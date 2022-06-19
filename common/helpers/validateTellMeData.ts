import TellMeDataSchema from '@schemas/1.0.0/TellMe.Data.schema.json'

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

export async function validateTellMeData(data: TellMe.Data): Promise<{
  errors: ValidationError[]
  isValid: boolean
}> {
  const validate = await (async () => {
    if (CACHE.validate === undefined) {
      CACHE.validate = await ajv.compileAsync(TellMeDataSchema)
    }

    return CACHE.validate
  })()

  const isValid = validate(data)

  const errors = Array.isArray(validate.errors) ? validate.errors : []

  return {
    errors,
    isValid,
  }
}
