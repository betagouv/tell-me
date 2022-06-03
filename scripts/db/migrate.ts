/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

import * as prismaClient from '@prisma/client'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import createUserConfig from '../../db/migrations/20211028-create-UserConfig-docs'
import dropTokenCollection from '../../db/migrations/20211031-drop-Token-collection'
import migrateMongoUserConfigsToPrisma from '../../db/migrations/20211124-migrate-mongo-user-configs-to-prisma'
import migrateMongoRefreshTokensToPrisma from '../../db/migrations/20211125-migrate-mongo-refresh-tokens-to-prisma'
import migrateMongoSurveysToPrisma from '../../db/migrations/20220426-migrate-mongo-surveys-to-prisma'

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
    const prismaInstance = new prismaClient.PrismaClient()

    await createUserConfig(mongooseInstance)
    await dropTokenCollection(mongooseInstance)
    await migrateMongoUserConfigsToPrisma(mongooseInstance, prismaInstance)
    await migrateMongoRefreshTokensToPrisma(mongooseInstance, prismaInstance)
    await migrateMongoSurveysToPrisma(mongooseInstance, prismaInstance)

    await mongoose.disconnect()
    await prismaInstance.$disconnect()

    process.exit()
  } catch (err) {
    console.error(`[scripts/db/migrate.ts] ${err}`)

    process.exit(1)
  }
}

migrate()
