import React, { Component } from "react";

class Error extends Component{

  render(){

    const { errors } = this.props;

    let content =
      <p className="alert alert-danger container mx-10">{errors}
        <button className="close" onClick={this.props.updateError}>
          <span aria-hidden="true">&times;</span>
        </button>
      </p>;


    if(errors.length === 0){
      content = null;
    }

    return ( content );
  }

}

export default Error;

