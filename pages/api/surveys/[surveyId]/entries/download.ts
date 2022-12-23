import { ApiError } from '@api/libs/ApiError'
import { prisma } from '@api/libs/prisma'
import { handleAuth } from '@api/middlewares/withAuth/handleAuth'
import { handleApiEndpointError } from '@common/helpers/handleApiEndpointError'
import { UserRole } from '@prisma/client'
import { TellMe } from '@schemas/1.0.0/TellMe'
import { stringify } from 'csv-stringify'
import { keys, uniq } from 'ramda'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/surveys/[surveyId]/entries/download.ts'

async function generateCsvFromObject(data: Array<Record<string, number | string | undefined>>): Promise<string> {
  return new Promise((resolve, reject) => {
    stringify(
      data,
      {
        header: true,
        quoted_empty: true,
        quoted_string: true,
      },
      (err, dataAsCsv) => {
        if (err) {
          reject(err)

          return
        }

        resolve(dataAsCsv)
      },
    )
  })
}

export default async function SurveyEntriesDownloadEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        await handleAuth(req, res, [UserRole.ADMINISTRATOR, UserRole.MANAGER], true)

        const { surveyId } = req.query
        if (typeof surveyId !== 'string') {
          throw new ApiError('`surveyId` must be a string.', 422, true)
        }

        const maybeSurvey = await prisma.survey.findUnique({
          where: {
            id: surveyId,
          },
        })
        if (maybeSurvey === null) {
          throw new ApiError('Not found.', 404, true)
        }

        const data = maybeSurvey.data as TellMe.Data
        const dataAsFlatObject = data.entries.map(({ answers, id, openedAt, submittedAt }) =>
          answers
            .filter(({ type }) => type !== 'file')
            .reduce(
              (prev, { question, rawValue }) => ({
                ...prev,
                [question.value]: rawValue,
              }),
              {
                /* eslint-disable sort-keys-fix/sort-keys-fix */
                ID: id,
                'Opened At': openedAt,
                'Submitted At': submittedAt,
                /* eslint-enable sort-keys-fix/sort-keys-fix */
              } as Record<string, number | string | undefined>,
            ),
        )
        const dataKeys = uniq(dataAsFlatObject.map(keys).flat())
        const consolidatedDataAsFlatObject = dataAsFlatObject.map(record =>
          dataKeys.reduce((_record, dataKey) => {
            if (_record[dataKey] === undefined) {
              return {
                ..._record,
                [dataKey]: undefined,
              }
            }

            return _record
          }, record),
        )
        const dataAsCsv = await generateCsvFromObject(consolidatedDataAsFlatObject)

        res.setHeader('Content-Type', 'text/csv')
        res.status(200).send(dataAsCsv)
      } catch (err) {
        handleApiEndpointError(err, ERROR_PATH, res, true)
      }

      return undefined

    default:
      handleApiEndpointError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res, true)
  }
}
