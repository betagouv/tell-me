import Overlay from './Overlay'
import Window from './Window'

function Modal({ children }) {
  return (
    <Overlay>
      <Window>{children}</Window>
    </Overlay>
  )
}

export default Object.assign(Modal, {
  Overlay,
  Window,
})
