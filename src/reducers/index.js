import { combineReducers } from 'redux';
import users from './usersReducer';
import redirects from './redirectReducer';
import errors from './errorsReducer';
import images from './imagesReducer';

const rootReducer = combineReducers({
  users,
  redirects,
  errors,
  images
});

export default rootReducer;