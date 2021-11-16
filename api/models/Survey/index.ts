import mongoose from 'mongoose'

import SurveyBlock from './SurveyBlock'

const SurveyPropsType = {
  coverUrl: {
    required: false,
    type: String,
    default: null,
  },
  logoUrl: {
    required: false,
    type: String,
    default: null,
  },
  thankYouMessage: {
    required: false,
    type: String,
    default: null,
  },
}

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
        blocks: {
          required: true,
          type: [SurveyBlock],
        },
        props: {
          required: false,
          type: SurveyPropsType,
          default: {
            thankYouMessage: null,
          },
        },
      },
      {
        timestamps: true,
      },
    ),
  )
}

export default Survey()
