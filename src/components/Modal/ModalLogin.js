import React, { Component } from 'react';

import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import { bindActionCreators } from 'redux';

import firebase from "../../firebase"

class ModalLogin extends Component {


  state = {

    email:{
      value: "a@a.se",
      classMsg: "warning",
      feedback_msg: null,
    },
    password:{
      value: "123456",
      classMsg: "warning",
      feedback_msg: null,
    },

  };

  signIn = e => {
    e.preventDefault();

    const { email, password } = this.state;

    firebase
      .auth()
      .signInWithEmailAndPassword(email.value,password.value)
      .catch(error => {
        console.log(error);
        // show friendly user error msg
      })

  };
  registerOAuth = (provider) => {

    console.log("provider register - registerOAuth");

    firebase.auth().signInWithPopup(provider)
      .then((authData) => {

        console.log(authData);
        const { user, additionalUserInfo } = authData;

        const newUser = {
          name: additionalUserInfo.profile.name,
          email: additionalUserInfo.profile.email,
          role: "subscriber",
        };
        firebase.database().ref(`users/${user.uid}`).set(newUser);

      }).catch((error) => {
        console.log(error);
        let password = this.state.password;
        password.classMsg = "danger";
        password.feedback_msg = error.message;
        this.setState({ password })
      })

  };
  onChange = e => {

    let newState = this.state[e.target.name];
    newState.value = e.target.value;

    if( newState.value.length < 3 ){
      newState.classMsg = "danger";
      newState.feedback_msg = "Min 3 characters";
    }else{
      newState.classMsg = "success";
      newState.feedback_msg = `${e.target.name} is ok`;
    }

    this.setState({
      [e.target.name]: newState
    })
  };

  render() {


    const {
      email,
      password,
    } = this.state;

    return (
      <div className="modal fade" id="modalLogin">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Login</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={this.signIn}>

                <div className={`form-group row has-${email.classMsg}`}>
                  <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
                  <div className="col-sm-10">
                    <input type="email" className={`form-control form-control-${email.classMsg}`} id="email" name="email" onChange={this.onChange} value={email.value} />
                    {email.value && <div className="form-control-feedback">{email.feedback_msg}</div>}
                  </div>
                </div>

                <div className={`form-group row has-${password.classMsg}`}>
                  <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
                  <div className="col-sm-10">
                    <input type="password" className={`form-control form-control-${password.classMsg}`} id="password" name="password" onChange={this.onChange} value={password.value} />
                    <div className="form-control-feedback">{password.feedback_msg}</div>
                  </div>
                </div>


                <input type="submit" className="form-control" value="Login" />

              </form>
            </div>
            <div className="modal-footer">
              <div className="row px-3">
                <button className="btn btn-danger col-12" onClick={ () => this.registerOAuth(new firebase.auth.GithubAuthProvider()) }>Login in with Github</button>
                <button className="btn btn-primary col-12" onClick={ () => this.registerOAuth(new firebase.auth.TwitterAuthProvider()) }>Login in with Twitter</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: state.users,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalLogin);
