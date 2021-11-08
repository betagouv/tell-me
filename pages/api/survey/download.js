import dayjs from 'dayjs'
import * as R from 'ramda'
import XLSX from 'xlsx'

import handleError from '../../../api/helpers/handleError.ts'
import ApiError from '../../../api/libs/ApiError'
import withAuthentication from '../../../api/middlewares/withAuthentication'
import withMongoose from '../../../api/middlewares/withMongoose'
import Survey from '../../../api/models/Survey'
import SurveyEntry from '../../../api/models/SurveyEntry'
import {
  SURVEY_ENTRIES_DOWLOAD_CONTENT_TYPE,
  SURVEY_ENTRIES_DOWLOAD_EXTENSION,
  SURVEY_ENTRIES_DOWLOAD_EXTENSIONS,
  USER_ROLE,
} from '../../../common/constants'

const ERROR_PATH = 'pages/api/survey/SurveyDownloadController()'

const convertSurveyEntriesToCollection = R.pipe(
  R.map(R.prop('answers')),
  R.map(R.reduce((row, { question, values }) => ({ ...row, [question]: values.join(',') }), {})),
)

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
async function SurveyDownloadController(req, res) {
  if (req.method !== 'GET') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)

    return
  }

  try {
    const {
      fileExtension,
      surveyId: [surveyId],
    } = req.query

    if (!SURVEY_ENTRIES_DOWLOAD_EXTENSIONS.includes(fileExtension)) {
      handleError(new ApiError('Missing or wrong [fileExtension] query parameter.', 422, true), ERROR_PATH, res)

      return
    }

    const survey = await Survey.findById(surveyId).exec()
    const surveyEntries = await SurveyEntry.find({
      survey: surveyId,
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

export default withMongoose(
  withAuthentication(SurveyDownloadController, [USER_ROLE.ADMINISTRATOR, USER_ROLE.MANAGER, USER_ROLE.VIEWER]),
)
