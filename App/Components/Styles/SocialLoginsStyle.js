import { StyleSheet } from 'react-native'
import { Fonts, Colors, ApplicationStyles } from '../../Themes/'
export default StyleSheet.create({
 ...ApplicationStyles.screen,
  container: {
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center'
  },
  button:{
  	height: 75,
  	width: 75
  }

})
