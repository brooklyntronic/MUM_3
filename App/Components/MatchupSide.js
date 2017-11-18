import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { ScrollView, Text, View, Image, TextInput, Switch, Picker, Flatlist, ActivityIndicator, AsyncStorage} from 'react-native'
import { List, ListItem } from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker'
import RoundedButton from './RoundedButton'
import FullButton from './FullButton'
import styles from './Styles/MatchupSideStyle'
import YouTube from 'react-native-youtube'
// import Reactotron from 'reactotron-react-native'
import Video from 'react-native-video'
import uuid from 'react-native-uuid'
// import Api from '../Services/Api'
// const api = Api.create()
export default class MatchupSide extends Component {
  // // Prop type warnings
  static propTypes = {
    side: PropTypes.number,
    userId: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {
      mediaType: 'pic'
    }
  }

  getData () {
    if(!this.state.name || (!this.state.videoUrl && !this.state.imageUrl && !this.state.ytvideo)){
      return false
    }
    const sideId = uuid.v4()
    let stateCopy = Object.assign({}, this.state);
    const fileName = this.props.userId + Date.now() + sideId + this.state.name.split(/(?!\.)\W/gm).join('-')
    if (this.state.mediaType === 'pic'){
      stateCopy.image = fileName
    }
    if (this.state.mediaType === 'vid'){
      stateCopy.video = fileName
    }

    return stateCopy;
  }
  getImage(){
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      includeBase64: true
    }).then((result)=>{
      this.setState(Object.assign({}, this.state,{imageSelected: true, imageUrl: result.path, mime: result.mime, youtubeSelected: false, videoSelected: false,  ytvideo: '', data: result.data}))
    }).catch((err)=>console.log(err))
  }
  getVideo(){
    ImagePicker.openPicker({
      mediaType: 'video',
      includeBase64: true,
    }).then((result)=>{
      // Reactotron.log(result)
      this.setState(Object.assign({}, this.state, {imageSelected: false, videoUrl: result.path, mime: result.mime, youtubeSelected: false, videoSelected: true,  ytvideo: '', data: result.data}))
    }).catch((err)=>console.log(err))
  }
  getYoutube (result) {
    this.setState(Object.assign({}, this.state, {youtubeSelected: true, youtubeResults: '', ytvideo: result.id.videoId, imageSelected: false, videoSelected: false, imageUrl: '', image: ''}))
  }
  chooseOtherPhoto () {
    this.setState(Object.assign({}, this.state,  {imageSelected: false, imageUrl: ''}))
  }

  chooseOtherVideo () {
    this.setState(Object.assign({}, this.state,  {videoSelected: false, videoUrl: ''}))
  }

  chooseOtherYoutube () {
    this.setState(Object.assign({}, this.state,  {youtubeSelected: false, ytvideo: ''}))
  }
  
  getYoutubeResults(searchTerm, side) {
    this.setState(Object.assign({}, this.state, {ytResultsLoading: true, youtubeResults: []}), fetch('https://www.googleapis.com/youtube/v3/search?&key=AIzaSyBit7fGezaGwPyaeH25wMS1IQ-SXlpou1o&part=snippet&maxResults=50&q='+ searchTerm+'&videoEmbeddable=true&type=video').then((resp)=>resp.json()).then((respJSON)=>{
      respJSON.items.length = 10
      this.setState(Object.assign({}, this.state,{youtubeResults:respJSON.items, ytResultsLoading: false}))
    }).catch((err)=>{console.log(err)}).done())
    
  }
  render () {
    return (
      <View>
      <Text style={styles.heading}>Side {this.props.side}</Text>
      <TextInput style={styles.matchupTextInput} placeholder='Media Title' onChangeText={(text) => this.setState(Object.assign({}, this.state, {name: text, youtubeSearch: text}))} value={this.state.name}/>
      <Text style={styles.link}>Media Type</Text>
      {!this.state.videoSelected && !this.state.youtubeSelected ? <Picker style={styles.matchupPicker}
      selectedValue ={this.state.mediaType}
      onValueChange={(itemValue, itemIndex) => this.setState(Object.assign({}, this.state, {mediaType: itemValue}))}
      >
      <Picker.Item label='Photo' value='pic'/>
      <Picker.Item label='Video' value='vid'/>
      <Picker.Item label='Youtube' value='y'/>

      </Picker> : null}

      {this.state.mediaType ==='y' && !this.state.youtubeSelected ? (<View>
        <TextInput style={styles.matchupTextInput} placeholder='Search Youtube' onChangeText={(text) => this.setState(Object.assign({}, this.state, {youtubeSearch: text}))} value={this.state.youtubeSearch}/>
        <FullButton onPress={()=>{this.getYoutubeResults(this.state.youtubeSearch)}} text='Search'/>
        <Text>*Please note that youtube prohibits some of its content from being embedded.  Please click play to ensure that the video is playable on this app.</Text>
        {this.state.ytResultsLoading ? (<View><ActivityIndicator/></View>) :
          (<List>
            {this.state.youtubeResults && this.state.youtubeResults.length > 0 ? this.state.youtubeResults.map((result, i)=>{
              return( <ListItem onPress={()=>{this.getYoutube(result)}} key={i} avatar={{uri: result.snippet.thumbnails.default.url}} title={result.snippet.title}/>)
            }) : null}
            </List>)}</View>): null}
      {this.state.mediaType === 'y' && this.state.youtubeSelected ?  <View style={styles.centered}>
          <YouTube
          videoId={this.state.ytvideo}   
          play={false}             
          fullscreen={false}       
          loop={false} 
          style={styles.fullImage} 
          />
          <RoundedButton onPress={()=>{this.chooseOtherYoutube()}} text='Choose Another'/>
          </View> : null}
      {this.state.mediaType ==='pic' && !this.state.imageSelected ? <FullButton text='Get Photo' onPress={()=>{this.getImage()}} />  : null}
      {this.state.mediaType ==='pic' && this.state.imageSelected ? <View style={styles.centered}><Image source={{uri: this.state.imageUrl}} style={styles.fullImage}/>
      <RoundedButton onPress={()=>{this.chooseOtherPhoto()}} text='Choose Another'/>
      </View> : null}
      {this.state.mediaType ==='vid' && !this.state.videoSelected ? <FullButton text='Get Video' onPress={()=>{this.getVideo()}} />  : null}
      {this.state.mediaType ==='vid' && this.state.videoSelected ? <View style={styles.centered}>
      <Video source={{uri: this.state.videoUrl, mainVer: 1, patchVer: 0}} // Looks for .mp4 file (background.mp4) in the given expansion version.
       rate={1.0}                   // 0 is paused, 1 is normal.
       volume={1.0}                 // 0 is muted, 1 is normal.
       muted={false}                // Mutes the audio entirely.
       paused={false}               // Pauses playback entirely.  // Callback when video cannot be loaded
       style={styles.fullImage} />
      <RoundedButton onPress={()=>{this.chooseOtherVideo()}} text='Choose Another'/>
      </View> : null}
      </View>
      )
  }
}
