import styled, { css } from 'styled-components'

import type { Block } from '../../libs/SurveyEditorManager/Block'
import type { HTMLAttributes } from 'react'

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

const Content = styled.div<any>`
  flex-grow: 1;
  opacity: ${p => (p.isHidden ? 0.65 : 1)};
  padding: 0 1rem 0 0;
`

const Button = styled.div<any>`
  align-items: center;
  background-color: ${p => p.theme.color[p.accent].background};
  color: ${p => p.theme.color.body.white};
  display: flex;
  justify-content: center;
  min-height: 3rem;
  min-width: 3rem;

  ${p =>
    !p.isDisabled
      ? css<any>`
          cursor: pointer;

          :hover {
            background-color: ${p.theme.color[p.accent].active};
          }
        `
      : css`
          opacity: 0;
        `}
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

const ICON: Record<string, (props: HTMLAttributes<HTMLSpanElement>) => JSX.Element> = {
  Add: () => <span className="material-icons md-24">add</span>,
  AddModerator: () => <span className="material-icons md-24">add_moderator</span>,
  Delete: () => <span className="material-icons md-24">delete</span>,
  Emergency: () => <span className="material-icons md-24">key</span>,
  Key: () => <span className="material-icons md-24">key</span>,
  KeyOff: () => <span className="material-icons md-24">key_off</span>,
  RemoveModerator: () => <span className="material-icons md-24">remove_moderator</span>,
  SubdirectoryArrowLeft: () => <span className="material-icons md-24">subdirectory_arrow_left</span>,
  Visibility: () => <span className="material-icons md-24">visibility</span>,
  VisibilityOff: () => <span className="material-icons md-24">visibility_off</span>,
}

type RowProps = {
  block: Block
  children: any
  onClickCondition: Common.FunctionLike
  onClickDelete: Common.FunctionLike
  onClickKey: Common.FunctionLike
  onToggleObligation: any
  onToggleVisibility: any
}
export function Row({
  block,
  children,
  onClickCondition,
  onClickDelete,
  onClickKey,
  onToggleObligation,
  onToggleVisibility,
}: RowProps) {
  return (
    <Box>
      <Button accent="primary" className="Button">
        <ICON.Add onClick={undefined} />
      </Button>

      <Asterisk isVisible={block.isRequired}>*</Asterisk>

      <Content isHidden={block.isHidden}>{children}</Content>

      <Button
        accent="primary"
        className="Button"
        isDisabled={!block.isQuestion}
        onClick={block.isQuestion ? onToggleObligation : undefined}
      >
        {block.isRequired ? <ICON.RemoveModerator /> : <ICON.AddModerator />}
      </Button>
      <Button
        accent="primary"
        className="Button"
        isDisabled={!block.isQuestion}
        onClick={block.isQuestion ? onToggleVisibility : undefined}
      >
        {block.isHidden ? <ICON.Visibility /> : <ICON.VisibilityOff />}
      </Button>
      <Button
        accent="secondary"
        className="Button"
        isDisabled={!block.isQuestion}
        onClick={block.isQuestion ? onClickKey : undefined}
      >
        {block.key ? <ICON.Key /> : <ICON.KeyOff />}
      </Button>
      <Button
        accent="secondary"
        className="Button"
        isDisabled={!block.isCheckbox && !block.isChoice}
        onClick={block.isCheckbox || block.isChoice ? onClickCondition : undefined}
      >
        <ICON.SubdirectoryArrowLeft />
      </Button>
      <Button accent="danger" className="Button" onClick={onClickDelete}>
        <ICON.Delete />
      </Button>
    </Box>
  )
}
