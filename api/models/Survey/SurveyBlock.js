import mongoose from 'mongoose'

import { SURVEY_BLOCK_TYPES } from '../../../common/constants'

const SurveyBlockPositionType = {
  page: {
    required: true,
    type: Number,
  },
  rank: {
    required: true,
    type: Number,
  },
}

const SurveyBlockPropsType = {
  ifSelectedThenShowQuestionId: {
    required: false,
    type: mongoose.SchemaTypes.ObjectId,
    default: null,
  },
  isHidden: {
    required: false,
    type: Boolean,
    default: false,
  },
  isMandatory: {
    required: false,
    type: Boolean,
    default: false,
  },
}

const SurveyBlock = new mongoose.Schema({
  type: {
    required: true,
    type: String,
    enum: SURVEY_BLOCK_TYPES,
  },
  value: {
    required: true,
    type: String,
  },
  position: {
    required: true,
    type: SurveyBlockPositionType,
  },
  props: {
    required: false,
    type: SurveyBlockPropsType,
    default: {
      ifSelectedThenShowQuestionId: null,
      isHidden: false,
      isMandatory: false,
    },
  },
})

export default SurveyBlock
