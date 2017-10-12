import React, { Component } from "react";

import Bvkingimgz from "../Header/Bvkingimgz"


class Header extends Component{

  render(){
    return (
      <div className="container my-5">

        <div className="row">
          <div className="col-4">

{/*            <Link to="/">
              <img src={bvkingimgz_image} alt="bvkingimgz_image"/>
              <span className="bvkingimgz_image_text">imgz</span>
            </Link>*/}

            <Bvkingimgz linkClassName={false} />

          </div>
          <div className="col-8">
            <h3>Bvikingimgz</h3>
            <div className="my-3">
              <div><span className="badge badge-default col-2">50 </span><span className="col-10">users</span></div>
              <div><span className="badge badge-default col-2">100</span><span className="col-10">images</span></div>
              <div><span className="badge badge-default col-2">349</span><span className="col-10">comments</span></div>
            </div>
            <p>Bvikingimgz - Register and share your images... and don't forget to leave a comment or a like :) </p>
          </div>
        </div>

      </div>
    );
  }

}

export default Header;

