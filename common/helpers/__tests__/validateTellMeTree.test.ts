import { validateTellMeTree } from '../validateTellMeTree'

import type { TellMe } from '@schemas/1.0.0/TellMe'

describe('common/helpers/validateTellMeTree()', () => {
  test('with a valid tree', async () => {
    const tree: TellMe.Tree = {
      children: [],
      data: {
        backgroundUri: null,
        coverUri: null,
        language: 'en-US',
        logoUri: null,
        title: 'A Title',
        version: '1.0.0',
      },
      id: 'cjld2cjxh0000qzrmn831i7rn',
      type: 'root',
    }

    const result = await validateTellMeTree(tree)

    expect(result.isValid).toStrictEqual(true)
    expect(result.errors).toHaveLength(0)
  })

  test('with an invalid tree', async () => {
    const tree = {} as any

    const result = await validateTellMeTree(tree)

    expect(result.isValid).toStrictEqual(false)
    expect(result.errors).toStrictEqual([
      {
        instancePath: '',
        keyword: 'required',
        message: "must have required property 'type'",
        params: {
          missingProperty: 'type',
        },
        schemaPath: '#/required',
      },
    ])
  })
})
