import React, { Component } from 'react'
import Image from 'react-native-image-progress'
import { ScrollView, Text, AsyncStorage, View, ActivityIndicator, FlatList, TouchableOpacity, Alert} from 'react-native'
import { connect } from 'react-redux'
import FullButton from '../Components/FullButton'
import Utilities from '../Services/Utilities'
import Swiper from 'react-native-swiper'
import { List, ListItem } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import MessagesActions from '../Redux/MessagesRedux'
// import Reactotron from 'reactotron-react-native'
import {findIndex} from 'lodash'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import UserActions from '../Redux/UserRedux'
// Styles
import styles from './Styles/ProfileScreenStyle'
// Make mapview a static map on this page
//const staticMapURL = 'https://maps.googleapis.com/maps/api/staticmap'
class ProfileScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {userId: this.props.navigation.state.params.id, user: {}, fetching: true, messages: [], onCall: false}
  }
  // componentWillMount () {

  // }

  componentWillMount() {
   return this.props.getUserProfile(this.props.navigation.state.params.id)
 }
 showPicker(index){
    // this.props.navigation.navigate('PreferenceScreen', {property, fromProfile: 'yes', isText: isText || false})
    let pickerOpen = {}
    pickerOpen[index] = true
    this.setState({pickerOpen: pickerOpen})
  }
  makePhotos(a) {
    var arrays = [], size = 3;
    while (a.length > 0)
      arrays.push(a.splice(0, size));
    return arrays
  }
  showImage(image) {
    this.setState({
      avatar: 'https://d23grucy15vpbj.cloudfront.net/'+ image
    })
  }
  gotoMessage (){
    this.props.navigation.navigate('MessageScreen', {threadId: this.props.user})
  }
  openVideoChat(){
    this.props.makeCall(this.props.user._id, this.props.myId, global.chatSocket)

  }
  getPermissionToUnfriend(){
    Alert.alert(
      'Do you really want to unmatch me?',
      'No takebacks...',
      [
      {text: 'Cancel', onPress: () => {}},
      {text: 'Yes', onPress: () => this.unfriend()},
      ],
      { cancelable: true }
      )
  }
  unfriend(){
    this.props.unfriend(this.props.user._id, this.props.myId)
  }
  addFriend(){
    this.props.addFriend(this.props.user._id, this.props.myId)
  }
  sendRequest() {
    this.props.sendRequest(this.props.user._id, this.props.myId)
  }
  denyRequest() {
    this.props.denyRequest(this.props.user._id)
  }
  makeProps (prop) {
    return this.props.user.profileProps[prop].map(function(attribute){
      if (attribute.label){
        return ( <ListItem key={attribute.label} hideChevron={true} subtitle={<View style={styles.subtitleView}><Text style={styles.attr}>{`${attribute.value.charAt(0).toUpperCase()+attribute.value.slice(1)}`}</Text></View>} containerStyle={{borderBottomWidth: 0, paddingVertical: 10}} title={attribute.label} />)
      }
    })
  }
  render () {

    if (this.props.fetching) {
      return (
        <View style={styles.mainContainer}>
        <View style={styles.content}>
        <ActivityIndicator />
        </View>
        </View>
        )
    }
    return (
      <ScrollView style={styles.mainScroll}>
      <View style={styles.container}>
      <View style={styles.mainContainer}>
      <Text style={styles.heading}>{this.props.user.name}</Text>
      {findIndex(this.props.friends, {_id: this.props.user._id})> -1 ? (<View style={styles.iconBox}>
        {this.props.user.isOnline ? <TouchableOpacity onPress={()=>{this.openVideoChat()}}>
                <Icon style={styles.icons} name='phone-square' size={40} />
                </TouchableOpacity> : null}
        <TouchableOpacity onPress={()=>{this.gotoMessage()}}>
        <Icon style={styles.icons} name='envelope' size={40}  />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{this.getPermissionToUnfriend()}}>
        <Icon style={styles.icons} name='trash-o' size={40} />
        </TouchableOpacity>
        </View>) : null}
      {findIndex(this.props.requestsReceived, {_id: this.props.user._id}) > -1 && findIndex(this.props.friends, {_id: this.props.user._id}) < 0 ? 
      (<View style={styles.iconBox}>
        <TouchableOpacity onPress={()=>{this.addFriend()}}>
        <Icon style={styles.icons} name='plus' size={40} />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{this.denyRequest()}}>
        <Icon style={styles.icons} name='trash-o' size={40} />
        </TouchableOpacity>
        </View>)
      :null}
      {(this.props.requestsSent.indexOf(this.props.user._id)< 0  && findIndex(this.props.requestsReceived, {_id: this.props.user._id}) < 0) && findIndex(this.props.friends, {_id: this.props.user._id}) < 0 ? 
      (<View style={styles.iconBox}>
        <TouchableOpacity onPress={()=>{this.sendRequest()}} style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon style={styles.icons} name='heart' size={40} /><Text style={styles.link}>Request</Text>
        </TouchableOpacity>
        </View>)
      :null}
      {this.props.requestsSent.indexOf(this.props.user._id) > -1 && findIndex(this.props.requestsReceived, {_id: this.props.user._id}) < 0 && findIndex(this.props.friends, {_id: this.props.user._id}) ? <View style={styles.iconBox}>
        <TouchableOpacity  style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon style={styles.icons} name='heart-o' size={40} /><Text style={styles.link}>Requested</Text>
        </TouchableOpacity>
        </View> : null}
      <Image style={styles.fullImage} source={{uri:this.state.avatar?this.state.avatar : Utilities.getAvatar(this.props.user)}}/>      
      {this.props.user.photos.length > 0? <Text style={styles.pageHeading}>{this.props.user.name}'s Photos</Text>:null}
      <View>
      {this.props.user.photos.length > 0 ? <View style={styles.carouselWrapper}><Swiper showsButtons={true}  showsPagination={false}
      >
      {this.makePhotos([...this.props.user.photos]).map((photo, i)=>{
        return (
          <View key={i}>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
          {photo.map((ind)=>(<TouchableOpacity key={ind} onPress={()=>{this.showImage(ind)}}><Image style={styles.carouselImage} source={{uri: 'https://d23grucy15vpbj.cloudfront.net/'+ ind}}/></TouchableOpacity>))}
          </View>
          </View>
          )
      })}
      </Swiper></View> : null}
      </View>
      </View>
      <List containerStyle={{borderTopWidth: 0}}>
      <ListItem hideChevron={true} subtitle={<View style={styles.subtitleView}><Text style={styles.attr}>{`${this.props.user.location}`}</Text></View>} title='Location' containerStyle={{borderBottomWidth: 0, paddingVertical: 10}}/>
      {this.makeProps('Personal')}{this.makeProps('Appearance')}{this.makeProps('Interests')} 
      </List>

      </View>

      </ScrollView>
      )

  }
}

