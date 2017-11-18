import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import Utilities from '../Services/Utilities'
import { unionBy } from 'lodash'
/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  createUserAttempt: ['user'],
  createUserSuccess: ['user'],
  createUserFailure: ['error'],

  loggedIn: null,
  loginAttempt: ['idToken'],
  loginSuccess: ['user'],
  loginFailure: null,

  logout: null,

  switchPhone: null,

  voteOnMatchup: ['matchup','user'],

  preferencesAttempt: null,
  preferencesSuccess: ['preferences'],
  preferencesFailure: ['error'],

  preferencesCreateAttempt:['user'],
  preferencesCreateSuccess: null,
  preferencesCreateFailure: ['error'],

  locationPreferenceEditAttempt: ['user'],
  locationPreferenceEditSuccess: ['preferences'],
  locationPreferenceEditFailure: ['error'],

  locationProfileEditAttempt: ['user'],
  locationProfileEditSuccess: ['profileUser'],
  locationProfileEditFailure: ['error'],

  preferenceEditAttempt:['user'],
  preferenceEditSuccess: ['preferences'],
  preferenceEditFailure: ['error'],

  profileCreateAttempt: ['user'],
  profileCreateSuccess: null,
  profileCreateFailure: ['error'],

  profileEditAttempt:['user'],
  profileEditSuccess: ['profileUser'],
  profileEditFailure: ['error'],

  profileAttempt: ['userId'],
  profileSuccess: ['profileUser'],
  profileFailure: ['error'],

  searchMatchesPreferenceAttempt: null,
  searchMatchesPreferenceSuccess: ['matchList'],
  searchMatchesPreferenceFailure: ['error'],

  searchMatchesVoteAttempt:null,
  searchMatchesVoteSuccess: ['matchList'],
  searchMatchesVoteFailure: ['error'],

  sendFriendRequestAttempt: ['friendId', 'myId'],
  sendFriendRequestSuccess: ['requestsSentList'],
  sendFriendRequestFailure: ['error'],

  sendFriendRequestListAttempt: ['friendId', 'myId'],
  sendFriendRequestListSuccess: ['requestsSentList'],
  sendFriendRequestListFailure: ['error'],

  acceptFriendRequestAttempt: ['friendId', 'myId'],
  acceptFriendRequestSuccess: ['matchesList', 'requestsReceivedList'],
  acceptFriendRequestFailure: ['error'],

  denyFriendRequestAttempt: ['friendId'],
  denyFriendRequestSuccess: ['requestsReceivedList'],
  denyFriendRequestFailure: ['error'],  

  unfriendAttempt: ['friendId', 'myId'],
  unfriendSuccess: ['matchesList'],
  unfriendFailure: ['error'],

  matchesAttempt: null,
  matchesSuccess: ['matchesList'],
  matchesFailure: ['error'],

  requestsAttempt: null,
  requestsSuccess: ['requestsReceivedList'],
  requestsFailure: ['error'],

  notificationsAttempt: null,
  notificationsSuccess: ['notifications'],
  notificationsFailure: ['error'],

  myProfileAttempt: null,
  myProfileSuccess: ['myProfile'],
  myProfileFailure: ['error'],
  viewPhotoSuccess: ['photo'],
  makeAvatarAttempt: ['photo'],
  makeAvatarSuccess: ['myProfile'],
  makeAvatarFailure: ['error'],

  uploadPhotoAttempt: ['file', 'key'],
  uploadPhotoSuccess: ['myProfile', 'key'],
  uploadPhotoFailure: ['error'],

  deletePhotoAttempt: ['photo'],
  deletePhotoSuccess: ['myProfile'],
  deletePhotoFailure: ['error'],

  inviteToMatchupAttempt: ['matchList','matchId', 'socket', 'myId'],
  inviteToMatchupSuccess: ['matchList'],
  inviteToMatchupFailure: ['error']
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  user: null,
  fetching: false,
  error: null,
  emailSwitchIsOn: true,
  loggedIn: false,
  sideVotes: [],
  createUserFetching: false,
  preferencesFetching: true,
  preferencesCreateFetching: false,
  attributeFetching: false,
  profileAttributeFetching: false,
  preferencesLoaded: false,
  profileCreateFetching: false, 
  profileFetching: true, 
  profileUser: null,
  matchesList: [],
  searchMatchesVotes: [],
  searchMatchesVotesFetching: true,
  searchMatchesPreferences: [],
  searchMatchesPreferencesFetching: true,
  matchesLoaded: false,
  matchesFetching: true,
  myProfileFetching: true,
  myProfile: null,
  profileLoaded: false,
  myProfileLoaded: false,
  matchInviteList: null,
  sentFriendRequests: [],
  requestsReceivedList: [],
  requestsSentList: [],
  notifications: null,
  photosUploading: null,
  viewedPhoto: null,
  friendRequestFetching: false
})

