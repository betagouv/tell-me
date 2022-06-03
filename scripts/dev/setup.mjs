import { B } from 'bhala'
import { getAbsolutePath } from 'esm-path'
import { promises as fs } from 'fs'
import { pathExists } from 'fs-extra'
import keypair from 'keypair'

async function addRsaPrivateKeyToEnvIfNotExist() {
  const envPath = getAbsolutePath(import.meta.url, '../../.env')

  if (!(await pathExists(envPath))) {
    B.info(`Generating initial .env file...`)

    const envExamplePath = getAbsolutePath(import.meta.url, '../../.env.example')
    await fs.copyFile(envExamplePath, envPath)
  }
  const envSource = await fs.readFile(envPath, 'utf-8')

  if (/RSA_PRIVATE_KEY="/.test(envSource)) {
    return
  }

  B.info(`Generating development-only RSA Key Pair...`)

  const rsaKeyPair = keypair()
  const envSourceRsaPrivateKeyLine = `RSA_PRIVATE_KEY="${rsaKeyPair.private.trim().replace(/\n/g, '\\n')}"`
  const envSourceRsaPublicKeyLine = `NEXT_PUBLIC_RSA_PUBLIC_KEY="${rsaKeyPair.public.trim().replace(/\n/g, '\\n')}"`

  const envSourceWithRsa1 = envSource.replace(/RSA_PRIVATE_KEY=/, envSourceRsaPrivateKeyLine)

  const envSourceWithRsa2 = envSourceWithRsa1.replace(/NEXT_PUBLIC_RSA_PUBLIC_KEY=/, envSourceRsaPublicKeyLine)

  await fs.writeFile(envPath, envSourceWithRsa2)
}

;(async () => {
  // Don't run dev setup for non-local development environments
  if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV !== 'development') {
    return
  }

  B.info(`Running development setup...`)

  await addRsaPrivateKeyToEnvIfNotExist()
})()
