import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,

    imageContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'
  },
  centered: {
    alignItems: 'center',
  },
  padding: {
    padding: Metrics.doubleBaseMargin
  },
addMatchup:{
  position: 'absolute',
  right: 5,
  zIndex: 10
},
matchup: {flex:1,alignItems:'center',justifyContent:'center'}
})
