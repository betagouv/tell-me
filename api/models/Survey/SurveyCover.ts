import mongoose from 'mongoose'

import { SURVEY_COVER_TYPES } from '../../../common/constants'

const SurveyCover = new mongoose.Schema({
  type: {
    required: true,
    type: String,
    enum: SURVEY_COVER_TYPES,
  },
  value: {
    required: true,
    type: String,
  },
})

export default SurveyCover
