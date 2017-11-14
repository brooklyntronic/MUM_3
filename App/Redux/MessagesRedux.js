import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import Utilities from '../Services/Utilities'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  messagesAttemptAll: null,
  messagesSuccessAll: ['messagesList'],
  messagesFailureAll: ['error'],
  messagesThreadAttempt: ['msgId'],
  messagesThreadSuccess: ['messageThread'],
  messagesThreadFailure: ['error'],
  postMessageAttempt: ['msg', 'fromId', 'toId', 'socketConnection'],
  postMessageSuccess: null,
  postMessageFailure: ['error'],
  deleteMessageThreadAttempt: ['msgId'],
  deleteMessageThreadSuccess: ['messagesList'],
  deleteMessageThreadFailure: ['error'],
  saveMessagesAttempt: ['msgId', 'messageThread'],
  saveMessagesSuccess: ['messageThread'],
  saveMessagesFailure: ['error'],
  
  makeCallAttempt: ['recipient', 'caller', 'socketConnection'],
  makeCallSuccess:['recipient', 'caller', 'roomId'],
  makeCallFailure: ['error'],
  receiveCallAttempt: ['user', 'key', 'roomId'],
  receiveCallSuccess: ['user', 'roomId'],
  receiveCallFailure: ['error'],
  acceptCallAttempt: ['caller', 'recipient','key'],
  acceptCallSuccess: null,
  acceptCallFailure: ['error'],
  hangCallAttempt: null,
  hangCallSuccess: null,
  hangCallFailure: ['error']
})

export const MessagesTypes = Types
export default Creators
 
/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  allFetching: null,
  messagesList: [],
  allMessagesLoaded: null,
  messageThread: null,
  messageThreadUser: null,
  messagesFetching: null,
  messageThreadFetching: null,
  onCall: null,
  caller: null,
  recipient: null,
  key: null,
  user: null,
  myEnd: null,
  otherEnd: null, 
  roomId: null
})

/* ------------- Reducers ------------- */

// request the messages for a user
export const messagesAttemptAll = (state) =>
state.merge({ allFetching: true})

// successful messages lookup
export const messagesSuccessAll = (state, action) => {
  return state.merge({ allFetching: false, error: null, messagesList:Utilities.fixMessages(action.messagesList), allMessagesLoaded: true})
}

// failed to get the messages
export const messagesFailureAll = (state, action) =>
state.merge({ allFetching: false, error: action.error })

export const messagesThreadAttempt = (state) => 
state.merge({messageThreadFetching: true})

export const messagesThreadSuccess = (state, action) =>
state.merge({messageThreadFetching: false, messageThread: action.messageThread.messages, messageThreadUser: action.messageThread.user})

export const messagesThreadFailure = (state, action) => 
state.merge({messageThreadFetching: false, error: action.error})

export const saveMessagesAttempt = (state) => state

export const saveMessagesSuccess = (state, action) => state
export const saveMessagesFailure = (state, action) => state

export const postMessageAttempt = (state) => 
state
export const postMessageSuccess = (state, action) =>
state
export const postMessageFailure = (state, action) =>
state.merge({error: action.error})
export const deleteMessageAttempt = (state) => state
export const deleteMessageSuccess = (state, action) => state.merge({messagesList: Utilities.fixMessages(action.messagesList)})
export const deleteMessageFailure = (state, action) => state.merge({error: action.error})

export const makeCallAttempt = (state)=> state 
export const makeCallSuccess = (state,action)=> state.merge({onCall: true, myEnd: action.caller, otherEnd: action.recipient, key: null, caller: action.caller, recipient: action.recipient, roomId: action.roomId})
export const makeCallFailure = (state,action)=> state.merge({error: action.error}) 

export const receiveCallAttempt = (state, action)=> state
export const receiveCallSuccess = (state, action)=> state.merge({user: action.user, roomId: action.roomId})
export const receiveCallFailure = (state, action)=> state.merge({error: action.error})

export const acceptCallAttempt = (state, action)=> state.merge({ myEnd:action.recipient, otherEnd:action.caller, caller: action.caller, recipient: action.recipient, key: action.key})
export const acceptCallSuccess = (state, action)=> state.merge({onCall: true})
export const acceptCallFailure = (state, action)=> state.merge({error: action.error})



export const hangCallAttempt = (state)=> state 
export const hangCallSuccess = (state,action)=> state.merge({onCall: false, caller: null, recipient: null, myEnd: null, other: null, key: null})
export const hangCallFailure = (state,action)=> state.merge({error: action.error})
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.MESSAGES_ATTEMPT_ALL]: messagesAttemptAll,
  [Types.MESSAGES_SUCCESS_ALL]: messagesSuccessAll,
  [Types.MESSAGES_FAILURE_ALL]: messagesFailureAll,
  [Types.POST_MESSAGE_ATTEMPT]: postMessageAttempt,
  [Types.POST_MESSAGE_SUCCESS]: postMessageSuccess,
  [Types.POST_MESSAGE_FAILURE]: postMessageFailure,
  [Types.DELETE_MESSAGE_THREAD_ATTEMPT]: deleteMessageAttempt,
  [Types.DELETE_MESSAGE_THREAD_SUCCESS]: deleteMessageSuccess,
  [Types.DELETE_MESSAGE_THREAD_FAILURE]: deleteMessageFailure,
  [Types.MESSAGES_THREAD_ATTEMPT]: messagesThreadAttempt,
  [Types.MESSAGES_THREAD_SUCCESS]: messagesThreadSuccess,
  [Types.MESSAGES_THREAD_FAILURE]: messagesThreadFailure,
  [Types.SAVE_MESSAGES_ATTEMPT]: saveMessagesAttempt,
  [Types.SAVE_MESSAGES_SUCCESS]: saveMessagesSuccess,
  [Types.SAVE_MESSAGES_FAILURE]: saveMessagesFailure,
  
  [Types.MAKE_CALL_ATTEMPT]: makeCallAttempt,
  [Types.MAKE_CALL_SUCCESS]: makeCallSuccess,
  [Types.MAKE_CALL_FAILURE]: makeCallFailure,
  [Types.RECEIVE_CALL_ATTEMPT]: receiveCallAttempt,
  [Types.RECEIVE_CALL_SUCCESS]: receiveCallSuccess,
  [Types.RECEIVE_CALL_FAILURE]: receiveCallFailure,
  [Types.ACCEPT_CALL_ATTEMPT]: acceptCallAttempt,
  [Types.ACCEPT_CALL_SUCCESS]: acceptCallSuccess,
  [Types.ACCEPT_CALL_FAILURE]: acceptCallFailure,
  [Types.HANG_CALL_ATTEMPT]: hangCallAttempt,
  [Types.HANG_CALL_SUCCESS]: hangCallSuccess,
  [Types.HANG_CALL_FAILURE]: hangCallFailure



})

    // if(this.state.onCall){
    //   return
    // }
    // this.setState(Object.assign({}, this.state, {onCall: true}))
    // global.chatSocket.emit('call_user', this.state.messageThreadUser._id, this.props.myId, {called: this.state.messageThreadUser._id, caller: this.props.myId});
    // this.props.navigation.navigate('NewVideoChatContainer', {id: this.props.myId, toId: this.state.messageThreadUser._id, called: 'no'})
