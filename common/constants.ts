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
  CONTENT: {
    QUESTION: 'CONTENT_QUESTION',
    // SUBTITLE: 'CONTENT_SUBTITLE',
    TEXT: 'CONTENT_TEXT',
  },
  INPUT: {
    CHECKBOX: 'INPUT_CHECKBOX',
    CHOICE: 'INPUT_CHOICE',
    // EMAIL: 'INPUT_EMAIL',
    FILE: 'INPUT_FILE',
    // LINEAR_SCALE: 'INPUT_LINEAR_SCALE',
    // LINK: 'INPUT_LINK',
    LONG_ANSWER: 'INPUT_LONG_ANSWER',
    // NUMBER: 'INPUT_NUMBER',
    // RATING: 'INPUT_RATING',
    SHORT_ANSWER: 'INPUT_SHORT_ANSWER',
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
