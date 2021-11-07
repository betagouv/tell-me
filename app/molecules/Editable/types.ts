import { Properties } from 'hast'

export type BlockMenuItem = {
  label: string
  type: string
}

export type Node = {
  children?: Node[]
  properties?: Properties
  tagName?: string
  type: 'element' | 'root' | 'text'
  value?: string
}
