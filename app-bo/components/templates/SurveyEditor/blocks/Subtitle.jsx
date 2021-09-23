import { forwardRef } from 'react'

function Subtitle({ children, ...props }, ref) {
  return (
    <h2 ref={ref} {...props}>
      {children}
    </h2>
  )
}

const SubtitleWithRef = forwardRef(Subtitle)
SubtitleWithRef.displayName = 'Subtitle'

export default SubtitleWithRef
