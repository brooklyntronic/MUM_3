import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TextInput, ScrollView } from 'react-native'
import styles from './Styles/LoginFormStyle'
import FullButton from './FullButton'
import SocialLogins from './SocialLogins'
export default class LoginForm extends Component {
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

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.inputHolder}>
        <TextInput placeholder="Email Address"/>
        </View>
        <View  style={styles.inputHolder}>
        <TextInput placeholder="Password"/>
        </View>
        <FullButton text="Go"/>
      </View>
    )
  }
}
