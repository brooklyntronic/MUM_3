import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Fonts, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  content:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems: 'center'
    },
    imageContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'
  },
  logo: {
    marginTop: Metrics.doubleSection,
    height: Metrics.images.medium,
    width: Metrics.images.medium,
    resizeMode: 'contain'
  },
  logoContainer: {flexDirection:'row',justifyContent: 'center', alignItems: 'center', marginBottom: 10},
  padding: {
    padding: Metrics.doubleBaseMargin
  },
  getMore: {
  	...Fonts.style.h4,
  	marginTop: Metrics.doubleBaseMargin,
  	textAlign: 'center'
  },
  image: {
    ...ApplicationStyles.screen.fullImage,
    alignItems:'center',justifyContent:'flex-end', marginBottom: 20, borderRadius: 10
  },
  paragraph: {
  	color: '#fff',
  	fontSize: Fonts.size.h5,
  	textAlign: 'center',
  	fontWeight: 'bold'
  },
  matchup: {flex:1,alignItems:'center',justifyContent:'center'}
})
