import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { View, Text, TouchableOpacity, AsyncStorage, InteractionManager } from 'react-native'
import styles from './Styles/CustomNavbarStyle'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Badge } from 'react-native-elements'
import Swiper from 'react-native-swiper'
import Utilities from '../Services/Utilities'
import io from 'socket.io-client';
import { EventRegister } from 'react-native-event-listeners'
import UserActions from '../Redux/UserRedux'
import MessagesActions from '../Redux/MessagesRedux'
import PushNotification from 'react-native-push-notification'
// import Reactotron from 'reactotron-react-native'
class CustomNavbar extends Component {
  // // Prop type warnings
  static propTypes = {
    searchNavigate: PropTypes.func,
    messagesNavigate: PropTypes.func,
    profileNavigate: PropTypes.func,
    matchesNavigate: PropTypes.func,
    answerCall: PropTypes.func,
    matchupsNavigate: PropTypes.func,
    preferencesNavigate: PropTypes.func,
    logout: PropTypes.func,
    newMessages:PropTypes.number,
    hangCall: PropTypes.func
  }
  constructor (props) {
    super(props)
    const obj = {name: this.props.user.name || null, id: this.props.user._id || null};
    
    window.setInterval(()=>{
      if (!global.chatSocket || !global.chatSocket.connected) {
        global.chatSocket = io.connect(Utilities.baseUrl, {transports: ['websocket']})
        global.chatSocket.emit('adduser', obj);
        global.chatSocket.on('call_user_handle', (username, data)=>{
          if (!this.props.onCall){
            // Reactotron.log(data)
           //receiveCallAttempt: ['user', 'key', 'roomId'],
           this.props.receiveCall(data.called, this.props.navKey, data.roomId)
         }
       })
        global.chatSocket.on('add_user_handle', (username, data)=>{
          this.props.getRequests()
        })
        global.chatSocket.on('friend_added_handle', (username, data)=>{
          this.props.getMatches()
        })
        global.chatSocket.on('unfriend_user_handle', (username, data)=>{
          this.props.getMatches()
        })
        global.chatSocket.on('msg_user_handle', (username, data)=>{
          this.props.getAllMessages();
          
        })
      }
    }, 3000);
  }
  
  componentDidUpdate (prevProps, prevState){
    if(prevProps.requests !== this.props.requests && this.props.requests > 0){
      PushNotification.localNotification({
        type: 'request',
        title: "New Requests",
        message: `You have ${this.props.requests} new request${this.props.requests > 1 ? 's':''}`, 
        playSound: true, 
        soundName: 'default',
        repeatType: 'hour'
      });
    }
    if(prevProps.messages !== this.props.messages && this.props.messages > 0){
      PushNotification.localNotification({
        type: 'message',
        title: "New Messages",
        message: `You have ${this.props.messages} new message${this.props.requests > 1 ? 's':''}`, 
        playSound: true, 
        soundName: 'default',
        repeatType: 'hour'
      });
    }
  }
  componentWillUnmount(){
    EventRegister.removeEventListener(this.listener)
  }
  //   getMessages() {
  //   // return fetch(Utilities.baseUrl + 'users/me', {credentials: 'include'}).then((resp)=>resp.json()).then((user)=>{
  //   //      if (user.requestsRecieved.length > 0) {
  //   //       var tempRequestArray = user.requestsRecieved.filter(function(request){
  //   //         return user.requestsAnswered.indexOf(request) < 0
  //   //       });
  //   //       const newRequests = tempRequestArray.length;
  //   //       this.setState(Object.assign({}, this.state, {newRequests: newRequests}))
  //   //     }
  //   //   }).catch((err)=>{alert('Network Error')})
  // }
  render () {
    const self = this
    return (
      <View style={styles.container}>
      <Swiper showsPagination={false} loop={false} >
      <View style={styles.menuPart} key={1} >
      <TouchableOpacity onPress={()=>{this.props.homeNavigate()}} disabled={!this.props.complete}><Icon name='home' size={30} color='#add8e6'/></TouchableOpacity>
      <TouchableOpacity onPress={()=>{this.props.searchNavigate()}}  disabled={!this.props.complete}><Icon name='search' size={30} color='#add8e6'/></TouchableOpacity>
      <TouchableOpacity onPress={this.props.matchesNavigate}  disabled={!this.props.complete}><Icon name='heart' size={30} color='red'/>
      {this.props.requests && this.props.requests > 0 ? <View style={{position: 'absolute', right: -5}}><Badge containerStyle={{ backgroundColor: 'red', padding: 5, borderRadius:5}} value={this.props.requests} /></View>:null}
      </TouchableOpacity>
      <TouchableOpacity onPress={this.props.messagesNavigate}  disabled={!this.props.complete}><Icon name='envelope' size={30} color='#add8e6'/>
      {this.props.messages && this.props.messages > 0 ? <View style={{position: 'absolute', right: -5}}><Badge containerStyle={{ backgroundColor: 'red', padding: 5, borderRadius:5}} value={this.props.messages} /></View>:null}
      </TouchableOpacity>
      </View>
      <View style={styles.menuPart} key={2}>
      <TouchableOpacity onPress={this.props.matchupsNavigate}  disabled={!this.props.complete}><Icon name='bar-chart' size={30} color='#add8e6'/></TouchableOpacity>
      <TouchableOpacity onPress={this.props.profileNavigate}  disabled={!this.props.complete}><Icon name='user-circle' size={30} color='#add8e6'/></TouchableOpacity>
      <TouchableOpacity onPress={this.props.preferencesNavigate}  disabled={!this.props.complete}><Icon name='wrench' size={30} color='#add8e6'/></TouchableOpacity>
      <TouchableOpacity onPress={this.props.logout}  disabled={!this.props.complete}><Icon name='sign-out' size={30} color='#add8e6'/></TouchableOpacity>
      </View>
      </Swiper>
      </View>
      )
  }
}
const mapStateToProps = (state) => {
  // Reactotron.log(state)
  return {
    messages: state.user.notifications.messages,
    requests: state.user.notifications.requests,
    user: state.user.user,
    onCall: state.messages.onCall,
    navKey: state.nav.routes[state.nav.routes.length - 1].key,
    complete: state.user.myProfile.complete.complete
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getNotifcations: ()=>{
      dispatch(UserActions.notificationsAttempt())
    },
    getRequests: ()=>{dispatch(UserActions.requestsAttempt())},
    getMatches: ()=>{dispatch(UserActions.matchesAttempt())},
    getAllMessages: ()=>{
      dispatch(MessagesActions.messagesAttemptAll())
    },
    //receiveCallAttempt: ['user', 'key', 'roomId'],
    receiveCall: (caller, key, roomId)=>{
      dispatch(MessagesActions.receiveCallAttempt(caller, key, roomId))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomNavbar )