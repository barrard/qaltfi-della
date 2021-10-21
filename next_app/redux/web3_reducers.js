
import Web3 from "web3";
// import truffleConfig from '../../truffle.js'
import { retry } from "../components/utils/index.js";
import {dst_balance_of} from '../components/contracts/Della_Stable_Token_balance.js'

// ------------------------------------
// Constants
// ------------------------------------
export const WEB3_CONNECTED = "WEB3_CONNECTED";
export const WEB3_DISCONNECTED = "WEB3_DISCONNECTED";
export const USER_BALANCE = "USER_BALANCE";
export const USER_ACCOUNT = "USER_ACCOUNT";
export const SET_HAS_WALLET = "SET_HAS_WALLET";
export const SET_HAS_BROWSER_WALLET = "SET_HAS_BROWSER_WALLET";
export const LOADING = "LOADING";
export const STOP_LOADING = "STOP_LOADING";
export const ADD_NEW_ACCOUNT_ADDRESS = "ADD_NEW_ACCOUNT_ADDRESS";
export const SET_ACCOUNTS_DATA = "SET_ACCOUNTS_DATA";
export const SET_METAMASK_WALLET = "SET_METAMASK_WALLET";
export const SET_SELECTED_ACCOUNT = "SET_SELECTED_ACCOUNT";

// ------------------------------------
// Actions
// ------------------------------------




export const REMOVE_ADDRESS_FROM_WALLET = address => {
  return dispatch => {
    dispatch({
      type: "REMOVE_ADDRESS_FROM_WALLET",
      address
    });
  };
};

export function get_all_account_balances(web3, accounts) {
  accounts.forEach(async (account, index) => {
    console.log({ account, index });
    await get_user_balance(web3, account, index);
  });
}

/* Just get the users balance per address */
export const get_user_balance = (web3, account_address, account_index) => {
  return async dispatch => {
    try {
      console.log("get_user_balance");
      console.log(web3);
      console.log({ account_index });
      console.log(account_address);
      const balance = await get_eth_balance(web3, account_address);
      dispatch({
        type: USER_BALANCE,
        balance,
        account_index
      });
    } catch (err) {
      console.log("err");
      console.log(err);
    }
  };
};

/* internal function to get balance of address */
export const get_eth_balance = async (web3, account_address) => {
  if (!account_address)
    return console.log("Need to provide an account address");

  try {
    // console.log(web3);
    // console.log(account_address);
    let balance = await web3.eth.getBalance(account_address);
    console.log({ account_address });
    console.log({ balance });
    return web3.utils.fromWei(balance, "ether");
  } catch (err) {
    console.log("err");
    // console.log(err);
    throw err;
  }
};

export const get_account = web3 => {
  console.log("GET ACCOUNT ACTION");
  console.log("get_account");
  return dispatch => {
    dispatch({
      type: USER_ACCOUNT,
      account: web3.eth.accounts[0]
    });
  };
};

export const add_new_account_address = ({ web3, address }) => {
  console.log({ address });
  return async dispatch => {
    let balance = await get_eth_balance(web3, address);
    dispatch({
      type: ADD_NEW_ACCOUNT_ADDRESS,
      address,
      balance
    });
  };
};

