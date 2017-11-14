import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './Styles/RadioButtonStyle'

export default class RadioButton extends Component {
  // // Prop type warnings
  static propTypes = {
    style: PropTypes.object,
    selected: PropTypes.bool,
    onPress: PropTypes.func,
    text: PropTypes.string
  }
  //
  // // Defaults for props
  // static defaultProps = {
  //   someSetting: false
  // }
  
  render () {
    return (
      <View style={styles.centered}>
      <TouchableOpacity onPress={this.props.onPress} style={[{
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
      }, this.props.style]}>
        {
          this.props.selected ?
            <View style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: 'blue',
            }}/>
            : null
        }
      </TouchableOpacity>
      <Text>{this.props.text}</Text>
      </View>
  );
  }
}
