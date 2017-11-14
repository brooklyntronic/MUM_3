import React, { Component } from 'react'
import { ScrollView, Text, AsyncStorage, View, ActivityIndicator, Image,Picker, TouchableOpacity, FlatList, Switch} from 'react-native'
import { connect } from 'react-redux'
import {Images} from '../Themes/'
import FullButton from '../Components/FullButton'
import PageHeader from '../Components/PageHeader'
import { List, ListItem, FormLabel, Button } from 'react-native-elements'
import Utilities from '../Services/Utilities'
import Icon from 'react-native-vector-icons/FontAwesome'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import UserActions from '../Redux/UserRedux'
// Styles
import styles from './Styles/PreferencesScreenStyle'
// import Reactotron from 'reactotron-react-native'
import * as Animatable from 'react-native-animatable'
class PreferencesScreen extends Component {
  constructor (props) {
    super(props)
    // Reactotron.log(this.props.preferences)
    this.state = {preferences: null, fetching: true, editSwitch: false, picAttributes: this.props.preferences.choicePreferences, pickerOpen: {}, useLocation: this.props.preferences.location.useLocation}
  }

  showEdit(property){
    this.props.navigation.navigate('PreferenceScreen', {property, preferences: true})
  }
  showMap(property){
    // Reactotron.log(property)
    this.props.navigation.navigate('MapPreferenceScreen', {property})
  }

  saveItem(attribute, value){
    let user = {}, newVal
    if (!attribute.value){
      newVal= attribute.options[0].value
    } else {
      newVal = value
    }
    user[attribute.attr] =  newVal
    this.props.saveItem(user)
    this.updatePicker(attribute, newVal)
    this.setState({pickerOpen: {}})
  }
   updatePicker (attribute, value) {
    let picA = this.state.picAttributes
    let updatedAttr = picA.find((attr)=>attr.label === attribute.label)
    let newAttr = Object.assign({}, updatedAttr, {value: value})
    const updatedIndex = picA.indexOf(updatedAttr)
    picA = [...picA.slice(0, updatedIndex), newAttr, ...picA.slice(updatedIndex + 1, picA.length)]
    this.setState({picAttributes: picA})
  }
  showPicker(index){
    // this.props.navigation.navigate('PreferenceScreen', {property, fromProfile: 'yes', isText: isText || false})
    let pickerOpen = {}
    pickerOpen[index] = true
    this.setState({pickerOpen: pickerOpen})
  }
  changeUseLocation(value){
   let user = {preferredUseLocation: value}
   this.props.saveItem(user);
   this.setState({useLocation: value})
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
      <ScrollView style style={styles.mainScroll}>
      <View style={{marginTop: 40}}>
      <View style={styles.switchContainer}>
      <Text style={{paddingLeft: 20}}>Use Location</Text>
      <Switch
      style={{marginLeft: 20}}
      onValueChange={(value) => {this.changeUseLocation(value)}}
      value={this.state.useLocation}>
      </Switch>
      </View>
      {this.state.useLocation ? <View>
        <FormLabel>Location</FormLabel>
        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('MapPreferenceScreen', {fromProfile: 'no'})}}><View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5, marginBottom: 10}}><Text  style={{marginLeft: 15}}>{this.props.preferences.location.value || 'Enter Preferred Location'}</Text><Icon name='pencil-square-o' size={25}/></View></TouchableOpacity>
      </View>: null}
        {this.state.picAttributes.map((attribute, i)=>{
          return (
            <View key={attribute.label}>
            <FormLabel>{attribute.label}</FormLabel>
            {this.state.pickerOpen[i] ? null: <TouchableOpacity onPress={()=>{this.showPicker(i)}}><View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5, marginBottom: 10}}><Text  style={{marginLeft: 15}}>{attribute.value}</Text><Icon name='pencil-square-o' size={25}/></View></TouchableOpacity>}
            {this.state.pickerOpen[i]?<View><Picker
            selectedValue={attribute.value ? attribute.value : attribute.options[0].value}
            onValueChange={(itemValue, itemIndex) => this.updatePicker(attribute, itemValue)}>
            {attribute.options.map((choice, i)=>{
              return <Picker.Item key={i} label={choice.label} value={choice.value} />
            })}
            </Picker>
            <Button raised icon={{name: 'cached'}} title='Save' onPress={()=>{this.saveItem(attribute, attribute.value)}} /></View>:null}
            </View>
            )
        })}
        {!this.props.complete ? <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite" style={[styles.centered, styles.padding]}><TouchableOpacity onPress={()=>{this.props.navigation.navigate('MyProfileScreen')}}><Text style={styles.link}>Go to My Profile</Text></TouchableOpacity></Animatable.View>: null}
      </View>
      </ScrollView>
      )
  }
}

const mapStateToProps = (state) => {
  return {
    preferences: state.user.preferences,
    fetching: state.user.preferencesFetching,
    loaded: state.user.preferencesLoaded,
    complete: state.user.myProfile.complete.complete
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveItem: (user)=>{dispatch(UserActions.preferenceEditAttempt(user))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreferencesScreen)
