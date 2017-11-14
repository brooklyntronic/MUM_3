import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TextInput, ScrollView, Switch } from 'react-native'
import styles from './Styles/LoginFormStyle'
import FullButton from './FullButton'
import SocialLogins from './SocialLogins'
var t = require('tcomb-form-native')
export default class SignupForm extends Component {
  // // Prop type warnings
  // static propTypes = {
  //   someProperty: PropTypes.object,
  //   someSetting: PropTypes.bool.isRequired,
  // }
  //
  // // Defaults for props
  // static defaultProps = {
  //   someSetting: false
  // }
  constructor(props) {
    super(props);
    this.state = {falseSwitchIsOn: false, username: null, password: null};
  }
  userSignIn (username, password) {
    if (!username || !password)  window.alert('No username ',  this.state.username)
    fetch('http://localhost:3000/signin', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: username,
    password: password
  })
})
  }
  render () {

    if (this.state.falseSwitchIsOn){
     loginForm = <View style={styles.container}>
     <View style={styles.inputHolder}>
     <TextInput
     editable={true}
     onChangeText={(username) => this.setState({username})}
     placeholder='Username'
     ref='username'
     returnKeyType='next'
     value={this.state.username}
     /></View>
     <View  style={styles.inputHolder}>
     <TextInput
     editable={true}
     onChangeText={(password) => this.setState({password})}
     placeholder='Password'
     ref='password'
     returnKeyType='next'
     secureTextEntry={true}
     value={this.state.password}
     />
     </View>
     </View>
     switchText = <Text>Switch To Use Cellphone Number</Text>

   } else {
     loginForm =( <View style={styles.container}>
      <View style={styles.phoneInputHolder}>
      <TextInput placeholder="Enter Cellphone Number"/>
      </View>
      </View>
      )
     switchText = <Text>Switch To Use MatchupMatch.com Account</Text>
   }
   return (
    <View style={styles.signinContainer}>
    {switchText}
    <Switch
    onValueChange={(value) => this.setState({falseSwitchIsOn: value})}
    style={{marginBottom: 30}}
    value={this.state.falseSwitchIsOn}>
    </Switch>
    <Text>{this.state.username}</Text>
    {loginForm}
     <FullButton text="Sign In" onPress={this.userSignIn(this.state.username, this.state.password)}/><FullButton text="Sign Up"/>
    </View>
    )
 }
}
