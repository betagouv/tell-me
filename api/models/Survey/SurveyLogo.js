import mongoose from 'mongoose'

import { SURVEY_LOGO_TYPE } from '../../../common/constants'

const SurveyLogo = new mongoose.Schema({
  type: {
    required: true,
    type: String,
    enum: SURVEY_LOGO_TYPE,
  },
  value: {
    required: true,
    type: String,
  },
})

export default SurveyLogo
