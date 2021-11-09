/* eslint-disable no-cond-assign, no-plusplus */

import mongoose from 'mongoose'

type NullableABNS = Common.Nullable<boolean | number | string | NullableABNS[]>
type JSONPojo = {
  [key: string]: NullableABNS
}
type JSONObject = JSONPojo

export default function removeMongoIds(data: JSONObject): JSONObject {
  const dataAsJson = JSON.stringify(data)
  const regExp = /"_id":"([^"]+)"/g
  let dataWithNewIdsAsJson = dataAsJson
  let result
  while ((result = regExp.exec(dataAsJson)) !== null) {
    const id = result[1]
    const idRegExp = new RegExp(id, 'g')
    dataWithNewIdsAsJson = dataWithNewIdsAsJson.replace(idRegExp, new mongoose.Types.ObjectId().toString())
  }

  const dataWithNewIds = JSON.parse(dataWithNewIdsAsJson)

  return dataWithNewIds
}
