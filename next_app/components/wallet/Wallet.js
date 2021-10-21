import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { withRouter } from "next/router";
import { retry } from "../../components/utils/index.js";
import Unlock_Browsar_Wallet_Modal from "../modals/Unlock_Browsar_Wallet_Modal.js";
import {
  set_has_wallet,
  get_all_browser_addresses_and_balances,
  loading,
  stop_loading,
  set_has_browser_wallet,
  // REMOVE_ADDRESS_FROM_WALLET,
  // add_new_account_address,
  // set_metamask_wallet,
  // set_selected_account,
  // get_eth_balance
} from "../../redux/web3_reducers.js";
import { NEW_ETH_PRICE_EVENT_INIT, get_eth_price_on_chain } from "../contracts/Eth_Price_Oracle.js";
import {dst_balance_of} from '../contracts/Della_Stable_Token_balance.js'

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wallet_password:undefined
    };
    
    this.add_to_user_model = this.add_to_user_model.bind(this)
    this.load_wallet = this.load_wallet.bind(this)
    this.unlock_wallet = this.unlock_wallet.bind(this)
    this.handle_dispatch_input = this.handle_dispatch_input.bind(this)
  }

  componentDidMount() {
    /* Find account data from browser or metamask */
    if(this.props.web3.accounts_set) return
    var browser_wallet = localStorage.getItem("web3js_wallet");
    // if (browser_wallet == "[]") browser_wallet = false; //this empty array is still an empty wallet
    try {
      browser_wallet = JSON.parse(browser_wallet);
    } catch (err) {
      /* Whatever is in local storange isn't a proper wallet */
      browser_wallet = false;
    }

    if (!Array.isArray(browser_wallet) || browser_wallet.length == 0)
      browser_wallet = false;
      const {dispatch} = this.props
      const {web3} = this.props.web3

    /* This should just be set once */
    /*once we know we have a wallet */
    /* We can just update balances */
    if (browser_wallet) {
      console.log("Has browser wallet but not has wallet?");
      /* Grab first address in wallet, TODO possibly have main address variable */
      // const address = `0x${browser_wallet[0].address}`; //need "0x" yet not supplied..
      // if (!address) browser_wallet = false;
      dispatch(set_has_browser_wallet(true));
      // this.setState({ browser_wallet_in_storage: true });
      // console.log(this.props);
      // console.log(address);
      if(!this.props.accounts_set){

        
        retry('Waiting for web3 to call get_all_browser_addresses_and_balances',1000,  () => {
          const { web3 } = this.props.web3;
          // console.log({web3});
          if (!web3) return false;
           dispatch(get_all_browser_addresses_and_balances({web3}));
          this.start_event_listeners();
          return true
        });
        retry('waiting for adderss to be populated', 2000, ()=>{
          const {accounts_data, web3} =  this.props.web3
          if(!accounts_data.length) return false
          console.log(this.props.web3.accounts_data)
          accounts_data.map((data)=>this.add_to_user_model( data.address))

          accounts_data.map((data)=>dst_balance_of(this.props.dispatch,web3, data.address))
          return true
        })
        
      }

    }

  }

  async add_to_user_model(address){
    if(this.props.user &&
      this.props.user.wallet_addresses.indexOf(address.toLowerCase()<0)){
        console.log("ADDING ADDRESS TO ACCOUINT")
      /* add this address to the server */
      let _csrf = this.props.csrf
      let resp = await $.post('/user/add_account_address', {_csrf,address})
      if(!resp.ok)toastr.error(`Couldnt add ${address}`)
      console.log(resp)
    }
    

  }

  async start_event_listeners(){
    const {web3, dispatch}=this.props
    const {isConnected}= web3
    const web3_props = web3
    if(isConnected) console.log('WEB3 IS READY YET')
    console.log('EVENT LISTENERS ACTIVE')
    /* NEW ETH PRICE */
    get_eth_price_on_chain({web3_props, dispatch})
    NEW_ETH_PRICE_EVENT_INIT({web3_props, dispatch})
    // const subscription = web3_props.web3.eth.subscribe('logs'
    // , 
    // {
    //   address:'0x1b1f755C9dE75afe87f7cED03Ea2AA7D74BD5d44',
    //   topics:['0x85cc2eb6bb4a86ba50c8a6e951f178892950dbf2c37eda26fef47b723fc792d3']
    // }
    // , (err, result)=>{
    //   console.log(result)
    // })
    // .on('data', (data)=> console.log(data))
    // .on('changed', (data)=> console.log(data))

  }

  async load_wallet() {
    console.log('load wallet')
    // console.log(this.props)
    const { wallet_password } = this.props.web3;
    // if (!wallet_password) throw toastr.error("Please type in a password");

    try {
      const flag = true;
      // this.setState({ load_wallet_btn_txt: "Loading..." });
      const message = "Loading Wallet";
      this.props.dispatch(loading({ flag, message }));
      const { web3 } = this.props.web3;
      console.log(web3.eth.accounts.wallet)

      const wallet = await web3.eth.accounts.wallet.load(wallet_password);
      console.log(wallet)
      if (!wallet.length) throw "No Address found"; //No account_address found
      // console.log(wallet);
      // this.setState({ load_wallet_btn_txt: "Load Wallet" });

      /* This stop and start loading doesnt seem to work */
      this.props.dispatch(stop_loading());

      /* Has wallet state, we have the account address, and wallet? */
      this.props.dispatch(
        set_has_wallet({
          wallet,
          has_browser_wallet: true,
          has_wallet: true,
          browser_wallet_unlocked: true
        })
      );
      /* Get Ether balance for address */
      this.props.dispatch(get_all_browser_addresses_and_balances({ web3 }));
      const {accounts_data} =  this.props.web3
      if(!accounts_data.length) return false
      console.log(this.props.web3.accounts_data)
      accounts_data.map((data)=>dst_balance_of(this.props.dispatch,web3, data.address))

      toastr.success("Wallet loaded sucesfully!");
    } catch (err) {
      // this.setState({ load_wallet_btn_txt: "Load Wallet" });

      this.props.dispatch(stop_loading());
      console.log("err");
      console.log(err);
      toastr.error("Incorrect Password / No address found");
    }
  }//LOAD WALLET

  unlock_wallet() {
    console.log("unlock_wallet");
    const { wallet_password } = this.props.web3;
    console.log({ wallet_password });
    this.load_wallet();
  }//UNLOCK_WALLET

  handle_dispatch_input(type, key, value) {
    this.props.dispatch({
      type, [key]:value
    })
      // this.setState({
      //   [key]: value
      // });
  }

  render() {
    console.log('WA::ETT')
    // console.log(this.props)
    return <>
          <Unlock_Browsar_Wallet_Modal
            unlock_wallet={this.unlock_wallet}
            handle_dispatch_input={this.handle_dispatch_input}
            wallet_password={this.props.web3.wallet_password}
          />    </>;
  }
}

function mapStateToProps(state) {
  const { user, csrf, locals, web3 } = state;
  return {
    ...user,
    ...csrf,
    ...locals,
    web3
  };
}

export default connect(mapStateToProps)(withRouter(Wallet));