export const web3Connect = ({ BLOCKCHAIN_ENV, BLOCKCHAIN_NETWORK, INFURA_KEY }) => {
  return dispatch => {
    console.log({ BLOCKCHAIN_ENV, BLOCKCHAIN_NETWORK, INFURA_KEY });
    console.log({ BLOCKCHAIN_ENV, BLOCKCHAIN_NETWORK, INFURA_KEY });
    console.log({ BLOCKCHAIN_ENV, BLOCKCHAIN_NETWORK, INFURA_KEY });
    console.log({ BLOCKCHAIN_ENV, BLOCKCHAIN_NETWORK, INFURA_KEY });

    const web3Location = BLOCKCHAIN_ENV
      ? `https://${BLOCKCHAIN_NETWORK}.infura.io/v3/${INFURA_KEY}`
      : `${`http://${`192.168.0.12`}`}:${"8545"}`;
    const ws_web3Location = BLOCKCHAIN_ENV
      ? `wss://${BLOCKCHAIN_NETWORK}.infura.io/ws/v3/${INFURA_KEY}`
      : `${`ws://${`192.168.0.12`}`}:${"8545"}`;

    console.log("web3connect");
    // let web3Location = `http://${truffleConfig.rpc.host}:${truffleConfig.rpc.port}`
    // let web3Location = `${`http://${`192.168.0.12`}`}:${"8545"}`;
    // let web3Location = `https://${`rinkeby`}.infura.io/${`TjRTQBJlDPM6sQNN3Yyy`}`;

    // this.state.web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    /* Use Metamask */
    // if (false) {
      if (typeof web3 !== "undefined") {
        console.log("this.state.web3 is enabled");
      const web3 = new Web3(Web3.givenProvider);
      console.log(web3);
      console.log(web3.currentProvider);

      const meta_proxy = Object.assign({}, web3.currentProvider);
      console.log(meta_proxy);
      // Object.keys(meta_proxy).forEach(key=>console.log(key))
      // console.log( meta_proxy.hasOwnProperty('_metamask') ? 'Metamask':'Other')

      // console.log(web3.currentProvider.metamask)
      const provider = meta_proxy.hasOwnProperty("_metamask")
        ? "Metamask"
        : "Other";

      dispatch({
        type: WEB3_CONNECTED,
        payload: {
          web3,

          ws_web3: new Web3(
            new Web3.providers.WebsocketProvider(
              `${ws_web3Location}`
            )
          ),
          provider,
          isConnected: true
        }
      });

      /* Use Infura */
    } else {
      console.log("Connect to own web3 provider");
      dispatch({
        type: WEB3_CONNECTED,
        payload: {
          ws_web3: new Web3(
            new Web3.providers.WebsocketProvider(
              `${ws_web3Location}`
            )
          ),
          web3: new Web3(
            new Web3.providers.HttpProvider(
              `${web3Location}`
              ,{
                headers: [{
                  name: 'Access-Control-Allow-Origin',
                  value: `${web3Location}`
                }]
              }
            )
          ),

          provider: "HTTP/Infura",
          isConnected: true
        }
      });
    }


  };
};


export function web3Connected({ web3, isConnected, ws_web3 }) {
  return {
    type: WEB3_CONNECTED,
    payload: {
      web3,
      isConnected,
      ws_web3, events_web3
    }
  };
}

export function web3Disconnected() {
  return {
    type: WEB3_DISCONNECTED,
    payload: {
      web3: null,
      isConnected: false
    }
  };
}

export function loading({ flag, message }) {
  console.log(new Date().getTime());
  return {
    type: LOADING,
    flag,
    message
  };
}
export function stop_loading() {
  console.log(new Date().getTime());

  return {
    type: STOP_LOADING
  };
}

export const get_wallet_balance_details =({web3}) => {
  console.log('get_wallet_balance_details')
  console.log('get_wallet_balance_details')
  console.log('get_wallet_balance_details')
  console.log('get_wallet_balance_details')
  console.log('get_wallet_balance_details')
  console.log('get_wallet_balance_details')
  console.log('get_wallet_balance_details')
  console.log('get_wallet_balance_details')
  console.log('get_wallet_balance_details')
  console.log('get_wallet_balance_details')
  const address = web3.eth.defaultAccount
  return async dispatch =>{
    dst_balance_of(dispatch, web3, address)

  }
}

export const get_all_browser_addresses_and_balances = ({ web3 }) => {
  return async dispatch => {
    retry(
      "get_all_browser_addresses_and_balances waiting for web3",
      2000,
      async () => {
        // const { web3 } = this.props.web3;
        console.log(web3);
        if (!web3) return false;
        const accounts_data = [];
        const web3js_wallet = JSON.parse(localStorage.getItem("web3js_wallet"));
        await Promise.all(
          web3js_wallet.map(async (account, index) => {
            const address = `0x${account.address}`;
            let balance = await get_eth_balance(web3, address);
            dst_balance_of(dispatch, web3, address)
            const type = "BROWSER";
            const wallet_index = index;
            const account_data = { address, balance, type, wallet_index };
            accounts_data[index] = account_data;
            console.log({ accounts_data });
          })
        );
        /* Dont forget metamask account */
        
        /* Add the addresses  */
        dispatch({
          type: "SET_ACCOUNTS_DATA",
          accounts_data,
          web3
        });
        return true;
      }
    );
  };
};

