import { prisma } from './prisma'

export enum GlobalVariableKey {
  BASE_URL = 'BASE_URL',
}

const globalVariables = {
  get: async (key: GlobalVariableKey): Promise<string | null> => {
    const globalVariable = await prisma.globalVariable.findUnique({
      where: {
        key,
      },
    })
    if (globalVariable === null) {
      return null
    }

    return globalVariable.value
  },

  set: async (key: GlobalVariableKey, value: string | null): Promise<string | null> => {
    const globalVariable = await prisma.globalVariable.update({
      data: {
        value,
      },
      where: {
        key,
      },
    })
    if (globalVariable === null) {
      return null
    }

    return globalVariable.value
  },
}

export { globalVariables }
