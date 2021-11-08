import { SURVEY_BLOCK_TYPE } from '../../../common/constants'
import SurveyManager from '../SurveyManager'

describe('common/SurveyManager [Base Operations]', () => {
  /** @type SurveyManager */
  let instance

  test('should instantiate', () => {
    instance = new SurveyManager()

    expect(instance._blocks).toHaveLength(2)
  })

  test('should focus', () => {
    instance.setFocusAt(1)

    expect(instance._focusedBlockIndex).toStrictEqual(1)
    expect(instance.focusedBlock).toMatchObject({
      position: { rank: 2 },
      type: SURVEY_BLOCK_TYPE.CONTENT.QUESTION,
    })
  })
})