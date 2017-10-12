import * as actionType from './actionTypes';
import firebase from '../firebase';





export function userChanged(){
  return function(dispatch){

    // 1. GET user from firebase AUTH DB
    // 2. make a "GET req from the "normal" DB.. fetch user"
    // 3. dispatch and set redux user: user

    return firebase.auth().onAuthStateChanged((user) => {
      if(user){
        firebase.database().ref(`users/${user.uid}`).once("value").then((user) => {
          dispatch({ type: actionType.SIGN_IN, user });
        })
      }else{
        dispatch({ type: actionType.SIGN_OUT, user: "" });
      }
    })
  }
}

export function redirectAcessDenied(redirectMsg) {
  return function(dispatch) {
    dispatch({
      type: 'REDIRECT_ACCESS_DENIED',
      redirectMsg
    });
  }
}