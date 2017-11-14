import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
	...ApplicationStyles.screen,
	subheading: {
		...Fonts.style.h4,
		margin: Metrics.doubleBaseMargin
	},
	padding: {
		padding: Metrics.doubleBaseMargin
	},
	matchupContainer: {
		marginBottom: Metrics.doubleBaseMargin
	},
	bold: {
		fontWeight: 'bold'
	}
})
