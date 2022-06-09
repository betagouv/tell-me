/* eslint-disable import/prefer-default-export */

import * as R from 'ramda'

const listDeepObjectValues = (input: Record<string, Record<string, string>>) => {
  const values = R.values(input)
  const deepValues = R.map(R.values)(values)

  return R.flatten(deepValues)
}

export const LOCALE = {
  en: 'en-US',
  'en-US': 'en-US',
  fr: 'fr-FR',
  'fr-FR': 'fr-FR',
}

export const LOCALE_LABEL = {
  'en-US': 'English (US)',
  'fr-FR': 'Français (France)',
}

export const LOCALES = R.keys(LOCALE)

export const SURVEY_BLOCK_TYPE = {
  ACTION: {
    NEXT: 'ACTION.NEXT',
    SUBMIT: 'ACTION.SUBMIT',
  },
  CONTENT: {
    QUESTION: 'CONTENT.QUESTION',
    SUBTITLE: 'CONTENT.SUBTITLE',
    TEXT: 'CONTENT.TEXT',
  },
  INPUT: {
    CHECKBOX: 'INPUT.CHECKBOX',
    CHOICE: 'INPUT.CHOICE',
    EMAIL: 'INPUT.EMAIL',
    FILE: 'INPUT.FILE',
    LINEAR_SCALE: 'INPUT.LINEAR_SCALE',
    LINK: 'INPUT.LINK',
    LONG_ANSWER: 'INPUT.LONG_ANSWER',
    NUMBER: 'INPUT.NUMBER',
    RATING: 'INPUT.RATING',
    SHORT_ANSWER: 'INPUT.SHORT_ANSWER',
  },
}

export const SURVEY_BLOCK_TYPES = listDeepObjectValues(SURVEY_BLOCK_TYPE) as string[]

export const SURVEY_COVER_TYPE = {
  COLOR: 'COLOR',
  URL: 'URL',
}

export const SURVEY_COVER_TYPES = Object.values(SURVEY_COVER_TYPE)

export const SURVEY_ENTRIES_DOWLOAD_CONTENT_TYPE = {
  CSV: 'text/csv',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export const SURVEY_ENTRIES_DOWLOAD_EXTENSION = {
  CSV: 'csv',
  XLSX: 'xlsx',
}

export const SURVEY_ENTRIES_DOWLOAD_EXTENSIONS = Object.values(SURVEY_ENTRIES_DOWLOAD_EXTENSION)

export const USER_ROLE = {
  ADMINISTRATOR: 'ADMINISTRATOR',
  MANAGER: 'MANAGER',
  VIEWER: 'VIEWER',
}

export const USER_ROLE_LABEL = {
  ADMINISTRATOR: 'Administror',
  MANAGER: 'Manager',
  VIEWER: 'Viewer',
}

export const USER_ROLES = Object.values(USER_ROLE)
