import { combineReducers } from 'redux';
import users from './usersReducer';
import redirects from './redirectReducer';
import errors from './errorsReducer';
import images from './imagesReducer';
import counters from './countersReducer';
import comments from './commentsReducer';

const rootReducer = combineReducers({
  users,
  redirects,
  errors,
  images,
  counters,
  comments
});

export default rootReducer;