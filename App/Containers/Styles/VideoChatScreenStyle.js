import { StyleSheet } from 'react-native'
import { Colors, Metrics, ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
 ...ApplicationStyles.screen,

  selfView: {
    width: 200,
    height: 200,
    position: 'absolute',
    bottom: 0,
    right: -40,
    zIndex: 5
  },
  remoteView: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  listViewContainer: {
    height: 150,
  },
  incomingCall: {
    ...ApplicationStyles.screen.container,
    backgroundColor: '#000'
  },
})
