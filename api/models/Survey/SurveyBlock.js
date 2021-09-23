import mongoose from 'mongoose'

import { SURVEY_BLOCK_TYPES } from '../../../common/constants'

const SurveyBlockPositionType = {
  page: {
    required: true,
    type: Number,
  },
  rank: {
    required: true,
    type: Number,
  },
}

const SurveyBlock = new mongoose.Schema({
  type: {
    required: true,
    type: String,
    enum: SURVEY_BLOCK_TYPES,
  },
  value: {
    required: true,
    type: String,
  },
  position: {
    required: true,
    type: SurveyBlockPositionType,
  },
})

export default SurveyBlock
