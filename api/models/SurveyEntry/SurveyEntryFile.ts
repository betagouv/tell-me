import mongoose from 'mongoose'

import { SURVEY_BLOCK_TYPE } from '../../../common/constants'

const SurveyEntryFile = new mongoose.Schema({
  question: {
    required: true,
    type: String,
  },
  type: {
    required: false,
    type: String,
    default: SURVEY_BLOCK_TYPE.INPUT.FILE,
  },
  url: {
    required: true,
    type: String,
  },
})

export default SurveyEntryFile