export const set_metamask_wallet = (web3, address) => {
  return async dispatch => {
    const balance = await get_eth_balance(web3, address);
    console.log({ balance });
    const metamask_account_data = {
      address,
      balance,
      type: "METAMASK"
    };

    dispatch({
      type: SET_METAMASK_WALLET,
      metamask_account_data
    });
  };
};

export function set_has_wallet({
  wallet,
  has_wallet,
  browser_wallet_unlocked,
  has_browser_wallet
}) {
  console.log({ wallet });
  // const account_address = [wallet[0].address];

  return {
    type: SET_HAS_WALLET,
    wallet,
    has_wallet,
    browser_wallet_unlocked,
    has_browser_wallet
    // account_address
  };
}

export function wallet_created({
  wallet,
  has_wallet,
  browser_wallet_unlocked,
  has_browser_wallet,
  wallet_password
}) {
  console.log({ wallet });

  return {
    type: "WALLET_CREATED",
    wallet,
    has_wallet,
    browser_wallet_unlocked,
    has_browser_wallet,
    wallet_password
  };
}

export function set_has_browser_wallet(has_browser_wallet) {
  console.log({ has_browser_wallet });
  return {
    type: SET_HAS_BROWSER_WALLET,
    has_browser_wallet
  };
}

export function set_selected_account(selected_account, web3) {
  console.log(`set defailt account to ${selected_account.address}`);
  web3.eth.defaultAccount = selected_account.address.toLowerCase();;
  return {
    type: SET_SELECTED_ACCOUNT,
    selected_account
  };
}

export const actions = {
  web3Connect,
  web3Connected,
  web3Disconnected
};

