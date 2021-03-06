import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import {unionBy} from 'lodash'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  listAttempt: null,
  listSuccess: ['matchupList'],
  listFailure: ['error'],
  myInviteAttempt: null,
  myInviteSuccess: ['invitedList'],
  myInviteFailure: ['error'],
  myListAttempt: null,
  myListSuccess: ['myMatchupList'],
  myListFailure: ['error'],
  createMatchupAttempt: ['matchup'],
  createMatchupSuccess: ['matchup'],
  createMatchupFailure: ['error'],
  searchMatchupAttempt: ['searchTerm', 'myList'],
  searchMatchupSuccess: ['searchResults'],
  searchMatchupFailure: ['error'],
  switchLists: ['listShown'],
  getVotesAttempt: null,
  getVotesSuccess: ['sideVotes'],
  getVotesFailure: ['error'],
  voteAttempt: ['vote', 'matchupId'],
  voteSuccess: ['matchup', 'sideVotes'],
  voteFailure: ['error'],
  getMatchupAttempt: ['matchupId'],
  getMatchupSuccess: ['matchup'],
  getMatchupFailure: ['error'],
  index: 0,
  openMatchup: ['matchup']

})

export const MatchupTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: true,
  matchupFetching: false,
  error: null,
  sideVotes: null,
  matchup: null,
  matchupList: [],
  invitedList: [],
  myMatchupList: [],
  listShown: 'matchupList',
  myMatchupsLoaded: false,
  matchupsLoaded: false,
  matchupsOpened: [],
  createFetching: false,
  matchInviteList: null,
  voteFetching: false,
  inviteListFetching:false,
  searchFetching: false,
  searchResults: []
})

/* ------------- Reducers ------------- */
export const getListAttempt = (state) => {
  return state.merge({fetching: true})}

export const getListSuccess = (state, action) => {
  const {matchupList} = action
  return state.merge({fetching: false, matchupList: matchupList, index: 0, matchupsLoaded: true})
}
export const getListError = (state, action) => 
  state.merge({fetching: false, error: action.error })

export const getMyListAttempt = (state) => {
  return state
}
export const getMyListSuccess = (state, action) => {
  const {myMatchupList} = action
  return state.merge({fetching: false, myMatchupList: myMatchupList, index: 0, myMatchupsLoaded: true})
}
export const getMyListError = (state, action) => 
  state.merge({fetching: false, error: action.error })

export const searchMatchupAttempt = (state, action) => {
  return state.merge({searchTerm: action.searchTerm, searchFetching: true})
}
export const searchMatchupSuccess = (state, action) => {
  return state.merge({searchFetching: false, searchResults: action.searchResults})
}
export const searchMatchupFailure = (state, action) => 
  state.merge({searchFetching: false, error: action.error })

export const myInviteAttempt = (state) =>state.merge({inviteListFetching: true})
export const myInviteSuccess = (state, action) =>state.merge({inviteListFetching: false, invitedList: action.invitedList})
export const myInviteFailure = (state, action) =>state.merge({inviteListFetching: false, error: action.error})

export const toggleLists = (state, action) =>{ 
    return state.merge({listShown: action.listShown})
}
export const openMatchup = (state, action) => {
  const { matchup } = action
  let newMatchupArray = [...state.matchupsOpened]
  if (state.matchupsOpened.indexOf(matchup) < 0) {
    newMatchupArray.push(matchup)
  }
  return state.merge({ fetching: false, error: null, matchupsOpened: newMatchupArray })
}

export const getVotesAttempt = (state) => state
export const getVotesSuccess = (state, action) => state.merge({sideVotes: action.sideVotes})
export const getVotesFailure = (state, action) => state.merge({error: action.error})

export const voteAttempt = (state, action) => {
  return state.merge({voteFetching: true})
}
export const voteSuccess = (state, action) => {
  // let matchup = state.matchup
  // let matchup1 = Object.assign({},matchup)
  // matchup.myVote = action.vote
  return state.merge({voteFetching: false, matchup: action.matchup, sideVotes: action.sideVotes})
}
export const voteFailure = (state, action) => {
  return state.merge({error: action.error, matchupFetching: false})
}
export const getMatchupAttempt = (state, action) => {
  return state.merge({matchupFetching: true})
}
export const getMatchupSuccess = (state, action) => {
  return state.merge({matchup: action.matchup, matchupFetching: false})
}
export const getMatchupFailure = (state, action) => {
  return state.merge({error: action.error, matchupFetching: false})
}
export const createMatchupAttempt = (state) => {
  return state.merge({ createFetching: true, error: null, matchupsLoaded: false, myMatchupsLoaded:false })
}
export const createMatchupSuccess = (state, action) => {
  return state.merge({ createFetching: false, error: null, matchup: action.matchup, listShown: 'myMatchupList'})
}
export const createMatchupFailure = (state, action) => {
  return state.merge({ createFetching: false, error: null, error: action.error })
}
export const editMatchup = (state, action) => {
  const { matchup } = action
  return state.merge({ fetching: false, error: null, matchup })
}
export const deleteMatchuo = (state, action) => {
  const { matchup } = action
  return state.merge({ fetching: false, error: null, matchup })
}


// failed to get the avatar

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LIST_ATTEMPT]: getListAttempt,
  [Types.LIST_SUCCESS]: getListSuccess,
  [Types.LIST_FAILURE]: getListError,
  [Types.MY_LIST_ATTEMPT]: getMyListAttempt,
  [Types.MY_LIST_SUCCESS]: getMyListSuccess,
  [Types.MY_LIST_FAILURE]: getMyListError,
  [Types.MY_INVITE_ATTEMPT]: myInviteAttempt,
  [Types.MY_INVITE_SUCCESS]: myInviteSuccess,
  [Types.MY_INVITE_FAILURE]: myInviteFailure,
  [Types.SWITCH_LISTS]: toggleLists,
  [Types.GET_VOTES_ATTEMPT]: getVotesAttempt,
  [Types.GET_VOTES_SUCCESS]: getVotesSuccess,
  [Types.GET_VOTES_FAILURE]: getVotesFailure, 
  [Types.VOTE_ATTEMPT]: voteAttempt,
  [Types.VOTE_SUCCESS]: voteSuccess,
  [Types.VOTE_FAILURE]: voteFailure,
  [Types.SEARCH_MATCHUP_ATTEMPT]: searchMatchupAttempt,
  [Types.SEARCH_MATCHUP_SUCCESS]: searchMatchupSuccess,
  [Types.SEARCH_MATCHUP_FAILURE]: searchMatchupFailure, 
  [Types.GET_MATCHUP_ATTEMPT]: getMatchupAttempt,
  [Types.GET_MATCHUP_SUCCESS]: getMatchupSuccess,
  [Types.GET_MATCHUP_FAILURE]: getMatchupFailure, 
  [Types.CREATE_MATCHUP_ATTEMPT]: createMatchupAttempt,
  [Types.CREATE_MATCHUP_SUCCESS]: createMatchupSuccess,
  [Types.CREATE_MATCHUP_FAILURE]: createMatchupFailure, 
  [Types.OPEN_MATCHUP]: openMatchup
})
