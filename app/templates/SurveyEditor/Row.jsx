import { css, styled } from '@singularity-ui/core'
import PropTypes from 'prop-types'
import { CornerDownRight, Eye, EyeOff, Move, Shield, ShieldOff, Trash } from 'react-feather'

import { SurveyManagerBlockShape } from '../../shapes'

const Box = styled.div`
  align-items: flex-start;
  display: flex;
  min-height: 3rem;
  padding: 0 1rem 0 1rem;

  :hover {
    background-color: #ffffff;
  }

  .Button {
    visibility: hidden;
  }
  :hover > .Button {
    visibility: visible;
  }
`

const Content = styled.div`
  flex-grow: 1;
  opacity: ${p => (p.isHidden ? 0.65 : 1)};
  padding: 0 1rem;
`

const Button = styled.div`
  align-items: center;
  background-color: ${p => p.theme.color[p.accent].background};
  display: flex;
  justify-content: center;
  min-height: 3rem;
  min-width: 3rem;

  ${p =>
    !p.isDisabled
      ? css`
          cursor: pointer;
          opacity: 0.65;

          :hover {
            background-color: ${p => p.theme.color[p.accent].active};
            opacity: 1;
          }
        `
      : css`
          opacity: 0.1;
        `}

  svg {
    color: ${p => p.theme.color.body.white};
    height: 2rem !important;
    max-width: 2rem !important;
  }
`

const noop = () => undefined

export default function Row({ block, children, onCondition, onDelete, onMove, onToggleVisibility }) {
  return (
    <Box>
      <Button accent="primary" className="Button">
        <Move onClick={onMove} />
      </Button>

      <Content isHidden={block.props.isHidden}>{children}</Content>

      <Button
        accent="secondary"
        className="Button"
        isDisabled={!block.isQuestion}
        onClick={block.isQuestion ? onCondition : noop}
      >
        {block.isMandatory ? <Shield /> : <ShieldOff />}
      </Button>
      <Button
        accent="primary"
        className="Button"
        isDisabled={!block.isQuestion}
        onClick={block.isQuestion ? onToggleVisibility : noop}
      >
        {block.isHidden ? <EyeOff /> : <Eye />}
      </Button>
      <Button
        accent="secondary"
        className="Button"
        isDisabled={!block.isCheckbox && !block.isChoice}
        onClick={block.isCheckbox || block.isChoice ? onCondition : noop}
      >
        <CornerDownRight />
      </Button>
      <Button accent="danger" className="Button" onClick={onDelete}>
        <Trash />
      </Button>
    </Box>
  )
}

Row.defaultProps = {
  onCondition: noop,
  onMove: noop,
}

Row.propTypes = {
  block: PropTypes.shape(SurveyManagerBlockShape).isRequired,
  onCondition: PropTypes.func,
  onDelete: PropTypes.func.isRequired,
  onMove: PropTypes.func,
  onToggleVisibility: PropTypes.func.isRequired,
}
