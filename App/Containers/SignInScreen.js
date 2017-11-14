import React, { Component } from 'react';
import { View, Button, Text, TextInput, Image, ActivityIndicator, ScrollView} from 'react-native';
import { connect } from 'react-redux'
import firebase from 'react-native-firebase'
import Utilities from '../Services/Utilities'
import UserActions from '../Redux/UserRedux'
// import Reactotron from 'reactotron-react-native'
import styles from './Styles/SignInScreenStyle'
import Images from '../Themes/Images'
import * as Animatable from 'react-native-animatable'
class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      message: '',
      codeInput: '',
      phoneNumber: '+63',
      confirmResult: null
    };
  }
  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.auth().currentUser.getIdToken().then((idToken)=> {
          let newUser = user.toJSON();
          newUser.token = idToken.toString().trim()
          newUser.username = user.phoneNumber
          this.props.createUser(newUser)
        }).catch((error)=> {
          this.setState({fetching: false})
        });        
      } else {
        this.setState({
          user: null,
          message: '',
          codeInput: '',
          phoneNumber: '+63',
          confirmResult: null,
          fetching: false
        });
      }
    });
  }
  componentWillUnmount() {
   if (this.unsubscribe) this.unsubscribe();
 }
 signIn (){
  const { phoneNumber } = this.state;
  this.setState({fetching: true})
  firebase.auth().signInWithPhoneNumber(phoneNumber)
  .then(confirmResult => {this.setState({ confirmResult, fetching: false}); })
  .catch(error => {window.alert('Network Error, please make sure you are connected');this.setState({ message: `Sign In With Phone Number Error: ${error.message}`, fetching: false })});
}
checkCode (value) {
  this.setState({codeInput: value}, ()=>{
    const { codeInput, confirmResult } = this.state;
    if (codeInput.length === 6){
      confirmResult.confirm(codeInput).then((resp)=>{
        firebase.auth().currentUser.getIdToken().then(function(idToken) {
          this.setState({fetching: true})
          let user = resp.toJSON()
          user.token = idToken.toString().trim()
          this.props.createUser(user)
        }).catch((error)=> {this.setState({fetching: false })});
      }).catch(error => this.setState({fetching: false }));
    }  
  })
}
confirmCode () {
  const { codeInput, confirmResult } = this.state;
  if (confirmResult && codeInput.length) {
    confirmResult.confirm(codeInput)
    .then((resp) => {
     let user = resp.toJSON()
     this.setState({fetching: true})
     this.props.createUser(user.phoneNumber)
   })
    .catch(error => this.setState({ message: `Code Confirm Error: ${error.message}` }));
  }
}
setFocus(){
  this.inputText.focus()
}
renderPhoneNumberInput() {
 const { phoneNumber } = this.state;
 return (
  <View>
  <Image source={Images.logo} style={styles.logo} />
  <View style={{ padding: 25 }}>
  <Text>Enter phone number:</Text>
  <TextInput
  autoFocus
  keyboardType='phone-pad'
  style={{ height: 40, marginTop: 15, marginBottom: 15 }}
  onChangeText={value => this.setState({ phoneNumber: value })}
  placeholder={'Phone number ... '}
  value={phoneNumber}
  />
  <Button title="Sign In" color="green" onPress={()=>this.signIn()} />
  </View>
  </View>
  );
}
renderMessage() {
  const { message } = this.state;
  if (!!message.length) return null;
  return (
    <Text style={{ padding: 5, backgroundColor: '#000', color: '#fff' }}>{message}</Text>
    );
}
renderVerificationCodeInput() {
  const { codeInput } = this.state;
  return (
    <View style={{ marginTop: 25, padding: 25 }}>
    <Text style={[styles.heading,{textAlign: 'center'}]}>Enter verification code below:</Text>
    <TextInput
    autoFocus
    style={{ height: 40, marginTop: 15, marginBottom: 0, padding: 0, display: 'none' }}
    onChangeText={value => this.checkCode(value )}
    value={codeInput}
    ref = {(ref)=>{this.inputText = ref}}
    maxLength = {6}
    keyboardType='phone-pad'
    />
    <View style={{flexDirection: 'row', alignItems: 'stretch',
    justifyContent: 'center'}}>
    <View style={styles.confirmationBox}>
    <Text style={styles.heading}>{codeInput[0]}</Text>
    </View>
    <View style={styles.confirmationBox}>
    <Text style={styles.heading}>{codeInput[1]}</Text>
    </View>
    <View style={styles.confirmationBox}>
    <Text style={styles.heading}>{codeInput[2]}</Text>
    </View>
    <View style={styles.confirmationBox}>
    <Text style={styles.heading}>{codeInput[3]}</Text>
    </View>
    <View style={styles.confirmationBox}>
    <Text style={styles.heading}>{codeInput[4]}</Text>
    </View>
    <View style={styles.confirmationBox}>
    <Text style={styles.heading}>{codeInput[5]}</Text>
    </View>
    </View>
    <Text style={{marginTop: 20}}>{this.state.message}</Text>
    </View>
    );
}
render() {
  if (this.state.fetching || this.props.fetching) {
    return (
      <View style={styles.mainContainer}>
      <View style={styles.content}>
      <ActivityIndicator />
      </View>
      </View>
      );
  }
  const { user, confirmResult } = this.state;
  return (
    <ScrollView style={styles.mainScroll}>
    <View style={styles.mainContainer}>

    {!user && !confirmResult && this.renderPhoneNumberInput()}
    {!user && confirmResult && this.renderVerificationCodeInput()}
    {this.props.error ? <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite" style={styles.padding}><Text style={styles.heading}>{this.props.error}</Text></Animatable.View>:null}
    {user && (
      <View style={styles.content}>
      <ActivityIndicator/>
      </View>
      )}
    </View>
    </ScrollView>
    );
}
}
const mapStateToProps = (state) => {
  return {
    fetching: state.user.createUserFetching,
    error: state.user.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createUser: (user)=>{dispatch(UserActions.createUserAttempt(user))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen)
