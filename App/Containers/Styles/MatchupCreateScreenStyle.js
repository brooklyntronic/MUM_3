import { StyleSheet } from 'react-native'
import { Colors, Metrics, ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  sliderContainer: {
  	alignContent: 'flex-start',
  },
  side: {
  	flex: 1,
  	justifyContent: 'flex-end',
  }

})
