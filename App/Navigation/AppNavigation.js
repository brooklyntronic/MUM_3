import { StackNavigator } from 'react-navigation'
import NewPreferencesScreen from '../Containers/NewPreferencesScreen'
import NewUserScreen from '../Containers/NewUserScreen'
import React from 'react'
import {AsyncStorage} from 'react-native'
import NewVideoChatContainer from '../Containers/NewVideoChatContainer'
import PhoneCallScreen from '../Containers/PhoneCallScreen'
import MapPreferenceScreen from '../Containers/MapPreferenceScreen'
import MatchupCreateScreen from '../Containers/MatchupCreateScreen'
import MyProfileScreen from '../Containers/MyProfileScreen'
import PreferenceScreen from '../Containers/PreferenceScreen'
import MessageScreen from '../Containers/MessageScreen'
import MessagesScreen from '../Containers/MessagesScreen'
import PreferencesScreen from '../Containers/PreferencesScreen'
import MatchesSearchScreen from '../Containers/MatchesSearchScreen'
import AuthenticatedLaunchScreen from '../Containers/AuthenticatedLaunchScreen'
import MatchupScreen from '../Containers/MatchupScreen'
import MatchesScreen from '../Containers/MatchesScreen'
import ProfileScreen from '../Containers/ProfileScreen'
import SignInScreen from '../Containers/SignInScreen'
import MatchupListScreen from '../Containers/MatchupListScreen'
import CustomNavbar from '../Components/CustomNavbar'
import styles from './Styles/NavigationStyles'
import Utilities from '../Services/Utilities'
import firebase from 'react-native-firebase'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  NewPreferencesScreen: { screen: NewPreferencesScreen, navigationOptions: {
    header: null,
  } },
  NewUserScreen: { screen: NewUserScreen , 
    navigationOptions: {
      header: null,
    }},
    NewVideoChatContainer: { screen: NewVideoChatContainer, navigationOptions: {
      header: null,
    } },
    PhoneCallScreen: { screen: PhoneCallScreen , 
      navigationOptions: {
        header: null,
      }
    },
    MapPreferenceScreen: { screen: MapPreferenceScreen },
    MatchupCreateScreen: { screen: MatchupCreateScreen },
    MyProfileScreen: { screen: MyProfileScreen },
    PreferenceScreen: { screen: PreferenceScreen },
    MessageScreen: { screen: MessageScreen },
    MessagesScreen: { screen: MessagesScreen },
    PreferencesScreen: { screen: PreferencesScreen },
    MatchesSearchScreen: { screen: MatchesSearchScreen },
    AuthenticatedLaunchScreen: { screen: AuthenticatedLaunchScreen },
    MatchupScreen: { screen: MatchupScreen },
    MatchesScreen: { screen: MatchesScreen },
    ProfileScreen: { screen: ProfileScreen },
    SignInScreen: { screen: SignInScreen,navigationOptions: {
      header: null,
    } },
    MatchupListScreen: { screen: MatchupListScreen },
  }, {
    headerMode: 'float',
    initialRouteName: 'SignInScreen',
    navigationOptions: {
      header: (props)=>{
        return(
          <CustomNavbar
          answerCall={(data)=>{props.navigation.navigate('PhoneCallScreen', {id: data.caller})}}
          searchNavigate={()=>{props.navigation.navigate('MatchesSearchScreen')}}
          messagesNavigate={()=>{props.navigation.navigate('MessagesScreen')}}
          matchesNavigate={()=>{props.navigation.navigate('MatchesScreen')}}
          matchupsNavigate={()=>{props.navigation.navigate('MatchupListScreen')}}
          profileNavigate={()=>{props.navigation.navigate('MyProfileScreen')}}
          preferencesNavigate={()=>{props.navigation.navigate('PreferencesScreen')}}
          homeNavigate={()=>{props.navigation.navigate('AuthenticatedLaunchScreen')}}
          logout={
            ()=>{
              AsyncStorage.getAllKeys().then((keys)=>{
                AsyncStorage.multiRemove(keys)
              }).
              then(()=>

                fetch(Utilities.baseUrl + 'signout')
                ).
              then((resp)=> {
                firebase.auth().signOut().then(function() {
                  props.navigation.navigate('SignInScreen')
                }).catch(function(error) {
                }) 
              }).
              catch((err)=>{console.log(err)})  
            }
          }
          hangCall={()=>{props.navigation.goBack(null)}}
          />
          )
      }

    }
  })
export default PrimaryNav
