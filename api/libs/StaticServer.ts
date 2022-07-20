/* eslint-disable class-methods-use-this */

import { getFileNameFromFilePath } from '@api/helpers/getFileNameFromFilePath'
import { GlobalVariableKey } from '@common/constants'
import { handleApiError } from '@common/helpers/handleApiError'
import * as Minio from 'minio'

import { globalVariables } from './globalVariable'

import type { MimeType } from '@common/constants'

type UploadedFileInfo = {
  fileName: string
  mimeType: MimeType
  publicUrl: string
}

enum StaticServerType {
  S3,
}

const CACHE: {
  type?: StaticServerType
} = {}

export class StaticServer {
  #type?: StaticServerType

  constructor() {
    if (CACHE.type !== undefined) {
      this.#type = CACHE.type
    }
  }

  public async upload(filePath: string, mimeType: MimeType): Promise<UploadedFileInfo> {
    try {
      if (this.#type === undefined) {
        await this.#setType()
      }

      switch (this.#type) {
        case StaticServerType.S3:
          return await this.#uploadToS3(filePath, mimeType)

        default:
          throw new Error(`\`this.#type\` (= ${this.#type}) doesn't match any handled type.`)
      }
    } catch (err) {
      return handleApiError(err, 'api/libs/StaticServer.upload()')
    }
  }

  async #setType(): Promise<void> {
    try {
      this.#type = StaticServerType.S3
    } catch (err) {
      handleApiError(err, 'api/libs/StaticServer.#setType()')
    }
  }

  async #uploadToS3(filePath: string, mimeType: MimeType): Promise<UploadedFileInfo> {
    try {
      const accessKey = await globalVariables.get(GlobalVariableKey.S3_ACCESS_KEY)
      if (accessKey === null) {
        throw new Error('`accessKey` is null.')
      }
      const bucket = await globalVariables.get(GlobalVariableKey.S3_BUCKET)
      if (bucket === null) {
        throw new Error('`bucket` is null.')
      }
      const endPoint = await globalVariables.get(GlobalVariableKey.S3_ENDPOINT)
      if (endPoint === null) {
        throw new Error('`accessKey` is null.')
      }
      const port = await globalVariables.get(GlobalVariableKey.S3_PORT)
      const secretKey = await globalVariables.get(GlobalVariableKey.S3_SECRET_KEY)
      if (secretKey === null) {
        throw new Error('`accessKey` is null.')
      }
      const url = await globalVariables.get(GlobalVariableKey.S3_URL)
      if (url === null) {
        throw new Error('`url` is null.')
      }

      const client = new Minio.Client({
        accessKey,
        endPoint,
        port: port !== null ? Number(port) : undefined,
        secretKey,
        useSSL: true,
      })

      const fileName = getFileNameFromFilePath(filePath)
      const metaData = {
        'Content-Type': mimeType,
      }
      await client.fPutObject(bucket, fileName, filePath, metaData)
      const publicUrl = `${url}${url.endsWith('/') ? '' : '/'}${fileName}`

      return {
        fileName,
        mimeType,
        publicUrl,
      }
    } catch (err) {
      return handleApiError(err, 'api/libs/StaticServer.#uploadToS3()')
    }
  }
}
