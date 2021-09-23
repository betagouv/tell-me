import MuiSkeleton from '@mui/material/Skeleton'
import { styled } from '@mui/material/styles'

const MAPPER = new Array(10).fill(null)

const Text = styled(MuiSkeleton)`
  background-color: #cccccc;
  height: 2rem;
  margin: 0.5rem 0;
  transform: none;
`

export default function Button() {
  return (
    <>
      {MAPPER.map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Text key={index} variant="text" />
      ))}
    </>
  )
}
