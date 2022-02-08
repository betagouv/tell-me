import { PrismaClient } from '@prisma/client'

// eslint-disable-next-line @typescript-eslint/naming-convention
const __PRISMA = {
  prismaInstance: new PrismaClient(),
}

export default function getPrisma(): PrismaClient {
  return __PRISMA.prismaInstance
}
