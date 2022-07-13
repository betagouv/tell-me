import { editableReducer } from '@app/molecules/Editable/slice'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    editable: editableReducer,
  },
})
