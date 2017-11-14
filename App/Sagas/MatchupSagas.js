import { call, put, all } from 'redux-saga/effects'
import { path } from 'ramda'
import MatchupActions from '../Redux/MatchupRedux'
import UserActions from '../Redux/UserRedux'
import {NavigationActions} from 'react-navigation'
import s3 from '../Services/S3'
export function * matchups (api, action) {
  // make the call to the api
  const response = yield call(api.getMatchups)
  if (response.ok) {
  	const myResponse = yield call(api.getMyMatchups)
  	if (myResponse.ok) {
  		yield put(MatchupActions.myListSuccess(myResponse.data))  
  	} else {
  		yield put(MatchupActions.myListFailure(myResponse.error))
  	}
  	yield put(MatchupActions.listSuccess(response.data))

  } else {
  	yield put(MatchupActions.listFailure(response.error))
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

function * gets3Creds (api, file) {

  yield call(api.getS3Policy, file.type)


}
export function * create_matchup (api, s3, action) {

  const {matchup} = action

  const tempArray = yield all(matchup.sides.map((side)=>{

    if (side.mediaType !=='y'){

      let file = {body: side.data, type: side.mime}

      side.data = null;

      side.imageUrl = null;

      side.mime = null;

      return call(s3.putInS3, file, side.image)

    } else {

      return {ok: true}

    }

  }))
  
  if (typeof(tempArray.find((obj)=>!obj.ok)) === 'undefined'){

    const response = yield call(api.createMatchup, {matchup})
    
    if (response.ok) {

      yield put(MatchupActions.createMatchupSuccess(response.data))

      yield put(NavigationActions.navigate({ routeName: 'MatchupListScreen' }))

    } else {

      yield put(MatchupActions.createMatchupFailure(response.error))

    }

  } else {

    yield put(MatchupActions.createMatchupFailure('Upload Error'))

  }

}


export function * get_matchup (api, action) {
  // make the call to the api
  const {matchupId} = action
  const response = yield call(api.getMatchup, matchupId)
  if (response.ok) {

  	yield put(MatchupActions.getMatchupSuccess(response.data))

  } else {
  	yield put(MatchupActions.getMatchupFailure(response.error))
  }
}


