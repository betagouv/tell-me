import 'styled-components'

import type { Theme } from '@singularity/core'

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

declare namespace App {
  type SelectOption = {
    label: string
    value: string
  }
}
