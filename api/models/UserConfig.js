import mongoose from 'mongoose'

import { LOCALE, LOCALES } from '../../common/constants'

function UserConfig() {
  if (mongoose.models.UserConfig) {
    return mongoose.models.UserConfig
  }

  return mongoose.model(
    'UserConfig',
    new mongoose.Schema(
      {
        user: {
          required: true,
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        locale: {
          default: LOCALE['en-US'],
          enum: LOCALES,
          type: String,
        },
      },
      {
        timestamps: true,
      },
    ),
  )
}

export default UserConfig()
