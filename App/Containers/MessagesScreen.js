import React, { Component } from 'react'
import { ScrollView, Text, FlatList, View, ActivityIndicator, Image, TouchableOpacity, AsyncStorage } from 'react-native'
import {Images, Colors} from '../Themes/'
import { connect } from 'react-redux'
import { List, ListItem, SearchBar } from 'react-native-elements'
import PageHeader from '../Components/PageHeader'
import Addicon from '../Components/Addicon'
import Icon from 'react-native-vector-icons/FontAwesome'
import Utilities from '../Services/Utilities'
import Swipeout from 'react-native-swipeout'
import io from 'socket.io-client'
import { EventRegister } from 'react-native-event-listeners'
import MessagesActions from '../Redux/MessagesRedux'

// import Reactotron from 'reactotron-react-native'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/MessagesScreenStyle'

class MessagesScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchText: ''
    }
    // this.socket.on('call_user_handle', (username, data)=>{this.props.navigation.navigate('PhoneCallScreen', {id: data.caller})
    //})
  }
  componentWillMount() {
    let self = this
    this.getMessages()
  }
 getMessages(){
  this.props.getAllMessages()
 }
 gotoMessage (id) {
  this.props.navigation.navigate('MessageScreen', {threadId: id})
}
createMessage () {
  this.props.navigation.navigate('MessageScreen', {user: 'newMessage'})
}
newMessages (list){

  var tempArray = [];
  list.forEach((item)=>{
    if(!item.received && item.user._id !== this.props.myId){
      tempArray.push(item)
    }
  })

  return tempArray.length > 0 ? {value: tempArray.length, containerStyle:{backgroundColor: 'red', top: 5}} : null
}
deleteThread (id) {
  this.props.deleteMessageThread(id)
}
render () {
  const self = this;
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
    <ScrollView contentContainerStyle={styles.mainScroll}>
    <SearchBar
    containerStyle = {styles.searchBar}
    round
    lightTheme
  onChangeText={(text)=>{this.setState(Object.assign({}, this.state, {searchText: text}))}}
  onClearText={()=>{this.setState(Object.assign({}, this.state, {searchText: ''}))}}
  placeholder='Search Messages...' />
    <Addicon onPress={()=>{this.createMessage()}} />
    <List containerStyle={{borderTopWidth: 0}}>
    <FlatList
    data={this.props.messages.filter((message)=>message.user.name.indexOf(this.state.searchText) > -1)}
    renderItem={( {item }) => {
      let swipeoutBtns = [{
              text: 'Delete',
              backgroundColor: '#ff0000',
              onPress: ()=>{this.deleteThread(item.user._id)}
            }]
      return (
          <Swipeout right={swipeoutBtns} style={{backgroundColor: 'transparent'}}>
          <ListItem
          onPress={()=>this.gotoMessage(item.user)}
          subtitleNumberOfLines={2}
          subtitle={`${item.messages[0].text}\n${Utilities.formatDate(item.messages[0].createdAt)}`}
          title={item.user.name}
          titleStyle={styles.link}
          avatar={Utilities.getAvatar(item.user)}
          roundAvatar
          avatarStyle={{height: 70, width: 70, borderRadius: 35}}
          avatarContainerStyle={{height:70, width: 70, backgroundColor: 'white', borderRadius: 35, paddingTop: 0, paddingRight: 0, paddingLeft: 0, overflow: 'hidden'}}
          badge={this.newMessages(item.messages)}
          hideChevron
          containerStyle={{borderBottomWidth: 0, marginVertical: 10}}
          /></Swipeout>
          )}
  }
    keyExtractor={item => item.user._id}
    />

    </List>
    </ScrollView>
    )
}
}

const mapStateToProps = (state) => {
  return {
    fetching: state.messages.allFetching,
    messages: state.messages.messagesList,
    messagesLoaded: state.messages.allMessagesLoaded,
    name: state.user.user.name,
    myId: state.user.user._id
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAllMessages: ()=>{
      dispatch(MessagesActions.messagesAttemptAll())
    },
    deleteMessageThread: (threadId) =>{
      dispatch(MessagesActions.deleteMessageThreadAttempt(threadId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesScreen)
