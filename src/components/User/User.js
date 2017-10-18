import React, { Component } from "react";

import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import { bindActionCreators } from 'redux';

import { Redirect } from 'react-router-dom';

class User extends Component{

  componentDidMount(){
    this.props.actions.getAllUsers();
  }

  componentWillReceiveProps(nextProps){
    // console.log( nextProps );
  }

  render(){

    if(this.props.users.role !== "admin"){
      this.props.actions.setError("You are not allowed to access this route - admin only -");
      return <Redirect to="/"/>;
    }



    const usersallMapped = this.props.usersall.map((user,key) => {
      // not allowed to change the currentUser
      let content = null;
      if (this.props.users.email !== user.email) {

        content = (
          <li key={key} className="list-group-item justify-content-between">{user.email}
            <span>
              <span className="badge badge-default badge-pill">{user.role}</span>
              <span className="fa fa-pencil-square-o editUserBtn" title="Update the user role" onClick={ () => this.props.actions.updateUserRole(user) }></span>
            </span>
          </li>
        );
      }
      return content;

    });

    return (
      [
        <ul key="UserUl" className="list-group">
          {usersallMapped}
        </ul>
      ]
    );
  }

}

function mapStateToProps(state) {
  return {
    users:    state.users,
    errors:   state.errors,
    images:   state.images,
    counters: state.counters,
    usersall: state.usersall,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(User);

