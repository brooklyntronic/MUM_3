import React, { Component } from 'react'
import Image from 'react-native-image-progress'
import { View, Text, ActivityIndicator, ScrollView, AsyncStorage, Animated, TextInput, TouchableOpacity } from 'react-native'
import { List, ListItem, SearchBar } from 'react-native-elements'
import { connect } from 'react-redux'
import PageHeader from '../Components/PageHeader'
import FullButton from '../Components/FullButton'
import RoundedButton from '../Components/RoundedButton'
import YouTube from 'react-native-youtube'
import UserActions from '../Redux/UserRedux'
import Swiper from 'react-native-swiper'
import Utilities from '../Services/Utilities'
import { VictoryBar, VictoryPie, VictoryTheme } from 'victory-native'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import MatchupActions from '../Redux/MatchupRedux'
import { filter, indexOf, invert, findKey, union, findIndex } from 'lodash'
// Styles
import styles from './Styles/MatchupScreenStyle'
import {Images} from '../Themes'
import Video from 'react-native-video'
// import Reactotron from 'reactotron-react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

class MatchupScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true, searchText: '', inviteList: []
    }
    this.goNext= this.goNext.bind(this)
    this.goPrev= this.goPrev.bind(this)
  }
  componentWillMount() {
    return this.getData()
  }
  filterNames(searchText, names) {
    let text = searchText.toLowerCase();
    return filter(names, (n) => {
      let name = n.name.toLowerCase();
      return name.search(text) !== -1;
    });
  }
  getData() {
    this.props.getMatchup(this.props.navigation.state.params.id)
  }
  vote (side){
    this.props.vote(side, this.props.matchup.prettyUrl)
  }
  alreadyVoted (matchup){
    if (!this.props.sideVotes){
      return false;
    }
    var sideVotes = this.props.sideVotes;
    var result = sideVotes.find(function(sv){
      return sv.matchup === matchup 
    });
    return result ? result.vote : false
  }
  goNext(){
    const matchList = this.props.listShown ==='public'? this.props.matchups : this.props.myMatchups
    const thisIndex = findIndex(matchList, {_id: this.props.matchup._id})
    this.props.navigation.navigate('MatchupScreen', {id: matchList[thisIndex + 1 < matchList.length ? thisIndex + 1 :  0].prettyUrl, fromList: this.props.listShown})
  }
  goPrev(){
    // Reactotron.log(this.props.listShown)
    const matchList = this.props.listShown ==='public'? this.props.matchups : this.props.myMatchups
    const thisIndex = findIndex(matchList, {_id: this.props.matchup._id})
    this.props.navigation.navigate('MatchupScreen', {id: matchList[thisIndex - 1 > -1 ? thisIndex - 1 : matchList.length - 1].prettyUrl, fromList: this.props.listShown})
  }
  viewStats() {
    this.setState(Object.assign({}, this.state, {viewStats: true, inviteMatches: false}))
  }
  inviteMatches() {
    this.setState(Object.assign({}, this.state, {viewStats: false, inviteMatches: true}))
  }
  invite(match) {
    this.setState(Object.assign({}, this.state, {inviteList: [...this.state.inviteList, match]}))
  }
  removeInvite(match) {
    let tempArray = [...this.state.inviteList.slice(0, this.state.inviteList.indexOf(match)),...this.state.inviteList.slice(this.state.inviteList.indexOf(match) + 1)
    ]
    this.setState(Object.assign({}, this.state, {inviteList: tempArray}))
  }
  staticContent () {
    return (
      this.props.matchup.sides.map((item)=> {
        if (item.mediaType === 'pic'){
          return (
            <View style={styles.centered}  key={item.side}>
            <Image source={{uri: 'https://d23grucy15vpbj.cloudfront.net/' + item.image}}  style={styles.fullImage}  />
            {this.props.matchup.matchupType === 'Poll' || this.props.matchup.myVote  ? null : <FullButton onPress={this.vote(item.side)}  text={'Vote '+ item.name} />}
            </View>
            )
        } if (item.mediaType === 'y'){
          return(
            <View key={item.side}>
            <View style={styles.centered}>
            <YouTube
            videoId={item.ytvideo}   
            play={false}             
            fullscreen={false}       
            loop={false} 
            style={styles.fullImage} 
            controls={true}
            />
            </View>
            {this.props.matchup.matchupType === 'Poll' || this.props.matchup.myVote ? null : (this.props.voteFetching ? <FullButton onPress={()=>this.vote(item.side)}  text={'Vote '+ item.name} /> : <View style={styles.padding}><ActivityIndicator/></View>)}
            </View>
            )
        } if(item.mediaType === 'vid'){
            return (<View  style={styles.centered}   key={item.side}>
                        <Text>Video</Text>
                        <Video source={{uri: `https://d2heqpumv6ps36.cloudfront.net/Converted/${item.mp4}`, mainVer: 1, patchVer: 0}} // Looks for .mp4 file (background.mp4) in the given expansion version.
                   rate={1.0}                   // 0 is paused, 1 is normal.
                   volume={1.0}                 // 0 is muted, 1 is normal.
                   muted={false}                // Mutes the audio entirely.
                   paused={false}
                   repeat={true}               // Pauses playback entirely.  // Callback when video cannot be loaded
                   style={styles.fullImage} />
                    </View>)
          }
      })
      )
  }
  contents () {
    if (!this.props.fetching){
      return (this.props.matchup.matchupType==='Poll' ? this.staticContent() : (
        <Swiper showsButtons={true} showsPagination={false} loop={false} height={-1}>
        {this.swiperSlides()}
        </Swiper>
        ))}
    }
    swiperSlides () {
      return this.props.matchup ? (
        this.props.matchup.sides.map((item)=>{

          if(item.mediaType === 'vid'){
           return ( <View key={item.side}>
                    <TouchableOpacity style={{position: 'absolute', top: '45%', left: '45%', zIndex:10}}><Icon name="play-circle" size={60} style={{color: 'white'}} onPress={()=>{this['player' + item.side].presentFullscreenPlayer()}}/></TouchableOpacity>
                       <Video source={{uri: `https://d2heqpumv6ps36.cloudfront.net/Converted/${item.mp4}`, mainVer: 1, patchVer: 0}} // Looks for .mp4 file (background.mp4) in the given expansion version.
                  rate={1.0}                   // 0 is paused, 1 is normal.
                  volume={1.0}                 // 0 is muted, 1 is normal.
                  muted={false}                // Mutes the audio entirely.
                  paused={true} 
                  repeat={true}    
                  ref={(ref) => {
                      this['player' + item.side] = ref
                  }}          
                  style={styles.fullImage} />
                  {!this.props.matchup.myVote && !this.props.voteFetching ? <View style={styles.padding}><FullButton onPress={()=>this.vote(item.side)}  text={'Vote '+ item.name} /></View> : this.props.matchup.myVote == item.side ? <View style={[styles.padding, styles.centered]}><Text style={styles.matchupHeading}>Voted for {this.props.matchup.sides[this.props.matchup.myVote - 1].name}</Text></View> :  <View style={[styles.padding, styles.centered]}><Text style={styles.matchupHeading}>{item.name}</Text></View>}
              {this.props.voteFetching? <View  style={styles.padding}><ActivityIndicator/></View>:null}
                   </View>)
          }
          if (item.mediaType === 'pic'){
            return (
              <View style={styles.centered}  key={item.side}>
              <Image source={{uri: 'https://d23grucy15vpbj.cloudfront.net/' + item.image}}  style={styles.fullImage}  />
              {!this.props.matchup.myVote && !this.props.voteFetching ? <View style={styles.padding}><FullButton onPress={()=>this.vote(item.side)}  text={'Vote '+ item.name} /></View> : this.props.matchup.myVote == item.side ? <View style={[styles.padding, styles.centered]}><Text style={styles.matchupHeading}>Voted for {this.props.matchup.sides[this.props.matchup.myVote - 1].name}</Text></View> :  <View style={[styles.padding, styles.centered]}><Text style={styles.matchupHeading}>{item.name}</Text></View>}
              {this.props.voteFetching? <View  style={styles.padding}><ActivityIndicator/></View>:null}
              </View>
              )
          } if (item.mediaType === 'y'){
            return(
              <View  style={styles.centered}   key={item.side}>
              <View>
              <YouTube
              videoId={item.ytvideo}   
              play={false}             
              fullscreen={false}       
              loop={false} 
              style={styles.fullImage} 
              />
              </View>
              {!this.props.matchup.myVote && !this.props.voteFetching ? <View style={styles.padding}><FullButton onPress={()=>this.vote(item.side)}  text={'Vote '+ item.name} /></View> : this.props.matchup.myVote == item.side ? <View style={[styles.padding, styles.centered]}><Text style={styles.matchupHeading}>Voted for {this.props.matchup.sides[this.props.matchup.myVote - 1].name}</Text></View> :  <View style={[styles.padding, styles.centered]}><Text style={styles.matchupHeading}>{item.name}</Text></View>}
              {this.props.voteFetching? <View  style={styles.padding}><ActivityIndicator/></View>:null}
              </View>
              )
          } 
        }) 
        ) : null
    }
    choices() {
      if (!this.props.fetching){
        return (this.props.matchup.matchupType==='Poll' ? this.props.matchup.sides[0].choices.map((side)=> {
          if (!this.props.matchup.myVote){
            return <FullButton text={side.name} onPress={()=>this.vote(this.props.matchup.sides[0].choices.indexOf(side) + 1)} key={this.props.matchup.sides[0].choices.indexOf(side)}/>
          }
          return <Text key={this.props.matchup.sides[0].choices.indexOf(side)} style={this.props.matchup.myVote == this.props.matchup.sides[0].choices.indexOf(side) + 1 ? styles.redHeading: styles.matchupHeading}>{side.name}</Text>
        }) : null)
      }
    }
    sendInvite (list) {
      this.props.inviteToMatchup(list, this.props.matchup.prettyUrl, global.chatSocket, this.props.myId)
      this.setState(Object.assign({}, this.state, {inviteList: []}))
    }
    // this.props.inviteToMatchup(this.state.inviteList, this.props.matchup.prettyUrl)
    render () {
      if (this.props.fetching || !this.props.matchup) {
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
        <View style={styles.container}>
        <View style={{flexDirection: 'row', justifyContent:'space-between', padding: 15}}><TouchableOpacity onPress={this.goPrev}><Text style={styles.link}>Prev</Text></TouchableOpacity><TouchableOpacity onPress={this.goNext}><Text style={styles.link}>Next</Text></TouchableOpacity></View>
        <View style={styles.mainContainer}>
        <Text style={styles.heading}>{this.props.matchup.title}</Text>
        {this.contents()}
        {this.props.matchup.matchupType === 'Poll'  && !this.props.matchup.myVote  ? <View style={styles.centered}><Text style={styles.voteNow}>VOTE NOW</Text></View> : null}
        {this.choices()}
        </View>
        <View style={styles.formContainer}>
        {
          this.props.matchup.myVote || (this.props.matchup.user === this.props.myId) ?
          <View>

         {this.props.inviteList[this.props.matchup.prettyUrl] && this.props.inviteList[this.props.matchup.prettyUrl].length > 0 ? 
          <View>
          <Text style={styles.heading}>Invited</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                     {this.props.inviteList[this.props.matchup.prettyUrl].map((invited)=>{
                         const tempList = this.props.inviteList[this.props.matchup.prettyUrl] || []
                         return findIndex(tempList, {_id: invited._id}) > -1 ?
                         (<TouchableOpacity key={invited._id} style={{backgroundColor: 'gray', padding: 5, marginVertical: 5, marginRight: 5}}><Text>{invited.name}</Text></TouchableOpacity>) : false
                         })
                       }
                   </View></View> : null}

          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <FullButton text='View Stats' onPress={()=>{this.viewStats()}}/>
          {this.props.matchup.isPublic || this.props.matchup.user === this.props.myId ? <FullButton text='Invite Matches to Vote' onPress={()=>{this.inviteMatches()}}/> : null}</View>
          {this.state.viewStats ? <View style={styles.centered}><VictoryPie
            theme={VictoryTheme.material}
            style={{
              labels: {
                fill: "black"
              }
            }}
            data={this.props.matchup.sides.filter((side)=>side.votePercentage > 0).map((side)=>{
              if (side.votePercentage > 0){
                return {x: side.name, y:side.votePercentage}
              }
            })}
            /></View>:null}
            {this.state.inviteMatches ? <View>
              <SearchBar placeholder='Invite Match' onChangeText={(text) => {this.setState({searchText: text})}} value={this.state.searchText}/>
        
              
              <View style={{flexDirection: 'row', paddingHorizontal: -5, flexWrap: 'wrap'}}>
              {this.state.inviteList.map((invited)=>{
                const tempList = this.props.inviteList[this.props.matchup.prettyUrl] || []
                return findIndex(tempList, {_id: invited._id}) < 0 ?
                (<TouchableOpacity key={invited._id} style={{backgroundColor: 'gray', padding: 5, margin: 5}} onPress={()=>this.removeInvite(invited)}><Text>{invited.name} x</Text></TouchableOpacity>) : false
                }) 
              }
              </View>
              <List style={{borderWidth: 0}}>
              {this.filterNames(this.state.searchText, this.props.matches).map((result, i)=>{
                const tempList = this.state.inviteList || []
                
                return findIndex(tempList.concat(this.props.inviteList[this.props.matchup.prettyUrl]), {_id: result._id}) < 0 ? (<ListItem style={{borderBottomWidth: 0, paddingVertical: 10}} onPress={()=>{this.invite(result)}} key={i} avatar={{uri: Utilities.getAvatar(result)}} title={result.name}/>) : false
              })}
              </List>
              {this.state.inviteList.length > 0 ? <FullButton text='Send Invite to Selected' onPress={()=>{this.sendInvite(this.state.inviteList)}}/>: null}
              </View> : null}


              </View>:null
            }

            </View>
            </View>
            </ScrollView>
            )
    }
  }

  const mapStateToProps = (state) => {
    // Reactotron.log(state.matchups.matchup)
    return {
      myId: state.user.user._id,
      matchup: state.matchups.matchup,
      fetching: state.matchups.matchupFetching,
      voteFetching: state.matchups.voteFetching,
      matchups: state.matchups.matchupList,
      myMatchups: state.matchups.myMatchupList,
      listShown: state.matchups.listShown,
      sideVotes: state.matchups.sideVotes,
      matches: state.user.matchesList,
      inviteList: state.user.matchInviteList || []
    }
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      vote: (vote, matchupId)=>{dispatch(MatchupActions.voteAttempt(vote, matchupId))},
      getMatchup: (matchupId)=>{dispatch(MatchupActions.getMatchupAttempt(matchupId))},
      inviteToMatchup: (list, matchup, socket, myId)=>{dispatch(UserActions.inviteToMatchupAttempt(list, matchup, socket, myId))}
    }
  }

  export default connect(mapStateToProps, mapDispatchToProps)(MatchupScreen)
