import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native'
import styles from './Styles/CameraActionButtonStyle'

export default class CameraActionButton extends Component {
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
    return ( <TouchableOpacity onPress={this.uploadImage}><Icon name="camera" size={30} style={{color: 'grey', marginBottom: 10}}/></TouchableOpacity> )
  }
}
