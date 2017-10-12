import React, { Component } from "react";
import bvkingogram_image from "../_img/bVikingFullBlack-logo-150x150.png"

import Image from "./Image"

class Images extends Component{

  state = {
    images:{
      img1:{
        src: bvkingogram_image,
        alt: "img1",
        title: "img1_title",
        thumbs_up_tot: 10,
        thumbs_down_tot: 2,
        comments_tot: 34
      },
      img2:{
        src: bvkingogram_image,
        alt: "img2",
        title: "img2_title",
        thumbs_up_tot: 20,
        thumbs_down_tot: 22,
        comments_tot: 341
      },
      img3:{
        src: bvkingogram_image,
        alt: "img3",
        title: "img3_title",
        thumbs_up_tot: 30,
        thumbs_down_tot: 32,
        comments_tot: 343
      },
      img4:{
        src: bvkingogram_image,
        alt: "img4",
        title: "img4_title",
        thumbs_up_tot: 44,
        thumbs_down_tot: 42,
        comments_tot: 344
      },
    }
  };

  render(){

    const { images } = this.state;
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

export default Images;

