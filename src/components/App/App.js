import React, { Component } from 'react';

import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import { bindActionCreators } from 'redux';

import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";
import Images from "../Images/Images";

import Modal from "../Modal/Modal";
import ModalLogin from "../Modal/ModalLogin";
import ModalImage from "../Modal/ModalImage";

import Error from "../Error/Error";

import User from "../User/User";
import FormRegister from "../Form/FormRegister";
import Footer from "../Footer/Footer";

import SpanButton from "../Button/SpanButton";


import firebase from "../../firebase"


class App extends Component {

  state = {
    dev_flag: false,
    image_modal:{ }, // dyn added, from image-component
    toggleModalImage: false,
    toggleModalLogin: false,
    toggleUser: false,
  };


  componentDidMount(){

    const {actions} = this.props;

    actions.userChanged();

    // listen for POST "added" in FB collection
    actions.postImagesListener();
    actions.postUserListener();
    actions.postCommentsListener();
    actions.postVotesListener();

    // listen for DELETE "removed" in FB collection
    actions.deleteImageListener();
    actions.removeCommentsListener();
    actions.removeUsersListener();

    // listen for PUT/PATCH "update" in FB collection
    actions.updateImagesListener();
    actions.updateUsersListener();
    actions.updateCommentsListener();

  }

  update_image_modal = (image_modal, toggleModalImage) => { this.setState({ image_modal, toggleModalImage }) };
  closeModalImage = (toggleModalImage) => { this.setState({ toggleModalImage }) };
  closeModalLogin = (toggleModalLogin) => { this.setState({ toggleModalLogin }) };
  showModalLogin = (toggleModalLogin) => { this.setState({ toggleModalLogin }) };

  signOut = () => {
    this.setState({ toggleUser: false });
    firebase.auth().signOut();
  };

  toggleUser = () => {
    this.setState({ toggleUser: !this.state.toggleUser });
  };
  toggle = () => {
    console.log("toggle");
  };

  render() {

    const { users, actions } = this.props;
    const { toggleUser, toggleModalLogin, image_modal, toggleModalImage, dev_flag } = this.state;

    return (
      <div className="App">





        <Navbar showModalLogin={this.showModalLogin}  signOut={this.signOut} />
        <Error errors={this.props.errors} updateError={this.props.actions.updateError} />
        <Header counters={this.props.counters} />


        {users.role === "admin" && <SpanButton text=" Toggle Admin / Images area" fontClass="fa-user-circle-o" fontClassSize="fa-lg" cssExtra="ctaBtn"  onClick={this.toggleUser} /> }
        {toggleUser && <User /> }
        {!users && <FormRegister /> }
        {!toggleUser && <Images update_image_modal={this.update_image_modal} /> }


        <Modal>
          <ModalLogin showModalLogin={toggleModalLogin} closeModalLogin={this.closeModalLogin}/>
          <ModalImage image_modal={image_modal} showModalImage={toggleModalImage} closeModalImage={this.closeModalImage} />
        </Modal>

        <Footer removeLoggedinUserFB={actions.removeLoggedinUserFB} users={users}/>

        {dev_flag &&
        <div>
          <h4>dev buttons</h4>
          <button className="btn btn-warning" onClick={actions.removeAllUsers}>Remove * FB users (not auth DB)</button><br/>
          <button className="btn btn-warning" onClick={actions.removeLoggedinUserFB}>Remove 1x logged in FB user (both places)</button><br/><br/>
          <button className="btn btn-warning" onClick={actions.removeAllImages}>Remove * FB images</button><br/>
        </div>
        }

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    users:    state.users,
    errors:   state.errors,
    images:   state.images,
    counters: state.counters,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);