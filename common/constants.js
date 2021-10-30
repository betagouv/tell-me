/* eslint-disable import/prefer-default-export */

import * as R from 'ramda'

const listDeepObjectValues = input => R.pipe(R.values, R.map(R.values), R.flatten)(input)

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
    LINEAR_SCALE: 'INPUT.LINEAR_SCALE',
    LINK: 'INPUT.LINK',
    LONG_ANSWER: 'INPUT.LONG_ANSWER',
    NUMBER: 'INPUT.NUMBER',
    RATING: 'INPUT.RATING',
    SHORT_ANSWER: 'INPUT.SHORT_ANSWER',
  },
}

export const SURVEY_BLOCK_TYPES = listDeepObjectValues(SURVEY_BLOCK_TYPE)

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

export const SURVEY_LOGO_TYPE = {
  URL: 'URL',
}

export const SURVEY_LOGO_TYPES = Object.values(SURVEY_LOGO_TYPE)

export const QUESTION_TYPE = {
  GRADE: 'Grade',
  INPUT: 'Input',
  NUMBER: 'Number',
  RADIO: 'Radio',
  SELECT: 'Select',
}

export const QUESTION_TYPES = Object.values(QUESTION_TYPE)

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
