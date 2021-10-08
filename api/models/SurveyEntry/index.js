import mongoose from 'mongoose'

import SurveyEntryAnswer from './SurveyEntryAnswer'

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
      },
      {
        timestamps: true,
      },
    ),
  )
}

export default SurveyEntry()
