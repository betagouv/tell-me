import Ajv from 'ajv'
import { B } from 'bhala'
import cuid from 'cuid'
import ky from 'ky-universal'

import TellMeDataSchema from '../../schemas/1.0.0/TellMe.Data.schema.json' assert { type: 'json' }
import TellMeTreeSchema from '../../schemas/1.0.0/TellMe.Tree.schema.json' assert { type: 'json' }

const ERROR_PATH = 'prisma/seeds/01-generate-surveys-missing-keys-and-ids.js'

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
export async function generateSurveysMissingKeysAndIds(prisma) {
  try {
    B.info(`[${ERROR_PATH}]`, 'Generating surveys missing tree and data IDs…')

    const surveys = await prisma.survey.findMany()
    const validateTree = await ajv.compileAsync(TellMeTreeSchema)
    const validateData = await ajv.compileAsync(TellMeDataSchema)

    const updatedSurveys = surveys.map(({ data, id, tree }) => {
      /** @type {import('../../schemas/1.0.0/TellMe').TellMe.Tree} */
      const typedTree = tree
      /** @type {import('../../schemas/1.0.0/TellMe').TellMe.Data} */
      const typedData = data

      const treeChildrenWithKey = typedTree.children.map(child => {
        if (child.type !== 'question' || child.data.key !== undefined) {
          return child
        }

        return {
          ...child,
          data: {
            ...child.data,
            key: null,
          },
        }
      })

      const updatedTree = {
        ...typedTree,
        children: treeChildrenWithKey,
      }

      if (!validateTree(updatedTree)) {
        B.error(`[${ERROR_PATH}]`, '`updatedTree` is invalid.')
        console.error(validateTree.errors)

        process.exit(1)
      }

      const dataEntriesWithId = typedData.entries.map(entry => {
        const answersWithQuestionKey = entry.answers.map(answer => {
          if (answer.question.key !== undefined) {
            return answer
          }

          return {
            ...answer,
            question: {
              ...answer.question,
              key: null,
            },
          }
        })

        return {
          ...entry,
          answers: answersWithQuestionKey,
          id: entry.id === undefined ? cuid() : entry.id,
        }
      })

      const updatedData = {
        ...typedData,
        entries: dataEntriesWithId,
      }

      if (!validateData(updatedData)) {
        B.error(`[${ERROR_PATH}]`, '`updatedData` is invalid.')
        console.error(validateData.errors)

        process.exit(1)
      }

      return {
        data: updatedData,
        id,
        tree: updatedTree,
      }
    })

    for (const updatedSurvey of updatedSurveys) {
      await prisma.survey.update({
        data: {
          data: updatedSurvey.data,
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
