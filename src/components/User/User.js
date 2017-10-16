import React, { Component } from "react";

import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import { bindActionCreators } from 'redux';

import Navbar from "../Navbar/Navbar";

class User extends Component{

  render(){

    console.log( this.props.users );

    return (
      <div>
        <Navbar />
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    users:    state.users,
    errors:   state.errors,
    images:   state.images,
    counters: state.counters,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(User);

