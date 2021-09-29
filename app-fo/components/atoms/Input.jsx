import styled from 'styled-components'

export const Container = styled.div`
  align-items: center;
  display: flex;
  margin: 0.375rem 0;
  min-height: 2.125rem;
  position: relative;
`

export default function Checkbox({ children, className }) {
  return <Container className={className}>{children}</Container>
}
