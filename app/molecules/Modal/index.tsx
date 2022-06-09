import { Overlay } from './Overlay'
import { Window } from './Window'

function ModalComponent({ children }) {
  return (
    <Overlay>
      <Window>{children}</Window>
    </Overlay>
  )
}

ModalComponent.name = 'Modal'

export const Modal = Object.assign(ModalComponent, {
  Overlay,
  Window,
})
