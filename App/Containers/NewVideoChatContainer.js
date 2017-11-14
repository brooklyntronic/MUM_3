import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ListView,
  Platform,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux'
import Utilities from '../Services/Utilities'
import io from 'socket.io-client';
import BackArrow from '../Components/BackArrow'
import InCallManager from 'react-native-incall-manager';
import {
  RTCPeerConnection,
  RTCMediaStream,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStreamTrack,
  getUserMedia,
} from 'react-native-webrtc';
import styles from './Styles/VideoChatScreenStyle'
import Icon from 'react-native-vector-icons/FontAwesome'
import { EventRegister } from 'react-native-event-listeners'
// import Reactotron from 'reactotron-react-native'
import MessagesActions from '../Redux/MessagesRedux'
import { NavigationActions } from 'react-navigation'
// Styles

let container
class NewVideoChatContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fetching: true, remoteList: {}, pcPeers: {}, localStream: null, remoteStream: null
    }
    // this.chatSocket = io.connect(Utilities.baseUrl, {transports: ['websocket']})

    // this.chatSocket.on('hang_call_handle', ()=>{
    //   this.leave()
    // })
    global.chatSocket.on('exchange', (data)=>{
      this.exchange(data);
    });
    global.chatSocket.on('leave', (socketId)=>{
      this._goBack()
        // socket = io.connect(Utilities.baseUrl, {transports: ['websocket']})
      });
    // this.chatSocket.on('connect', function(data) {
      global.chatSocket.on('hang_call_handle', ()=>{
        this._goBack()
      })
    // })
  }
  getLocalStream(isFront, callback) {
    let self = this
    let videoSourceId;
    // if (Platform.OS === 'ios') {
      MediaStreamTrack.getSources(sourceInfos => {

        for (const i = 0; i < sourceInfos.length; i++) {
          const sourceInfo = sourceInfos[i];
          if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
            videoSourceId = sourceInfo.id;
          }
        }
      });
    // }
    getUserMedia({
      audio: true,
      video: {
        mandatory: {
        minWidth: 300, // Provide your own width, height and frame rate here
        minHeight: 300,
        minFrameRate: 30,
      },
      facingMode: (isFront ? "user" : "environment"),
      optional: (videoSourceId ? [{sourceId: videoSourceId}] : []),
    }
  }, function (stream) {
    callback(stream);
  }, this.logError);
  }
  join(roomID, turnServers) {
    // const self = this
    // console.log('Joining', roomID)
    InCallManager.start('video')
    global.chatSocket.emit('join', roomID,(socketIds)=>{
      for (const i in socketIds) {
        const socketId = socketIds[i];
        this.setState({pConnection: this.createPC(socketId, true, turnServers)})
      }
    });
  }
  createPC(socketId, isOffer, turnServers) {
    const pc = new RTCPeerConnection(turnServers);
    this.state.pcPeers[socketId] = pc;
    const self = this
    // self.setState(Object.assign({}, self.state, {connection: pc}))
    pc.onicecandidate = function (event) {
      if (event.candidate) {
        global.chatSocket.emit('exchange', {'to': socketId, 'candidate': event.candidate });
      }
    };

    function createOffer() {
      pc.createOffer(function(desc) {
        pc.setLocalDescription(desc, function () {
          console.log('setLocalDescription', pc.localDescription);
          global.chatSocket.emit('exchange', {'to': socketId, 'sdp': pc.localDescription });
        }, self.logError);
      }, self.logError);
    }

    pc.onnegotiationneeded = function () {
      // console.log('onnegotiationneeded');
      if (isOffer) {
        createOffer();
      }
    }

    // pc.oniceconnectionstatechange = function(event) {
    //   if (event.target.iceConnectionState === 'completed') {
    //     setTimeout(() => {
    //       console.log('completed')
    //     }, 1000);
    //   }
    // };
    // pc.onsignalingstatechange = function(event) {
    //   console.log('onsignalingstatechange', event.target.signalingState);
    // };

    pc.onaddstream = function (event) {
      // remoteList[socketId] = event.stream.toURL();
      self.setState(Object.assign({}, self.state, { remoteStream: event.stream.toURL(), fetching: false}));
    };
    pc.onremovestream = function (event) {
      console.log('onremovestream', event.stream);
    };
    pc.addStream(this.state.localStream);
    return pc;
  }
  exchange(data) {
    const self = this
    const fromId = data.from;
    let pc;
    if (fromId in this.state.pcPeers) {

      pc = this.state.pcPeers[fromId];
      // console.log('existing exchange pc')
    } else {
      pc = self.createPC(fromId, false, this.state.turnServers);
      // console.log('new exchange pc')
    }
    if (data.sdp) {
      console.log('exchange sdp', data);
      pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
        if (pc.remoteDescription.type == "offer")
          pc.createAnswer(function(desc) {
            // console.log('createAnswer', desc);
            pc.setLocalDescription(desc, function () {
              // console.log('setLocalDescription', pc.localDescription);
              global.chatSocket.emit('exchange', {'to': fromId, 'sdp': pc.localDescription });
            }, self.logError);
          }, self.logError);
      }, self.logError);
    } else {
      pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
    
  }
