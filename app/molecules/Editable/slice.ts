/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit'

import type { PayloadAction } from '@reduxjs/toolkit'

export interface EditableState {
  isBlockMenuForId: string | undefined
  isBlockMenuOpen: boolean
}

const INITIAL_STATE: EditableState = {
  isBlockMenuForId: undefined,
  isBlockMenuOpen: false,
}

export const editableSlice = createSlice({
  name: 'editable',
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  initialState: INITIAL_STATE,
  reducers: {
    closeBlockMenu: state => {
      state.isBlockMenuForId = undefined
      state.isBlockMenuOpen = false
    },
    openBlockMenu: (state, action: PayloadAction<string>) => {
      state.isBlockMenuForId = action.payload
      state.isBlockMenuOpen = true
    },
  },
})

export const editableActions = editableSlice.actions
export const editableReducer = editableSlice.reducer
