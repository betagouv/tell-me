import { promises as fs } from 'fs'

export async function isPath(path: string): Promise<boolean> {
  try {
    await fs.lstat(path)

    return true
  } catch {
    return false
  }
}
