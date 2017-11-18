import React, { Component } from 'react'
import { ActivityIndicator, View, Text,Dimensions, TouchableOpacity, AsyncStorage, ScrollView } from 'react-native'
import { List, ListItem } from 'react-native-elements'
import Image from 'react-native-image-progress'
import { connect } from 'react-redux'
import {Images} from '../Themes'
import PageHeader from '../Components/PageHeader'
import Icon from 'react-native-vector-icons/FontAwesome'
import Utilities from '../Services/Utilities'
import UserActions from '../Redux/UserRedux'
// import Reactotron from 'reactotron-react-native'
// Styles
import styles from './Styles/MatchesScreenStyle'
class MatchesScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true, matchups: [], sideVotes: []
    }
  }
  renderMatches (type) {
    
    if (this.props[type] && this.props[type].length > 0)  {
      return (
        <View>
        <View style={styles.centered}>
        <Text style={styles.heading}>{type==='matches'? 'Matches':'Requests'}</Text>
        </View>
        <List containerStyle={{borderTopWidth: 0}}>
        {this.props[type].map((user, i)=>{
          // Reactotron.log(user)
          return( 
            <ListItem
            key={user._id}
            onPress={()=>{this.openMatchScreen(user._id, type==='matches' ? 'match': 'request')}}
            avatar={{ uri: Utilities.getAvatar(user) }}
            roundAvatar
            avatarStyle={{height: 70, width: 70, borderRadius: 35}}
            avatarContainerStyle={{width: 70}}
            subtitle={`${user.location ? user.location.split(',')[0]: '- '}`}
            titleStyle={styles.link}
            title={user.name}
            hideChevron
            containerStyle={{borderBottomWidth: 0, marginVertical: 10}}
            />
            )
        })}
        </List>
        </View>)
    }
  }

    openMatchScreen (matchid, friend){
      this.props.navigation.navigate('ProfileScreen', {id: matchid, friend: friend})
    }
    render() {
      var self = this
      const { width, height } = Dimensions.get('window');
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
    <ScrollView contentContainerStyle={styles.mainScroll}>
    <View style={styles.container}>
    {this.renderMatches('requests') }
    {this.renderMatches('matches')}
    </View>
    </ScrollView>
    );
}
}

const mapStateToProps = (state) => {
  return {
    fetching: state.user.matchesFetching,
    matches: state.user.matchesList,
    requests: state.user.requestsReceivedList,
    loaded: state.user.matchesLoaded
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMatches: () => {
      dispatch(UserActions.matchesAttempt())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(MatchesScreen)
