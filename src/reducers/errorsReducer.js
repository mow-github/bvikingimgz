import initialState from './initialState';
import * as actionType from '../actions/actionTypes';


export default function errors(state = initialState.errors, action) {
  switch (action.type) {
    case actionType.FETCH_ERROR:
      return action.error.message;
    case actionType.UPDATE_ERROR:
      return action.error;
    default:
      return state;
  }
};