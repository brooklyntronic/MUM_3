import React, { Component } from 'react'
import { ScrollView, Text, View, ActivityIndicator, TouchableOpacity, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import Image from 'react-native-image-progress'
import Utilities from '../Services/Utilities'
import io from 'socket.io-client';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import MessagesActions from '../Redux/MessagesRedux'
// Styles
import styles from './Styles/PhoneCallScreenStyle'
// import Reactotron from 'reactotron-react-native'
class PhoneCallScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      avatar: '',
      fetching: false
    }
    // let self = this
    // this.socket = io.connect(Utilities.baseUrl, {transports: ['websocket']})
    // this.socket.on('cancel_call_handle', function(){
    //     self.socket.disconnect()
    //     self.socket = io.connect(Utilities.baseUrl, {transports: ['websocket']})
    //     self.props.navigation.goBack(self.props.navigation.state.key)

    //   })
  }
//   componentWillMount () {
//     const self = this
    
//     this.setState(Object.assign({}, this.state, {fetching: true}))
//     fetch(Utilities.baseUrl + 'users/profile/' + this.props.navigation.state.params.id).then((resp)=>resp.json()).then((user)=>

//     {
//       if (user.facebook && !user.avatar){
//         user.pic = 'https://graph.facebook.com/'+user.facebook.id+'/picture?type=large'
//       }
//       if (user.twitter && !user.avatar){
//         user.pic = user.twitter.profile_image_url_https;
//       }
//       if (user.instagram && !user.avatar){
//         user.pic = user.instagram.data.profile_picture;
//       }
//       if (user.avatar){
//         user.pic = 'https://d23grucy15vpbj.cloudfront.net/' + user.avatar;
//       } 
//       this.setState(Object.assign({}, this.state, {avatar: user.pic, name: user.name, fetching: false, userId: user._id}))
//     })
//     //.then(()=>{
//     //   AsyncStorage.getItem('@MySuperStore:userID').then((resp)=>{this.setState(Object.assign({}, this.state, {myId: resp}))})
//     // })

// }
  answerCall() {
    // this.setState(Object.assign({}, this.state, {callAnswered: true}))
    // this.props.navigation.navigate('NewVideoChatContainer', {id: this.state.userId, toId: this.props.myId, called: this.props.navigation.state.key})
    this.props.acceptCall(this.props.user._id, this.props.myId, this.props.navigation.state.key)
  }
  hangCall() {
   global.chatSocket.emit('hang_call', this.state.userId, this.props.myId, 'hung up' )
    this.props.navigation.goBack(null)
  }
  render () {
    if (this.state.fetching) {
      return (
        <View style={styles.phoneContainer}>
        <View style={styles.content}>
        <Text>Incoming Call</Text>
        <ActivityIndicator />
        </View>
        </View>
        );
    }
    return (
      <View style={styles.container}>
      <View style={styles.phoneContainer}>
      <Text style={styles.overlayText}>{this.props.user.name.toUpperCase()}</Text>
      <View style={styles.padding}><Image source={{uri: Utilities.getAvatar(this.props.user)}} style={styles.fullImage} /></View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', width: 150}}>
      {!this.props.onCall?<TouchableOpacity onPress={()=>{this.answerCall()}}><Icon name='phone' style = {{color:'green'}} size={70} /></TouchableOpacity>:null}
      <TouchableOpacity onPress={()=>{this.hangCall()}}><Icon name='times-circle' style={{color: 'red'}} size={65}/></TouchableOpacity>
      </View>
      </View>
      </View>
      )
  }
}

const mapStateToProps = (state) => {
  // Reactotron.log(state)
  return {
    myId: state.user.user._id,
    user: state.messages.user,
    onCall: state.messages.onCall

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    acceptCall: (caller, recipient, key)=>{
      dispatch(MessagesActions.acceptCallAttempt(caller, recipient, key))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhoneCallScreen)
