import styled from 'styled-components'

const Container = styled.div`
  align-items: center;
  display: flex;
  margin: 0.375rem 0;
  min-height: 2.125rem;
  position: relative;
`

const Box = styled.label`
  cursor: pointer;
  display: flex;

  :focus-within .CheckboxIcon {
    box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(58 151 212 / 36%) 0px 0px 0px 4px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(0 122 255) 0px 0px 0px 2px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(0 0 0 / 0%) 0px 0px 0px 0px;
  }

  :focus-within > div {
    font-weight: 700;
  }
`

const Icon = styled.span`
  align-items: center;
  background-color: rgb(255, 255, 255);
  border-radius: 0.25rem;
  border: 0px;
  box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px,
    rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
    rgb(60 66 87 / 8%) 0px 2px 5px 0px;
  display: flex;
  height: 1.125rem;
  justify-content: center;
  margin-right: 0.25rem;
  min-height: 1.125rem;
  min-width: 1.125rem;
  width: 1.125rem;
`

export default function Checkbox({ children, className }) {
  return (
    <Container className={className}>
      <Box className="CheckboxBox">
        <Icon className="CheckboxIcon" />

        {children}
      </Box>
    </Container>
  )
}
