import mongoose from 'mongoose'

const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60

function RefreshToken() {
  if (mongoose.models.RefreshToken) {
    return mongoose.models.RefreshToken
  }

  return mongoose.model(
    'RefreshToken',
    new mongoose.Schema(
      {
        user: {
          required: true,
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        ip: {
          required: true,
          type: String,
        },
        value: {
          required: true,
          type: String,
          select: false,
          unique: true,
        },
        ttl: {
          required: false,
          type: Date,
          default: Date.now,
          index: {
            expireAfterSeconds: THIRTY_DAYS_IN_SECONDS,
          },
        },
      },
      {
        timestamps: true,
      },
    ),
  )
}

export default RefreshToken()
