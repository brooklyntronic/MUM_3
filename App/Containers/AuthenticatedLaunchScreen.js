import React, { Component } from 'react'
import { ScrollView, Text, View, Image, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import Orientation from 'react-native-orientation'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import {Images} from '../Themes'
import ButtonBox from '../Components/ButtonBox'
import BackArrow from '../Components/BackArrow'
// Styles
import UserActions from '../Redux/UserRedux'
import styles from './Styles/AuthenticatedLaunchScreenStyle'
import Utilities from '../Services/Utilities'
import PushNotification from 'react-native-push-notification'
import * as Animatable from 'react-native-animatable'
// import Reactotron from 'reactotron-react-native'
class AuthenticatedLaunchScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: null
    }
  }

  componentWillMount () {
    const initial = Orientation.getInitialOrientation();
    if (initial === 'PORTRAIT') {
      this.setState(Object.assign({}, this.state, {orientation: 'portrait'}))
    } else {
      this.setState(Object.assign({}, this.state, {orientation: 'landscape'}))
    }
    
    

  }
  componentDidMount () {
    Orientation.addOrientationListener(this._orientationDidChange);
    PushNotification.configure({

    // (optional) Called when Token is generated (iOS and Android)
    // onRegister: function(token) {
    //     console.log( 'TOKEN:', token );
    // },

    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
        if (notification.type === 'message'){
          this.props.navigation.navigate('MessagesScreen')
        }
        if (notification.type === 'request') {
          this.props.navigation.navigate('MatchesScreen')
        }
    },

    // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
    // senderID: "YOUR GCM SENDER ID",

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
      * (optional) default: true
      * - Specified if permissions (ios) and token (android and ios) will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      */
    requestPermissions: true,
});
  }
  _orientationDidChange = (orientation) => {
    if (orientation === 'LANDSCAPE') {
      this.setState({orientation: 'landscape'})
    } else {
      this.setState({orientation: 'portrait'})
    }
  }
  openMatchupListScreen = () => {
    this.props.navigation.navigate('MatchupListScreen')
  }
  openProfile= () => {
    this.props.navigation.navigate('MyProfileScreen')
  }
  openMatches = () => {
    this.props.navigation.navigate('MatchesScreen')
  }
  openMatchesSearch = () => {
    this.props.navigation.navigate('MatchesSearchScreen')
  }
  openPreferences = () => {
    this.props.navigation.navigate('PreferencesScreen')
  }
  openMessages = () => {
    this.props.navigation.navigate('MessagesScreen')
  }
  signout () {
    this.setState({isLoading: true})
    self = this

  //   AsyncStorage.getAllKeys.then((keys)=>{
  //     multiRemove(keys)
  //   }).then(()=>{
  //     fetch(Utilities.baseUrl + 'signout')
  //   })
  //   .then((resp)=> {self.props.navigation.navigate('SignupScreen')
  // }).catch((err)=>{alert('Network Error')})  
  }
  render () {
    if (this.state.isLoading) {
      return (
        <View style={styles.mainContainer}>
        <View style={styles.content}>
        <ActivityIndicator />
        </View>
        </View>
        );
    }
    return (
      <ScrollView bounces={false}>
      <View style={styles.mainContainer}>

      <View style={styles.buttonsContainer}>
      <View style={this.props.complete ? {} : {backgroundColor: '#000', opacity: 0.5}}><ButtonBox onPress={this.openMatchupListScreen} style={styles.topLeftButton} text='Matchups' disabled={!this.props.complete}  icon='bar-chart' iconSize={40}/></View>
      <View style={this.props.complete ? {} : {backgroundColor: '#000', opacity: 0.5}}><ButtonBox onPress={this.openMatchesSearch} style={styles.topRightButton} text='Find People' disabled={!this.props.complete} icon='search' iconSize={40} /></View>
      {this.state.orientation === 'landscape' ? <View style={this.props.complete ? {} : {backgroundColor: '#000', opacity: 0.5}}><ButtonBox onPress={this.openMatches} style={styles.middleLeftButton} text='My Matches' icon='heart' iconSize={40}/></View> : null}
      </View>
      {this.state.orientation === 'portrait' ? <View style={styles.buttonsContainer}>
      <View style={this.props.complete ? {} : {backgroundColor: '#000', opacity: 0.5}}><ButtonBox onPress={this.openMatches} style={styles.middleLeftButton} text='My Matches' disabled={!this.props.complete} icon='heart' iconSize={40}/></View>
      <View style={this.props.complete ? {} : {backgroundColor: '#000', opacity: 0.5}}><ButtonBox onPress={this.openMessages} style={styles.middleRightButton} text='Messages' disabled={!this.props.complete} icon='envelope' iconSize={40}/></View>
      </View>:null}
      <View style={styles.buttonsContainer}>
      {this.state.orientation === 'landscape' ? <View style={this.props.complete ? {} : {backgroundColor: '#000', opacity: 0.5}}><ButtonBox onPress={this.openMessages} style={styles.middleRightButton} text='Messages' icon='envelope' iconSize={40}/></View>:null}
      <Animatable.View animation="flash" easing="ease-out" iterationCount={!this.props.complete ? "infinite" : 1}><ButtonBox onPress={this.openProfile} style={styles.bottomLeftButton} text='My Profile' icon='user-circle' iconSize={40}/></Animatable.View>
      <Animatable.View animation="flash" easing="ease-out" iterationCount={!this.props.complete ? "infinite" : 1}><ButtonBox onPress={this.openPreferences} style={styles.bottomRightButton} text='Preferences' icon='wrench' iconSize={40} /></Animatable.View>
      </View>
      </View>
      </ScrollView>
      )
  }
}

const mapStateToProps = (state) => {
  // Reactotron.log(state)
  return {
    complete: state.user.myProfile.complete.complete
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // getRequests: ()=>{dispatch(UserActions.requestsAttempt())},
    // getMatches: ()=>{dispatch(UserActions.matchesAttempt())},
    // getAllMessages: ()=>{
    //   dispatch(MessagesActions.messagesAttemptAll())
    // },
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AuthenticatedLaunchScreen )
