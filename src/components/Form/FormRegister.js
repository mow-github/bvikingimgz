import React, { Component } from "react";

import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import { bindActionCreators } from 'redux';

import firebase from "../../firebase"

import Bvkingimgz from "../Header/Bvkingimgz"

import faker from "faker";

class FormRegister extends Component{


  state = {

    redirect: false,

      email:{
        value: faker.internet.email(),
        classMsg: "warning",
        feedback_msg: null,
      },
      password:{
        value: "123456",
        classMsg: "warning",
        feedback_msg: null,
      },
      name:{
        value: faker.name.findName(),
        classMsg: "warning",
        feedback_msg: null,
      },
      role:{
        value: "subscriber",
        classMsg: "warning",
        feedback_msg: null,
      }


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

    if(e.target.name === "role"){

      const allowedRoles = ["subscriber", "admin"];
      if( allowedRoles.indexOf( e.target.value ) === -1 ){
        newState.classMsg = "danger";
        newState.feedback_msg = "Allowed roles are: "+allowedRoles;
      }

    }

    this.setState({
      [e.target.name]: newState
    })
  };

  register = e => {
    e.preventDefault();

    const { email, password,name,role } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email.value,password.value)
      .then((user) => {

        const newUser = {
          name: name.value,
          email: user.email,
          role: role.value,
          //uid: user.uid
        };
        firebase.database().ref(`users/${user.uid}`).set(newUser);

      }).then(() => {
        this.setState({ redirect: true });
      })
      .catch(error => {
        let password = this.state.password;
        password.classMsg = "danger";
        password.feedback_msg = error.message;
        this.setState({ password })
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


  render(){

    if (this.state.redirect || this.props.users) {
      // redirect user to "/" IF user exist aka. logged in
      // gives warning error.. why
      // this.props.actions.redirectAcessDenied("You don't have access to this path if you are logged in");
      return <Redirect to='/'/>;
    }

    const {
      email,
      password,
      name,
      role
    } = this.state;

    return (
      <div className="container my-5">

        <Bvkingimgz linkClassName={true} />

        <form onSubmit={this.register}>

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

          <div className={`form-group row has-${name.classMsg}`}>
            <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
            <div className="col-sm-10">
              <input type="text" className={`form-control form-control-${name.classMsg}`} id="name" name="name" onChange={this.onChange} value={name.value} />
              {name.value && <div className="form-control-feedback">{name.feedback_msg}</div>}
            </div>
          </div>

          <div className={`form-group row has-${role.classMsg}`}>
            <label htmlFor="role" className="col-sm-2 col-form-label">Role</label>
            <div className="col-sm-10">
              <select className={`form-control form-control-${role.classMsg}`} name="role" onChange={this.onChange} >
                <option >-- Choose a role --</option>
                <option value="subscriber">Subscriber</option>
                <option value="admin">Admin</option>
              </select>
              {role.value && <div className="form-control-feedback">{role.feedback_msg}</div>}
            </div>
          </div>

          <input type="submit" className="form-control form-control-warning" value="Register" />

        </form>

        <div className="row my-5">
          <button className="btn btn-primary col-6 py-4" onClick={ () => this.registerOAuth(new firebase.auth.GithubAuthProvider()) }>Register with Github</button>
          <button className="btn btn-primary col-6 py-4" onClick={ () => this.registerOAuth(new firebase.auth.TwitterAuthProvider()) }>Register with Twitter</button>
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


export default connect(mapStateToProps, mapDispatchToProps)(FormRegister);
