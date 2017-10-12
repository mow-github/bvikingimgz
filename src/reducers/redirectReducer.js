import initialState from './initialState';
import * as actionType from '../actions/actionTypes';

export default function redirects(state = initialState.redirects, action) {

  switch (action.type) {
    case actionType.REDIRECT_ACCESS_DENIED:
      return action.redirectMsg;
    default:
      return state;
  }

};