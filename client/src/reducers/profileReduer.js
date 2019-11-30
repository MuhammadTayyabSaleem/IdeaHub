import {GET_PROFILE,GET_PROFILES, PROFILE_LOADING, CLEAR_CURRENT_PROFILE,ADD_PROFILES_COUNT} from '../actions/types';

const initialState = {
  profile: null,
  profiles: null,
  loading: false,
  count: 0
}

export default function(state = initialState, action){
  switch (action.type) {

      case PROFILE_LOADING:
      return {
        ...state,
        loading:true
      };

      case GET_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading:false
      };

      case GET_PROFILES:
      return {
        ...state,
        profiles: action.payload,
        loading:false
      };
      case ADD_PROFILES_COUNT:
      return {
        ...state,
        count: action.payload
      };

      case CLEAR_CURRENT_PROFILE:
      return {
        ...state,
        profile: null,
      };
    default:
    return state;
  }
}