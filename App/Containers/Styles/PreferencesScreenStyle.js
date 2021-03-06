import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts, ApplicationStyles} from '../../Themes/'

export default StyleSheet.create({
...ApplicationStyles.screen,
 content:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
    },

  attrLabel:{
  	...Fonts.style.description
  },
  attr: {
  	...Fonts.style.h4,
  	color: Colors.brand,
  	marginLeft: 15,
  	fontWeight: 'bold'
  },
  profileLI :{
  		width: Metrics.screenWidth * .8,
    	...ApplicationStyles.screen.centered,
    	padding: 10
    },
  editAvatar: {backgroundColor: '#000', padding: 5, opacity: .5, borderRadius: 3},
  editAvatarContainer: {flexDirection: 'row', position: 'absolute', top: 0, left: 5, zIndex: 100}
})
