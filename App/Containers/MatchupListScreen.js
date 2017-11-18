import React, { Component } from 'react'
import { ActivityIndicator, View, Text, Dimensions, TouchableOpacity, ScrollView, ImageBackground} from 'react-native'
import Image from 'react-native-image-progress'
import { connect } from 'react-redux'
import {Images, Colors} from '../Themes'
import Addicon from '../Components/Addicon'
import SearchBar from '../Components/SearchBar'
import PageHeader from '../Components/PageHeader'
import FullButton from '../Components/FullButton'
import RoundedButton from '../Components/RoundedButton'
import Icon from 'react-native-vector-icons/FontAwesome'
// Styles
import styles from './Styles/MatchupListScreenStyle'
import Swiper from 'react-native-swiper'
import Utilities from '../Services/Utilities'
import Api from '../Services/Api'
import MatchupActions from '../Redux/MatchupRedux'
// import Reactotron from 'reactotron-react-native'
class MatchupListScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      index: this.props.navigation.state.params? this.props.navigation.state.params.index : 0
    }
  }
  alreadyVoted (matchup){
    // if (!this.props.sideVotes){
    //   return false;
    // }
    var sideVotes = this.props.sideVotes;
    var result = sideVotes.find(function(sv){
      return sv.matchup === matchup 
    });
    return result ? result.vote : false
  }
  componentDidMount() {
    if(!this.props.loaded){
        this.props.getList()
        // this.props.getMyList()
      }
  }
  openMatchupScreen (matchid, vote, index, matchup){
    const voteParam = vote ? {vote: vote} : null
    this.props.openMatchup(matchup)
    this.props.navigation.navigate('MatchupScreen', {id: matchid, voteParam, fromList: this.props.listShown, index: index})
  }
  toggleMatchups (val) {
    this.props.toggleMatchups(val)
  }
  swipe(targetIndex) {
      const currentIndex = this.props.index || 0;
      const offset = targetIndex- currentIndex;
      this.swiper.scrollBy(offset);
  }
  render() {
    let listShown = this.props[this.props.listShown]
    if (this.props.isLoading) {
      return (
        <View style={styles.mainContainer}>
        <View style={styles.content}>
        <ActivityIndicator />
        </View>
        </View>
        );
    }
    return (
      <ScrollView style={styles.mainScroll}>
      <Addicon onPress={()=>this.props.navigation.navigate('MatchupCreateScreen')}/>
      <View style = {styles.mainContainer}>
      <View style={styles.sliderWrapper}>
      {listShown.length > 0 ?<Swiper showsButtons={true} showsPagination={false} ref={component => this.swiper = component}>
            {listShown.map((matchup, i)=>{
              return( 
                <TouchableOpacity key={matchup._id} onPress={()=>this.openMatchupScreen(matchup.prettyUrl, this.alreadyVoted(matchup._id), listShown.indexOf(matchup), matchup)} style={styles.centered} >
                <Text style={styles.heading}>{matchup.title.toUpperCase()}</Text>
                <Image  style={styles.overlayImage}   source={{uri:'https://d23grucy15vpbj.cloudfront.net/merged/' + matchup.mergedImage}}>
                {this.alreadyVoted(matchup._id) ? <View style={styles.overlay}><Text style={styles.overlayText}>Already Voted {matchup.sides[this.alreadyVoted(matchup._id) - 1].name}</Text></View> : null}
                </Image>
                </TouchableOpacity>
                )
              })
            }
          </Swiper>:null}
    </View>

    </View>
    <View style={styles.formContainer}>
    {this.props.listShown !== 'myMatchupList' ? <FullButton text='Go To My Matchups' onPress={()=>{this.toggleMatchups('myMatchupList')}}/> : null}
    {this.props.listShown !== 'matchupList' ?<FullButton text='Go To Public Matchups' onPress={()=>{this.toggleMatchups('matchupList')}}/> : null}
    {this.props.listShown !== 'invitedList' && this.props.invitedList.length > 0 ? <RoundedButton text={`Invited Matchups ${this.props.invitedList.length}`} onPress={()=>{this.toggleMatchups('invitedList')}}/> : null}
    </View>
    </ScrollView>

    );
  }
}

const mapStateToProps = (state) => {
  return {
    sideVotes: state.matchups.sideVotes,
    matchupList: state.matchups.matchupList, 
    isLoading: state.matchups.fetching,
    myMatchupList: state.matchups.myMatchupList,
    invitedList: state.matchups.invitedList,
    listShown: state.matchups.listShown,
    publicMatchups: state.matchups.publicMatchups,
    index: state.matchups.index,
    loaded: state.matchups.matchupsLoaded && state.matchups.myMatchupsLoaded,
    // isPublic: state.matchups.listShown ==='public'? true: false
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getList: ()=>{
      dispatch(MatchupActions.listAttempt())
    },
    toggleMatchups: (val)=>{
      dispatch({type: 'SWITCH_LISTS', listShown: val})
    },
    getMyList: ()=>{
      dispatch(MatchupActions.myListAttempt())
    },
    openMatchup: (matchup)=>{
      dispatch(MatchupActions.openMatchup(matchup))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(MatchupListScreen)
