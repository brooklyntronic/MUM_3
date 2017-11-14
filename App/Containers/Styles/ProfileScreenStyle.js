import { StyleSheet} from 'react-native'
import { Colors, Metrics, ApplicationStyles, Fonts } from '../../Themes/'

export default StyleSheet.create({
...ApplicationStyles.screen,
attrLabel:{
    ...Fonts.style.description
  },
  attr: {
    ...Fonts.style.h4,
    marginLeft: 10,
    fontWeight: 'bold'
  },
  profileLI :{
      width: Metrics.screenWidth * .8,
      ...ApplicationStyles.screen.centered,
      padding: 10
    }
})
