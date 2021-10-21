import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { reducer as toastrReducer } from "react-redux-toastr";
import web3_reducer from "./web3_reducers.js"
const InitialState = {
  two_factor_auth: {
    //two_factor_auth
    current_eth_price:'',
    balance: 0, //if not already present....
    transaction_processing: false,
    verifying_wallet_password: false,
    incorrect_wallet_password: false,
    two_factor_auth: {
      second_transaction_gas_estimate: 0,

      user_id: "",
      gas_estimate: 21000,
      wallet_password: "",
      gas_price: 8,
      median_time: 30,
      transaction_type: "",
      to: "",
      from: "",
      value: 0,
      fn_data: {
        fn: "",
        args: []
      }
    }
  },
  csrf: "",
  user: {},
  locals: {},
  crowdsales: {
    user_crowdsale: {},
    crowdsales: [],
    campaign_view_data:{}
  }
};

export const actionTypes = {
  SET_CSRF: "SET_CSRF",
  SET_USER: "SET_USER",
  SET_LOCALS: "SET_LOCALS",
  SET_FIRST_NAME: "SET_FIRST_NAME"
  // IS_WINDOW: 'IS_WINDOW',
  // INCREMENT: 'INCREMENT',
  // DECREMENT: 'DECREMENT',
  // RESET: 'RESET'
};

const two_factor_auth_reducer = (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_TWO_FACTOR_AUTH":
      return {
        ...state,
        [action.key]: action.value
      };
    default:
      return state;
  }
};

const initial_crowdsale_state={
  user_crowdsale:{
    crowdsale_youtube_link:''
  },
  crowdsales:[],
  campaign_view_data:{}

}

export const add_liked_crowdsale_to_user = (campaign_id)=>{
  return async dispatch =>{
    dispatch({
      type:"ADD_LIKED_CROWDSALE", campaign_id
    })
  }
}

export const set_campaign_view_data = (campaign_view_data)=>{
  return async dispatch =>{
    dispatch({
      type:"SET_CAMPAIGN_VIEW_DATA", campaign_view_data
    })
  }

}

const crowdsale_reducer = (state = {}, action) => {
  switch (action.type) {
    // case "UPDATE_CROWDSALE_VIEW_DATA":
    //   return{
    //     ...state, campaign_view_data
    //   }
    case "SET_CAMPAIGN_VIEW_DATA_PROPERTY":{
      const {property, value} = action
      // console.log({property, value})
      return{
     
        ...state, campaign_view_data:{
        ...state.campaign_view_data,
        [property]:value
        }
        
      }

    }
    case "SET_CAMPAIGN_VIEW_DATA":{
      const {campaign_view_data}=action
      return{
        ...state, campaign_view_data
      }
    }
    case "SET_MAIN_USER_CROWDSALE_IMGS":
      return {
        ...state, user_crowdsale:{
          ...state.user_crowdsale,
          main_crowdsale_img:action.img
        }
      }
    case "UPDATE_CROWDSALE":
      // console.log(state);
      console.log("UPDATE_CROWDSALE");
      // console.log(action);
      // return state
      return {
        ...state,
        user_crowdsale: {
          ...state.user_crowdsale,
          [action.key]: action.value
        }
      };
      case "SET_CROWDSALE_PHOTOS":
      // console.log(action.photos_array)
        return{
          ...state, 
          user_crowdsale:{
            ...state.user_crowdsale,
            photos:[...action.photos_array]

          }
        }
    case "SET_CROWDSALES":
      return { ...state, crowdsales: action.crowdsales };
      
    case "SET_USER_CROWDSALE":
      console.log("SET_USER_CROWDSALE");
      // console.log(action.user_crowdsale);
      // console.log(state);
      return { ...state, user_crowdsale: {...action.user_crowdsale} };
    default:
      return state;
  }
};

