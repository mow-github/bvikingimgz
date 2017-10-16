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
    case actionType.PATCH_IMAGE:

      state.filter(image => {
        if(image.imgid === action.image.imgid){
          image.comments_tot = action.image.comments_tot;
          image.thumbs_down_tot = action.image.thumbs_down_tot;
          image.thumbs_up_tot = action.image.thumbs_up_tot;
        }
        return image;
      });

      return [...state];
    case actionType.PATCH_IMAGE_POST_COMMENT_INDEX:

      state.filter(image => {
        if(image.imgid === action.comment.imgid){
          console.log("..",image);

          image.comments = {...image.comments,  [action.comment.cid]:{ [action.comment.cid]: true } };
        }
        return image;
      });

      return [...state];
    default:
      return state;
  }
};