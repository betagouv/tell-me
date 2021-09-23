import * as R from 'ramda'

const stringifyObjectId = objectId => objectId.toString()

const isObjectId = R.pathEq(['constructor', 'name'], 'ObjectId')
const isArray = R.is(Array)
const isPojo = R.pathEq(['constructor', 'name'], 'Object')
const isArrayOrPojo = R.anyPass([isArray, isPojo])

const stringifyIfObjectId = R.ifElse(isObjectId, stringifyObjectId, R.identity)
// eslint-disable-next-line no-use-before-define
const convertObjectIds = R.map(R.ifElse(isArrayOrPojo, value => convertObjectIds(value), stringifyIfObjectId))

export default function convertDocumentToPojo(document) {
  const documentPojoWithObjectIds = document.toObject()
  const documentPojo = convertObjectIds(documentPojoWithObjectIds)

  return documentPojo
}
