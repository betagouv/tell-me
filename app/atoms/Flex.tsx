import styled from 'styled-components'

export const Flex = styled.div<{
  flexDirection?: 'column' | 'row'
}>`
  display: flex;
  flex-direction: ${p => p.flexDirection ?? 'row'};
`