const mapStateToProps = (state) => {
  // Reactotron.log(state.user)
  return {
    fetching: state.user.profileFetching,
    myId: state.user.user._id,
    user: state.user.profileUser,
    friends: state.user.matchesList || [],
    requestsSent: state.user.requestsSentList || [],
    requestsReceived: state.user.requestsReceivedList || [],
    // // avatar: Utilities.getAvatar(state.user.profileUser), 
    // userProps: state.user.profileUser.profileProps, 
    // region:{
    //   longitude: state.user.profileUser.coordinates[0],
    //   latitude: state.user.profileUser.coordinates[1],
    //   latitudeDelta: 0.0922,
    //   longitudeDelta: 0.0421
    // }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserProfile: (userId) => {dispatch(UserActions.profileAttempt(userId))},
    unfriend: (userId, myId) => {dispatch(UserActions.unfriendAttempt(userId, myId))},
    addFriend: (userId, myId) => {dispatch(UserActions.acceptFriendRequestAttempt(userId, myId))},
    sendRequest: (userId, myId) => {dispatch(UserActions.sendFriendRequestAttempt(userId, myId))},
    denyRequest: (userId) => {dispatch(UserActions.denyFriendRequestAttempt(userId))},
    makeCall: (recipient, caller, socketConnection) => {
      dispatch(MessagesActions.makeCallAttempt(recipient, caller, socketConnection))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
