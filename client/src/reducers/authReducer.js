import {SET_CURRENT_USER,UPDATE_BALANCE} from '../actions/types';
import isEmpty from '../validation/is-empty';

const initialState = {
  isAuthenticated:false,
  user:{}
}
export default function(state = initialState, action){
  switch(action.type) {
    case SET_CURRENT_USER:
    return{
      ...state,
      isAuthenticated: !isEmpty(action.payload), user: action.payload
    }; 
    case UPDATE_BALANCE:
    return{
      ...state,
      balance:action.payload
    }
    default:
      return state;
  } 
}