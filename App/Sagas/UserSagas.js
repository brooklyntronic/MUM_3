import { call, put, all } from 'redux-saga/effects'
import { path } from 'ramda'
import UserActions from '../Redux/UserRedux'
import MatchupActions from '../Redux/MatchupRedux'
import {NavigationActions} from 'react-navigation'

// const global.chatSocket = global.chatSocket
export function * create_user (api, action) {

  const response = yield call(api.createUser, action.user)
  
  

  

  if (response.status === 200 && response.ok){




    const logResponse = yield call(api.logInUser, response.data.token)
    if (logResponse && logResponse.ok) {

      



      const {profileResponse, notificationResponse, prefResponse, matchesResponse, requestsResponse, voteResponse, searchResponse, searchVoteResponse} = yield all(
      {
        profileResponse: call(api.getMyProfile),
        notificationResponse: call(api.getNotifications),
        prefResponse: call(api.getPreferences),
        matchesResponse: call(api.getMatches),
        requestsResponse: call(api.getRequests),
        voteResponse: call(api.getVotes),
        searchResponse: call(api.getMatchesByPreference),
        searchVoteResponse: call(api.getMatchesByMatchups)
      }
      )

      if (searchResponse.ok){
        yield put(UserActions.searchMatchesPreferenceSuccess(searchResponse.data))
      } else {
        yield put(UserActions.searchMatchesPreferenceFailure(searchResponse.error))
      }
      if (searchVoteResponse.ok){
        yield put(UserActions.searchMatchesVoteSuccess(searchVoteResponse.data))
      } else {
        yield put(UserActions.searchMatchesVoteFailure(searchVoteResponse.error))
      }


      if (notificationResponse.ok){

        yield put(UserActions.notificationsSuccess({messages: notificationResponse.data.messageNotifications, requests: notificationResponse.data.friendNotifications, matchups: notificationResponse.data.matchupNotifications}))
      } else {
        yield put(UserActions.notificationsFailure('Error'))
      }

      if (profileResponse.ok){

        yield put(UserActions.myProfileSuccess(profileResponse.data))

      }  else {

        yield put(UserActions.myProfileFailure(profileResponse.error))

      }

        // const prefResponse = yield call(api.getPreferences)
        
        if (prefResponse.ok) {

          yield put(UserActions.preferencesSuccess(prefResponse.data))

        } else {

          yield put(UserActions.preferencesFailure(prefResponse.error))

        }

        // const matchesResponse = yield call(api.getMatches)

        if (matchesResponse.ok){

          yield put(UserActions.matchesSuccess(matchesResponse.data))

        } else {

          yield put(UserActions.matchesFailure(matchesResponse.error))

        }

        // const requestsResponse = yield call(api.getRequests)

        if (requestsResponse.ok){

          yield put(UserActions.requestsSuccess(requestsResponse.data))

        } else {

          yield put(UserActions.requestsFailure(requestsResponse.error))

        }

        // const voteResponse = yield call(api.getVotes)

        if(voteResponse.ok){

          yield put(MatchupActions.getVotesSuccess(voteResponse.data))



        } else {

          yield put(MatchupActions.getVotesFailure(voteResponse.error))

        }
        yield put(UserActions.loginSuccess(response.data))
        yield put(UserActions.createUserSuccess(response.data))
        yield put(NavigationActions.navigate({routeName: 'AuthenticatedLaunchScreen'}))
      } else {

        yield put(UserActions.loginFailure(response.error))

      }
    } else {

      yield put(UserActions.createUserFailure('Please Check Your Network Connection'))

    }


  } 


  export function * login (api, action) {
  // make the call to the api
  const {idToken} = action
  const response = yield call(api.logInUser,idToken)
  if (response.ok) {
    yield put(UserActions.loginSuccess(response.data))
  } else {
    yield put(UserActions.loginFailure(response.error))
  }
}
export function * check_login (api, action) {
  const response = yield call(api.checkLogin)
  if (response.ok) {
    yield put(UserActions.loginSuccess(response.data))
  } else {
    yield put(UserActions.loginFailure(response.error))
  }
}
export function * create_preferences (api, action) {
  const response = yield call(api.editProfile, action.user)
  if (response.ok){
    yield put(UserActions.preferencesCreateSuccess())
    yield put(NavigationActions.navigate({routeName: 'AuthenticatedLaunchScreen'}))
  } else {
    yield put(UserActions.preferencesCreateFailure(response.error))
  }
}
export function * get_preferences (api, action) {
  const response = yield call(api.getPreferences)
  if (response.ok) {
    yield put(UserActions.preferencesSuccess(response.data))  
  } else {
    yield put(UserActions.preferencesFailure(response.error))
  }
}

