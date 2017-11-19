import { takeLatest, all, takeEvery } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'
import S3 from '../Services/S3'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { GithubTypes } from '../Redux/GithubRedux'
import { UserTypes } from '../Redux/UserRedux'
import { MatchupTypes } from '../Redux/MatchupRedux'
import { MessagesTypes } from '../Redux/MessagesRedux'
import { FileTypes } from '../Redux/FileRedux'
/* ------------- Sagas ------------- */
import { create_user, login, check_login, get_preferences, edit_preference, edit_location_preference, edit_location_profile, edit_my_profile, get_profile, get_my_profile, change_avatar, delete_photo, invite_to_matchup, create_preferences, create_profile, search_matches_preference, search_matches, send_friend_request, send_friend_request_list, receive_friend_request, accept_friend_request, deny_friend_request, added_friend_request, unfriend, get_notifications, upload_photo } from './UserSagas'
import { matchups, vote_matchup, get_matchup, create_matchup, get_votes, invited_matchups, search_matchup} from './MatchupSagas'
import { get_all_messages, get_message_thread, post_message, delete_message_thread, save_messages, make_call, accept_call, receive_call, hang_call } from './MessagesSagas'
/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugConfig.useFixtures ? FixtureAPI : API.create()
const s3 = S3

/* ------------- Connect Types To Sagas ------------- */
 
export default function * root () {
  yield all([
    // some sagas only receive an action

    // some sagas receive extra parameters in addition to an action

    //Users
    takeLatest(UserTypes.CREATE_USER_ATTEMPT, create_user, api),
    takeLatest(UserTypes.LOGGED_IN, check_login, api),
    takeLatest(UserTypes.LOGIN_ATTEMPT, login, api),
    takeLatest(UserTypes.PREFERENCES_ATTEMPT, get_preferences, api),
    takeLatest(UserTypes.LOCATION_PREFERENCE_EDIT_ATTEMPT, edit_location_preference, api),
    takeLatest(UserTypes.LOCATION_PROFILE_EDIT_ATTEMPT, edit_location_profile, api),
    takeLatest(UserTypes.PREFERENCE_EDIT_ATTEMPT, edit_preference, api),
    takeLatest(UserTypes.PROFILE_EDIT_ATTEMPT, edit_my_profile, api),
    takeLatest(UserTypes.PROFILE_ATTEMPT, get_profile, api),
    takeLatest(UserTypes.MY_PROFILE_ATTEMPT, get_my_profile, api),
    takeLatest(UserTypes.MAKE_AVATAR_ATTEMPT, change_avatar, api),
    takeLatest(UserTypes.UPLOAD_PHOTO_ATTEMPT, upload_photo, api),
    takeLatest(UserTypes.DELETE_PHOTO_ATTEMPT, delete_photo, api),
    takeLatest(UserTypes.PROFILE_CREATE_ATTEMPT, create_profile, api),
    takeLatest(UserTypes.PREFERENCES_CREATE_ATTEMPT, create_preferences, api),
    takeLatest(UserTypes.SEARCH_MATCHES_PREFERENCE_ATTEMPT, search_matches_preference, api),
    takeLatest(UserTypes.SEARCH_MATCHES_ATTEMPT, search_matches, api),
    takeLatest(UserTypes.SEND_FRIEND_REQUEST_ATTEMPT, send_friend_request, api),
    takeLatest(UserTypes.SEND_FRIEND_REQUEST_LIST_ATTEMPT, send_friend_request_list, api),
    takeLatest(UserTypes.ACCEPT_FRIEND_REQUEST_ATTEMPT, accept_friend_request, api),
    takeLatest(UserTypes.DENY_FRIEND_REQUEST_ATTEMPT, deny_friend_request, api),
    takeLatest(UserTypes.UNFRIEND_ATTEMPT, unfriend, api),
    takeLatest(UserTypes.REQUESTS_ATTEMPT, receive_friend_request, api),
    takeLatest(UserTypes.MATCHES_ATTEMPT, added_friend_request, api),
    takeLatest(UserTypes.NOTIFICATIONS_ATTEMPT, get_notifications, api),
    //Matchups
    takeLatest(MatchupTypes.LIST_ATTEMPT, matchups, api),
    takeLatest(MatchupTypes.MY_INVITE_ATTEMPT, invited_matchups, api),
    takeLatest(MatchupTypes.VOTE_ATTEMPT, vote_matchup, api),
    takeLatest(MatchupTypes.GET_MATCHUP_ATTEMPT, get_matchup, api),
    takeLatest(MatchupTypes.CREATE_MATCHUP_ATTEMPT, create_matchup, api, s3),
    takeLatest(MatchupTypes.SEARCH_MATCHUP_ATTEMPT, search_matchup, api),
    takeLatest(UserTypes.INVITE_TO_MATCHUP_ATTEMPT, invite_to_matchup, api),

    //Messages
    takeLatest(MessagesTypes.MESSAGES_ATTEMPT_ALL, get_all_messages, api),
    takeLatest(MessagesTypes.DELETE_MESSAGE_THREAD_ATTEMPT, delete_message_thread, api),
    takeLatest(MessagesTypes.MESSAGES_THREAD_ATTEMPT, get_message_thread, api),
    takeLatest(MessagesTypes.POST_MESSAGE_ATTEMPT, post_message, api),
    takeLatest(MessagesTypes.SAVE_MESSAGES_ATTEMPT, save_messages, api),
    takeLatest(MessagesTypes.MAKE_CALL_ATTEMPT, make_call),
    takeLatest(MessagesTypes.RECEIVE_CALL_ATTEMPT, receive_call, api),
    takeLatest(MessagesTypes.ACCEPT_CALL_ATTEMPT, accept_call),
    takeLatest(MessagesTypes.HANG_CALL_ATTEMPT, hang_call)
   
  ])
}
