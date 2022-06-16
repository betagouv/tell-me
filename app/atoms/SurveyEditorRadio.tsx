import { forwardRef } from 'react'
import styled from 'styled-components'

import type { BaseHTMLAttributes, ForwardedRef } from 'react'

const Label = styled.div`
  /* https://github.com/singularity-ui/core/blob/main/fields/Radio.jsx */

  align-items: center;
  background-color: ${p => p.theme.color.body.white};
  border: solid 1px ${p => p.theme.color.secondary.default};
  border-radius: ${p => p.theme.appearance.borderRadius.medium};
  display: inline-flex;
  margin: ${p => p.theme.padding.layout.small} 0;
  opacity: 1;
  padding: ${p => p.theme.padding.inputBox.medium};
  user-select: none;
`

const Letter = styled.span`
  /* https://github.com/singularity-ui/core/blob/main/fields/Radio.jsx */

  align-items: center;
  background-color: ${p => p.theme.color.secondary.default};
  border-radius: 0.25rem;
  color: ${p => p.theme.color.body.white};
  display: flex;
  font-size: ${p => p.theme.typography.size.medium * 80}%;
  font-weight: 700;
  height: 1.125rem;
  justify-content: center;
  line-height: 1;
  margin-right: ${p => p.theme.padding.input.medium};
  width: 1.125rem;
`

const Editable = styled.div`
  font-weight: 400;

  :empty::before {
    cursor: text;
    min-width: 5rem;
    content: attr(placeholder);
    display: block;
    -webkit-text-fill-color: rgb(187, 187, 187);
  }
`

type SurveyEditorRadioProps = BaseHTMLAttributes<HTMLDivElement> & {
  countLetter: string
}
export const SurveyEditorRadio = forwardRef(
  ({ countLetter, ...props }: SurveyEditorRadioProps, ref: ForwardedRef<HTMLDivElement>) => (
    <Label>
      <Letter>{countLetter}</Letter>

      <Editable ref={ref} {...props} />
    </Label>
  ),
)

SurveyEditorRadio.displayName = 'SurveyEditorRadio'
