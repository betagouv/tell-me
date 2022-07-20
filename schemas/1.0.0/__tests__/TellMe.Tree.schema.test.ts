import { loadSchema } from '@common/helpers/loadSchema'
import Ajv from 'ajv'
import { B } from 'bhala'
import fastGlob from 'fast-glob'
import { promises as fs } from 'fs'

import TellMeTreeSchema from '../TellMe.Tree.schema.json'

import type { ValidateFunction } from 'ajv'

describe('schemas/1.0.0/TellMe.Tree.schema.json', () => {
  const ajv = new Ajv({
    loadSchema,
    strict: false,
  })
  let ajvValidate: ValidateFunction
  const failureSamplePaths = fastGlob.sync(`./schemas/1.0.0/__tests__/samples/failures/*.json`)
  const successSamplePaths = fastGlob.sync(`./schemas/1.0.0/__tests__/samples/successes/*.json`)

  beforeAll(async () => {
    ajvValidate = await ajv.compileAsync(TellMeTreeSchema)
  })

  test('', () => {
    expect(1 + 1).toBe(2)
  })

  describe('should pass', () => {
    test.each(successSamplePaths)('with %s', async samplePath => {
      const sampleSource = await fs.readFile(samplePath, 'utf-8')
      const tree = JSON.parse(sampleSource)

      const result = ajvValidate(tree)

      if (!result) {
        B.error(JSON.stringify(ajvValidate.errors, null, 2))
      }

      expect(result).toBe(true)
    })
  })

  describe('should fail', () => {
    test.each(failureSamplePaths)('with %s', async samplePath => {
      const sampleSource = await fs.readFile(samplePath, 'utf-8')
      const tree = JSON.parse(sampleSource)

      const result = ajvValidate(tree)

      expect(result).toBe(false)
    })
  })
})
