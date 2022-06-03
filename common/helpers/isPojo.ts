export function isPojo(value: any): boolean {
  return typeof value === 'object' && value.constructor.name === 'Object'
}
