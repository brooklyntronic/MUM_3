import React, { Component } from 'react'
import { ScrollView, Text, AsyncStorage, View, ActivityIndicator, Picker, TouchableOpacity, FlatList, Animated, TextInput} from 'react-native'
import { connect } from 'react-redux'
import {Images} from '../Themes/'
import FullButton from '../Components/FullButton'
import RadioButton from '../Components/RadioButton'
import SocketChat from '../Components/SocketChat'
import { List, ListItem } from 'react-native-elements'
import Swiper from 'react-native-swiper'
import Image from 'react-native-image-progress'
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-crop-picker'
import Utilities from '../Services/Utilities'
import { RNS3 } from 'react-native-aws3'
import Icon from 'react-native-vector-icons/FontAwesome'
import UserActions from '../Redux/UserRedux'
// import Reactotron from 'reactotron-react-native'
import { Button, FormInput, FormLabel } from 'react-native-elements'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import * as Animatable from 'react-native-animatable'
// Styles
import styles from './Styles/PreferencesScreenStyle'


class MyProfileScreen extends Component {
  constructor (props) {
    super(props)
    let tempArray = []
    for (var i in this.props.profile.writtenAttributes){
      tempArray.push(this.props.profile.writtenAttributes[i])
    }
    let tempPhotos = [...this.props.profile.photos]
    this.state = {preferences: null, fetching: true, editSwitch: false, index: 0, writtenAttributes: tempArray, editOpen: {}, pickerOpen: {}, picAttributes: this.props.profile.attributes, sex: this.props.profile.sex.value || null, noAvatar : this.props.profile.sex.value === 'female' ? 'https://d23grucy15vpbj.cloudfront.net/webImg/icons/user-female-icon.png' : 'https://d23grucy15vpbj.cloudfront.net/webImg/icons/user-male-icon.png', userId: this.props.me._id, photoSlides: this.makePhotos(tempPhotos), avatar: Utilities.getAvatar(this.props.me)}
  }

