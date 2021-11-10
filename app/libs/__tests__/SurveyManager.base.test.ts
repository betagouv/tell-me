import { SURVEY_BLOCK_TYPE } from '../../../common/constants'
import SurveyManager from '../SurveyManager'

describe('common/SurveyManager [Base Operations]', () => {
  let instance: SurveyManager

  test('should instantiate', () => {
    instance = new SurveyManager()

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
