import {combineReducers} from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import profileReducer from './profileReduer';
import postReducer from './postReducer';
import requestReducer from './requestReducer';
import chatReducer from './chatReducer';
import balanceReducer from './balanceReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducer,
  post: postReducer,
  request: requestReducer,
  chat: chatReducer,
  balance: balanceReducer
});