import { combineReducers } from 'redux';
import users from './usersReducer';
import redirects from './redirectReducer';

const rootReducer = combineReducers({
  users,
  redirects
});

export default rootReducer;