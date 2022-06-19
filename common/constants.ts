import type { UserRole } from '@prisma/client'

/**
 * List of acceptable asset file types.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 */
export const FILE_EXTENSION_MIME_TYPE = Object.freeze({
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
})

export type MimeType = typeof FILE_EXTENSION_MIME_TYPE[keyof typeof FILE_EXTENSION_MIME_TYPE]

/**
 * List of acceptable asset mime types.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 */
export const MIME_TYPES: Readonly<MimeType[]> = Object.freeze(Object.values(FILE_EXTENSION_MIME_TYPE))

export enum GlobalVariableKey {
  BASE_URL = 'BASE_URL',
  S3_ACCESS_KEY = 'S3_ACCESS_KEY',
  S3_BUCKET = 'S3_BUCKET',
  S3_ENDPOINT = 'S3_ENDPOINT',
  S3_PORT = 'S3_PORT',
  S3_SECRET_KEY = 'S3_SECRET_KEY',
  S3_URL = 'S3_URL',
}

export const LOCALE = Object.freeze({
  en: 'en-US',
  'en-US': 'en-US',
  fr: 'fr-FR',
  'fr-FR': 'fr-FR',
})

export const LOCALE_LABEL = Object.freeze({
  'en-US': 'English (US)',
  'fr-FR': 'Français (France)',
})

export const USER_ROLE_LABEL: Record<UserRole, string> = Object.freeze({
  ADMINISTRATOR: 'Administror',
  MANAGER: 'Manager',
  VIEWER: 'Viewer',
})
