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
import Footer from "../Footer/Footer";


class App extends Component {

  state = {
    dev_flag: false,
    image_modal:{ }, // dyn added, from image-component
    toggleModalImage: false,
    toggleModalLogin: false,
    toggleUser: false,
  };


  componentDidMount(){
    this.props.actions.userChanged();

    // listen for POST "added" in FB collection
    this.props.actions.postImagesListener();
    this.props.actions.postUserListener();
    this.props.actions.postCommentsListener();
    this.props.actions.postVotesListener();

    // listen for DELETE "removed" in FB collection
    this.props.actions.deleteImageListener();
    this.props.actions.removeCommentsListener();

    // listen for PUT/PATCH "update" in FB collection
    this.props.actions.updateImagesListener();
    this.props.actions.updateUsersListener();
    this.props.actions.updateCommentsListener();

  }

  update_image_modal = (image_modal, toggleModalImage) => { this.setState({ image_modal, toggleModalImage }) };
  closeModalImage = (toggleModalImage) => { this.setState({ toggleModalImage }) };
  closeModalLogin = (toggleModalLogin) => { this.setState({ toggleModalLogin }) };
  showModalLogin = (toggleModalLogin) => { this.setState({ toggleModalLogin }) };


  render() {
    return (
      <div className="App">

        <Navbar showModalLogin={this.showModalLogin}/>
        <Error errors={this.props.errors} updateError={this.props.actions.updateError} />
        <Header counters={this.props.counters} />


        {this.props.users.role === "admin" && <button className="btn btn-danger" onClick={() => this.setState({ toggleUser: !this.state.toggleUser }) }>Toggle Admin / Images area</button> }
        {this.state.toggleUser && <User /> }
        {!this.state.toggleUser && <Images update_image_modal={this.update_image_modal} /> }

        <Modal>
          <ModalLogin showModalLogin={this.state.toggleModalLogin} closeModalLogin={this.closeModalLogin}/>
          <ModalImage image_modal={this.state.image_modal} showModalImage={this.state.toggleModalImage} closeModalImage={this.closeModalImage} />
        </Modal>

        <Footer removeLoggedinUserFB={this.props.actions.removeLoggedinUserFB} users={this.props.users}/>

        {this.state.dev_flag &&
        <div>
          <h4>dev buttons</h4>
          <button className="btn btn-warning" onClick={this.props.actions.removeAllUsers}>Remove * FB users (not auth DB)</button><br/>
          <button className="btn btn-warning" onClick={this.props.actions.removeLoggedinUserFB}>Remove 1x logged in FB user (both places)</button><br/><br/>
          <button className="btn btn-warning" onClick={this.props.actions.removeAllImages}>Remove * FB images</button><br/>
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