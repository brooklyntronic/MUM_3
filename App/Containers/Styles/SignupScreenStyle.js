import { StyleSheet } from 'react-native'
import {Colors, Metrics, ApplicationStyles, Fonts  } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  switchContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  loginContainer: {
    padding: 20
  }
})
