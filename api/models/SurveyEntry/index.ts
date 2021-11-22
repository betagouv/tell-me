import mongoose from 'mongoose'

import SurveyEntryAnswer from './SurveyEntryAnswer'
import SurveyEntryFile from './SurveyEntryFile'

function SurveyEntry() {
  if (mongoose.models.SurveyEntry) {
    return mongoose.models.SurveyEntry
  }

  return mongoose.model(
    'SurveyEntry',
    new mongoose.Schema(
      {
        survey: {
          required: true,
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Survey',
        },
        answers: {
          required: true,
          type: [SurveyEntryAnswer],
        },
        files: {
          required: false,
          type: [SurveyEntryFile],
          default: [],
        },
      },
      {
        timestamps: true,
      },
    ),
  )
}

export default SurveyEntry()
