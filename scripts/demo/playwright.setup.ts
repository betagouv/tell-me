/* eslint-disable no-await-in-loop */

import prismaClientPkg from '@prisma/client'
import dotenv from 'dotenv'
import ky from 'ky-universal'

import { DEMO_USER } from './constants.js'

dotenv.config()

const { PrismaClient } = prismaClientPkg

// eslint-disable-next-line import/no-default-export
export default async function globalSetup() {
  const prisma = new PrismaClient()

  await prisma.oneTimeToken.deleteMany()
  await prisma.personalAccessToken.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.survey.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.userConfig.deleteMany()

  await prisma.user.deleteMany()

  await ky.post('http://localhost:3000/api/auth/signup', {
    json: DEMO_USER,
  })

  await prisma.$disconnect()
}
