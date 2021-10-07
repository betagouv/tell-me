import mongoose from 'mongoose'

import { USER_ROLE, USER_ROLES } from '../../common/constants'

function User() {
  if (mongoose.models.User) {
    return mongoose.models.User
  }

  return mongoose.model(
    'User',
    new mongoose.Schema(
      {
        email: {
          required: true,
          type: String,
          unique: true,
        },
        isActive: {
          default: false,
          type: Boolean,
        },
        password: {
          required: true,
          select: false,
          type: String,
        },
        role: {
          default: USER_ROLE.VIEWER,
          enum: USER_ROLES,
          required: false,
          type: String,
        },
      },
      {
        timestamps: true,
      },
    ),
  )
}

export default User()
