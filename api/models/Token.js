import mongoose from 'mongoose'

function Token() {
  if (mongoose.models.Token) {
    return mongoose.models.Token
  }

  return mongoose.model(
    'Token',
    new mongoose.Schema(
      {
        email: {
          required: true,
          type: String,
        },
        ip: {
          required: true,
          type: String,
        },
        token: {
          required: true,
          type: String,
          unique: true,
        },
      },
      {
        timestamps: true,
      },
    ),
  )
}

export default Token()
