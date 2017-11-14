import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Fonts, Colors  } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1
  },
    backArrow: {
	color: Colors.brand,
  marginTop: 3
  },
  linkStyle: {
          paddingHorizontal: 5,
          zIndex: 10,
          backgroundColor: 'transparent'
        }
})
