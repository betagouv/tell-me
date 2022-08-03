import shell from 'shelljs'

const { PORT } = process.env

shell.exec(`next dev -p ${PORT || 3000}`)
