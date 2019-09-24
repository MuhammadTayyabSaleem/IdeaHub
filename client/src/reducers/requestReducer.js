import {GET_REQUEST,GET_REQUESTS,DELETE_REQUEST, REQUEST_LOADING, CLEAR_CURRENT_REQUEST} from '../actions/types';

const initialState = {
  request:{},
  requests:[],
  loading: false
}

export default function(state = initialState, action){
  switch (action.type) {

      case REQUEST_LOADING:
      return {
        ...state,
        loading:true
      };

      case GET_REQUEST:
      return {
        ...state,
        request: action.payload,
        loading:false
      };

      case GET_REQUESTS:
      return {
        ...state,
        requests: action.payload,
        loading:false
      };

      case CLEAR_CURRENT_REQUEST:
      return {
        ...state,
        request: null,
      };
      case DELETE_REQUEST:
      return {
        ...state,
        requests: state.requests.filter(request => request._id !== action.payload)
      };
    default:
    return state;
  }
}