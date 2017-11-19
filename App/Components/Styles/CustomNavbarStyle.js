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
	},
	navIcon: {
		color: '#4c4c4c',
		shadowOpacity: 0.75,
        shadowColor: '#000',
        shadowOffset: { height: 0, width: 0 }
	},
	navIconSelected: {
		color: '#add8e6',
		shadowOpacity: 0.75,
        shadowColor: '#000',
        shadowOffset: { height: 0, width: 0 }
	}
	
})
