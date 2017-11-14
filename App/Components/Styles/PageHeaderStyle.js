import { StyleSheet } from 'react-native'
import {ApplicationStyles, Fonts, Colors, Metrics} from '../../Themes/'
export default StyleSheet.create({
...ApplicationStyles.screen,
pageHeader: {
	position: 'absolute',
	top: 0,
	zIndex: 8,
	flexDirection: 'row',
	padding: 0,
	width: Metrics.screenWidth,
	justifyContent: 'center'

},
   logoHeading: {
    ...Fonts.style.h5,
    color: Colors.brand,
  },
})
