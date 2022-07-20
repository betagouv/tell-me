import styled from 'styled-components'

import type { HTMLAttributes } from 'react'

const Box = styled.span`
  font-size: inherit;
`

type IconProps = HTMLAttributes<HTMLSpanElement> & {
  /**
   * @see https://fonts.google.com/icons
   *
   * @example `arrow_back`
   */
  icon: string
}
export function Icon({ icon, ...rest }: IconProps) {
  return (
    <Box className="material-icons" {...rest}>
      {icon}
    </Box>
  )
}
