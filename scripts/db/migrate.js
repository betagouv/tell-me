/* eslint-disable no-await-in-loop, no-restricted-syntax */

import ß from 'bhala'
import dotenv from 'dotenv'
import glob from 'glob'
import mongoose from 'mongoose'
import { promisify } from 'util'

const asyncGlob = promisify(glob)

dotenv.config()

async function migrate() {
  await mongoose.connect(process.env.DB_URL, {
    connectTimeoutMS: 5000,
  })

  const migrationFilePaths = await asyncGlob('./db/migrations/*.js')

  for (const migrationFilePath of migrationFilePaths) {
    ß.log(`Running '${migrationFilePath}' migration…`)
    const migrationModule = await import(`../.${migrationFilePath}`)
    await migrationModule.default()
  }

  await mongoose.disconnect()

  process.exit()
}

migrate()
