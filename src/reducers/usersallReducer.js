import initialState from './initialState';
import * as actionType from '../actions/actionTypes';

export default function usersall(state = initialState.usersall, action) {

  switch (action.type) {
    case actionType.GET_ALL_USERS:
      return action.usersall;
    case actionType.PATCH_USER_ROLE:

      state.filter((userObj) => {
        if(userObj.uid === action.user.uid){ userObj.role = action.user.role }
        return userObj;
      });
      return [...state];
    default:
      return state;
  }

};