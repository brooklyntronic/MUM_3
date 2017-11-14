import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './Styles/AddiconStyle'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Colors} from '../Themes'
export default class Addicon extends Component {
  // // Prop type warnings
  static propTypes = {
    onPress: PropTypes.func,
  }
  //
  // // Defaults for props
  // static defaultProps = {
  //   someSetting: false
  // }

  render () {
    return (
      <View style={styles.addMatchup}><TouchableOpacity onPress={()=>{this.props.onPress()}}><Icon name='plus-circle' size={40} color={Colors.brand}/></TouchableOpacity></View>
      )
  }
}
