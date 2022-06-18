import { handleApiError } from '@common/helpers/handleApiError'

import { prisma } from './prisma'

import type { GlobalVariableKey } from '@common/constants'

export const globalVariables = {
  get: async (key: GlobalVariableKey): Promise<string | null> => {
    try {
      const globalVariable = await prisma.globalVariable.findUnique({
        where: {
          key,
        },
      })
      if (globalVariable === null) {
        return null
      }

      return globalVariable.value
    } catch (err) {
      return handleApiError(err, 'api/libs/globalVariables.get()')
    }
  },

  set: async (key: GlobalVariableKey, value: string | number | null): Promise<string | null> => {
    try {
      const stringOrNullValue = typeof value === 'number' ? String(value) : value
      const normalizedValue =
        typeof stringOrNullValue === 'string' && stringOrNullValue.trim().length === 0 ? null : stringOrNullValue

      const globalVariable = await prisma.globalVariable.update({
        data: {
          value: normalizedValue,
        },
        where: {
          key,
        },
      })
      if (globalVariable === null) {
        return null
      }

      return globalVariable.value
    } catch (err) {
      return handleApiError(err, 'api/libs/globalVariables.set()')
    }
  },
}
