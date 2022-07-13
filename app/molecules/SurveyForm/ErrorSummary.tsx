import { Block } from '@app/libs/SurveyEditorManager/Block'
import { useFormikContext } from 'formik'
import { isEmpty, map, pipe, propEq, toPairs } from 'ramda'
import { useMemo } from 'react'
import styled from 'styled-components'

const ErrorCard = styled.div`
  background-color: ${p => p.theme.color.danger.background};
  border-radius: ${p => p.theme.appearance.borderRadius.medium};
  margin-bottom: ${p => p.theme.padding.layout.medium};
  padding: ${p => p.theme.padding.layout.medium};

  > p:first-child {
    font-weight: 700;
  }
`

type SummaryError = {
  id: string
  message: string
  question: string
}

const mapFormikErrorsObjectToCollection: (
  formikErrors: Record<string, string>,
) => Array<Pick<SummaryError, 'id' | 'message'>> = pipe(
  toPairs,
  map<[string, string], Pick<SummaryError, 'id' | 'message'>>(([id, message]) => ({
    id,
    message,
  })),
)

const mapFormikErrorsToSurmmaryErrors = (blocks: Block[], formikErrors: Record<string, string>): SummaryError[] => {
  const summaryErrors = pipe(
    mapFormikErrorsObjectToCollection,
    map<Pick<SummaryError, 'id' | 'message'>, SummaryError>(formikErrorItem => {
      const block = blocks.find(propEq('id', formikErrorItem.id))

      if (block === undefined) {
        return {
          ...formikErrorItem,
          question: '???',
        }
      }

      return {
        ...formikErrorItem,
        question: block.value,
      }
    }),
  )(formikErrors)

  return summaryErrors
}

type ErrorSummaryProps = {
  blocks: Block[]
}
export function ErrorSummary({ blocks }: ErrorSummaryProps) {
  const { errors: formikErrors } = useFormikContext<Record<string, string>>()

  const summaryErrors = useMemo(
    () => mapFormikErrorsToSurmmaryErrors(blocks, formikErrors as Record<string, string>),
    [blocks, formikErrors],
  )

  if (isEmpty(summaryErrors)) {
    return null
  }

  return (
    <>
      {summaryErrors.map(({ id, message, question }) => (
        <ErrorCard>
          <p>{message}</p>
          <p>
            <a href={`#question-${id}`}>{question}</a>
          </p>
        </ErrorCard>
      ))}
    </>
  )
}
