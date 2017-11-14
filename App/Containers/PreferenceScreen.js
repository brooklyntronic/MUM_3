import React, { Component } from 'react'
import { ScrollView, Text, AsyncStorage, View, ActivityIndicator, Image,Picker, TouchableOpacity, FlatList, TextInput} from 'react-native'
import { connect } from 'react-redux'
import {Images} from '../Themes/'
import BackArrow from '../Components/BackArrow'
import FullButton from '../Components/FullButton'
import PageHeader from '../Components/PageHeader'
import { List, ListItem } from 'react-native-elements'
import Utilities from '../Services/Utilities'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import UserActions from '../Redux/UserRedux'
// Styles
import styles from './Styles/PreferencesScreenStyle'
import t from 'tcomb-form-native'
// import Reactotron from 'reactotron-react-native'
let Form = t.form.Form
// here we are: define your domain model
let UserInput = t.struct({
  input: t.String,              // a required string
});
let options = {
  auto: 'none', // do not generate automatic labels nor automatic placeholders

};
class PreferenceScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {fromProfile:(this.props.navigation.state.params.fromProfile || null), 
      fetching: false, 
      property: this.props.navigation.state.params.property, 
      propertyValue: this.props.navigation.state.params.property.value ,
      isText: this.props.navigation.state.params.isText || null

    }
  }
  onChange(value) {
    this.setState({value});
  }
  componentWillMount () {
    if (!this.state.isText){
      let propertyOptions = this.props.navigation.state.params.property.options;
      if (this.props.navigation.state.params.fromProfile) {
        filteredOptions = propertyOptions.filter((option)=>{
          return option.value !=='Doesn\'t Matter'
        })
      }
      if (!this.state.propertyValue) {
        this.setState({propertyValue: filteredOptions[0].value})
      }
      this.setState({propertyOptions: this.props.navigation.state.params.fromProfile? filteredOptions : propertyOptions, 
        value:  {input: this.props.navigation.state.params.property.value}
      })
    }
    // AsyncStorage.getItem('@MySuperStore:userID').then((resp)=>{this.setState({userID: resp})}).done()
  }
  setPreference(){
    let formValue = this.state.isText ? this.refs.form.getValue() : false
    if (!formValue && !this.state.propertyValue ) {
      return
    }
    let user = {id: this.props.myId};
    let userProp = this.state.property.attr
    user[userProp] = this.state.isText ? formValue.input : this.state.propertyValue 
    if(this.props.navigation.state.params.preferences){
      this.props.setPreference(user)
    } else {
      this.props.setProfile(user)
    }
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
      <ScrollView contentContainerStyle={styles.mainScroll}>
      <View style={styles.container}>
      <Text style={styles.attr}>{this.state.property.label}</Text>
      <View style={styles.formContainer}>
      {this.state.isText ?
        <Form
        ref="form"
        type={UserInput}
        options={options}
        value={{input: this.props.navigation.state.params.property.value}}
        onChange={()=>this.onChange}
        /> : <Picker
        selectedValue={this.state.propertyValue}
        onValueChange={(itemValue, itemIndex) => this.setState({propertyValue: itemValue})}>
        {this.state.propertyOptions.map((choice, i)=>{
          return <Picker.Item key={i} label={choice.label} value={choice.value} />
        })}
        </Picker>
      }
      <FullButton text='Done' onPress={()=>this.setPreference()}/>
      </View>
      </View>
      </ScrollView>
      )
  }
}

const mapStateToProps = (state) => {
  // Reactotron.log(state)
  return {
    myId: state.user.user._id,
    fetching: state.user.attributeFetching || state.user.profileAttributeFetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setPreference: (user)=>{
      dispatch(UserActions.preferenceEditAttempt(user))
    },
    setProfile: (user)=>{
      dispatch(UserActions.profileEditAttempt(user))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreferenceScreen)
