import convertDocumentToPojo from '../../../api/helpers/convertDocumentToPojo'
import getMongoose from '../../../api/helpers/getMongoose'
import SurveyModel from '../../../api/models/Survey'
import LegacySurvey from '../../../app/templates/LegacySurvey'

export default function PublicLegacySurveyPage({ data }) {
  return <LegacySurvey data={data} />
}

export async function getServerSideProps(context) {
  const {
    query: { slug },
  } = context

  await getMongoose()
  const maybeLegacySurvey = await SurveyModel.findOne({ slug }, '-createdAt -updatedAt').exec()
  if (maybeLegacySurvey === null) {
    return {
      notFound: true,
    }
  }

  const legacySurveyPojo = convertDocumentToPojo(maybeLegacySurvey)

  return {
    props: {
      data: legacySurveyPojo,
    },
  }
}
