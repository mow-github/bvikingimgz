import React, { Component } from "react";

class Image extends Component{


  update_image_modal = () => {

    const { src, title, thumbs_up_tot, thumbs_down_tot, comments_tot, imgid } = this.props;

    const Image = {
      src,
      title,
      thumbs_up_tot,
      thumbs_down_tot,
      comments_tot,
      imgid,
    };

    this.props.update_image_modal(Image,true);
  };

  render(){

    const { thumbs_up_tot, thumbs_down_tot, comments_tot, uid, imgid, comments, votes } = this.props;
    const removeObj = {uid, imgid, thumbs_up_tot, thumbs_down_tot, comments, votes};

    return (
     [
      <figure key={this.props.id} className="col-4 my-5 text-center">
        <img src={this.props.src} alt={this.props.alt} />
        <figcaption className="row my-1">
          <span className="fa fa-comment-o fa-lg col-4 imageNoHoverBtns" aria-hidden="true" > { comments_tot }</span>
          <span className="fa fa-thumbs-o-up fa-lg col-4 imageBtns" aria-hidden="true"  onClick={() => { this.props.incrementLike({imgid, value: 1}); }}> { thumbs_up_tot }</span>
          <span className="fa fa-thumbs-o-down fa-lg col-4 imageBtns" aria-hidden="true"  onClick={() => { this.props.decrementLike({imgid, value: -1}); }}> { thumbs_down_tot }</span>
        </figcaption>
        <button type="button" className="btn col-12"  onClick={this.update_image_modal}>View img and comments</button>
        <span className="fa fa-trash-o fa-lg removeImageBtn" onClick={() => this.props.removeImage(removeObj) } ></span>
      </figure>
      ]

    );
  }

}

export default Image;

// data-toggle="modal" data-target="#modalImage"