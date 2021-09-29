import * as R from 'ramda'

import { SURVEY_BLOCK_TYPE } from '../../../../../common/constants'

const isBlockTypeIndexable = R.flip(R.includes)([SURVEY_BLOCK_TYPE.INPUT.CHECKBOX, SURVEY_BLOCK_TYPE.INPUT.CHOICE])

export default isBlockTypeIndexable
