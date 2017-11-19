import React, { Component } from 'react'
import { ActivityIndicator, View, Text, Dimensions, TouchableOpacity, ScrollView, ImageBackground} from 'react-native'
import Image from 'react-native-image-progress'
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux'
import {Images, Colors} from '../Themes'
import Addicon from '../Components/Addicon'
import {SearchBar, List, ListItem} from 'react-native-elements'
import PageHeader from '../Components/PageHeader'
import FullButton from '../Components/FullButton'
import RoundedButton from '../Components/RoundedButton'
import Icon from 'react-native-vector-icons/FontAwesome'
import debounce from 'debounce'
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
      index: this.props.navigation.state.params? this.props.navigation.state.params.index : 0, searchText: '', searching: false
    }
    this.debounceSearch = debounce(this.props.searchMatchups, 3000)
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
  searchMatchups(text){
    this.setState(Object.assign({}, this.state, {searchText: text, searching: true}), ()=>{
      this.debounceSearch(text, this.props.listShown);
    })
  }
  openMatchupScreen (matchid, vote, index, matchup){
    const voteParam = vote ? {vote: vote} : null
    this.props.openMatchup(matchup)
    this.props.navigation.navigate('MatchupScreen', {id: matchid, voteParam, fromList: this.props.listShown, index: index})
  }
  componentWillReceiveProps(nextProps){
    if(this.props.searchFetching){
      this.setState({searching: false})
    }
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
      {<SearchBar
        clearIcon
        onClearText={()=>{this.setState(Object.assign({}, this.state, {searchText: ''}), ()=>{this.props.clearSearch()})}}
        containerStyle = {styles.searchBar}
        round
        lightTheme
        onChangeText={(text)=>{this.searchMatchups(text)}}
        onClearText={()=>{this.setState(Object.assign({}, this.state, {searchText: ''}))}}
        placeholder='Search Matchups...' />
    }
  <Addicon onPress={()=>this.props.navigation.navigate('MatchupCreateScreen')}/>
        {this.props.searchFetching || this.state.searching  ? (<View style={styles.centered}><ActivityIndicator/></View>) : null}
        {this.state.searchText && this.props.searchResults && !this.props.searchFetching && !this.state.searching ? (<View><View style={styles.centered}><Text style={styles.heading}>Search Results</Text></View>
              {this.props.searching?<ActivityIndicator/>:null}
              <List containerStyle={{borderTopWidth: 0}}>{this.props.searchResults.map((matchup, i)=>{
                return (<ListItem
                  key={matchup._id}
                  onPress={()=>this.openMatchupScreen(matchup.prettyUrl, this.alreadyVoted(matchup._id), listShown.indexOf(matchup), matchup)}
                  avatar={{ uri:'https://d23grucy15vpbj.cloudfront.net/merged/' + matchup.mergedImage }}
                  roundAvatar
                  avatarStyle={{height: 70, width: 70, borderRadius: 35}}
                  avatarContainerStyle={{width: 70}}
                  subtitle={`${matchup.category || 'Uncategorized'}`}
                  titleStyle={styles.link}
                  title={matchup.title}
                  hideChevron
                  containerStyle={{borderBottomWidth: 0, marginVertical: 10}}
                  />)})}</List></View>):null}
      <View style = {styles.mainContainer}>

      <View style={styles.sliderWrapper}>
      {listShown.length > 0 ?<Swiper showsButtons={true} showsPagination={false} ref={component => this.swiper = component}>
            {listShown.map((matchup, i)=>{
              return( 
                <TouchableOpacity key={matchup._id} onPress={()=>this.openMatchupScreen(matchup.prettyUrl, this.alreadyVoted(matchup._id), listShown.indexOf(matchup), matchup)} style={styles.centered} >
                <Text style={styles.heading}>{matchup.title.toUpperCase()}</Text>
                <FastImage  style={styles.overlayImage}   source={{uri:'https://d23grucy15vpbj.cloudfront.net/merged/' + matchup.mergedImage}}>
                {this.alreadyVoted(matchup._id) ? <View style={styles.overlay}><Text style={styles.overlayText}>Already Voted {matchup.sides[this.alreadyVoted(matchup._id) - 1].name}</Text></View> : null}
                </FastImage>
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
    searchResults: state.matchups.searchResults,
    searchFetching: state.matchups.searchFetching
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
    },
    searchMatchups: (searchTerm, myList) =>{
      dispatch(MatchupActions.searchMatchupAttempt(searchTerm, myList))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(MatchupListScreen)
