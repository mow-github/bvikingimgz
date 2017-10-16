import initialState from './initialState';
import * as actionType from '../actions/actionTypes';


export default function counters(state = initialState.counters, action) {
  switch (action.type) {
    case actionType.COUNT_IMAGE:
      state.images += action.imgCount;
      return {...state};
    case actionType.COUNT_USER:
      state.users += action.userCount;
      return {...state};
    case actionType.COUNT_COMMENT:
      state.comments += action.commentCount;
      return {...state};
    default:
      return state;
  }
};