import { handleError } from '@common/helpers/handleError'
import dayjs from 'dayjs'
import * as R from 'ramda'
import XLSX from 'xlsx'

import ApiError from '../../../../../api/libs/ApiError'
import withAuth from '../../../../../api/middlewares/withAuth'
import withMongoose from '../../../../../api/middlewares/withMongoose'
import withPrisma from '../../../../../api/middlewares/withPrisma'
import Survey from '../../../../../api/models/Survey'
import SurveyEntry from '../../../../../api/models/SurveyEntry'
import {
  SURVEY_ENTRIES_DOWLOAD_CONTENT_TYPE,
  SURVEY_ENTRIES_DOWLOAD_EXTENSION,
  SURVEY_ENTRIES_DOWLOAD_EXTENSIONS,
  USER_ROLE,
} from '../../../../../common/constants'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/legacy/survey/SurveyDownloadEndpoint()'

const mapAnswers: (entries: any[]) => any[] = R.map(R.prop('answers'))

const convertSurveyEntriesToCollection = R.pipe(
  mapAnswers,
  R.map(R.reduce((row, { question, values }) => ({ ...row, [question]: values.join(',') }), {})),
)

async function SurveyDownloadEndpoint(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }

  try {
    const { fileExtension, id } = req.query
    if (typeof fileExtension !== 'string' || typeof id !== 'string') {
      return handleError(new ApiError('Not found.', 404, true), ERROR_PATH, res)
    }

    if (!SURVEY_ENTRIES_DOWLOAD_EXTENSIONS.includes(String(fileExtension))) {
      return handleError(new ApiError('Missing or wrong [fileExtension] query parameter.', 422, true), ERROR_PATH, res)
    }

    const survey = await Survey.findById(id).exec()
    const surveyEntries = await SurveyEntry.find({
      survey: id,
    }).exec()

    const date = dayjs().format('YYYYMMDD-HHmmss')
    const surveyEntriesCollection = convertSurveyEntriesToCollection(surveyEntries)
    const surveyEntriesXlsx = XLSX.utils.json_to_sheet(surveyEntriesCollection)

    if (fileExtension === SURVEY_ENTRIES_DOWLOAD_EXTENSION.XLSX) {
      res
        .status(200)
        .setHeader('Content-Type', SURVEY_ENTRIES_DOWLOAD_CONTENT_TYPE.XLSX)
        .setHeader('Content-Disposition', `attachment; filename=${survey.slug}-${date}.${fileExtension}`)
        .send(surveyEntriesXlsx)

      return
    }

    const surveyEntriesCsv = XLSX.utils.sheet_to_csv(surveyEntriesXlsx)

    res
      .status(200)
      .setHeader('Content-Type', SURVEY_ENTRIES_DOWLOAD_CONTENT_TYPE.CSV)
      .setHeader('Content-Disposition', `attachment; filename=${survey.slug}-${date}.${fileExtension}`)
      .send(surveyEntriesCsv)
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}

export default withPrisma(withMongoose(withAuth(SurveyDownloadEndpoint, [USER_ROLE.ADMINISTRATOR])))
