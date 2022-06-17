import type { UserRole } from '@prisma/client'

/**
 * List of acceptable asset file types.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 */
export const FILE_EXTENSION_MIME_TYPE = {
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  odp: 'application/vnd.oasis.opendocument.presentation',
  ods: 'application/vnd.oasis.opendocument.spreadsheet',
  odt: 'application/vnd.oasis.opendocument.text',
  pdf: 'application/pdf',
  png: 'image/png',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  svg: 'image/svg+xml',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  webp: 'image/webp',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

/**
 * List of acceptable asset mime types.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 */
export const MIME_TYPES = Object.values(FILE_EXTENSION_MIME_TYPE)

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
