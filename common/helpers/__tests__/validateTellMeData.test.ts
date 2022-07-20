import { validateTellMeData } from '../validateTellMeData'

import type { TellMe } from '@schemas/1.0.0/TellMe'

describe('common/helpers/validateTellMeData()', () => {
  test('with a valid tree', async () => {
    const data: TellMe.Data = {
      entries: [],
      id: 'cjld2cjxh0000qzrmn831i7rn',
      language: 'en-US',
      title: 'A Title',
      version: '1.0.0',
    }

    const result = await validateTellMeData(data)

    expect(result.isValid).toStrictEqual(true)
    expect(result.errors).toHaveLength(0)
  })

  test('with an invalid tree', async () => {
    const tree = {} as any

    const result = await validateTellMeData(tree)

    expect(result.isValid).toStrictEqual(false)
    expect(result.errors).toStrictEqual([
      {
        instancePath: '',
        keyword: 'required',
        message: "must have required property 'entries'",
        params: {
          missingProperty: 'entries',
        },
        schemaPath: '#/required',
      },
    ])
  })
})
