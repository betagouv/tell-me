import { handleApiError } from '@common/helpers/handleApiError'

export function getFileNameFromFilePath(filePath: string): string {
  try {
    const result = /[/\\]([^/\\]+)$/.exec(filePath)
    if (result === null || result[1] === undefined) {
      throw new Error(`Impossible to extract the file name from "${filePath}" file path."`)
    }

    return result[1]
  } catch (err) {
    return handleApiError(err, 'api/helpers/getFileNameFromFilePath()')
  }
}
