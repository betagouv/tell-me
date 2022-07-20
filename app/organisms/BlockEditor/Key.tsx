import { TextInput } from '@singularity/core'
import { FormEvent, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import type { Block } from '../../libs/SurveyEditorManager/Block'

const KeyComponent = styled(TextInput)`
  padding-left: 7rem;

  .TextInput {
    background-color: ${p => p.theme.color.info.background};
    border: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0.5rem;
    color: ${p => p.theme.color.body.white};
    display: inline-flex;
    font-size: 75%;
    /* text-align: center; */
    padding: 0.15rem 0.325rem 0.1rem;
    min-width: 5rem;
    text-transform: uppercase;
    width: auto;

    ::placeholder {
      color: ${p => p.theme.color.body.white};
      opacity: 0.65;
    }
  }
`

type KeyProps = {
  block: Block
  onChange: (newKey: string | null) => void | Promise<void>
}
export function Key({ block, onChange }: KeyProps) {
  const [hasError, setHasError] = useState(false)

  const defaultValue = useMemo(() => block.key ?? undefined, [])
  const error = useMemo(
    () => (hasError ? 'A question key can only contain letters and underscores in-between.' : undefined),
    [hasError],
  )

  const handleInput = useCallback((event: FormEvent<HTMLInputElement>) => {
    setHasError(false)

    const { value } = event.currentTarget
    if (value === null || value.trim().length === 0) {
      onChange(null)

      return
    }

    const normalizedValue = value.toUpperCase()

    if (!/^[A-Z]([A-Z_]*[A-Z])?$/.test(normalizedValue)) {
      setHasError(true)

      return
    }

    onChange(normalizedValue)
  }, [])

  return (
    <KeyComponent contentEditable defaultValue={defaultValue} error={error} onInput={handleInput} placeholder="KEY" />
  )
}
