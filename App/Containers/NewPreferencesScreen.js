import React, { Component } from 'react'
import { ScrollView, Text, View, Picker, TouchableOpacity, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'
import Preferences from '../Services/Preferences'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { extend } from 'lodash'
import UserActions from '../Redux/UserRedux'
import Utilities from '../Services/Utilities'
import Image from 'react-native-image-progress'
import ImagePicker from 'react-native-image-crop-picker'
import { RNS3 } from 'react-native-aws3'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/NewUserScreenStyle'

class NewPreferencesScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
        user:{}
    }
}

someFunction(){

}
setUserAttr(userObj){
    let user = extend({}, this.state.user);
    for (var attr in userObj.user){
        user[attr] = userObj.user[attr]
    }
   this.setState(Object.assign({}, this.state, {user: user}))
}
setLocation(event, details){
    let user = extend({}, this.state.user);
    user.preferredLocation = details
    user.preferredCoordinates = [event.lng, event.lat]
    this.setState(Object.assign({}, this.state, {user: user}))
  } 
submitUser() {
    this.setState({errorMessage: ''}, ()=>{
        let user = this.state.user
        for (var attr in Preferences){
        console.log(attr)
        if (!user[attr])
            return this.setState({errorMessage: 'Please Make Sure You Fill Out the whole form'})
        }
        user.hasPreferences = true;
        return this.props.submitUser(user)
    })
}
uploadImage () {
    this.setState({photosUploading: true})
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true
    }).then(image => {
      const file = {
        uri: image.path,
        name: decodeURIComponent('profilePics/'+ this.props.userId + '/' + Date.now() + image.filename.split(' ').join('-').split('.').join('-').replace('#', '-')),
        type: "image/png"
      }
      const options = {
        key: decodeURIComponent('profilePics/'+ this.props.userId + '/' + Date.now() + image.filename.split(' ').join('-').split('.').join('-').replace('#', '-')),
        bucket: "toosentsvids",
        region: "us-west-2",
        accessKey: "AKIAIGA2C2IZIWOYPCWQ",
        secretKey: "si+aOyZ4zYRPSBz2ecI7uucl6zoAMfofgrDxcK6V",
        successActionStatus: 201
      }
      RNS3.put(file, options).then(response => {
        const responseText = JSON.stringify({photo: response.body.postResponse.key})
        const photoKey = response.body.postResponse.key
        fetch(Utilities.baseUrl + 'users/photos', 
          {method: 'POST', 
          credentials: 'include', 
          body: responseText,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        }).then((resp)=>{console.log(photoKey);this.setUserAttr({user: {avatar:photoKey}});this.setState({photosUploading: false})}).done();
      });
    }).catch((err) => {console.log(err);this.setState({photosUploading: false})}).done();
  }
