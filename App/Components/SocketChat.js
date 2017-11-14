import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, Platform } from 'react-native'
import styles from './Styles/SocketChatStyle'
import io from 'socket.io-client';
import Utilities from '../Services/Utilities'
export default class SocketChat extends Component {
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
  componentDidMount () {
    
    socket.on('exchange', function(data){
      exchange(data);
    });
    socket.on('answerCall', function(data){
      this.props.navigation.navigate('VideoChatScreen')
    })
    socket.on('leave', function(){
      socket.close();
      socket.disconnect();
    });
    socket.on('call_user_handle', function(username, data){
      console.error(this.props)
    })
  }
  render () {
    return (
      <View></View>
      )
  }
}
