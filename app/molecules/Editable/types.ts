import type { TellMe } from '@schemas/1.0.0/TellMe'
import type { Properties } from 'hast'

export type BlockMenuItem = {
  category: string
  label: string
  type: TellMe.BlockType
}

export type Node = {
  children?: Node[]
  properties?: Properties
  tagName?: string
  type: 'element' | 'root' | 'text'
  value?: string
}