export function * edit_preference (api, action) {
  const response = yield call(api.editProfile, action.user)
  if (response.ok){
    yield put(UserActions.searchMatchesPreferenceAttempt())
    yield put(UserActions.searchMatchesVoteAttempt())
    const {response2, response3, voteResponse } = yield all({
      response2: call(api.getPreferences),
      response3: call(api.getMatchesByPreference),
      voteResponse: call(api.getMatchesByMatchups)
    })
    if (response3.ok){
      yield put(UserActions.searchMatchesPreferenceSuccess(response3.data))
    } else {
      yield put(UserActions.searchMatchesPreferenceFailure(response3.error))
    }
    if (voteResponse.ok){
      yield put(UserActions.searchMatchesVoteSuccess(voteResponse.data))
    } else {
      yield put(UserActions.searchMatchesVoteFailure(voteResponse.error))
    }
    if (response2.ok) {
      yield put(UserActions.preferenceEditSuccess(response2.data)) 
    } else {
      yield put(UserActions.preferenceEditFailure(response2.error))
    }
  } else {
    yield put(UserActions.preferenceEditFailure(response.error))
  }
}
export function * edit_location_preference (api, action) {
  const response = yield call(api.editProfile, action.user)
  if (response.ok){

    yield put(UserActions.searchMatchesPreferenceAttempt())
    yield put(UserActions.searchMatchesVoteAttempt())
    const {response2, response3, voteResponse } = yield all({
      response2: call(api.getPreferences),
      response3: call(api.getMatchesByPreference),
      voteResponse: call(api.getMatchesByMatchups)
    })
    if (response2.ok) {
      yield put(UserActions.locationPreferenceEditSuccess(response2.data))
      yield put(UserActions.preferenceEditSuccess(response2.data)) 
      yield put(NavigationActions.navigate({routeName: 'PreferencesScreen'}))
    } else {
      yield put(UserActions.preferenceEditFailure(response2.error))
    }
    if (response3.ok){
      yield put(UserActions.searchMatchesPreferenceSuccess(response3.data))
    } else {
      yield put(UserActions.searchMatchesPreferenceFailure(response3.error))
    }
    if (voteResponse.ok){
      yield put(UserActions.searchMatchesVoteSuccess(voteResponse.data))
    } else {
      yield put(UserActions.searchMatchesVoteFailure(voteResponse.error))
    }

  } else {
    yield put(UserActions.locationPreferenceEditFailure(response.error))
  }
}
export function * edit_location_profile (api, action) {
  const response = yield call(api.editProfile, action.user)
  if (response.ok){
    const response2 = yield call(api.getMyProfile)
    if (response2.ok) {
      yield put(UserActions.locationProfileEditSuccess(response2.data)) 
      yield put(NavigationActions.navigate({routeName: 'MyProfileScreen'}))
    } else {
      yield put(UserActions.locationProfileEditFailure(response2.error))
    }
  } else {
    yield put(UserActions.locationProfileEditFailure(response.error))
  }
}
export function * edit_my_profile (api, action) {
  const response = yield call(api.editProfile, action.user)
  if (response.ok){
    const response2 = yield call(api.getMyProfile)
    if (response2.ok) {
      yield put(UserActions.profileEditSuccess(response2.data)) 
    } else {
      yield put(UserActions.profileEditFailure(response2.error))
    }
  } else {
    yield put(UserActions.profileEditFailure(response.error))
  }
}
export function * create_profile (api, action) {
  const response = yield call(api.editProfile, action.user)
  if (response.ok){
    yield put(UserActions.profileCreateSuccess())
    yield put(NavigationActions.navigate({ routeName: 'NewPreferencesScreen' }));
  } else {
    yield put(UserActions.profileCreateFailure(response.error))
  }
}
export function * get_profile (api, action) {
  const response = yield call(api.getProfile, action.userId)
  if (response.ok){
    yield put(UserActions.profileSuccess(response.data))
  } else {
    yield put(UserActions.profileFailure(response.error))
  }
}

