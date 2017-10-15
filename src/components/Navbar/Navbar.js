import React, { Component } from "react";

import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import { bindActionCreators } from 'redux';

import Bvkingimgz from "../Header/Bvkingimgz"
import { Link } from 'react-router-dom'

class Navbar extends Component{

  render(){
    return (
      <div className="container">
        <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
          <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <Bvkingimgz linkClassName={false} logoSmall={true} />

          <div className="collapse navbar-collapse" id="navbarHeader">
            <div className="navbar-nav mr-auto">

              <Link className="nav-item nav-link ml-5" to="/">Bvikingimgz</Link>

              <form className="form-inline hidden-sm-down">
                <input className="form-control" type="text" placeholder="Filter imgz" />
                <div className="input-group-addon" ><span className="fa fa-search"></span></div>
              </form>

            </div>
            <div className="navbar-nav ml-auto">
              {!this.props.users && <Link className="nav-item nav-link ml-5" to="/register">Register</Link> }
              {!this.props.users && <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modalLogin">login modal</button>}
              {this.props.users && <button className="btn btn-danger" onClick={this.props.signOut}>signOut - { this.props.users.email }</button> }
            </div>
          </div>

        </nav>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    users: state.users,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Navbar);