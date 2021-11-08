import mongoose from 'mongoose'

const TEN_MINUTES_IN_SECONDS = 10 * 60

function OneTimeToken() {
  if (mongoose.models.OneTimeToken) {
    return mongoose.models.OneTimeToken
  }

  return mongoose.model(
    'OneTimeToken',
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
            expireAfterSeconds: TEN_MINUTES_IN_SECONDS,
          },
        },
      },
      {
        timestamps: true,
      },
    ),
  )
}

export default OneTimeToken()
