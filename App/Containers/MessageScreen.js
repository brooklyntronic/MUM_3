import React, { Component } from 'react'
import { View, Text, Picker, TextInput, ScrollView, ActivityIndicator, AsyncStorage, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import BackArrow from '../Components/BackArrow'
import PageHeader from '../Components/PageHeader'
import Utilities from '../Services/Utilities'
import { GiftedChat, Actions, Bubble } from 'react-native-gifted-chat'
import { List, ListItem, SearchBar } from 'react-native-elements'
import { filter, indexOf, invert, findKey, union } from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome'
import ImagePicker from 'react-native-image-crop-picker'
import { RNS3 } from 'react-native-aws3'
import io from 'socket.io-client';
import { EventRegister } from 'react-native-event-listeners'
import MessagesActions from '../Redux/MessagesRedux'
import UserActions from '../Redux/UserRedux'
// import Reactotron from 'reactotron-react-native'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/MessageScreenStyle'

class MessageScreen extends Component {
  constructor (props) {
    super(props)
    let user
    if (this.props.navigation.state.params.threadId ){
      user = this.props.navigation.state.params.threadId
      user.avatar = Utilities.getAvatar(user);
    }
    this.sendReadReceipt = this.sendReadReceipt.bind(this)
    this.uploadImage = this.uploadImage.bind(this)
    this.state = {
      messageThread: [], searchText: '',  messageThreadUser: user || null
    }
    
    // this.state = {sending: true, messages: [],friends: [], searchText: '', fetching: true, recipient: this.props.navigation.state.params.threadId ? user: null}
    
    // global.chatSocket.on('call_user_handle', (username, data)=>{this.props.navigation.navigate('PhoneCallScreen', {id: data.caller})
  // })
  //   global.chatSocket.on('msg_read_handle', (data)=>{
  //     let tempMessages = data.messages
  //     tempMessages.forEach((message)=>{
  //       message.received = true
  //     })
  //     self.setState(Object.assign({}, self.state, {messages: tempMessages}))
  //   })
}
componentWillReceiveProps (nextProps) {
  if (typeof nextProps.messageThread != 'undefined' && this.state.messageThreadUser) {
    if(nextProps.messageThread !== null && nextProps.messageThread.length > 0){
      let tempArray = [...nextProps.messageThread]
      tempArray.forEach((message)=>{
        if (message.user._id !== this.props.myId){
          message.received = true
        }
      })
      this.setState((previousState) => ({
        messageThread: GiftedChat.append([], tempArray)
      })) 
    }
  }
}
chatInit(){
  global.chatSocket.on('msg_user_handle', this.sendReadReceipt)
  global.chatSocket.on('msg_read_handle', (user)=>{
    if (this.state.messageThreadUser && user === this.state.messageThreadUser._id && this.props.navigation.state.routeName === 'MessageScreen'){
      let tempArray = [...this.state.messageThread]
      tempArray.forEach((msg)=>{
        msg.received = true
      })
      this.setState((previousState) => ({
        messageThread: GiftedChat.append([], tempArray)
      }))      
    }
  })
  if (this.state.messageThreadUser){
    global.chatSocket.emit('msg_read', this.state.messageThreadUser._id, this.props.myId)
  }
}
componentWillMount(){
  if (this.state.messageThreadUser){
    this.props.getMessages(this.state.messageThreadUser._id)
  }
  this.listener = EventRegister.addEventListener('offCall', () => {
    // this.chatInit()
    this.setState({
      onCall: false,
      messageThread: this.props.messageThread
    })
  })
  this.chatInit()
  // global.chatSocket.on('msg_user_handle', this.sendReadReceipt)
  // global.chatSocket.on('msg_read_handle', ()=>{
  //   let tempArray = [...this.state.messageThread]
  //     tempArray.forEach((message)=>{
  //       if (message.user._id !== this.props.myId){
  //         message.received = true
  //       }
  //     })
  //     this.setState((previousState) => ({
  //         messageThread: GiftedChat.append(previousState.messageThread,tempArray)
  //       }))
  // })
  
    // AsyncStorage.multiGet(['@MySuperStore:userID', '@MySuperStore:name', '@MySuperStore:avatar']).then((resp)=>{
    //   self.socket.emit('adduser',  {name: resp[1][1], id:resp[0][1]});
    //   self.setState(Object.assign({}, self.state, {myId: resp[0][1], myAvatar: resp[2][1]})) })
    // fetch(Utilities.baseUrl + 'users/matches', {credentials: 'include'}).then((resp)=>resp.json()).then((respJson)=>{
    //   this.setState(Object.assign({}, this.state, {friends: respJson}))
    // }).
    // then(function(){
    //   if (self.props.navigation.state.params.threadId){
    //     fetch(Utilities.baseUrl + 'newMessageThread/' + self.props.navigation.state.params.threadId._id).
    //     then((resp)=>resp.json()).
    //     then((respJson)=>{
    //       if (respJson.messages){
    //         respJson.messages.forEach((message)=>{
    //           if (message.user._id !== self.props.myId){
    //             message.received = true
    //           }
    //         })
    //         self.setState(Object.assign({}, self.state, {messages: respJson.messages, fetching: false}),()=>{
    //           self.socket.emit('msg_read', self.state.recipient._id,self.props.myId, respJson)
    //           if (respJson.messages.length > 0){
    //             self.postMessages(respJson)
    //           }
    //         })
    //       }
    //     }).
    //     catch((err)=>{self.setState(Object.assign({}, self.state, {fetching: false}))})
    //   } else {
    //     self.setState(Object.assign({}, self.state, {fetching: false}))
    //   }  }). 
    // catch((err)=>{ self.setState(Object.assign({}, self.state, {fetching: false}))})
  }
  componentDidMount () {



  }
  componentWillUnmount(){
    // console.error('unmounting')
    EventRegister.removeEventListener(this.listener)
    global.chatSocket.off('msg_user_handle', this.sendReadReceipt)
  }
  // postMessages(messageBody){
  //   return fetch(Utilities.baseUrl + 'newMessages',
  //     {credentials: 'include',
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(messageBody)}
  //     )
  // }
  sendReadReceipt(username, data){
    if (this.state.messageThreadUser && data.user._id === this.state.messageThreadUser._id ){
      data.received = true
      this.setState((previousState) => ({
        messageThread: GiftedChat.append(previousState.messageThread,[data]),
      }), ()=>{
        if(this.props.navigation.state.routeName ===this.props.nav.routes[this.props.nav.routes.length - 1].routeName){
        let tempMessages = this.state.messageThread;
        tempMessages.forEach((message)=>{
          message.received = true;
        })
        // Reactotron.log(tempMessages)
        this.props.saveMessages(tempMessages, this.state.messageThreadUser._id)
        global.chatSocket.emit('msg_read', this.state.messageThreadUser._id, this.props.myId, data)
      }
    })
      
    }
  }
  openVideoChat(){
    // if(this.state.onCall){
    //   return
    // }
    // this.setState(Object.assign({}, this.state, {onCall: true}))
    // global.chatSocket.emit('call_user', this.state.messageThreadUser._id, this.props.myId, {called: this.state.messageThreadUser._id, caller: this.props.myId});
    // this.props.navigation.navigate('NewVideoChatContainer', {id: this.props.myId, toId: this.state.messageThreadUser._id, called: 'no'})
    this.props.makeCall(this.state.messageThreadUser._id, this.props.myId, global.chatSocket)
  }
  filterNames(searchText, names) {
    let text = searchText.toLowerCase();
    return filter(names, (n) => {
      let name = n.name.toLowerCase();
      return name.search(text) !== -1;
    });
  }
  setRecipient(user){
    this.props.getMessages(user._id)
    this.setState(Object.assign({}, this.state, {messageThreadUser: user}))
  }
  
  uploadImage () {
    let self = this
    this.setState({photosUploading: true})
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true
    }).then(image => {
      const file = {
        uri: image.path,
        name: decodeURIComponent(this.props.myId + '/' + Date.now() + image.filename.split(' ').join('-').split('.').join('-').replace('#', '-')),
        type: "image/png"
      }
      const options = {
        key: decodeURIComponent( this.props.myId + '/' + Date.now() + image.filename.split(' ').join('-').split('.').join('-').replace('#', '-')),
        bucket: "toosentsvids",
        region: "us-west-2",
        accessKey: "AKIAIGA2C2IZIWOYPCWQ",
        secretKey: "si+aOyZ4zYRPSBz2ecI7uucl6zoAMfofgrDxcK6V",
        successActionStatus: 201
      }
      RNS3.put(file, options).then(response => {
        const responseText = JSON.stringify({photo: response.body.postResponse.key})
        const photoKey = response.body.postResponse.key
        const photoLocation = response.body.postResponse.location
        const message =  {
          _id: new Date(),
          createdAt: new Date(),
          image:photoLocation,
          user: {_id: this.props.myId, avatar: Utilities.getAvatar(this.props.me)}
        }
        this.setState((previousState) => ({
          messageThread: GiftedChat.append(previousState.messageThread,message), photosUploading: false
        }), ()=>{
          let messageBody = {
            messages: this.state.messageThread,
            user: this.state.messageThreadUser
          }
          this.props.postMessage(messageBody, this.props.myId, this.state.messageThreadUser._id, global.chatSocket)   
        })
      })
    }).catch((err) => {console.log(err);this.setState({photosUploading: false})}).done();
  }
  onSend(messages = []) {
    if (!this.state.messageThreadUser){
      return
    }
    this.setState((previousState) => {
      return {
        messageThread: GiftedChat.append(previousState.messageThread, messages),
      };
    }, ()=>{
      let messageBody = {
        messages: this.state.messageThread,
        user: this.state.messageThreadUser
      }
      messageBody.messages.forEach((message)=>{
        if (message.user._id !== this.props.myId){
          message.received = true
        }
      })
      this.props.postMessage(messageBody, this.props.myId, this.state.messageThreadUser._id, global.chatSocket)      
    });
    
    
    // const self = this
    // if (messages.length < 1){
    //   return
    // }
    // messages.forEach((message)=>{
    //   message.sent = true
    // })
    // this.setState((previousState) => ({
    //   messages: GiftedChat.append(previousState.messages, messages),
    // }), function(){
    //   self.setState(Object.assign({}, self.state, {sending: true}))

    //   self.postMessages(messageBody).then((resp)=>{
    //     messageBody.user = self.props.myId
    //     global.chatSocket.emit('msg_user', self.state.recipient._id,self.props.myId ,messageBody)
    //   });
    // });
  }
  renderBubble(props) {
    return (
      <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#008000',
        }
      }}
      />
      );
  }
  // renderActions() {
  //   const self = this
  //   return ( <TouchableOpacity onPressActionButton = {() => {self.uploadImage()}} ><Icon name="camera" size={30} style={{color: 'grey'}}/></TouchableOpacity> )
  // }
  render () {
    if (this.props.fetching) {
      return (
        <View style={styles.mainContainer}>
        <View style={styles.content}>
        <ActivityIndicator />
        </View>
        </View>
        );
    }
    return (

      <View style={styles.container}>
      <View style={styles.topBar}>
      <BackArrow onPress={() => this.props.navigation.goBack(null)}/>
      {this.state.messageThreadUser ?<Text style={styles.messageHeading}>{this.state.messageThreadUser.name}</Text>:null}{this.state.messageThreadUser  && this.state.messageThreadUser.isOnline ? <TouchableOpacity onPress={()=>{this.openVideoChat()}}><Icon name='phone-square' style={styles.phone} size={40}/></TouchableOpacity>:null}
      </View>
      {this.props.navigation.state.params.user === 'newMessage' && !this.state.messageThreadUser ? 
      ( <View>
        <View style={styles.centered}>
        <Text style={styles.heading}>Message</Text>
        </View>
        <View style={styles.formContainer}>
        <SearchBar placeholder='Search For Recipient' onChangeText={(text) => {this.setState({searchText: text})}} value={this.state.searchText}/>
        </View>
        <ScrollView>
        <List>
        {this.filterNames(this.state.searchText, this.props.matches).map((result, i)=>{
          return( <ListItem onPress={()=>{this.setRecipient(result)}} key={i} avatar={{uri: Utilities.getAvatar(result)}} title={result.name}/>)
        })}
        </List>
        </ScrollView>
        </View>) : null

    }
    {this.state.recipient?(<View style={styles.centered}>

      </View>):null}
    {this.props.navigation.state.params.user !== 'newMessage' || this.state.messageThreadUser ? 
    <GiftedChat
    onPressActionButton = {this.uploadImage}
    messages={this.state.messageThread}
    onSend={(messages) => this.onSend(messages)}
    user={ {_id: this.props.myId, avatar:Utilities.getAvatar(this.props.me)}}
    renderBubble={
      this.renderBubble
    }
    />
    :null}
    {this.state.photosUploading ? <ActivityIndicator style={{marginVertical: 10}}/> : null}
    </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    myId: state.user.user._id,
    matches: state.user.matchesList,
    me: state.user.user,
    messageThread: state.messages.messageThread,
    fetching: state.messages.messageThreadFetching,
    messageThreadUser: state.messages.messageThreadUser,
    nav: state.nav
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMessages: (threadId)=>{
      dispatch(MessagesActions.messagesThreadAttempt(threadId))
    },
    postMessage: (msg, fromId, toId, connection)=>{
      dispatch(MessagesActions.postMessageAttempt(msg, fromId, toId, connection))
    },
    getNotifcations: ()=>{
      dispatch(UserActions.notificationsAttempt())
    },
    saveMessages: (messages, id) =>{
      dispatch(MessagesActions.saveMessagesAttempt(messages, id))
    },
    makeCall: (recipient, caller, socketConnection) => {
      dispatch(MessagesActions.makeCallAttempt(recipient, caller, socketConnection))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageScreen)
