import type { HTMLAttributes } from 'react'

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
    <span className="material-icons md-24" {...rest}>
      {icon}
    </span>
  )
}
