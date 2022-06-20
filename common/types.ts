import { Survey } from '@prisma/client'
import { TellMe } from '@schemas/1.0.0/TellMe'

export type SurveyWithJsonType = Omit<Survey, 'createdAt' | 'data' | 'tree' | 'updatedAt'> & {
  createdAt: string
  data: TellMe.Data
  tree: TellMe.Tree
  updatedAt: string
}