export function * get_my_profile (api, action) {
  const response = yield call(api.getMyProfile)
  if (response.ok){
    yield put(UserActions.myProfileSuccess(response.data))
  } else {
    yield put(UserActions.myProfileFailure(response.error))
  }
}

export function * change_avatar (api, action) {
  const response = yield call(api.makeMyAvatar ,action.photo)
  if (response.ok){

    const response2 = yield call(api.getMyProfile)
    if (response2.ok){
      yield put(UserActions.makeAvatarSuccess(response2.data))
    } else {
      yield put(UserActions.makeAvatarFailure(response2.error))
    }
  } else {
    yield put(UserActions.makeAvatarFailure(response.error))
  }
}

export function * delete_photo (api, action) {
  const response = yield call(api.deletePhoto, action.photo)
  if (response.ok){
    const response2 = yield call(api.getMyProfile)
    if (response2.ok){
      yield put(UserActions.deletePhotoSuccess(response2.data))
    } else {
      yield put(UserActions.deletePhotoFailure(response2.error))
    }
  } else {
    yield put(UserActions.deletePhotoFailure(response.error))
  }
}

export function * upload_photo (api, action) {
  // const response = await yield call(api.putInS3, action.file, action.key)
  // if (response){
    const photoResponse = yield call(api.putInS3, action.file, action.key)
    if (photoResponse.ok){
      photoKeyResponse = yield call(api.addPhoto, action.key)
      if (photoKeyResponse.ok){
        const profileResponse = yield call(api.getMyProfile)
        if (profileResponse.ok){
          yield put(UserActions.uploadPhotoSuccess(profileResponse.data, action.key))
        } else {
          yield put(UserActions.uploadPhotoFailure(profileResponse.error))
        }
      } else {
       yield put(UserActions.uploadPhotoFailure(photoKeyResponse.error))
     }
   } else {
    yield put(UserActions.uploadPhotoFailure(photoResponse.error))
  }
} 
export function * invite_to_matchup (api, action) {
  const response = yield call(api.inviteMatchesToMatchup, action.matchList, action.matchId)
  if (response.ok) {
    yield put(UserActions.inviteToMatchupSuccess(response.data))
    action.matchList.forEach((match)=>{
      action.socket.emit('invite_user', match._id, action.myId, action.matchId )
    })
  } else {
    yield put(UserActions.inviteToMatchupFailure(response.error))
  }
}
export function * search_matches_preference (api, action) {
  const {response, voteResponse } = yield all({
    response: call(api.getMatchesByPreference),
    voteResponse: call(api.getMatchesByMatchups)
  })
  if (response.ok){
    yield put(UserActions.searchMatchesPreferenceSuccess(response.data))
  } else {
    yield put(UserActions.searchMatchesPreferenceFailure(response.error))
  }
  if (voteResponse.ok){
    yield put(UserActions.searchMatchesVoteSuccess(voteResponse.data))
  } else {
    yield put(UserActions.searchMatchesVoteFailure(voteResponse.error))
  }

}

export function * search_matches (api, action) {
  const response= yield call(api.searchMatches, action.searchTerm)
  if (response.ok){
    yield put(UserActions.searchMatchesSuccess(response.data))
  } else {
    yield put(UserActions.searchMatchesFailure(response.error))
  }

}
// export function * search_matches_votes (api, action) {
//   const response = yield call(api.getMatchesByMatchups)
//   if (response.ok){
//     yield put(UserActions.searchMatchesVoteSuccess(response.data))
//   } else {
//     yield put(UserActions.searchMatchesVoteFailure(response.error))
//   }

