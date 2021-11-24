import bcrypt from 'bcryptjs'

const BCRYPT_SALT_WORK_FACTOR = 10

export default function encrypt(value: string): Promise<string> {
  return bcrypt.hash(value, BCRYPT_SALT_WORK_FACTOR)
}
