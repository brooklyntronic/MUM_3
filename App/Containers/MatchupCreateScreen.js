import React, { Component } from 'react'
import { ScrollView, Text, AsyncStorage, View, TextInput, Picker, TouchableOpacity, Switch, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import BackArrow from '../Components/BackArrow'
import FullButton from '../Components/FullButton'
import PageHeader from '../Components/PageHeader'
import MatchupSide from '../Components/MatchupSide'
import Utilities from '../Services/Utilities'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Colors} from '../Themes/'
import { RNS3 } from 'react-native-aws3'
import Api from '../Services/Api'
import S3 from '../Services/S3'
// Add Actions - replace 'Your' with whatever your reducer is called :)
import MatchupActions from '../Redux/MatchupRedux'
// import Reactotron from 'reactotron-react-native'
import * as Animatable from 'react-native-animatable'

// Styles
import styles from './Styles/MatchupCreateScreenStyle'

const api = Api.create()
class MatchupCreateScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {userId: '', sides: [{side: 1}, {side: 2}]}
  }
   
  addSide () {
    let tempArray = this.state.sides;
    tempArray.push({side: this.state.sides.length + 1})
    this.setState(Object.assign({}, this.state, {sides: tempArray}))
  }
  isSideInvalid (side) {
    return !side.name || (!side.ytvideo && !side.image && !side.video)
  }
  isFormInvalid() {
    return !this.state.title || this.state.sides.filter((side, i)=>!this['side' + (i+1)].getData()).length > 0
  }

  async createMatchup () {
    // Reactotron.log(this.state.sides.filter((side)=>!side.name || !side.mediaType))
    if(this.isFormInvalid()){
      return this.setState(Object.assign({}, this.state, {missingData: true}))
    }
    let isValid = true;
    // this.setState(Object.assign({}, this.state, {isLoading: true, missingData: false}))
    let tempArray = [], matchupSides = []

    this.state.sides.forEach((side, i)=>{
      if (!this['side' + (i+1)].getData()) {
        return
      }
      let tempObject = Object.assign({}, this['side' + (i+1)].getData())
      tempObject.side = i + 1;    
      if (tempObject.mediaType === 'vid'){
        tempObject.file = {
        uri: tempObject.videoUrl,
        type: tempObject.mime,
        name: tempObject.video,
      };
        tempObject.mp4 = tempObject.file.name.split(/(?!\.)\W/gm).join('-') + 'converted_video.mp4'
        tempObject.webm = tempObject.file.name.split(/(?!\.)\W/gm).join('-') + 'converted_video.webm'
        
      } 
      if (tempObject.mediaType === 'pic'){
        tempObject.file = {
        uri: tempObject.imageUrl,
        type: tempObject.mime,
        name: tempObject.image,
      };

      }
      matchupSides.push(tempObject)
    });
    if (!isValid){
      return
    }
    // if (!isValid){
    //   return this.setState(Object.assign({}, this.state, {missingData: true, isLoading: false}))
    // }
    // if (tempArray.length > 0){
    //   const sidesResult = await Promise.all(tempArray)
    //     sidesResult.forEach((result)=>{
    //       if (result.status !== 201){
    //         console.error('Error Uploading')
    //          this.setState(Object.assign({}, this.state, {isLoading: false}))
    //       }
    //   })
    // }

    let matchup = {
      title: this.state.title,
      category: this.state.category,
      sides: matchupSides,
      isPublicRequest: this.state.isPublic,
      matchupType: this.state.matchupType || 'Matchup'
    }
    this.props.createMatchup(matchup)
  }
  render () {
    if (this.props.fetching) {
      return (
        <View style={styles.mainContainer}>
          <View style={styles.content}>
          <ActivityIndicator />
          </View>
        </View>
      );
    }
    return (
      <ScrollView style={styles.container}>
      <View style={styles.centered}><Text style={styles.heading}>Create Matchup</Text></View>
      <View style={styles.formContainer}>
      <TextInput style={styles.matchupTextInput} placeholder='Matchup Title' onChangeText={(text) => this.setState(Object.assign({}, this.state, {title: text}))} value={this.state.title}/>
      <Text style={styles.link}>Category</Text>
      <Picker style={styles.matchupPicker}
      selectedValue ={this.state.category}
      onValueChange={(itemValue, itemIndex) => this.setState(Object.assign({}, this.state, {category: itemValue}))}
      >
      {Utilities.matchupCategories.map((category, i)=><Picker.Item key={i} label={category} value={category}/>
        )}
      </Picker>
      {this.state.sides.map((side, i)=>{
        return <MatchupSide ref={(ref)=>{this['side'+ (i+1)] = ref}} userId={this.props.myId} key={i} side={side.side} />
      })}
      <View style={{flexDirection: 'row', marginVertical: 10}}>
      <TouchableOpacity onPress={()=>{this.addSide()}}><Icon name='plus-circle' size={40} color={Colors.brand}/></TouchableOpacity>
      <Text style={[styles.link, {marginTop: 10, marginLeft: 10}]}>Add Side</Text>
      </View>
      <Text style={[styles.link, {marginTop: 10}]}>Make Public </Text>
      <Switch
      onValueChange={(value) => this.setState({isPublic: value})}
      value={this.state.isPublic}>
      </Switch>
      {this.state.missingData? <Animatable.Text animation="pulse" easing="ease-out" iterationCount={5} style={styles.warning}>Make Sure You Get Everything!</Animatable.Text>:null}
      <FullButton styles={{marginTop: 20}} text='Create' onPress={()=>{this.createMatchup()}} />
      </View>
      </ScrollView>
      )
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.matchups.createFetching,
    myId: state.user.user._id
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createMatchup: (matchup)=>{
      dispatch(MatchupActions.createMatchupAttempt(matchup))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchupCreateScreen)
