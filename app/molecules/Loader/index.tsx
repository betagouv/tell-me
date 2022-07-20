import { Overlay } from './Overlay'
import { Spinner } from './Spinner'

export function Loader() {
  return (
    <Overlay>
      <Spinner />
    </Overlay>
  )
}