render () {
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
       <View style={{padding: 30}}>
       <Text style={styles.heading}>Please Fill Out And Submit Preferences Information</Text>
       <Text style={styles.heading}>Let's try to drill down on what you're looking for in a partner</Text>
       <FormLabel>Location</FormLabel>
       <GooglePlacesAutocomplete
        placeholder='Set Location'
      minLength={2} // minimum length of text to search
      autoFocus={false}
      returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      listViewDisplayed='auto'    // true/false/undefined
      fetchDetails={true}
      value={this.state.user.preferredLocation}
      onPress={(data, details = null) => { 
              this.setLocation(details.geometry.location, data.description);
            }}
    query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: 'AIzaSyA_NZIZpd3TbCvuqg_fcnhcpWu-NBLSveE',
        language: 'en'
    }}
      currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
      currentLocationLabel="Current location"
      styles={{
        textInputContainer: {
          backgroundColor: 'rgba(0,0,0,0)',
          borderTopWidth: 0,
          borderBottomWidth: 0,
          padding: 10,
          marginBottom: 20
      },
      textInput: {
          height: 38,
          color: '#5d5d5d',
          fontSize: 16,
          borderTopWidth: 0,
          borderBottomWidth:1,
          paddingLeft: 0
      },
      listView: {paddingHorizontal: 10, borderBottomWidth: 0},
      seperator: {borderBottomWidth: 0},
      predefinedPlacesDescription: {
          color: '#1faadb'
      },
  }}
      />
      <FormLabel>Age</FormLabel>
      <Picker
      style={styles.picker}
      selectedValue={this.state.user.preferredAge}
      onValueChange={(itemValue, itemIndex) => {this.setUserAttr({user: {preferredAge: itemValue}})}}>
      <Picker.Item label='Please Select' value=''/>
      {Preferences.preferredAge.map((item)=>(
        <Picker.Item key={item.label} label={item.label} value={item.value}/>
        ))}
      </Picker>
      <FormLabel>Body Type</FormLabel>
      <Picker
      style={styles.picker}
      selectedValue={this.state.user.preferredBodyType}
      onValueChange={(itemValue, itemIndex) => this.setUserAttr({user: {preferredBodyType: itemValue}})}>
      <Picker.Item label='Please Select' value=''/>
      {Preferences.preferredBodyType.map((item)=>(
        <Picker.Item key={item.label} label={item.label} value={item.value}/>
        ))}
      </Picker>
      <FormLabel>Relationship Status</FormLabel>
      <Picker
      style={styles.picker}
      selectedValue={this.state.user.preferredRelationshipStatus}
      onValueChange={(itemValue, itemIndex) => this.setUserAttr({user: {preferredRelationshipStatus: itemValue}})}>
      <Picker.Item label='Please Select' value=''/>
      {Preferences.preferredRelationshipStatus.map((item)=>(
        <Picker.Item key={item.label} label={item.label} value={item.value}/>
        ))}
      </Picker>
      <FormLabel>Number of Children</FormLabel>
      <Picker
      style={styles.picker}
      selectedValue={this.state.user.preferredNumberOfKids}
      onValueChange={(itemValue, itemIndex) => this.setUserAttr({user: {preferredNumberOfKids: itemValue}})}>
      <Picker.Item label='Please Select' value=''/> 
      {Preferences.preferredNumberOfKids.map((item)=>(
        <Picker.Item key={item.label} label={item.label} value={item.value}/>
        ))}
      </Picker>
      <FormLabel>Smoker</FormLabel>
      <Picker
      style={styles.picker}
      selectedValue={this.state.user.preferredSmoker}
      onValueChange={(itemValue, itemIndex) => this.setUserAttr({user: {preferredSmoker: itemValue}})}>
      <Picker.Item label='Please Select' value=''/>
      {Preferences.preferredSmoker.map((item)=>(
        <Picker.Item key={item.label} label={item.label} value={item.value}/>
        ))}
      </Picker>
      <FormLabel>Drinker</FormLabel>
      <Picker
      style={styles.picker}
      selectedValue={this.state.user.preferredDrinker}
      onValueChange={(itemValue, itemIndex) => this.setUserAttr({user: {preferredDrinker: itemValue}})}>
      <Picker.Item label='Please Select' value=''/>
      {Preferences.preferredDrinker.map((item)=>(
        <Picker.Item key={item.label} label={item.label} value={item.value}/>
        ))}
      </Picker>
      <View style={[styles.centered, styles.padding]}>
      <Text style={{color: 'red'}}>{this.state.errorMessage}</Text>
      </View>
      <Button
      raised
      large
      icon={{name: 'cached'}}
      title='Submit'
      style={{marginTop: 40}}
      buttonStyle={{backgroundColor: 'blue'}}
      onPress={()=>this.submitUser(this.state.user)}
      /> 
      </View>
      </ScrollView>
      )
}
}

const mapStateToProps = (state) => {
console.log(state)
  return {
    userId: state.user.user._id,
    fetching: state.user.preferencesCreateFetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    submitUser: (user) => dispatch(UserActions.preferencesCreateAttempt(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPreferencesScreen)
