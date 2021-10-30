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
          required: false,
          type: Boolean,
          default: false,
        },
        password: {
          required: true,
          type: String,
          select: false,
          unique: true,
        },
        role: {
          required: false,
          type: String,
          default: USER_ROLE.VIEWER,
          enum: USER_ROLES,
        },
      },
      {
        timestamps: true,
      },
    ),
  )
}

export default User()
