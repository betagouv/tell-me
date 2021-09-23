import mongoose from 'mongoose'

import SurveyBlock from './SurveyBlock'
import SurveyCover from './SurveyCover'
import SurveyLogo from './SurveyLogo'

function Survey() {
  if (mongoose.models.Survey) {
    return mongoose.models.Survey
  }

  return mongoose.model(
    'Survey',
    new mongoose.Schema(
      {
        title: {
          required: true,
          type: String,
          unique: true,
        },
        slug: {
          required: true,
          type: String,
          unique: true,
        },
        isPublished: {
          required: false,
          type: Boolean,
          default: false,
        },
        logo: {
          required: false,
          type: SurveyLogo,
        },
        cover: {
          required: false,
          type: SurveyCover,
        },
        blocks: [SurveyBlock],
      },
      {
        timestamps: true,
      },
    ),
  )
}

export default Survey()
