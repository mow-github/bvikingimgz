import React, { Component } from "react";

import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import { bindActionCreators } from 'redux';

import Image from "./Image"


class Images extends Component{

  render(){

    const { images } = this.props;
    const imagesMapped = Object.keys(images).map((image) => {
      return <Image key={image} id={image} {...images[image]} update_image_modal={this.props.update_image_modal} />
    });

    return (
      <div className="container">

        <div className="row">
          {imagesMapped}
        </div>

      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
     images: state.images,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Images);
