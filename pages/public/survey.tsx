import { prisma } from '../../api/libs/prisma'
import { SurveyTemplate } from '../../app/templates/Survey'

import type { NextPageContext } from 'next'

export default function PublicSurveyPage({ data }) {
  return <SurveyTemplate survey={data} />
}

export async function getServerSideProps(context: NextPageContext) {
  const {
    query: { slug: slugAsArray },
  } = context
  if (!Array.isArray(slugAsArray) || typeof slugAsArray[0] !== 'string') {
    return {
      notFound: true,
    }
  }

  const maybeSurvey = await prisma.survey.findUnique({
    where: {
      slug: slugAsArray[0],
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
      data: surveyWithStringDates,
    },
  }
}