  showEdit(index){
    // this.props.navigation.navigate('PreferenceScreen', {property, fromProfile: 'yes', isText: isText || false})
    let editOpen = {}
    editOpen[index] = true
    this.setState({editOpen: editOpen})
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
  deletePhoto(photo){
    this.props.deletePhoto(photo)
  }
  makeAvatar(photo){
    this.props.makeAvatar(photo)
  }
  saveItem(attribute, isText){
    let user = {}, newVal
    if(!isText && !attribute.value){
      newVal = attribute.options[0].value
      
    } else {
      newVal = attribute.value
    }
    user[attribute.attr] = newVal
    this.props.saveItem(user)
    isText ? this.updateText(attribute, newVal):this.updatePicker(attribute, newVal)
    this.setState({pickerOpen: {}, editOpen: {}})
  }
  openMap(property){
    this.props.navigation.navigate('MapPreferenceScreen', {property: property, fromProfile: 'yes'})
  }
  updatePicker (attribute, value) {
    let picA = this.state.picAttributes
    let updatedAttr = picA.find((attr)=>attr.label === attribute.label)
    let newAttr = Object.assign({}, updatedAttr, {value: value})
    const updatedIndex = picA.indexOf(updatedAttr)
    picA = [...picA.slice(0, updatedIndex), newAttr, ...picA.slice(updatedIndex + 1, picA.length)]
    this.setState({picAttributes: picA})
  }
  updateText (attribute, text){
    let writA = this.state.writtenAttributes
    let updatedAttr = writA.find((attr)=>{
      return attr.label === attribute.label
    })
    let newAttr = Object.assign({}, updatedAttr, {value: text})
    const updatedIndex = writA.indexOf(updatedAttr)
    writA = [...writA.slice(0, updatedIndex), newAttr, ...writA.slice(updatedIndex+1, writA.length )]
    this.setState({writtenAttributes: writA})
  }
  setSex (sex) {
    this.setState({sex: sex, noAvatar : sex === 'female' ? 'https://d23grucy15vpbj.cloudfront.net/webImg/icons/user-female-icon.png' : 'https://d23grucy15vpbj.cloudfront.net/webImg/icons/user-male-icon.png'})
    this.props.saveItem({sex:sex})
    this.state.editOpen = {}
  }
  showImage(image) {
    this.props.viewPhoto(image)
  }
  uploadImage () {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      includeBase64: true
    })
    .then((result)=>{
      const key = decodeURIComponent('profilePics/'+ this.props.me._id + '/' + Date.now() + result.filename.split(' ').join('-').split('.').join('-').replace('#', '-'))
      const file = {body: result.data, type: result.mime}
      this.props.uploadPhoto(file, key)
    })
  }
  goToSignIn () {
    this.props.navigation.navigate('SignupScreen')
  }
  render () {
    const self = this
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
      <View style={styles.centered}><Text style={styles.heading}>My Profile</Text></View>
      {this.props.viewedPhoto ? <View style={styles.centered}><FastImage style={styles.fullImage} source={{uri: 'https://d23grucy15vpbj.cloudfront.net/' + this.props.viewedPhoto}}>
            {!this.props.profile.avatar || this.props.viewedPhoto.indexOf(this.props.profile.avatar) < 0 ? 
              (<View style={styles.editAvatarContainer}>
                <TouchableOpacity style={styles.editAvatar} onPress={()=>{this.makeAvatar(this.props.viewedPhoto)}}><Icon name='user-circle' size={40} style={{color: '#fff'}}/></TouchableOpacity>
                <TouchableOpacity style={[styles.editAvatar, {marginLeft: 20}]} onPress={()=>{this.deletePhoto(this.props.viewedPhoto)}}><Icon style={styles.icons} name='trash-o' size={40} style={{color: '#fff'}} /></TouchableOpacity>
                </View>):null}</FastImage></View> : null}

        {!this.props.photosUploading && this.props.profile && this.props.profile.photos.length > 0  ?
          <View style={styles.carouselWrapper}>
          <Swiper showsButtons={true}  showsPagination={false} loop={false} index={this.state.index}>
          {this.makePhotos([...this.props.profile.photos]).map((photo, i)=>{
            return (
              <View key={i}>
              <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
              {photo.map((ind)=>(<TouchableOpacity key={ind} onPress={()=>{this.showImage(ind)}}><FastImage style={styles.carouselImage} source={{uri: 'https://d23grucy15vpbj.cloudfront.net/'+ ind}}/></TouchableOpacity>))}
              </View>
              </View>
              )}
            )}
          </Swiper>
          </View>: null}
          <View>
          {this.props.photosUploading || this.state.photosUploading ? <View style={[styles.centered, styles.padding]}><ActivityIndicator /></View>:<View style={styles.padding}><FullButton onPress={() => {this.uploadImage()}} text='Upload Photo'/></View>}
          <FormLabel>Sex</FormLabel>
          {this.state.editOpen[100]?null:<TouchableOpacity onPress={()=>{this.showEdit(100)}}><View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5, marginBottom: 10}}><Text style={{marginLeft: 15}}>{this.props.profile.sex.value}</Text><Icon name='pencil-square-o' size={25}/></View></TouchableOpacity>}
          {this.state.editOpen[100] ?<View style={{flexDirection: 'row', justifyContent: 'space-around' }}><RadioButton text='Male' selected={this.state.sex === 'male'}  onPress={()=>{this.setSex('male')}}/><RadioButton text='Female' selected={this.state.sex==='female'} onPress={()=>{this.setSex('female')}}/></View> : null}
          <View>
          <FormLabel>My Location</FormLabel>
          <TouchableOpacity onPress={()=>{this.openMap()}}><View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5, marginBottom: 10}}><Text style={[{marginLeft: 15}, styles.link]}>{this.props.profile.location.value || 'Enter Location'}</Text><Icon name='pencil-square-o' style={styles.link} size={25}/></View></TouchableOpacity>
          {this.state.writtenAttributes.map((attribute, i)=>{
            return (
              <View key={attribute.label}>
              <FormLabel>{attribute.label}</FormLabel>
              {this.state.editOpen[i] ? null :<TouchableOpacity onPress={()=>{this.showEdit(i)}}><View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5, marginBottom: 10}}><Text style={[{marginLeft: 15}, styles.link]}>{attribute.value}</Text><Icon name='pencil-square-o' style={styles.link} size={25}/></View></TouchableOpacity>}
              {this.state.editOpen[i] ?<View><View style={{paddingVertical: 12}}><FormInput value={attribute.value} onChangeText={(text)=>{this.updateText(attribute, text)}}/></View><Button raised icon={{name: 'cached'}} title='Save' onPress={()=>{this.saveItem(attribute, true)}}/></View>: null}
              </View>
              )
          })}
          {this.state.picAttributes.map((attribute, i)=>{
            return (
              <View key={attribute.label}>
              <FormLabel>{attribute.label}</FormLabel>
              {this.state.pickerOpen[i] ? null: <TouchableOpacity onPress={()=>{this.showPicker(i)}}><View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5, marginBottom: 10}}><Text style={[{marginLeft: 15}, styles.link]} >{attribute.value}</Text><Icon name='pencil-square-o' style={styles.link} size={25}/></View></TouchableOpacity>}
              {this.state.pickerOpen[i]?<View><Picker
                selectedValue={attribute.value}
                onValueChange={(itemValue, itemIndex) => this.updatePicker(attribute, itemValue)}>
                {attribute.options.map((choice, i)=>{
                  return <Picker.Item key={i} label={choice.label} value={choice.value} />
                })}
                </Picker>
                <Button raised icon={{name: 'cached'}} title='Save' onPress={()=>{this.saveItem(attribute)}} /></View>:null}
                </View>
                )
          })}
           {!this.props.complete ? <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite" style={[styles.centered, styles.padding]}><TouchableOpacity onPress={()=>{this.props.navigation.navigate('PreferencesScreen')}}><Text style={styles.link}>Go to Preferences</Text></TouchableOpacity></Animatable.View>: null}
          </View>
          </View>
          </ScrollView>
          )
}
}

const mapStateToProps = (state) => {
  // Reactotron.log(state)
  return {
    me: state.user.user,
    fetching: state.user.myProfileFetching,
    profile: state.user.myProfile,
    profileLoaded: state.user.myProfileLoaded,
    photosUploading: state.user.photosUploading,
    viewedPhoto: state.user.viewedPhoto,
    complete: state.user.myProfile.complete.complete
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMyProfile: ()=>{dispatch(UserActions.myProfileAttempt())},
    makeAvatar: (photo)=>{dispatch(UserActions.makeAvatarAttempt(photo))},
    deletePhoto: (photo)=>{dispatch(UserActions.deletePhotoAttempt(photo))},
    uploadPhoto: (file, key) =>{dispatch(UserActions.uploadPhotoAttempt(file,key))},
    saveItem: (user)=>{dispatch(UserActions.profileEditAttempt(user))},
    viewPhoto: (photo)=>{dispatch(UserActions.viewPhotoSuccess(photo))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyProfileScreen)
