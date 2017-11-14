import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, Modal } from 'react-native'
import styles from './Styles/LoginNavigateButtonStyle'
import FullButton from './FullButton'
import Login from '../Containers/Login'
export default class LoginNavigateButton extends Component {
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
  constructor (props) {
    super(props)
    this.state = {
      showModal: false
    }
  }
  render () {
    return (
      <View style={styles.container}>
        <FullButton onPress={this.toggleModal}/>
        <Modal
            visible={this.state.showModal}
            onRequestClose={this.toggleModal}>
            <Login/>
        </Modal>
      </View>
    )
  }
}
