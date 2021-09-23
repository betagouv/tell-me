import SurveyModel from '../../api/models/Survey'
import Survey from '../../app-fo/components/templates/Survey'
import convertDocumentToPojo from '../../app-fo/server/convertDocumentToPojo'
import getMongoose from '../../app-fo/server/getMongoose'

export default function PublicSurveyPage({ data }) {
  return <Survey data={data} />
}

export async function getServerSideProps(context) {
  const {
    query: { slug },
  } = context

  await getMongoose()
  const maybeSurvey = await SurveyModel.findOne({ slug }, '-createdAt -updatedAt').exec()
  if (maybeSurvey === null) {
    return {
      notFound: true,
    }
  }

  // console.time('convertDocumentToPojo()')
  const surveyPojo = convertDocumentToPojo(maybeSurvey)
  // console.timeEnd('convertDocumentToPojo()')

  return {
    props: {
      data: surveyPojo,
    },
  }
}
