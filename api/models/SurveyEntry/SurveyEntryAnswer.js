import mongoose from 'mongoose'

import { SURVEY_BLOCK_TYPES } from '../../../common/constants'

const SurveyEntryAnswer = new mongoose.Schema({
  question: {
    required: true,
    type: String,
  },
  type: {
    required: true,
    type: String,
    enum: SURVEY_BLOCK_TYPES,
  },
  values: {
    required: true,
    type: [String],
  },
})

export default SurveyEntryAnswer
