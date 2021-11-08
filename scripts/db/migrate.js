/* eslint-disable no-await-in-loop, no-restricted-syntax */

import ß from 'bhala'
import dotenv from 'dotenv'
import glob from 'glob'
import mongoose from 'mongoose'
import { promisify } from 'util'

const asyncGlob = promisify(glob)

dotenv.config()
const { DB_URL } = process.env

async function migrate() {
  try {
    if (DB_URL === undefined) {
      throw new Error('`process.env.DB_URL` is undefined.')
    }

    const mongooseInstance = await mongoose.connect(DB_URL, {
      connectTimeoutMS: 5000,
    })

    const migrationFilePaths = await asyncGlob('./db/migrations/*.js')

    for (const migrationFilePath of migrationFilePaths) {
      ß.log(`Running '${migrationFilePath}' migration…`)
      const migrationModule = await import(`../.${migrationFilePath}`)
      await migrationModule.default(mongooseInstance)
    }

    await mongoose.disconnect()

    process.exit()
  } catch (err) {
    ß.error(`[scripts/db/migrate.ts] ${err}`)

    process.exit(1)
  }
}

migrate()
