export function guardAsNaturalNumber(value: any, defaultValue: number, maxValue: number = Infinity): number {
  try {
    const valueAsNumber = value ? Number(value) : defaultValue
    if (Number.isNaN(valueAsNumber) || Math.floor(valueAsNumber) !== valueAsNumber || valueAsNumber < 0) {
      return defaultValue
    }
    if (valueAsNumber > maxValue) {
      return maxValue
    }

    return valueAsNumber
  } catch {
    return defaultValue
  }
}