/* ------------- Reducers ------------- */
// user switches phone/email
export const changePhoneInput = (state) =>
state.merge({emailSwitchIsOn: !emailSwitchIsOn})

// see if user is logged in
export const checkLoggedInAttempt = (state) => {
  return state.merge({fetching: true})
}
export const createUserAttempt = (state) =>state.merge({createUserFetching: true})
export const createUserSuccess = (state, action) =>state.merge({user: action.user, createUserFetching: false})
export const createUserFailure = (state, action) =>state.merge({error: action.error, createUserFetching: false})
// user attempt login sent to saga
export const attempt = (state) =>{
  return state.merge({ fetching: true})
}
// user succeed login
export const success = (state,action) => {
  let {user} = action
  return state.merge({ fetching: false, error: false, user: user, matchInviteList: user.matchupVoteRequestsSent, sideVotes: user.sideVotes, requestsSentList: action.user.requestsSent })
}
// user fail login
export const failure = (state) =>
state.merge({ fetching: false, error: true })

//preferences
// attempt get preferences sent to saga
export const preferencesAttempt = (state) => state.merge({preferencesFetching: true})
// get preferences success
export const preferencesSuccess = (state, action) => state.merge({preferencesFetching: false, preferences: action.preferences, preferencesLoaded: true})
// get preferences failure
export const preferencesFailure = (state, action) => state.merge({preferencesFetching: false, error: action.error})
// edit preferences attempt sent to saga
export const preferencesCreateAttempt = (state) => state.merge({preferencesCreateFetching: true})
// edit preference success
export const preferencesCreateSuccess = (state, action) => state.merge({preferencesCreateFetching: false})
// edit preference failure
export const preferencesCreateFailure = (state, action) => state.merge({preferencesCreateFetching: false, error: action.error})
export const locationPreferenceEditAttempt = (state) => state.merge({attributeFetching: true})
// edit preference success
export const locationPreferenceEditSuccess = (state, action) => state.merge({attributeFetching: false, preferences: action.preferences})
// edit preference failure
export const locationPreferenceEditFailure = (state, action) => state.merge({attributeFetching: false, error: action.error})

export const locationProfileEditAttempt = (state) => state.merge({attributeFetching: true})
// edit profile success
export const locationProfileEditSuccess = (state, action) => state.merge({attributeFetching: false, myProfile: action.profileUser})
// edit profile failure
export const locationProfileEditFailure = (state, action) => state.merge({attributeFetching: false, error: action.error})

export const preferenceEditAttempt = (state) => state.merge({attributeFetching: true})
// edit preference success
export const preferenceEditSuccess = (state, action) => state.merge({attributeFetching: false, preferences: action.preferences})
// edit preference failure
export const preferenceEditFailure = (state, action) => state.merge({attributeFetching: false, error: action.error})
export const profileCreateAttempt = (state) => state.merge({profileCreateFetching: true})
// edit preference success
export const profileCreateSuccess = (state, action) => state.merge({profileCreateFetching: false, profileUser: action.profileUser, myProfileLoaded: false})
// edit preference failure
export const profileCreateFailure = (state, action) => state.merge({profileCreateFetching: false, error: action.error})

export const profileEditAttempt = (state) => state.merge({profileAttributeFetching: true})
// edit preference success
export const profileEditSuccess = (state, action) => state.merge({profileAttributeFetching: false, myProfile: action.profileUser, myProfileLoaded: false})
// edit preference failure
export const profileEditFailure = (state, action) => state.merge({profileAttributeFetching: false, error: action.error})

