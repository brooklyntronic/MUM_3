// a library to wrap and simplify api calls
import apisauce from 'apisauce'
import Utilities from './Utilities'
import axios from 'axios'
// import Config from 'react-native-config'
// import Reactotron from 'reactotron-react-native'
// our "constructor"

const create = (baseURL = Utilities.baseUrl) => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    baseURL: Utilities.baseUrl,
    headers: {
      'Cache-Control': 'no-cache',
    },
    // 20 second timeout...
    timeout: 20000
  })
  // ------ 
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.

  // Matchups
  const setHeader = (accessToken) => api.setHeader('Authorization', accessToken)
  const getS3Policy = (type) => api.get('api/s3Policy?mimeType=' + type)
  const putInS3 = (file, key) => api.post('api/putInS3', {file, key},  {timeout: 100000})
  const getSignedUrl = (key, type) => api.post('api/getSignedUrl', {key, type})
  const putVideoInS3 = (file, key) => api.post('api/putVideoToS3', {file, key}, {timeout: 100000})
  const transcodeVideo = (key) => api.post('matchups/transcodeVideo', {key})
  const pollTranscoder = (jobId) => api.post('matchups/pollTranscoder', {jobId})
  const getNotifications = () => api.get('notifications')
  const getMatchups = () => api.get('matchups')
  const getMyMatchups = () => api.get('myMatchups')
  const getInvitedMatchups = () => api.get('invitedMatchups')
  const getMatchup = (matchupId) => api.get('matchups/'+matchupId)
  const createMatchup = (matchup) => api.post('matchups', JSON.stringify(matchup))
  const voteOnMatchup = (vote, matchupId) => api.post('users/votes',JSON.stringify({
          'date': new Date().getTime(),
          'vote': vote,
          'matchup': matchupId
        }))
  const getVotes = () => api.get('users/votes')
  const addPhoto = (key) => api.post('users/photos', {photo: key})
  
  const inviteMatchesToMatchup = (list, matchup) => api.post('inviteToMatchup', JSON.stringify({list:list, matchup: matchup}))
  const unfriend = (friendId) => api.post('users/unfriend', JSON.stringify({friend: friendId}))
  // User
  const createUser = (user) => api.post('users/create', JSON.stringify({user}))
  const logInUser = (idToken) => api.post('users/session', JSON.stringify({token: idToken}))
  const checkLogin = () => api.get('users/loggedIn')
  const getPreferences = () => api.get('getPreferences')
  const editProfile = (user) => api.post('users/editProfile', JSON.stringify({user}))
  const getMatches = () => api.get('users/matches')
  const getRequests = () => api.get('users/matchRequests')
  const friendRequest = (_id) => api.post('users/profile/request', JSON.stringify({_id}))
  const acceptRequest = (friend) => api.post('users/addfriend', JSON.stringify({friend}))
  const denyRequest = (friend) => api.post('users/profile/denyRequest', JSON.stringify({friend}))
  const getProfile = (userId) => api.get('users/profile/' + userId )
  const getMyProfile = () => api.get('getMyProfile')
  const makeMyAvatar = (photo) => api.post('users/avatar', {avatar: photo})
  const deletePhoto = (photo) => api.post('users/photos/delete', {pic: photo})
  const getMatchesByPreference = () => api.get('byPreferences')
  const getMatchesByMatchups = () => api.get('byVotes')

  // Messages
  const saveMessages = (messages, id)=>api.post('saveMessages', {messages, id})
  const getMessages = ()=> api.get('newMessages')
  const getMessageThread = (id)=>api.get('newMessageThread/' + id)
  const deleteMessageThread = (id)=> api.post('deleteNewMessage', {id})
  const postMessage = (message)=> api.post('newMessages', message)
  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    setHeader,
    getS3Policy,
    putInS3,
    getSignedUrl,
    putVideoInS3,
    transcodeVideo,
    pollTranscoder,
    getNotifications,
    getMatchups,
    getMyMatchups,
    getMatchup,
    getInvitedMatchups,
    getVotes,
    createMatchup,
    inviteMatchesToMatchup,
    makeMyAvatar,
    createUser,
    getPreferences,
    getMyProfile,
    addPhoto,
    deletePhoto,
    editProfile,
    getMatches,
    getRequests,
    friendRequest,
    acceptRequest,
    denyRequest,
    unfriend,
    getProfile,
    voteOnMatchup,
    logInUser,
    checkLogin,
    getMatchesByPreference,
    getMatchesByMatchups,
    getMessages,
    saveMessages,
    getMessageThread,
    deleteMessageThread,
    postMessage
  }
}

// let's return back our create method as the default.
export default {
  create
}