// ------------------------------------
// Action Handlers
// ------------------------------------
// const ACTION_HANDLERS = {
//   [WEB3_CONNECTED]: (state, action) => {
//     console.log('ACTION HANDLER!!')
//     console.log(state)
//     return action.payload
//   },
//   [WEB3_DISCONNECTED]: (state, action) => {
//     return action.payload
//   }
// }

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  transaction_in_progress: false,
  isConnected: false,
  has_wallet: false,
  selected_account:false,
  // balances: [0],
  accounts_set: false, //flag to run only once sett accounts
  accounts_data: [],
  transactions: [],
  // events: {},
  has_metamask_wallet: false,
  browser_wallet_unlocked: false,
  wallet_password: "",
  has_browser_wallet: false,
  wallet: null,
  loading: false,
  loading_message: "loading...",
  eth_price_data:{
    eth_price:'Loading...',
    eth_price_url:'', eth_price_time:''
  }
};
export default function web3_reducer(state = initialState, action) {
  switch (action.type) {
    case 'NEW_ETH_PRICE':{
      const {eth_price, eth_price_time, eth_price_url} = action;
      return{
        ...state,
        eth_price_data:{
          eth_price, eth_price_time, eth_price_url
        }

      }
    }
    case "DST_BALANCE":{
      console.log('DST_BALANCE')
      const {address, balance} = action
      // console.log({address, balance})
      const accounts_data = [...state.accounts_data]
      const account_index = accounts_data.findIndex(data => data.address == address.toLowerCase())
      console.log(accounts_data)
      console.log(address)
      if(account_index<0)return console.error(`account_index is ${account_index} not good`)
      accounts_data[account_index].dst_balance = balance
      // console.log(accounts_data)
      return{
        ...state, 
        accounts_data
      }
    }
    case "UPDATE_WALLET_PASSWORD": {
      console.log("UPDATE_WALLET_WASSPORD?");
      console.log({ action });
      const { wallet_password } = action;
      return { ...state, wallet_password };
    }

    case "REMOVE_ADDRESS_FROM_WALLET": {
      const { address } = action;
      const accounts_data = state.accounts_data.filter(
        data => data.address != address
      );
      return {
        ...state,
        accounts_data
      };
    }
    case "WEB3_TRANSACTION_IN_PROGRESS":
      return {
        ...state,
        transaction_in_progress: action.flag
      };
    case ADD_NEW_ACCOUNT_ADDRESS:
      console.log(action);
      const { address, balance } = action;
      const accounts_data = [...state.accounts_data];
      const type = "BROWSER";
      const new_account_obj = { balance, address, type };
      accounts_data.push(new_account_obj);
      return {
        ...state,
        accounts_data,
        browser_wallet_unlocked: true //flag to only load the browser wallet once
      };
    case SET_SELECTED_ACCOUNT:
      console.log(action);
      return {
        ...state,
        selected_account: action.selected_account
      };
    case SET_ACCOUNTS_DATA:{
      console.log("SET ACCOUNT DATA??");
      // if (state.accounts_set) return;
      let { accounts_data, web3 } = action;
      let {accounts_set} = state
      /* This keeps prior selected account if there is. */
      let selected_account_index = state.selected_account ?
      state.selected_account.wallet_index:0
      console.log({selected_account_index})
      console.log(accounts_data[selected_account_index]);
      console.log(`set defailt account to ${accounts_data[selected_account_index].address}`);
      web3.eth.defaultAccount = accounts_data[selected_account_index].address;
      if(accounts_set){
        let combine_accounts_data = state.accounts_data.map((act_data, index)=>(
          {...act_data, ...accounts_data[index]})
        )
        return {
          ...state,
          selected_account: combine_accounts_data[selected_account_index],
          accounts_data:combine_accounts_data,
        };

      }else{

        return {
          ...state,
          accounts_set: true, //flag to prevent re-running
          accounts_data,
          selected_account: accounts_data[selected_account_index]
        };
      }
    }
    case SET_METAMASK_WALLET:{
      const { metamask_account_data } = action;
      let new_accounts_data = [...state.accounts_data];
      metamask_account_data.wallet_index = new_accounts_data.length
      new_accounts_data.push(metamask_account_data);
      return {
        ...state,
        has_metamask_wallet: true,
        has_wallet: true,
        accounts_data: new_accounts_data
      };
    }
    case "USER_BALANCE":{
      console.log("USER_BALANCE");
      // console.log({ action });
      // console.log('wtf')
      // console.log(state.accounts_data)
      const { account_index, balance } = action;
      const accounts_data = [...state.accounts_data];
      accounts_data[account_index].balance = balance;

      return {
        ...state,
        accounts_data
      };
    }
    case LOADING:
      console.log("LOADING");
      // console.log("LOADING");

      const { flag, message } = action;
      console.log({ flag, message });
      return {
        ...state,
        loading: flag,
        loading_message: message
      };
    case STOP_LOADING:
      console.log("STOP LOADING");

      return {
        ...state,
        loading: false,
        loading_message: "Loading..."
      };
    case "WEB3_CONNECTED":
      var { web3, provider, ws_web3, events_web3 } = action.payload;
      console.log("WEB3_CONNECTED");

      return {
        ...state,
        isConnected: true,
        web3,
        provider,
        ws_web3, events_web3
      };
    case SET_HAS_WALLET:
      const {
        has_wallet,
        wallet,
        browser_wallet_unlocked,
        has_browser_wallet
      } = action;
      console.log(action);
      return {
        ...state,
        has_wallet: has_wallet,
        wallet: wallet,
        browser_wallet_unlocked,
        has_browser_wallet
      };
    case "WALLET_CREATED": {
      const {
        wallet_password,
        has_wallet,
        wallet,
        browser_wallet_unlocked,
        has_browser_wallet
      } = action;
      console.log(action);
      return {
        ...state,
        has_wallet: has_wallet,
        wallet: wallet,
        browser_wallet_unlocked,
        has_browser_wallet,
        wallet_password
      };
    }
    case SET_HAS_BROWSER_WALLET: {
      var { has_browser_wallet } = action;
      return {
        ...state,
        has_browser_wallet,
        browser_wallet_unlocked: false,
        has_wallet: true
      };
    }

    // case "SET_USER_CROWDSALE":
    //   console.log("SET_USER_CROWDSALE");
    //   console.log(action);
    //   console.log(state);
    //   return { ...state, user_crowdsale: action.user_crowdsale };
    default:
      return state;
  }
}
