import { StyleSheet } from 'react-native'
import { Colors, Metrics, ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
...ApplicationStyles.screen,
topBar: {
	flexDirection: 'row', width: '100%', justifyContent: 'space-between'
}
})
