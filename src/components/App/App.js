import React, { Component } from 'react';

import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import { bindActionCreators } from 'redux';

import firebase from "../../firebase"

import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";
import Images from "../Images/Images";

import Modal from "../Modal/Modal";
import ModalLogin from "../Modal/ModalLogin";
import ModalImage from "../Modal/ModalImage";

class App extends Component {

  state = {

    image_modal:{
      // update_image_modal fn updates data here
    },
    email: "a@a.se",
    password: "123456",

  };


  componentDidMount(){
    this.props.actions.userChanged();
  }

  update_image_modal = (image_modal) => {
    this.setState({ image_modal })
  };


  signIn = e => {

    const { email, password } = this.state;

    firebase
      .auth()
      .signInWithEmailAndPassword(email,password)
      .catch(error => {
        console.log(error);
        // show friendly user error msg
      })

  };

  signOut = () => {
    firebase.auth().signOut();
  };

  componentDidUpdate(){
    // console.log( this.props.redirects );
  }

  registerGithub = e => {

  console.log("github register");

    let provider = new firebase.auth.GithubAuthProvider();
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

      })
      .catch( err => console.log(err) )

  };

  render() {


    return (
      <div className="App">
        <Navbar />
        <Header />


        {!this.props.users &&
          <button className="btn btn-danger" onClick={this.registerGithub}>register Github</button>
        }

        {!this.props.users &&
          <button className="btn btn-primary" onClick={this.signIn}>signIn</button>
        }

        {this.props.users && <button className="btn btn-danger" onClick={this.signOut}>signOut</button> }

        {this.props.users &&
          <Images update_image_modal={this.update_image_modal} />
        }

        <Modal>
          <ModalLogin/>
          <ModalImage image_modal={this.state.image_modal} />
        </Modal>

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


export default connect(mapStateToProps, mapDispatchToProps)(App);