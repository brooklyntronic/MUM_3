import { StyleSheet } from 'react-native'
import { Colors, Metrics, ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
...ApplicationStyles.screen,
  container: {
    flex: 1,
    marginTop: Metrics.navBarHeight,
    backgroundColor: Colors.background
  },
  confirmationBox: {
  	height: 40, width: 40, backgroundColor: 'lightblue', marginRight: 10,alignItems: 'center',
    justifyContent:'center'
  }
})
