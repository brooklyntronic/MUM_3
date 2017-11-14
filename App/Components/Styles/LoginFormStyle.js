import { StyleSheet } from 'react-native'
import { Fonts, Colors, ApplicationStyles } from '../../Themes/'
export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    backgroundColor: Colors.snow,
  },
  phoneInputHolder: {
  	...ApplicationStyles.screen.inputHolder,
  	marginTop: 42
  }
})