// }
export function * send_friend_request (api, action) {
  const response = yield call(api.friendRequest, action.friendId)
  if (response.ok){
    yield put(UserActions.sendFriendRequestSuccess(response.data))
    global.chatSocket.emit('add_user', action.friendId, action.myId, action.myId)
    yield put(NavigationActions.back())
  } else {
    yield put(UserActions.sendFriendRequestFailure(response.error))
  }
}

export function * send_friend_request_list (api, action) {
  const response = yield call(api.friendRequest, action.friendId)
  if (response.ok){
    yield put(UserActions.sendFriendRequestListSuccess(response.data))
    global.chatSocket.emit('add_user', action.friendId, action.myId, action.myId)
  } else {
    yield put(UserActions.sendFriendRequestListFailure(response.error))
  }
}

export function * receive_friend_request (api, action) {
  const response = yield call(api.getRequests)
  if (response.ok){
    yield put(UserActions.requestsSuccess(response.data))
  } else {
    yield put(UserActions.requestsFailure(response.error))
  }
}
export function * accept_friend_request (api, action) {
  const response = yield call(api.acceptRequest, action.friendId)
  if (response.ok){
    const matchesResponse = yield call(api.getMatches)
    if (matchesResponse.ok){
      const requestsResponse = yield call(api.getRequests)
      if (requestsResponse.ok){
        yield put(UserActions.acceptFriendRequestSuccess(matchesResponse.data, requestsResponse.data))
        global.chatSocket.emit('friend_added', action.friendId,action.myId,action.myId);
        yield put(NavigationActions.navigate({routeName: 'MatchesScreen'}))
      } else {
        yield put(UserActions.acceptFriendRequestFailure(requestsResponse.error))
      }
    } else {
      yield put(UserActions.acceptFriendRequestFailure(matchesResponse.error))
    }
  } else {
    yield put(UserActions.acceptFriendRequestFailure(response.error))
  }
}

export function * added_friend_request (api, action) {
  const response = yield call(api.getMatches)
  if (response.ok){
    yield put(UserActions.matchesSuccess(response.data))
  } else {
    yield put(UserActions.matchesFailure(response.error))
  }
}

export function * deny_friend_request (api, action) {
  const response = yield call(api.denyRequest, action.friendId)
  if (response.ok){
    yield put(UserActions.denyFriendRequestSuccess(response.data))
    const requestsResponse = yield call(api.getRequests)
    if (requestsResponse.ok){
      yield put(UserActions.requestsSuccess(requestsResponse.data))
      yield put(NavigationActions.navigate({routeName: 'MatchesScreen' }))
    } else {
      yield put(UserActions.denyFriendRequestFailure(matchesResponse.error))
    }

  } else {
    yield put(UserActions.denyFriendRequestFailure(response.error))
  }
}

export function * unfriend (api, action) {
  const response = yield call(api.unfriend, action.friendId)
  if (response.ok){
    yield put(UserActions.unfriendSuccess(response.data))
    global.chatSocket.emit('unfriend_user', action.friendId,action.myId,action.myId);
    yield put(NavigationActions.navigate({routeName: 'MatchesScreen' }))
  } else {
    yield put(UserActions.unfriendFailure(response.error))
  }
}

export function * unfriend_request (api, action) {
  const response = yield call(api.getMatches)
  if (response.ok){
    yield put(UserActions.matchesSuccess(response.data))
  } else {
    yield put(UserActions.matchesFailure(response.error))
  }
}

export function * get_notifications (api, action) {
  const response = yield call(api.getNotifications)
  if (response.ok){
    yield put(UserActions.notificationsSuccess({messages: response.data.messageNotifications, requests: response.data.friendNotifications,  matchups: notificationResponse.data.matchupNotifications}))
  } else {
    yield put(UserActions.notificationsFailure(response.error))
  }
}