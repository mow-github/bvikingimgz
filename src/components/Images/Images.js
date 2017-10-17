import React, { Component } from "react";

import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import { bindActionCreators } from 'redux';

import Image from "./Image"

import faker from "faker";

class Images extends Component{

  state = {
  };

  toggle = () => {
    const imageKeys = Object.keys(this.props.users.images);
    const imagesAll = this.props.images;

    let userImages = Object.keys(imagesAll)
      .filter((imagePos) => imageKeys.includes( imagesAll[imagePos].imgid) ? imagePos : null )
      .map((imagePos) => imagesAll[imagePos]);

    this.setState({
      userImages,
      userImagesFlag: !this.state.userImagesFlag
    });

  };

  incrementLike = (voteObj) => {
    console.log("increment",voteObj);
    this.props.actions.postVote(voteObj);
  };

  decrementLike = (voteObj) => {
    console.log("decrement",voteObj);
    this.props.actions.postVote(voteObj);
  };

  removeImage = (imageObj) => {
    console.log("removeImage",imageObj);
    this.props.actions.removeImage(imageObj, this.props.users.role);
  };




  render(){
    let images = this.props.images;
    if( this.state.userImages && this.state.userImagesFlag ){
      images = this.state.userImages;
    }

    const imagesMapped = Object.keys(images).map((image) => {
      return <Image key={image} id={image} {...images[image]}
                    update_image_modal={this.props.update_image_modal}
                    incrementLike={this.incrementLike}
                    decrementLike={this.decrementLike}
                    removeImage={this.removeImage}
      />
    });

    const btns =         <div>
      <button className="btn" onClick={this.toggle}>Toggle all vs user imgz</button>
      <br/>
      <button className="btn btn-warning" onClick={() => {

        const imgLength       = this.props.images.length,
          src             = `https://picsum.photos/200/200?random=${imgLength}`,
          title           = faker.lorem.words(),
          alt             = `img${imgLength}`,
          thumbs_up_tot   = 0, // faker.random.number(100),
          thumbs_down_tot = 0, // faker.random.number(100),
          comments_tot    = 0; // faker.random.number(100);

        const imageObj = {
          src,
          alt,
          title,
          thumbs_up_tot,
          thumbs_down_tot,
          comments_tot,
        };

        this.props.actions.postImages(imageObj)
      }}>Add your random pic</button><br/>
    </div>;


    return (
      <div className="container">

        {this.props.users.email && btns}

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
     users: state.users,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Images);
