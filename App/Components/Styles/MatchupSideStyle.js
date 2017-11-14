import { StyleSheet } from 'react-native'
import {ApplicationStyles} from '../../Themes'
export default StyleSheet.create({
...ApplicationStyles.screen,
  container: {
    flex: 1
  },
  matchupInput: {borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginVertical: 10}

})