// profile
export const profileAttempt = (state) => state.merge({profileFetching: true})
export const profileSuccess = (state, action) =>{return state.merge({profileFetching: false, profileUser: action.profileUser, profileLoaded: true})}
export const profileFailure = (state, action) => state.merge({profileFetching: false, error: action.error, profileLoaded: false})

// matches
export const matchesAttempt = (state) => state.merge({matchesFetching: true})
export const matchesSuccess = (state, action) =>{return state.merge({matchesFetching: false, matchesList: action.matchesList, matchesLoaded: true})}
export const matchesFailure = (state, action) => state.merge({matchesFetching: false, error: action.error})

export const requestsAttempt = (state) => state.merge({requestsFetching: true})
export const requestsSuccess = (state, action) =>{return state.merge({requestsFetching: false, requestsReceivedList: action.requestsReceivedList, requestsLoaded: true})}
export const requestsFailure = (state, action) => state.merge({requestsFetching: false, error: action.error})

export const acceptFriendRequestAttempt = (state)=>state 
export const acceptFriendRequestSuccess = (state, action)=>{return state.merge({matchesList: action.matchesList, 
  requestsReceivedList: action.requestsReceivedList
})}
export const acceptFriendRequestFailure = (state, action)=>state.merge({error: action.error})

export const denyFriendRequestAttempt = (state)=>state 
export const denyFriendRequestSuccess = (state, action)=>state.merge({matchesList: action.requestsReceivedList})
export const denyFriendRequestFailure = (state, action)=>state.merge({error: action.error})

export const unfriendAttempt = (state)=>state 
export const unfriendSuccess = (state, action)=>state.merge({matchesList: action.matchesList})
export const unfriendFailure = (state, action)=>state.merge({error: action.error})

export const searchMatchesPreferenceAttempt = (state) => state.merge({searchMatchesPreferencesFetching: true})
export const searchMatchesPreferenceSuccess = (state, action) => state.merge({searchMatchesPreferencesFetching: false, searchMatchesPreferences: action.matchList})
export const searchMatchesPreferenceFailure = (state, action) => state.merge({searchMatchesPreferencesFetching: false, error: action.error})

export const searchMatchesVoteAttempt = (state) => state.merge({searchMatchesVotesFetching: true})
export const searchMatchesVoteSuccess = (state, action) => state.merge({searchMatchesVotesFetching: false, searchMatchesVotes: action.matchList})
export const searchMatchesVoteFailure = (state, action) => state.merge({searchMatchesVotesFetching: false, error: action.error})

export const myProfileAttempt = (state) => state.merge({myProfileFetching: true, myProfileLoaded: false})
export const myProfileSuccess = (state, action) => state.merge({myProfile: action.myProfile, myProfileFetching: false, myProfileLoaded: true, viewedPhoto: action.myProfile.avatar})
export const myProfileFailure = (state, action) => state.merge({error: action.error, myProfileLoaded: false, myProfileFetching: false})

export const sendFriendRequestAttempt = (state) => state
export const sendFriendRequestSuccess = (state, action) =>state.merge({requestsSentList: action.requestsSentList})
export const sendFriendRequestFailure = (state, action) =>state.merge({error: action.error})

export const sendFriendRequestListAttempt = (state) => state.merge({friendRequestFetching: true})
export const sendFriendRequestListSuccess = (state, action) =>state.merge({requestsSentList: action.requestsSentList, friendRequestFetching: false})
export const sendFriendRequestListFailure = (state, action) =>state.merge({error: action.error, friendRequestFetching: false})

export const notificationsAttempt = (state)=>state
export const notificationsSuccess = (state, action)=>state.merge({notifications: action.notifications})
export const notificationsFailure = (state, action)=>state.merge({error: action.error})

export const makeAvatarAttempt = (state) => state.merge({photosUploading: true})
export const makeAvatarSuccess = (state, action) => state.merge({myProfile: action.myProfile,  photosUploading: false, viewedPhoto: action.myProfile.avatar})
export const makeAvatarFailure = (state, action) => state.merge({photosUploading: false,error: action.error})

