import styled from 'styled-components'

const StyledHeader = styled.header`
  background-color: #b8d8d8;
  height: 10rem;
  opacity: 1;
  width: 100%;
`

export default function Header(props) {
  return <StyledHeader {...props} />
}
