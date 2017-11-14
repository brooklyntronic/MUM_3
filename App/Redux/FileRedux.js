import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  putS3Attempt: ['file', 'key'],
  putS3Success: ['location'],
  putS3Failure: ['error'],
})

export const FileTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: null,
  error: null,
  location: null
})

/* ------------- Reducers ------------- */

// request the avatar for a user
export const putS3Attempt = (state) =>
  state.merge({ fetching: true })

// successful avatar lookup
export const putS3Success = (state, action) => {
  return state.merge({ fetching: false, location: action.location})
}

// failed to get the avatar
export const putS3Failure = (state, action) =>
  state.merge({ fetching: false, error: action.error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PUT_S3_ATTEMPT]: putS3Attempt,
  [Types.PUT_S3_SUCCESS]: putS3Success,
  [Types.PUT_S3_FAILURE]: putS3Failure
})
