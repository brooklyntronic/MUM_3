import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './Styles/BackArrowStyle'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class BackArrow extends Component {
  static propTypes = {
    text: PropTypes.string,
    onPress: PropTypes.func,
    styles: PropTypes.object
  }
  render () {
    return (
        <TouchableOpacity style={styles.linkStyle} onPress={this.props.onPress}>
          <Icon name="chevron-left" size={30} style={styles.backArrow}/>
        </TouchableOpacity>
    )
  }
}
