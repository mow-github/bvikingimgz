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


class App extends Component {

  state = {

    dev_flag: false,

    image_modal:{
      // update_image_modal fn updates data here
    },

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

  update_image_modal = (image_modal) => {
    this.setState({ image_modal })
  };

  render() {

    return (
      <div className="App">
        <Navbar />
        <Error errors={this.props.errors} updateError={this.props.actions.updateError} />
        <Header counters={this.props.counters} />

        <Images update_image_modal={this.update_image_modal} />

        <Modal>
          <ModalLogin />
          <ModalImage
            image_modal={this.state.image_modal}
          />
        </Modal>




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