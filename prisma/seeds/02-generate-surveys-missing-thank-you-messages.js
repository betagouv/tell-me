import Ajv from 'ajv'
import { B } from 'bhala'
import ky from 'ky-universal'

import TellMeTreeSchema from '../../schemas/1.0.0/TellMe.Tree.schema.json' assert { type: 'json' }

const ERROR_PATH = 'prisma/seeds/02-generate-surveys-missing-thank-you-messages.js'

async function loadSchema(schemaUrl) {
  const response = await ky.get(schemaUrl)
  const schema = await response.json()

  return schema
}

const ajv = new Ajv({
  loadSchema,
  strict: false,
})

/**
 * @param {import('@prisma/client').PrismaClient} prisma
 */
export async function generateSurveysMissingThankYouMessages(prisma) {
  try {
    B.info(`[${ERROR_PATH}]`, 'Generating surveys missing thank you messages…')

    const surveys = await prisma.survey.findMany()
    const validateTree = await ajv.compileAsync(TellMeTreeSchema)

    const updatedSurveys = surveys.map(({ id, tree }) => {
      /** @type {import('../../schemas/1.0.0/TellMe').TellMe.Tree} */
      const typedTree = tree

      if (typedTree.data.thankYouMessage !== undefined) {
        return {
          id,
          tree,
        }
      }

      const updatedTree = {
        ...typedTree,
        data: {
          ...typedTree.data,
          thankYouMessage: null,
        },
      }

      if (!validateTree(updatedTree)) {
        B.error(`[${ERROR_PATH}]`, '`updatedTree` is invalid.')
        console.error(validateTree.errors)

        process.exit(1)
      }

      return {
        id,
        tree: updatedTree,
      }
    })

    for (const updatedSurvey of updatedSurveys) {
      await prisma.survey.update({
        data: {
          tree: updatedSurvey.tree,
        },
        where: {
          id: updatedSurvey.id,
        },
      })
    }
  } catch (err) {
    B.error(`[${ERROR_PATH}]`, String(err))
    console.error(err)

    process.exit(1)
  }
}
