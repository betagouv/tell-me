import Ajv from 'ajv'
import cuid from 'cuid'
import dayjs from 'dayjs'

import SurveyEntry from '../../api/models/SurveyEntry'
import TellMeDataSchema from '../../schemas/1.0.0/TellMe.Data.schema.json'
import TellMeTreeSchema from '../../schemas/1.0.0/TellMe.Tree.schema.json'
import loadSchema from './helpers/loadSchema'
import migrateAnswer, { MongoSurveyEntryAnswer } from './helpers/migrateAnswer'
import migrateBlock from './helpers/migrateBlock'

import type TellMe from '../../schemas/1.0.0/TellMe'
import type { Prisma, PrismaClient } from '@prisma/client'
import type { Mongoose, Types } from 'mongoose'

type MongoSurvey = {
  __v: number
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  // eslint-disable-next-line typescript-sort-keys/interface
  blocks: Api.Model.Survey.Block[]
  isPublished: boolean
  props: {
    _id: Types.ObjectId
    coverUrl: string | null
    logoUrl: string | null
    thankYouMessage: string | null
  }
  slug: string
  title: string
}

type MongoSurveyEntry = {
  __v: number
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  // eslint-disable-next-line typescript-sort-keys/interface
  answers: MongoSurveyEntryAnswer[]
  files: Array<{
    _id: Types.ObjectId
    mimeType: string
    question: string
    type: 'INPUT.FILE'
    url: string
  }>
  survey: Types.ObjectId
}

export default async function migrateMongoSurveysToPrisma(mongoose: Mongoose, prisma: PrismaClient) {
  try {
    const ajv = new Ajv({
      loadSchema,
      strict: false,
    })
    const ajvValidateTree = await ajv.compileAsync(TellMeTreeSchema)
    const ajvValidateData = await ajv.compileAsync(TellMeDataSchema)
    const Survey = mongoose.connection.db.collection<MongoSurvey>('surveys')
    // const SurveyEntry = mongoose.connection.db.collection<MongoSurveyEntry>('surveyentries')

    const mongoSurveys = await Survey.find().toArray()
    for (const mongoSurvey of mongoSurveys) {
      const tree: TellMe.Tree = {
        children: mongoSurvey.blocks.map(migrateBlock),
        data: {
          backgroundUri: null,
          coverUri: mongoSurvey.props.coverUrl,
          language: 'en-US',
          logoUri: mongoSurvey.props.logoUrl,
          title: mongoSurvey.title,
          version: '1.0.0',
        },
        id: mongoSurvey._id.toString(),
        type: 'root',
      }

      const isTreeValid: any = ajvValidateTree(tree)

      if (!isTreeValid) {
        console.error(JSON.stringify(ajvValidateTree.errors, null, 2))
      }

      const mongoSurveyEntries: MongoSurveyEntry[] = await SurveyEntry.find({
        survey: mongoSurvey._id,
      }).exec()

      const dataEntries: TellMe.DataEntry[] = mongoSurveyEntries.map(mongoSurveyEntry => {
        const answers: TellMe.DataEntryAnswer[] = [
          ...mongoSurveyEntry.answers.map(migrateAnswer),
          ...mongoSurveyEntry.files.map(
            file =>
              ({
                data: {
                  mime: file.mimeType,
                  uri: file.url,
                },
                question: {
                  id: cuid(),
                  value: file.question,
                },
                rawValue: file.url,
                type: 'file',
              } as TellMe.FileAnswer),
          ),
        ]

        return {
          answers,
          openedAt: dayjs(mongoSurveyEntry.createdAt).toISOString(),
          submittedAt: dayjs(mongoSurveyEntry.updatedAt).toISOString(),
        }
      })

      const data: TellMe.Data = {
        entries: dataEntries,
        id: tree.id,
        language: tree.data.language,
        title: tree.data.title,
        version: tree.data.version,
      }

      const isDataValid: any = ajvValidateData(data)

      if (!isDataValid) {
        console.error(JSON.stringify(ajvValidateData.errors, null, 2))

        return
      }

      const survey: Prisma.SurveyCreateInput = {
        createdAt: mongoSurvey.createdAt,
        data: data as any,
        id: mongoSurvey._id.toString(),
        isPublished: mongoSurvey.isPublished,
        slug: mongoSurvey.slug,
        tree: tree as any,
        updatedAt: mongoSurvey.updatedAt,
      }

      const count = await prisma.survey.count({
        where: {
          id: survey.id,
        },
      })
      if (count === 1) {
        // await prisma.survey.delete({
        //   where: {
        //     id: survey.id,
        //   },
        // })

        return
      }

      await prisma.survey.create({
        data: survey,
      })
    }
  } catch (err) {
    console.error(`[db/migrations/20220426-migrate-mongo-surveys-to-prisma.ts] ${err}`)

    process.exit(1)
  }
}
