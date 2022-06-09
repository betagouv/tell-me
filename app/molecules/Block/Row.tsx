import { CornerDownRight, Eye, EyeOff, Move, Shield, ShieldOff, Trash } from 'react-feather'
import styled, { css } from 'styled-components'

import type { Block as SurveyEditorManagerBlock } from '../../libs/SurveyEditorManager/Block'

const Box = styled.div<any>`
  align-items: flex-start;
  display: flex;
  margin-top: ${p => (p.isQuestion ? p.theme.padding.layout.large : 0)};
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

const Content = styled.div<any>`
  flex-grow: 1;
  opacity: ${p => (p.isHidden ? 0.65 : 1)};
  padding: 0 1rem 0 0;
`

const Button = styled.div<any>`
  align-items: center;
  background-color: ${p => p.theme.color[p.accent].background};
  display: flex;
  justify-content: center;
  min-height: 3rem;
  min-width: 3rem;

  ${p =>
    !p.isDisabled
      ? css<any>`
          cursor: pointer;
          opacity: 0.65;

          :hover {
            background-color: ${p.theme.color[p.accent].active};
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

const Asterisk = styled.div<any>`
  align-items: center;
  color: ${p => p.theme.color.primary.active};
  display: flex;
  font-size: 125%;
  font-weight: 700;
  justify-content: center;
  min-height: 3rem;
  min-width: 3rem;
  opacity: ${p => (p.isVisible ? 1 : 0)};
  padding: 0 0.5rem 0 1rem;
  user-select: none;
`

type RowProps = {
  block: SurveyEditorManagerBlock
  children: any
  onCondition?: () => void
  onDelete: () => void
  onMove?: () => void
  onToggleObligation: any
  onToggleVisibility: any
}
export function Row({
  block,
  children,
  onCondition,
  onDelete,
  onMove,
  onToggleObligation,
  onToggleVisibility,
}: RowProps) {
  return (
    <Box isQuestion={block.isQuestion}>
      <Button accent="primary" className="Button">
        <Move onClick={onMove} />
      </Button>

      <Asterisk isVisible={block.isRequired}>*</Asterisk>

      <Content isHidden={block.isHidden}>{children}</Content>

      <Button
        accent="secondary"
        className="Button"
        isDisabled={!block.isQuestion}
        onClick={block.isQuestion ? onToggleObligation : undefined}
      >
        {block.isRequired ? <ShieldOff /> : <Shield />}
      </Button>
      <Button
        accent="primary"
        className="Button"
        isDisabled={!block.isQuestion}
        onClick={block.isQuestion ? onToggleVisibility : undefined}
      >
        {block.isHidden ? <Eye /> : <EyeOff />}
      </Button>
      <Button
        accent="secondary"
        className="Button"
        isDisabled={!block.isCheckbox && !block.isChoice}
        onClick={block.isCheckbox || block.isChoice ? onCondition : undefined}
      >
        <CornerDownRight />
      </Button>
      <Button accent="danger" className="Button" onClick={onDelete}>
        <Trash />
      </Button>
    </Box>
  )
}
