/* eslint-disable no-await-in-loop, no-restricted-syntax */

import User from '../../api/models/User'
import UserConfig from '../../api/models/UserConfig'

export default async () => {
  const users = await User.find().exec()

  for (const user of users) {
    const maybeUserConfig = await UserConfig.findOne({
      user: user._id,
    }).exec()

    if (maybeUserConfig === null) {
      const newUserConfig = new UserConfig({
        user: user._id,
      })

      await newUserConfig.save()
    }
  }
}
