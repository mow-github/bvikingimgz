import { combineReducers } from 'redux';
import users from './usersReducer';
import redirects from './redirectReducer';
import errors from './errorsReducer';
import images from './imagesReducer';
import counters from './countersReducer';

const rootReducer = combineReducers({
  users,
  redirects,
  errors,
  images,
  counters
});

export default rootReducer;