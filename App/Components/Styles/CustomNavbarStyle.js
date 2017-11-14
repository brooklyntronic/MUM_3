import { StyleSheet } from 'react-native'
import {ApplicationStyles, Colors, Metrics} from '../../Themes'
export default StyleSheet.create({
	...ApplicationStyles.screen,
	container: {
		backgroundColor: Colors.brand,
		paddingBottom: Metrics.baseMargin,
		paddingTop: 20,
		height: 60
	},
	menuPart: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: Metrics.baseMargin
	}
	
})
