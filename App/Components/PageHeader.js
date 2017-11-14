import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native'
import {Images} from '../Themes/'
import styles from './Styles/PageHeaderStyle'

export default class PageHeader extends Component {
  // // Prop type warnings
  static propTypes = {
    text: PropTypes.string
  }
  //
  // // Defaults for props
  // static defaultProps = {
  //   someSetting: false
  // }

  render () {
    return (
      <View style={styles.pageHeader}><View style={styles.logoContainer}><Image source={Images.circleLogo}  style={styles.smallLogo}/><Text style={styles.logoHeading}>{this.props.text}</Text></View></View>
    )
  }
}
