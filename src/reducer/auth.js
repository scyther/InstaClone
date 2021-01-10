import {SET_USER, IS_AUTHENTICATED, SET_LOADING} from '../action/action.types';

const initialState = {
  user: null,
  loading: false,
  isAuthenticated: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case IS_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload,
        loading: false,
      };
      case SET_LOADING:
        return{
          ...state,
          loading: action.payload
        }

    default:
      return state;
  }
};
