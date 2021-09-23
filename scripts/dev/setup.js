const ß = require('bhala')
const { promises: fs } = require('fs')
const { pathExists } = require('fs-extra')
const keypair = require('keypair')
const path = require('path')

async function addRsaPrivateKeyToEnvIfNotExist() {
  const envPath = path.join(__dirname, '../../.env')

  if (!(await pathExists(envPath))) {
    ß.info(`Generating initial .env file...`, 'ℹ️')

    const envExamplePath = path.join(__dirname, '../../.env.example')
    await fs.copyFile(envExamplePath, envPath)
  }
  const envSource = await fs.readFile(envPath, 'utf-8')

  if (/RSA_PRIVATE_KEY="/.test(envSource)) {
    return
  }

  ß.info(`Generating development-only RSA Key Pair...`, 'ℹ️')

  const rsaKeyPair = keypair()
  const envSourceRsaPrivateKeyLine = `RSA_PRIVATE_KEY="${rsaKeyPair.private.trim().replace(/\n/g, '\\n')}"`
  const envSourceRsaPublicKeyLine = `NEXT_PUBLIC_RSA_PUBLIC_KEY="${rsaKeyPair.public.trim().replace(/\n/g, '\\n')}"`

  const envSourceWithRsa1 = envSource.replace(/RSA_PRIVATE_KEY=/, envSourceRsaPrivateKeyLine)

  const envSourceWithRsa2 = envSourceWithRsa1.replace(/NEXT_PUBLIC_RSA_PUBLIC_KEY=/, envSourceRsaPublicKeyLine)

  await fs.writeFile(envPath, envSourceWithRsa2)
}

;(async () => {
  // Don't run dev setup for non-local development environments
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  ß.info(`Running development setup...`, 'ℹ️')

  await addRsaPrivateKeyToEnvIfNotExist()
})()
