import Overlay from './Overlay'
import Title from './Title'
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
  Title,
  Window,
})
