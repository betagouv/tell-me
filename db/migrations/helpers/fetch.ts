import http from 'http'
import https from 'https'

export default async function fetch(url: string) {
  const protocol = url.startsWith('https') ? https : http

  return new Promise((resolve, reject) => {
    protocol
      .get(
        url,
        {
          timeout: 10000,
        },
        res => {
          const dataAsBuffer: Uint8Array[] = []

          res.on('data', (chunk: Uint8Array) => {
            dataAsBuffer.push(chunk)
          })

          res.on('end', () => {
            const data = JSON.parse(Buffer.concat(dataAsBuffer).toString())

            resolve(data)
          })
        },
      )
      .on('error', err => {
        reject(err)
      })
  })
}
