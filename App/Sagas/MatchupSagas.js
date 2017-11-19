import { call, put, all } from 'redux-saga/effects'
import { path } from 'ramda'
import MatchupActions from '../Redux/MatchupRedux'
import UserActions from '../Redux/UserRedux'
import {NavigationActions} from 'react-navigation'
import s3 from '../Services/S3'
// import Reactotron from 'reactotron-react-native'
// import API from '../Services/Api'
import Utilities from '../Services/Utilities'

export function * matchups (api, action) {
  // make the call to the api
  const {response, myResponse, inviteResponse } = yield all({
    response: call(api.getMatchups),
    myResponse: call(api.getMyMatchups),
    inviteResponse: call(api.getInvitedMatchups)
  })
  if (response.ok) {
  	yield put(MatchupActions.listSuccess(response.data))
  } else {
  	yield put(MatchupActions.listFailure(response.error))
  }
  if (myResponse.ok) {
    yield put(MatchupActions.myListSuccess(myResponse.data))  
  } else {
    yield put(MatchupActions.myListFailure(myResponse.error))
  }
  if (inviteResponse.ok) {
    yield put(MatchupActions.myInviteSuccess(inviteResponse.data))  
  } else {
    yield put(MatchupActions.myInviteFailure(inviteResponse.error))
  }
  
}

export function * invited_matchups (api, action) {
  const inviteResponse = yield call(api.getInvitedMatchups)
  if (inviteResponse.ok) {
    yield put(MatchupActions.myInviteSuccess(inviteResponse.data))  
  } else {
    yield put(MatchupActions.myInviteFailure(inviteResponse.error))
  }
}
export function * get_votes (api, action) {
  const response = yield call(api.getVotes)
  if(response.ok){
    yield put(MatchupActions.getVotesSuccess(response.data))
  } else {
    yield put(MatchupActions.getVotesFailure(response.error))
  }
}

export function * vote_matchup (api, action) {
  // make the call to the api
  const {vote, matchupId} = action
  const response = yield call(api.voteOnMatchup, action.vote, action.matchupId)
  if (response.ok) {
    yield put(UserActions.searchMatchesPreferenceAttempt())
    yield put(UserActions.searchMatchesVoteAttempt())
    const {searchResponse, voteResponse, matchupResponse, getVotesResponse } = yield all({
      searchResponse: call(api.getMatchesByPreference),
      voteResponse: call(api.getMatchesByMatchups),
      getVotesResponse: call(api.getVotes),
      matchupResponse: call(api.getMatchup, matchupId)
    })
    if (searchResponse.ok){
      yield put(UserActions.searchMatchesPreferenceSuccess(searchResponse.data))
    } else {
      yield put(UserActions.searchMatchesPreferenceFailure(searchResponse.error))
    }
    if (voteResponse.ok){
      yield put(UserActions.searchMatchesVoteSuccess(voteResponse.data))
    } else {
      yield put(UserActions.searchMatchesVoteFailure(voteResponse.error))
    }
    if (matchupResponse.ok) {
      yield put(MatchupActions.getMatchupSuccess(matchupResponse.data))
    } else {
      yield put(MatchupActions.getMatchupFailure(matchupResponse.error))
    }
    if (matchupResponse.ok && getVotesResponse.ok){
      yield put(MatchupActions.voteSuccess(matchupResponse.data, getVotesResponse.data))
    } else {
      yield put(MatchupActions.voteFailure('Error'))
    }
  } else {
  	yield put(MatchupActions.voteFailure(response.error))
  }
}

// function pollTranscoder(jobId, api){
//   return Utilities.pollTranscoder(jobId, function() {
//     return api.pollTranscoder(jobId);
//   }, 3000)
// }

export function * create_matchup (api, s3, action) {
  let hasError = false
  const {matchup} = action

  yield put(NavigationActions.navigate({ routeName: 'MatchupListScreen' }))
  const tempArray = yield all(matchup.sides.filter((side)=>side.mediaType === 'vid' || side.mediaType ==='pic').map((side)=>{
    return call(api.getS3Policy, side.mime)
  }))
  if(tempArray.filter(policy=>policy.status !== 200).length > 0){
    hasError = true
  }
  if(tempArray.length > 0 && !hasError){

    const uploadArray = yield all(tempArray.map((policy, i)=>{
      return call(s3.putInS3, policy.data, matchup.sides[i].file)
    }))
    // Reactotron.log(uploadArray)
    const transcodeArray = yield all(matchup.sides.filter((side)=>side.mediaType === 'vid').map((side, i)=>{
      return call(api.transcodeVideo, side.file.name)
    }))
    // Reactotron.log(transcodeArray)
    if(transcodeArray.length > 0){
      const pollArray = yield all(transcodeArray.map((transcode, i)=>{
        // Reactotron.log(call(pollTranscoder, transcode.data))
        return call(api.pollTranscoder, transcode.data)
      }))
      if(pollArray.filter((poll)=>poll.status !== 200).length > 0){

        yield put(MatchupActions.createMatchupFailure('Transcode Error'))

        hasError = true
        
      }
      
    }

  } 
  if(!hasError){
    const response = yield call(api.createMatchup, {matchup})

    if (response.ok) {

      yield put(MatchupActions.createMatchupSuccess(response.data))

      myMatchupsResponse = yield call(api.getMyMatchups)

      if (myMatchupsResponse.ok) {

        yield put(MatchupActions.myListSuccess(myMatchupsResponse.data))

      } else {

        yield put(MatchupActions.myListFailure('Error'))

      }


    } else {

      yield put(MatchupActions.createMatchupFailure(response.error))

    }
  }

}


export function * get_matchup (api, action) {
  // make the call to the api
  const {matchupId} = action
  
  const response = yield call(api.getMatchup, matchupId)
  
  if (response.ok) {

  	yield put(MatchupActions.getMatchupSuccess(response.data))


    const {invitedResponse, notificationResponse} = yield all({
      invitedResponse: call(api.getInvitedMatchups),
      notificationResponse: call(api.getNotifications)
    })
    
    if (notificationResponse.ok){

      yield put(UserActions.notificationsSuccess({messages: notificationResponse.data.messageNotifications, requests: notificationResponse.data.friendNotifications,  matchups: notificationResponse.data.matchupNotifications}))

    } else {

      yield put(UserActions.notificationsFailure(notificationResponse.error))

    }

    if (invitedResponse.ok) {

      yield put(MatchupActions.myInviteSuccess(invitedResponse.data))  

    } else {

      yield put(MatchupActions.myInviteFailure(invitedResponse.error))

    }

  } else {

   yield put(MatchupActions.getMatchupFailure(response.error))

 }

}

export function * search_matchup (api, action) {
  const response = yield call(api.searchMatchups, action.searchTerm, action.myList)

  if (response.ok){
    yield put(MatchupActions.searchMatchupSuccess(response.data))
  } else {
    yield put(MatchupActions.searchMatchupFailure('Error'))
  }
}
