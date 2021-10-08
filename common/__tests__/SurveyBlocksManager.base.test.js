/* eslint-disable no-underscore-dangle */

import { SURVEY_BLOCK_TYPE } from '../constants'
import SurveyBlocksManager from '../SurveyBlocksManager'

describe('common/SurveyBlocksManager [Base Operations]', () => {
  /** @type SurveyBlocksManager */
  let instance

  test('should instantiate', () => {
    instance = new SurveyBlocksManager()

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
