import styled, { keyframes } from 'styled-components'

const Box = styled.div`
  height: 3rem;
  perspective: 600px;
  position: relative;
  transform-style: preserve-3d;
  width: 3rem;
`

const Arc = styled.div`
  border-bottom: 2px solid ${p => p.theme.color.primary.default};
  border-radius: 50%;
  content: '';
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
`

const rotateFirstArc = keyframes`
  from {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(0);
  }

  to {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(1turn);
  }
`
const FirstArc = styled(Arc)`
  animation: ${rotateFirstArc} 1.15s linear infinite;
  animation-delay: -0.8s;
`

const rotateSecondArc = keyframes`
  from {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(0);
  }

  to {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(1turn);
  }
`
const SecondArc = styled(Arc)`
  animation: ${rotateSecondArc} 1.15s linear infinite;
  animation-delay: -0.4s;
`

const rotateThirdArc = keyframes`
  from {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(0);
  }

  to {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(1turn);
  }
`
const ThirdArc = styled(Arc)`
  animation: ${rotateThirdArc} 1.15s linear infinite;
  animation-delay: 0s;
`

export function Spinner() {
  return (
    <Box>
      <FirstArc />
      <SecondArc />
      <ThirdArc />
    </Box>
  )
}
