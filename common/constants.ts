/* eslint-disable import/prefer-default-export */

import * as R from 'ramda'

import type { UserRole } from '@prisma/client'

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

export const SURVEY_ENTRIES_DOWLOAD_CONTENT_TYPE = {
  CSV: 'text/csv',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export const SURVEY_ENTRIES_DOWLOAD_EXTENSION = {
  CSV: 'csv',
  XLSX: 'xlsx',
}

export const SURVEY_ENTRIES_DOWLOAD_EXTENSIONS = Object.values(SURVEY_ENTRIES_DOWLOAD_EXTENSION)

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  ADMINISTRATOR: 'Administror',
  MANAGER: 'Manager',
  VIEWER: 'Viewer',
}
