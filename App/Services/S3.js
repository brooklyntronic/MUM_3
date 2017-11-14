import { RNS3 } from 'react-native-aws3'
import axios from 'axios'
import Api from './Api'
import aws from 'aws-sdk/dist/aws-sdk-react-native'
const api = Api.create();
export default {

	putInS3: (file, key) =>{
		return api.putInS3(file, key)
	}
}