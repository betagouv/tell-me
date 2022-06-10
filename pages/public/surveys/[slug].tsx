import { prisma } from '@api/libs/prisma'
import { SurveyHeader } from '@app/atoms/SurveyHeader'
import { SurveyLogo } from '@app/atoms/SurveyLogo'
import { SurveyQuestion } from '@app/atoms/SurveyQuestion'
import { SurveyTitle } from '@app/atoms/SurveyTitle'
import { useApi } from '@app/hooks/useApi'
import { SurveyEditorManager } from '@app/libs/SurveyEditorManager'
import { Loader } from '@app/molecules/Loader'
import { SurveyForm } from '@app/molecules/SurveyForm'
import { Blocks } from '@app/templates/Survey/Blocks'
import { getDayjs } from '@common/helpers/getDayjs'
import { Survey } from '@prisma/client'
import { useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import * as Yup from 'yup'

import type { Block } from '@app/libs/SurveyEditorManager/Block'
import type { TellMe } from '@schemas/1.0.0/TellMe'
import type { NextPageContext } from 'next'

const Page = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  padding-bottom: 5rem;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 960px;
`

const buildValidationSchema = (blocks: Block[], message: string) =>
  blocks.reduce((schema, block) => {
    if (!block.isQuestion || !block.isRequired) {
      return schema
    }

    if (block.questionInputType === 'input_multiple_choice') {
      return {
        ...schema,
        [block.id]: Yup.array(Yup.string()).length(1, message).required(message),
      }
    }

    if (block.questionInputType === 'input_file') {
      return {
        ...schema,
        [block.id]: Yup.object()
          .shape({
            name: Yup.string().required(message),
          })
          .nullable(),
      }
    }

    return {
      ...schema,
      [block.id]: Yup.string().trim().required(message),
    }
  }, {})

type PublicSurveyPageProps = {
  survey: Survey
}
export default function PublicSurveyPage({ survey }: PublicSurveyPageProps) {
  const $dayJs = useRef(getDayjs())
  const $surveyEditorManager = useRef(new SurveyEditorManager((survey.tree as unknown as TellMe.Tree).children))
  const [isLoading, setIsLoading] = useState(false)
  const [initialValues] = useState({})
  const [isSent, setIsSent] = useState(false)
  const intl = useIntl()
  const api = useApi()

  const openedAt = useMemo(() => $dayJs.current.utc().toISOString(), [])

  const validationMessage = intl.formatMessage({
    defaultMessage: 'This answer is required to validate the form.',
    description: '[Public Survey] Missing answer error message for a required question.',
    id: 'cvJp/S',
  })
  const validationSchema = buildValidationSchema($surveyEditorManager.current.blocks, validationMessage)
  const FormSchema = Yup.object().shape(validationSchema)

  const submitSurvey = async (values, { setSubmitting }) => {
    setIsLoading(true)

    const url = `surveys/${survey.id}/entries`
    const data = {
      formData: values,
      openedAt,
    }
    const maybeBody = await api.post(url, data)
    if (maybeBody === null || maybeBody.hasError) {
      setSubmitting(false)
      setIsLoading(false)

      return
    }

    setIsSent(true)
    setIsLoading(false)
  }

  return (
    <Page>
      <SurveyHeader url={(survey.tree as unknown as TellMe.Tree).data.coverUri} />

      <Container>
        <SurveyLogo url={(survey.tree as unknown as TellMe.Tree).data.logoUri} />

        <SurveyTitle>{(survey.tree as unknown as TellMe.Tree).data.title}</SurveyTitle>

        {isLoading && <Loader />}

        {!isLoading && !isSent && (
          <SurveyForm initialValues={initialValues} onSubmit={submitSurvey} validationSchema={FormSchema}>
            <Blocks blocks={$surveyEditorManager.current.blocks} />

            <SurveyForm.Submit>
              {intl.formatMessage({
                defaultMessage: 'Submit',
                description: '[Public Survey] Submit button label.',
                id: 'i0E602',
              })}
            </SurveyForm.Submit>
          </SurveyForm>
        )}

        {!isLoading && isSent && (
          <SurveyQuestion>
            {intl.formatMessage({
              defaultMessage: 'Thank you for your interest in helping our project!',
              description: '[Public Survey] Thank you message once the survey has been sent.',
              id: 'i8B3g5',
            })}
          </SurveyQuestion>
        )}
      </Container>
    </Page>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const {
    query: { slug },
  } = context
  if (typeof slug !== 'string') {
    return {
      notFound: true,
    }
  }

  const maybeSurvey = await prisma.survey.findUnique({
    where: {
      slug,
    },
  })
  if (maybeSurvey === null) {
    return {
      notFound: true,
    }
  }

  const surveyWithStringDates = {
    ...maybeSurvey,
    createdAt: maybeSurvey.createdAt.toISOString(),
    updatedAt: maybeSurvey.updatedAt.toISOString(),
  }

  return {
    props: {
      survey: surveyWithStringDates,
    },
  }
}
