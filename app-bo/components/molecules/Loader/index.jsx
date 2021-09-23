import CircularProgress from '@mui/material/CircularProgress'

import Overlay from './Overlay'

export default function Loader() {
  return (
    <Overlay>
      <CircularProgress />
    </Overlay>
  )
}
