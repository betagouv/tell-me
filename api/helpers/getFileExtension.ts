export function getFileExtension(fileName: string): string {
  const result = /\.([^.]+)$/.exec(fileName)
  if (result === null) {
    throw new Error(`Impossible to extract the file extension from "${fileName}" file name."`)
  }

  return result[1]
}
