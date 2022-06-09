import * as R from 'ramda'

import { BlockMenuItem } from './types'

export type BlockMenuReducerState = {
  items: BlockMenuItem[]
  length: number
  query: string
  selectedIndex: number
  visibleItems: BlockMenuItem[]
}
export type BlockMenuReducerAction = {
  payload?: {
    [key: string]: any
  }
  type: 'selectPrevious' | 'selectNext' | 'updateQuery'
}
export function blockMenuReducer(state: BlockMenuReducerState, action: BlockMenuReducerAction): BlockMenuReducerState {
  switch (action.type) {
    case 'selectPrevious':
      return {
        ...state,
        selectedIndex: state.selectedIndex === 0 ? state.length - 1 : state.selectedIndex - 1,
      }

    case 'selectNext':
      return {
        ...state,
        selectedIndex: state.selectedIndex === state.length - 1 ? 0 : state.selectedIndex + 1,
      }

    case 'updateQuery':
      if (action.payload === undefined) {
        return state
      }

      // eslint-disable-next-line no-case-declarations
      const visibleItems = state.items.filter(
        R.propSatisfies(label => {
          if (action.payload === undefined) {
            return true
          }

          const regExp = new RegExp(action.payload.query, 'i')

          return regExp.test(label)
        }, 'label'),
      )

      return {
        ...state,
        query: action.payload.query,
        selectedIndex: 0,
        visibleItems,
      }

    default:
      return state
  }
}
