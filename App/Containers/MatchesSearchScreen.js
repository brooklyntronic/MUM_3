import React, { Component } from 'react'
import { ActivityIndicator, View, ScrollView, Text, ListView, Dimensions, TouchableOpacity, AsyncStorage } from 'react-native'
import { Rating } from 'react-native-elements'
import Image from 'react-native-image-progress'
import { connect } from 'react-redux'
import {Images} from '../Themes'
import BackArrow from '../Components/BackArrow'
import PageHeader from '../Components/PageHeader'
import SearchBar from '../Components/SearchBar'
import Icon from 'react-native-vector-icons/FontAwesome'
import Utilities from '../Services/Utilities'
// Styles
import styles from './Styles/MatchesSearchScreenStyle'
import * as Animatable from 'react-native-animatable'
import Swiper from 'react-native-swiper'
import UserActions from '../Redux/UserRedux'
// import Reactotron from 'reactotron-react-native'
class MatchesSearchScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true, matchups: [], sideVotes: [], requested: []
    }
  }
  // componentDidMount() {
  //   // this.props.getMatchesByPreference()
  //   // this.props.getMatchesByVote()
  // }
  openMatchScreen(matchid){
    this.props.navigation.navigate('ProfileScreen', {id: matchid})
  }
  addFriend (friend) {
    this.props.sendRequest(friend, this.props.myId)
  }
    render() {
      if (this.props.fetching) {
        return (
          <View style={styles.mainContainer}>
          <View style={styles.content}>
          <ActivityIndicator />
          </View>
          </View>
          );
      }
  //
  return (
    <ScrollView  contentContainerStyle={styles.mainScroll}>
    <View  style={styles.container}>
    <View style = {styles.mainContainer}>
    {this.props.prefUsers.length > 0 ?
      (<View>
        <View style={styles.centered}>
        <Text style={[styles.heading]}>By Preferences</Text>
        </View>
       <View style={styles.sliderWrapper}>
       <Swiper showsButtons={true} showsPagination={false}>
       {this.props.prefUsers.length > 0 && this.props.prefUsers.map((user, i)=>{
         return( <View  key={user._id}>
           <TouchableOpacity onPress={()=>this.openMatchScreen(user._id)}>
           <View style={styles.centered}>
           <Image style={styles.image} source={{uri:Utilities.getAvatar(user)}}>
           <View style={styles.overlay}>
           <Text style={styles.paragraph}>{user.name}</Text>
           <Text style={styles.paragraph}>{user.location.split(',')[0]}</Text>
           </View>
           </Image>
           </View>
           </TouchableOpacity>
           </View>
           )
       })}
       </Swiper>
       </View></View>) : 
      (<View style={styles.centered}><Text style={styles.heading}>No matches for you.</Text><TouchableOpacity onPress={()=>{this.props.navigation.navigate('PreferencesScreen')}}><Text style={styles.link}>Adjust your preferences.</Text></TouchableOpacity></View>)
    }
    {this.props.matchUsers.length > 0 ? (
      <View  style = {styles.mainContainer}>
      <Text style={styles.heading}>By Matchup Voting</Text>
      <View style={styles.sliderWrapper}>
      <Swiper showsButtons={true} showsPagination={false}>
      {this.props.matchUsers.map((user, i)=>{
        return( <View  key={user._id}><TouchableOpacity onPress={()=>this.openMatchScreen(user._id)}>
          {user.matchedAnswers ? <Rating

            type='heart'
            ratingCount={10}
            fractions={2}
            startingValue={user.matchedAnswers}
            imageSize={20}
            onFinishRating={this.ratingCompleted}
            ratingBackgroundColor='transparent'
            style={{alignItems: 'center'}}
          />:null}
          <View style={styles.centered}>
          <Image style={styles.image} source={{uri:Utilities.getAvatar(user)}}>
          <View style={styles.overlay}>
          <Text style={styles.paragraph}>{user.name}</Text>
          <Text style={styles.paragraph}>{user.location.split(',')[0]}</Text>
          </View>
          </Image>
          </View>
          </TouchableOpacity>

          </View>
          )
      })}
      </Swiper>
      </View></View>) : 
      (<View style={styles.centered}><Text style={styles.heading}>You Need More Votes for More Matches</Text></View>)}
    </View>
    </View>
    </ScrollView>
    );
}
}

const mapStateToProps = (state) => {
  // Reactotron.log(state)
  return {
    fetching: state.user.searchMatchesPreferencesFetching || state.user.searchMatchesVotesFetching,
    matchesByVote: state.user.searchMatchesVotes,
    matchesByPreference: state.user.searchMatchesPreferences,
    prefUsers: state.user.searchMatchesPreferences,
    matchUsers: state.user.searchMatchesVotes,
    matches: state.user.matchesList,
    requestsSent: state.user.requestsSentList || [],
    requestFetching: state.user.friendRequestFetching,
    myId: state.user.user._id
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMatchesByPreference: ()=>dispatch(UserActions.searchMatchesPreferenceAttempt()),
    getMatchesByVote: ()=>dispatch(UserActions.searchMatchesVoteAttempt()),
    sendRequest: (userId, myId) => {dispatch(UserActions.sendFriendRequestListAttempt(userId, myId))}
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(MatchesSearchScreen)