// leave(socketId) {
//   const self = this
//   let pc = this.state.pcPeers[socketId];
//   delete this.state.pcPeers[socketId];
//   let remoteList = self.state.remoteList;
//   delete remoteList[socketId]
// }

logError(error) {
  return null
}
// mapHash(hash, func) {
//   const array = [];
//   for (const key in hash) {
//     const obj = hash[key];
//     array.push(func(obj, key));
//   }
//   array.length = 1
//   return array;
// }
getStats() {
  return null
  // const pc = this.state.pcPeers[Object.keys(this.state.pcPeers)[0]];
  // if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
  //   const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
  //   console.log('track', track);
  //   pc.getStats(track, function(report) {
  //     console.log('getStats report', report);
  //   }, this.logError);
  // }
}

componentDidMount() {
  console.log('mounted')
    fetch(Utilities.baseUrl + 'turnservers').then((resp)=>resp.json()).then((JSONresp)=>{
      this.getLocalStream(true, (stream)=> {
        const turnServers = JSONresp.v
        if (!this.state.joined){
          this.setState({selfViewSrc: stream.toURL(), status: 'ready', joined: true, localStream: stream, turnServers}, ()=>{
            this.join(this.props.roomId, turnServers)
          });
        }
      });
    });  
}
leave(socketId) {
  this.closeStreams(socketId) 
}
_goBack () {
  this.closeStreams()
  
  
  // global.chatSocket.disconnect()
  if (this.props.onCall){
    this.props.navigation.goBack(this.props.backKey)
    this.props.hangCall()
  }
}
_cancelCall () {
  global.chatSocket.emit('cancel_call', this.props.navigation.state.params.toId)
  // this.props.navigation.goBack(this.props.backKey)
  // const resetAction = NavigationActions.reset({
  //   index: 0,
  //   actions: [
  //   NavigationActions.back({ key: this.props.backKey})
  //   ]
  // })
  // this.props.navigation.dispatch(resetAction)
}
closeStreams() {
  // InCallManager.stop()
  global.chatSocket.emit('drop_call')
  // global.chatSocket.disconnect();
  // this.state.remoteStream ? this.state.remoteStream.getTracks().forEach((track)=>track.stop()):null
  this.state.localStream ? this.state.localStream.getTracks().forEach((track)=>track.stop()):null
  // console.log(this.state.pcPeers.remoteStreams)
  this.state.pcPeers[Object.keys(this.state.pcPeers)[0]]?this.state.pcPeers[Object.keys(this.state.pcPeers)[0]].close():null
  EventRegister.emit('offCall')
  // console.log(this.state.connection)
  // console.log(this.state.pcPeers)
  // this.setState({pcPeers: {}}, ()=>{
  //   InCallManager.stop()
  //   
  //   // console.log(this.state.pcPeers)
  //   
  //   // global.chatSocket.disconnect();
  //   // global.chatSocket = io.connect(Utilities.baseUrl, {transports: ['websocket']})
  //   // if (localStream){localStream.getTracks().forEach(track => track.stop())}  
  //     // if (state.remoteStream){remoteStream.getTracks().forEach(track => track.stop())}
  //   })
}
render() {
  if (this.state.fetching) {
    return (
      <View style={styles.phoneContainer}>
      <View style={styles.content}>
      <Text>Connecting</Text>
      <ActivityIndicator />
      </View>
      <View style={{position: 'absolute', bottom: 20, backgroundColor: 'transparent', justifyContent: 'flex-start'}} >
      <TouchableOpacity onPress={() => this._goBack()}><Icon name='times-circle' style={{color: 'red'}} size={65}/></TouchableOpacity>
      </View>
      </View>
      );
  }
  return (
    <View style={styles.phoneContainer}>

    <View style={styles.mainContainer}>
    {this.props.onCall && this.state.selfViewSrc?<RTCView streamURL={this.state.selfViewSrc} style={styles.selfView}/>:null}

    {this.props.onCall ?<RTCView streamURL={this.state.remoteStream} style={styles.remoteView}/>: null} 
  </View>
  <View style={{position: 'absolute', bottom: 20, backgroundColor: 'transparent', justifyContent: 'flex-start'}} >
  <TouchableOpacity onPress={() => this._goBack()}><Icon name='times-circle' style={{color: 'red'}} size={65}/></TouchableOpacity>
  </View>
  </View>
  );
}
}

const mapStateToProps = (state) => {
  console.log(state)
  return {
    caller: state.messages.caller,
    recipient: state.messages.recipient,
    myEnd: state.messages.myEnd,
    otherEnd: state.messages.otherEnd,
    backKey: state.messages.key || null,
    onCall: state.messages.onCall,
    me: state.user.user,
    roomId: state.messages.roomId,
    nav: state.nav


  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    hangCall: (user, socket)=>{dispatch(MessagesActions.hangCallAttempt(user, socket))}
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(NewVideoChatContainer)
