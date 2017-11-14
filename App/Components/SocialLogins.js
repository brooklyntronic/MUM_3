import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, Image, Linking, PropTypes } from 'react-native'
import styles from './Styles/SocialLoginsStyle'
import { Images } from '../Themes'

export default class SocialLogins extends Component {
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
       <Image style={styles.button} source={Images.facebookLogin}/>
       <Image style={styles.button} source={Images.twitterLogin}/>
       <Image style={styles.button} source={Images.googleLogin}/>
      </View>
    )
  }
}