export const uploadPhotoAttempt = (state) => state.merge({photosUploading: true})
export const uploadPhotoSuccess = (state, action) => state.merge({myProfile: action.myProfile, photosUploading: false, viewedPhoto: action.key})
export const uploadPhotoFailure = (state, action) => state.merge({error: action.error})

export const deletePhotoAttempt = (state) => state.merge({photosUploading: true})
export const deletePhotoSuccess = (state, action) => state.merge({myProfile: action.myProfile, viewedPhoto: action.myProfile.avatar, photosUploading: false})
export const deletePhotoFailure = (state, action) => state.merge({error: action.error})

export const viewPhotoSuccess = (state, action) => state.merge({viewedPhoto: action.photo})

export const inviteToMatchupAttempt = (state) => state
export const inviteToMatchupSuccess = (state, action) => {
  return state.merge({matchInviteList: action.matchList})
}
export const inviteToMatchupFailure = (state, action) => {
  return state.merge({error: action.error})
}
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CREATE_USER_ATTEMPT]: createUserAttempt,
  [Types.CREATE_USER_SUCCESS]: createUserSuccess,
  [Types.CREATE_USER_FAILURE]: createUserFailure,

  [Types.LOGGED_IN]: checkLoggedInAttempt,

  [Types.LOGIN_ATTEMPT]: attempt,
  [Types.LOGIN_SUCCESS]: success,
  [Types.LOGIN_FAILURE]: failure,

  [Types.PREFERENCES_ATTEMPT]: preferencesAttempt,
  [Types.PREFERENCES_SUCCESS]: preferencesSuccess,
  [Types.PREFERENCES_FAILURE]: preferencesFailure,

  [Types.PREFERENCES_CREATE_ATTEMPT]: preferencesCreateAttempt,
  [Types.PREFERENCES_CREATE_SUCCESS]: preferencesCreateSuccess,
  [Types.PREFERENCES_CREATE_FAILURE]: preferencesCreateFailure,

  [Types.LOCATION_PREFERENCE_EDIT_ATTEMPT]: locationPreferenceEditAttempt,
  [Types.LOCATION_PREFERENCE_EDIT_SUCCESS]: locationPreferenceEditSuccess,
  [Types.LOCATION_PREFERENCE_EDIT_FAILURE]: locationPreferenceEditFailure,

  [Types.LOCATION_PROFILE_EDIT_ATTEMPT]: locationProfileEditAttempt,
  [Types.LOCATION_PROFILE_EDIT_SUCCESS]: locationProfileEditSuccess,
  [Types.LOCATION_PROFILE_EDIT_FAILURE]: locationProfileEditFailure,

  [Types.PREFERENCE_EDIT_ATTEMPT]: preferenceEditAttempt,
  [Types.PREFERENCE_EDIT_SUCCESS]: preferenceEditSuccess,
  [Types.PREFERENCE_EDIT_FAILURE]: preferenceEditFailure,

  [Types.PROFILE_CREATE_ATTEMPT]: profileCreateAttempt,
  [Types.PROFILE_CREATE_SUCCESS]: profileCreateSuccess,
  [Types.PROFILE_CREATE_FAILURE]: profileCreateFailure,

  [Types.PROFILE_EDIT_ATTEMPT]: profileEditAttempt,
  [Types.PROFILE_EDIT_SUCCESS]: profileEditSuccess,
  [Types.PROFILE_EDIT_FAILURE]: profileEditFailure,

  [Types.SEARCH_MATCHES_PREFERENCE_ATTEMPT]:searchMatchesPreferenceAttempt,
  [Types.SEARCH_MATCHES_PREFERENCE_SUCCESS]:searchMatchesPreferenceSuccess,
  [Types.SEARCH_MATCHES_PREFERENCE_FAILURE]:searchMatchesPreferenceFailure,

  [Types.SEARCH_MATCHES_VOTE_ATTEMPT]:searchMatchesVoteAttempt,
  [Types.SEARCH_MATCHES_VOTE_SUCCESS]:searchMatchesVoteSuccess,
  [Types.SEARCH_MATCHES_VOTE_FAILURE]:searchMatchesVoteFailure,

  [Types.SEND_FRIEND_REQUEST_ATTEMPT]: sendFriendRequestAttempt,
  [Types.SEND_FRIEND_REQUEST_SUCCESS]: sendFriendRequestSuccess,
  [Types.SEND_FRIEND_REQUEST_FAILURE]: sendFriendRequestFailure,

  [Types.SEND_FRIEND_REQUEST_LIST_ATTEMPT]: sendFriendRequestListAttempt,
  [Types.SEND_FRIEND_REQUEST_LIST_SUCCESS]: sendFriendRequestListSuccess,
  [Types.SEND_FRIEND_REQUEST_LIST_FAILURE]: sendFriendRequestListFailure,

  [Types.UNFRIEND_ATTEMPT]: unfriendAttempt,
  [Types.UNFRIEND_SUCCESS]: unfriendSuccess,
  [Types.UNFRIEND_FAILURE]: unfriendFailure,

  [Types.ACCEPT_FRIEND_REQUEST_ATTEMPT]: acceptFriendRequestAttempt,
  [Types.ACCEPT_FRIEND_REQUEST_SUCCESS]: acceptFriendRequestSuccess,
  [Types.ACCEPT_FRIEND_REQUEST_FAILURE]: acceptFriendRequestFailure,

  [Types.DENY_FRIEND_REQUEST_ATTEMPT]: denyFriendRequestAttempt,
  [Types.DENY_FRIEND_REQUEST_SUCCESS]: denyFriendRequestSuccess,
  [Types.DENY_FRIEND_REQUEST_FAILURE]: denyFriendRequestFailure,
  
  [Types.SWITCH_PHONE]: changePhoneInput,

  [Types.PROFILE_ATTEMPT]: profileAttempt,
  [Types.PROFILE_SUCCESS]: profileSuccess,
  [Types.PROFILE_FAILURE]: profileFailure,

  [Types.MATCHES_ATTEMPT]: matchesAttempt,
  [Types.MATCHES_SUCCESS]: matchesSuccess,
  [Types.MATCHES_FAILURE]: matchesFailure,

  [Types.REQUESTS_ATTEMPT]: requestsAttempt,
  [Types.REQUESTS_SUCCESS]: requestsSuccess,
  [Types.REQUESTS_FAILURE]: requestsFailure,

  [Types.MY_PROFILE_ATTEMPT]: myProfileAttempt,
  [Types.MY_PROFILE_SUCCESS]: myProfileSuccess,
  [Types.MY_PROFILE_FAILURE]: myProfileFailure,

  [Types.MAKE_AVATAR_ATTEMPT]: makeAvatarAttempt,
  [Types.MAKE_AVATAR_SUCCESS]: makeAvatarSuccess,
  [Types.MAKE_AVATAR_FAILURE]: makeAvatarFailure,
  [Types.VIEW_PHOTO_SUCCESS]: viewPhotoSuccess,
  [Types.UPLOAD_PHOTO_ATTEMPT]: uploadPhotoAttempt,
  [Types.UPLOAD_PHOTO_SUCCESS]: uploadPhotoSuccess,
  [Types.UPLOAD_PHOTO_FAILURE]: uploadPhotoFailure,

  [Types.DELETE_PHOTO_ATTEMPT]: deletePhotoAttempt,
  [Types.DELETE_PHOTO_SUCCESS]: deletePhotoSuccess,
  [Types.DELETE_PHOTO_FAILURE]: deletePhotoFailure,

  [Types.INVITE_TO_MATCHUP_ATTEMPT]: inviteToMatchupAttempt,
  [Types.INVITE_TO_MATCHUP_SUCCESS]: inviteToMatchupSuccess,
  [Types.INVITE_TO_MATCHUP_FAILURE]: inviteToMatchupFailure,

  [Types.NOTIFICATIONS_ATTEMPT]:notificationsAttempt,
  [Types.NOTIFICATIONS_SUCCESS]:notificationsSuccess,
  [Types.NOTIFICATIONS_FAILURE]:notificationsFailure
})
