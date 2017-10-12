import React, { Component } from "react";

class Image extends Component{


  update_image_modal = () => {

    const { src, title, thumbs_up_tot, thumbs_down_tot, comments_tot } = this.props;

    const Image = {
      src,
      title,
      thumbs_up_tot,
      thumbs_down_tot,
      comments_tot
    };

    this.props.update_image_modal(Image);
  };

  render(){

    const { thumbs_up_tot, thumbs_down_tot, comments_tot } = this.props;

    return (
     [
      <figure key={this.props.id} className="col-4 my-5 text-center">
        <img src={this.props.src} alt={this.props.alt} />
        <figcaption className="row my-1">
          <span className="fa fa-comment-o col-4" aria-hidden="true">{ comments_tot }</span>
          <span className="fa fa-thumbs-o-up col-4" aria-hidden="true">{ thumbs_up_tot }</span>
          <span className="fa fa-thumbs-o-down col-4" aria-hidden="true">{ thumbs_down_tot }</span>
        </figcaption>
        <button type="button" className="btn col-12" data-toggle="modal" data-target="#modalImage" onClick={this.update_image_modal}>full size and comment</button>
      </figure>
      ]

    );
  }

}

export default Image;

