import { RNS3 } from 'react-native-aws3'
import axios from 'axios'
import Api from './Api'
import aws from 'aws-sdk/dist/aws-sdk-react-native'
var s3 = new aws.S3();
const api = Api.create();
// function dataURLtoBlob(dataurl) {
//     var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
//         bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
//     while(n--){
//         u8arr[n] = bstr.charCodeAt(n);
//     }
//     return new Blob([u8arr], {type:mime});
// }
export default {
	
	getSignedUrl: (key, type) =>{
		return api.getSignedUrl(key, type)
		// return api.putInS3(formData, key)
	},
	putInS3: (params, file) =>{
		

		const options = {
			'presign': true,
			'key': file.name,
			'accessKey': 'AKIAJAGOUP37G6RKPCHA',
			'contentType': file.type,
			'acl': 'public-read',
			'policy': params.s3Policy,
			'signature': params.s3Signature,
			'bucket': file.type.indexOf('video') > -1 ? 'toosentsuploads': 'toosentsvids',
			'successActionStatus': '201'
		}
		return RNS3.put(file, options)
	}
}