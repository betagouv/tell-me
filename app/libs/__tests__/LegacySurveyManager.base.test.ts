import { SURVEY_BLOCK_TYPE } from '../../../common/constants'
import LegacySurveyManager from '../LegacySurveyManager'

describe('common/LegacySurveyManager [Base Operations]', () => {
  let instance: LegacySurveyManager

  test('should instantiate', () => {
    instance = new LegacySurveyManager()

    expect(instance.blocks).toHaveLength(2)
  })

  test('should focus', () => {
    instance.setFocusAt(1)

    expect(instance.focusedBlockIndex).toStrictEqual(1)
    expect(instance.focusedBlock).toMatchObject({
      position: { rank: 2 },
      type: SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
    })
  })
})
