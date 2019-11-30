import {GET_BALANCE} from '../actions/types';

const initialState = {
  balance:'0'
}

export default function(state = initialState, action){
  switch (action.type) {

      case GET_BALANCE:
      return {
        ...state,
        balance : action.payload
      };
    default:
    return state;
  }
}