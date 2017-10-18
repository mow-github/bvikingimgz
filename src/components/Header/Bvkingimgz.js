import React, { Component } from "react";
import bvkingimgz_image from "../_img/bVikingFullBlack-logo-150x150.png"
import { Link } from 'react-router-dom'

class Bvkingimgz extends Component{

  render(){

    /*
    * 1. Returns a Bvikingimgz image + span text ( Link wrapper )
    *
    * Note: it returns 3x different types, depending on the props.
    *   - linkClassName: true => some extra Link css
    *   - logoSmall: true => return a "small" version of the content
    *
    * */

    let linkClassName = "mx-auto my-5";
    if(!this.props.linkClassName){
      linkClassName = "";
    }

    let content =
      <div className="container row">
        <Link to="/" className={linkClassName}>
          <img src={bvkingimgz_image} alt="bvkingimgz_image"/>
          <span className="bvkingimgz_image_text">imgz</span>
        </Link>
      </div>;

    if(this.props.logoSmall){
      content =
      <Link className="navbar-brand" to="/">
        <img src={bvkingimgz_image} alt="bvkingimgz_image" width="64"/>
        <span className="bvkingimgz_image_text_small">imgz</span>
      </Link>
    }

    return (content);
  }

}

export default Bvkingimgz;
