import { forwardRef } from 'react'
import { Upload } from 'react-feather'
import styled from 'styled-components'

const Box = styled.div<any>`
  /* https://github.com/singularity-ui/core/blob/main/fields/FileInput.tsx */

  align-items: center;
  background-color: ${p => p.theme.color.body.white};
  display: flex;
  flex-direction: column;
  height: ${p => Math.round(p.theme.typography.size.medium * 8)}rem;
  justify-content: center;
  position: relative;

  ::after {
    border-bottom: 1rem solid ${p => p.theme.color.body.light};
    border-right: 1rem solid transparent;
    content: '';
    height: 0;
    opacity: 0.65;
    position: absolute;
    right: 0;
    top: 0;
    width: 0;
  }
  :hover::after {
    opacity: 1;
  }

  ::before {
    border-left: 1rem solid transparent;
    border-top: 1rem solid ${p => p.theme.color.body.background};
    content: '';
    height: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: 0;
  }

  > svg {
    color: ${p => p.theme.color.body.light};
    height: ${p => Math.round(p.theme.typography.size.medium * 2)}rem;
    width: ${p => Math.round(p.theme.typography.size.medium * 2)}rem;
    opacity: 0.65;
  }
  :hover > svg {
    opacity: 1;
  }

  :empty::before {
    -webkit-text-fill-color: ${p => p.theme.color.body.light};
    content: attr(placeholder);
    cursor: text;
    display: block;
    opacity: 0.65;
    width: 100%;
  }
`

const Editable = styled.div`
  /* https://github.com/singularity-ui/core/blob/main/fields/FileInput.tsx */

  font-size: ${p => Math.round(p.theme.typography.size.medium * 100)}%;
  font-weight: 500;
  padding: ${p => p.theme.padding.input.medium} 0 0 0;

  :empty::before {
    cursor: text;
    min-width: 5rem;
    content: attr(placeholder);
    display: block;
    text-align: center;
    -webkit-text-fill-color: rgb(187, 187, 187);
  }
`

export const FileInput = forwardRef<HTMLDivElement>((props, ref) => (
  <Box>
    <Upload />
    <Editable ref={ref} {...props} />
  </Box>
))

FileInput.displayName = 'FileInput'
