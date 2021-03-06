import { handleApiError } from '@common/helpers/handleApiError'

export function getFileExtension(fileName: string): string {
  try {
    const result = /\.([^.]+)$/.exec(fileName)
    if (result === null) {
      throw new Error(`Impossible to extract the file extension from "${fileName}" file name."`)
    }

    return result[1]
  } catch (err) {
    return handleApiError(err, 'api/helpers/getFileExtension()')
  }
}
