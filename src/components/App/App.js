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

import Error from "../Error/Error";

import faker from "faker";

class App extends Component {

  state = {

    dev_flag: true,

    image_modal:{
      // update_image_modal fn updates data here
    },

  };


  componentDidMount(){
    this.props.actions.userChanged();

    // listen for POST "added" in FB collection
    this.props.actions.postImagesListener();
    this.props.actions.postUserListener();

    // listen for DELETE "removed" in FB collection
    this.props.actions.deleteImageListener();
  }

  update_image_modal = (image_modal) => {
    this.setState({ image_modal })
  };




  signOut = () => {
    firebase.auth().signOut();
  };

  render() {


    return (
      <div className="App">
        <Navbar signOut={this.signOut} />
        <Error errors={this.props.errors} updateError={this.props.actions.updateError} />
        <Header />

        <Images update_image_modal={this.update_image_modal} />

        <Modal>
          <ModalLogin />
          <ModalImage image_modal={this.state.image_modal} />
        </Modal>

        {this.state.dev_flag &&
        <div>
          <h4>dev buttons</h4>
          <button className="btn btn-warning" onClick={this.props.actions.removeAllUsers}>Remove * FB users (not auth DB)</button><br/>
          <button className="btn btn-warning" onClick={this.props.actions.removeLoggedinUserFB}>Remove 1x logged in FB user (both places)</button><br/><br/>

          <button className="btn btn-warning" onClick={() => {

            const imgLength       = this.props.images.length,
                  src             = `https://picsum.photos/200/200?random=${imgLength}`,
                  title           = faker.lorem.words(),
                  alt             = `img${imgLength}`,
                  thumbs_up_tot   = faker.random.number(100),
                  thumbs_down_tot = faker.random.number(100),
                  comments_tot    = faker.random.number(100);

            const imageObj = {
                  src,
                  alt,
                  title,
                  thumbs_up_tot,
                  thumbs_down_tot,
                  comments_tot,
            };

            this.props.actions.postImages(imageObj)
          }}>postImagesFB</button><br/>
          <button className="btn btn-warning" onClick={this.props.actions.removeAllImages}>Remove * FB images</button><br/>



        </div>
        }

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: state.users,
    errors: state.errors,
    images: state.images,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);