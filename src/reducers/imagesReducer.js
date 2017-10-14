import initialState from './initialState';
import * as actionType from '../actions/actionTypes';


export default function errors(state = initialState.images, action) {
  switch (action.type) {
    case actionType.POST_IMAGE:
      return [...state, action.image];
    case actionType.REMOVE_IMAGE:
      return state.filter(image => image.imgid !== action.imgid);
    case actionType.GET_ALL_IMAGES:
      return action.images || [];
    default:
      return state;
  }
};