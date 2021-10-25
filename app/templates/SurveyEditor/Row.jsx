import { css, styled } from '@singularity-ui/core'
import PropTypes from 'prop-types'
import { Eye, EyeOff, GitPullRequest, Move, Shield, ShieldOff, Trash } from 'react-feather'

import { SurveyManagerBlockShape } from '../../shapes'

const Box = styled.div`
  align-items: flex-start;
  display: flex;
  min-height: 3rem;
  padding: 0 1rem 0 1rem;

  :hover {
    background-color: #ffffff;
  }

  :hover > .Button {
    opacity: 1;
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
  cursor: pointer;
  display: flex;
  justify-content: center;
  min-height: 3rem;
  min-width: 3rem;
  opacity: 0;

  ${p =>
    !p.isDisabled
      ? css`
          :hover {
            background-color: ${p => p.theme.color[p.accent].active};
            opacity: 1;
          }
        `
      : css`
          :hover {
            cursor: not-allowed;
          }
        `}

  svg {
    color: ${p => p.theme.color.body.white};
    height: 2rem !important;
    max-width: 2rem !important;
  }
`

export default function Row({ block, children, onCondition, onDelete, onMove, onToggleVisibility }) {
  return (
    <Box>
      <Button accent="primary" className="Button">
        <Move onClick={onMove} />
      </Button>

      <Content isHidden={block.props.isHidden}>{children}</Content>

      <Button accent="secondary" className="Button" isDisabled={!block.isQuestion} onClick={onCondition}>
        {block.isMandatory ? <Shield /> : <ShieldOff />}
      </Button>
      <Button accent="primary" className="Button" isDisabled={!block.isQuestion} onClick={onToggleVisibility}>
        {block.isHidden ? <EyeOff /> : <Eye />}
      </Button>
      <Button accent="secondary" className="Button" isDisabled={!block.isQuestion} onClick={onCondition}>
        <GitPullRequest />
      </Button>
      <Button accent="danger" className="Button" onClick={onDelete}>
        <Trash />
      </Button>
    </Box>
  )
}

Row.defaultProps = {
  onCondition: () => undefined,
  onMove: () => undefined,
}

Row.propTypes = {
  block: PropTypes.shape(SurveyManagerBlockShape).isRequired,
  onCondition: PropTypes.func,
  onDelete: PropTypes.func.isRequired,
  onMove: PropTypes.func,
  onToggleVisibility: PropTypes.func.isRequired,
}
