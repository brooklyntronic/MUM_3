import { call, put } from 'redux-saga/effects'
import { path } from 'ramda'
import MessagesActions from '../Redux/MessagesRedux'
import UserActions from '../Redux/UserRedux'
import {NavigationActions} from 'react-navigation'
import uuid from 'react-native-uuid'

export function * get_all_messages (api, action) {
  // make the call to the api
  const response = yield call(api.getMessages)
  if (response.ok) {
    yield put(MessagesActions.messagesSuccessAll(response.data))
    const notificationResponse = yield call(api.getNotifications)
    if (notificationResponse.ok){
      yield put(UserActions.notificationsSuccess({messages: notificationResponse.data.messageNotifications, requests: notificationResponse.data.friendNotifications}))
    } else {
      yield put(UserActions.notificationsFailure(notificationResponse.error))
    }

  } else {
  	yield put(MessagesActions.messagesFailureAll(response.error))
  }
}
export function * delete_message_thread (api, action) {
  // make the call to the api
  const response = yield call(api.deleteMessageThread, action.msgId)
  if (response.ok) {
  	yield put(MessagesActions.deleteMessageThreadSuccess(response.data))
    const messageResponse = yield call(api.getMessages)
    if (messageResponse.ok) {
      yield put(MessagesActions.messagesSuccessAll(messageResponse.data))
    } else {
      yield put(MessagesActions.messagesFailureAll(messageResponse.error))
    }
  } else {
  	yield put(MessagesActions.deleteMessageThreadFailure(response.error))
  }
}
export function * save_messages (api, action) {
  // make the call to the api
  const response = yield call(api.saveMessages, action.msgId, action.messageThread)
  if (response.ok) {
    yield put(MessagesActions.saveMessagesSuccess(response.data))
  } else {
    yield put(MessagesActions.saveMessagesFailure(response.error))
  }
}

export function * get_message_thread (api, action) {
  // make the call to the api
  const response = yield call(api.getMessageThread, action.msgId)
  if (response.ok) {
  	yield put(MessagesActions.messagesThreadSuccess(response.data))
    const notificationResponse = yield call(api.getNotifications)
    if (notificationResponse.ok){
      yield put(UserActions.notificationsSuccess({messages: notificationResponse.data.messageNotifications, requests: notificationResponse.data.friendNotifications}))
    } else {
      yield put(UserActions.notificationsFailure(notificationResponse.error))
    }
  } else {
  	yield put(MessagesActions.messagesThreadFailure(response.error))
  }
} 

export function * post_message (api, action) {

  const response = yield call(api.postMessage, action.msg)
  if (response.ok) {
    // action.socketConnection.emit('msg_user_api_success', action.toId, action.fromId)
    action.socketConnection.emit('msg_user', action.toId, action.fromId, action.msg.messages[0])
    yield put(MessagesActions.postMessageSuccess())
    const response2 = yield call(api.getMessages)
    if (response2.ok) {
      yield put(MessagesActions.messagesSuccessAll(response2.data))
    } else {
      yield put(MessagesActions.messagesFailureAll(response2.error))
    }
  } else{
    yield put(MessagesActions.postMessageFailure(response.data))
  }
}

export function * make_call (action) {
  const roomId = uuid.v4()
  action.socketConnection.emit('call_user', action.recipient, action.caller, {called: action.caller, recipient: action.recipient, roomId: roomId})
  yield put(MessagesActions.makeCallSuccess(action.recipient, action.caller, roomId))
  yield put(NavigationActions.navigate({routeName: 'NewVideoChatContainer', params: {id: action.caller, toId: action.recipient, called: null}}))
}
//acceptCallAttempt: ['caller', 'roomId', 'key'],
export function * accept_call (action) {

  yield put(NavigationActions.navigate({routeName: 'NewVideoChatContainer', params: {id: action.caller, toId: action.recipient, called: action.key}}))
  yield put(MessagesActions.acceptCallSuccess())
}

//receiveCallAttempt: ['user', 'roomId', 'key'],
export function * receive_call (api, action) {
  const response = yield call(api.getProfile, action.user)
  if (response.ok){
    yield put(MessagesActions.receiveCallSuccess(response.data, action.roomId))
    yield put(NavigationActions.navigate({routeName: 'PhoneCallScreen'}))
  } else {
    yield put(MessagesActions.receiveCallFailure(response.error))
  }
}

export function * hang_call (action) {
  // action.socketConnection.disconnect()
  // action.socketConnection = io.connect(Utilities.baseUrl, {transports: ['websocket']})
  // action.socketConnection.emit('adduser', {});
  // action.socketConnection.emit('add')
  yield put(MessagesActions.hangCallSuccess())
  // yield put(NavigationActions.back({key: action.key}))
}
// answerCall() {
//     this.setState(Object.assign({}, this.state, {callAnswered: true}))
//     this.props.navigation.navigate('NewVideoChatContainer', {id: this.state.userId, toId: this.props.myId, called: this.props.navigation.state.key})
//   }
//   hangCall() {
//    global.chatSocket.emit('hang_call', this.state.userId, this.props.myId, 'hung up' )
//     this.props.navigation.goBack(null)
//   }
    // if(this.state.onCall){
    //   return
    // }
    // this.setState(Object.assign({}, this.state, {onCall: true}))
    // global.chatSocket.emit('call_user', this.state.messageThreadUser._id, this.props.myId, {called: this.state.messageThreadUser._id, caller: this.props.myId});
    // this.props.navigation.navigate('NewVideoChatContainer', {id: this.props.myId, toId: this.state.messageThreadUser._id, called: 'no'})