const user_reducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_LIKED_CROWDSALE":{
      let {campaign_id} = action
      let liked_crowdsales = [...state.user.liked_crowdsales]
      liked_crowdsales.push(campaign_id)
      console.log(liked_crowdsales)
      console.log(state)
      return{
        ...state, user:{
          ...state.user, liked_crowdsales
        }

      }
    }
    case "ADD_PUBLIC_ACCOUNT_ADDRESS":
      return{
        ...state,
        user:{
          ...state.user,
          wallet_address:action.new_account
        }
      }
    case "UPDATE_USER_PROFILE":
      // console.log(state);
      console.log("UPDATE_USER_PROFILE");
      // console.log(action);
      // return state
      return {
        ...state,
        user: {
          ...state.user,
          [action.key]: action.value
        }
      };
    /* Sets an array of profile imgs */
    case "SET_PROFILE_IMGS":
      return {
        ...state,
        user: {
          ...state.user,
          profile_imgs: action.img_array
        }
      };
    // case 'SET_PROFILE_IMGS':
    // return{...state,
    //   user:{
    //     ...state.user,
    //     primary_email:action.img_array
    //   }
    // }
    /* Initialize edit email verification */
    // case 'SET_PROFILE_IMGS':
    // return{...state,
    //   user:{
    //     ...state.user,
    //     profile_imgs:action.img_array
    //   }
    // }

    case "UPDATE_USER_CURRENT_ADDRESS":
      return {
        ...state,
        user: {
          ...state.user,
          current_address: {
            ...state.user.current_address,
            formatted_address: action.value
          }
        }
      };

    case actionTypes.SET_USER:
      console.log("Setting user ACTION");
      // console.log(action.user);
      return { ...state, user: action.user };

    default:
      return state;
  }
};

const locals_reducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_LOCALS":
      return { ...state, locals: action.locals };
    case "UPDATE_LOCALS":
      return { ...state, [action.key]: action.value };

    default:
      return state;
  }
};

const csrf_reducer = (state = "", action) => {
  switch (action.type) {
    case "SET_CSRF":
      return {
        csrf: action.csrf
      };
    default:
      return state;
  }
};

// REDUCERS
// const app_reducer = (state={}, action) => {
//   switch (action.type) {
//     // case actionTypes.SET_LOCALS:
//     //   return {...state,
//     //     locals: action.locals
//     //   }
//     // case actionTypes.SET_CSRF:
//     //   return {...state,
//     //     csrf: action.csrf
//     //   }
//     case actionTypes.SET_USER:
//       return {...state,
//         user: action.user
//       }

// default: return state
//   }
// }

const reducers = {
  two_factor_auth: two_factor_auth_reducer,
  crowdsales: crowdsale_reducer,
  toastr: toastrReducer,
  user: user_reducer,
  csrf: csrf_reducer,
  locals: locals_reducer,
  web3:web3_reducer || undefined
};

const combined_reducers = combineReducers(reducers);

// ACTIONS
export const SET_MAIN_USER_CROWDSALE_IMGS = img => dispatch => {
  console.log("SET_MAIN_USER_CROWDSALE_IMGS");
  // console.log(img_array);
  return dispatch({ type: "SET_MAIN_USER_CROWDSALE_IMGS", img });
};
export const UPDATE_TWO_FACTOR_AUTH = ({ key, value }) => dispatch => {
  const type = "UPDATE_TWO_FACTOR_AUTH";
  return dispatch({ type, key, value });
};
export const SET_USER_CROWDSALE = user_crowdsale => dispatch => {
  // console.log(user_crowdsale)
  const type = "SET_USER_CROWDSALE";
  return dispatch({ type, user_crowdsale });
};
export const UPDATE_USER_PROFILE = ({ key, value }) => dispatch => {
  const type = "UPDATE_USER_PROFILE";
  return dispatch({ type, key, value });
};
export const SET_PROFILE_IMGS = img_array => dispatch => {
  console.log("SET_PROFILE_IMGS");
  // console.log(img_array);
  return dispatch({ type: "SET_PROFILE_IMGS", img_array });
};
export const SET_FIRST_NAME = firstname => dispatch => {
  console.log("firstname ACTION");
  // console.log(firstname)
  return dispatch({ type: actionTypes.SET_FIRST_NAME, firstname });
};
export const SET_CSRF = csrf => dispatch => {
  console.log("csrf ACTION");
  // logger.log(csrf)
  return dispatch({ type: actionTypes.SET_CSRF, csrf });
};
export const SET_USER = user => dispatch => {
  console.log("user ACTION");
  // logger.log(user.primary_email)
  return dispatch({ type: actionTypes.SET_USER, user });
};
export const SET_LOCALS = locals => dispatch => {
  console.log("locals ACTION");
  // logger.log(locals)
  return dispatch({ type: actionTypes.SET_LOCALS, locals });
};
export const is_window = () => dispatch => {
  // console.log('is_window? ACTION')
  return dispatch({ type: actionTypes.IS_WINDOW });
};

export function initializeStore(initialState = InitialState) {
  return createStore(
    combined_reducers,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
}
