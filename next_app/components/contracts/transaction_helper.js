import { UPDATE_USER_PROFILE, SET_USER_CROWDSALE,SET_USER } from "../../redux/store.js";
import { toastr } from "react-redux-toastr";
import Router from "next/router";
import {update_wallet} from './Della_Stable_Token.js'
// import $ from "jquery";

export async function run_transaction({
  props,
  fn,//fn to call with web3
  to,//who the transactio is going too
  value,//amount of wei sending with transaction
  onReceipt, onTxHash, onError
}) {
  const web3_store = props.web3
  const{web3, selected_account, browser_wallet_unlocked} = web3_store
  const _csrf = props.csrf;
  const {dispatch} = props;
  let default_account = web3.eth.defaultAccount;
  console.log({default_account});
  console.log(default_account ? true : false)
  
  if (!default_account) return toastr.error("Need to set an account");

  const address_type = selected_account.type
  console.log(address_type == "BROWSER" && !browser_wallet_unlocked)

  if(address_type == "BROWSER" && !browser_wallet_unlocked){
    /* opwn modal to unlock wallet */
     $('#unlock_wallet_modal').modal('show')
     return 

  }
  const tx_data = {
    from: default_account,
    to: to,
    value,
    data: fn ? fn.encodeABI() : ''
  };
  /* 6043924 gas needed to deploy a campaign, this has been giving me errors */
  // nonce, //default is web3.eth.getTransactionCount().
  // chainId, // default will use web3.eth.net.getId().
  // to, //The recevier of the transaction, can be empty when deploying a contract.
  // data, //The call data of the transaction, can be empty for simple value transfers.
  // value, //The value of the transaction in wei.
  // gasPrice //default web3.eth.getGasPrice
  // console.log(tx_data)
  try{

  
  const gas = await web3.eth.estimateGas(tx_data);
  console.log({ gas });
  tx_data.gas=Math.ceil(gas + (gas*.05))//adding 5% to gas becauase deploy campaign needs it smh
  // tx_data.gas = gas;
  const chainId = await web3.eth.net.getId();
  tx_data.gasPrice = await web3.eth.getGasPrice();
  tx_data.nonce = await web3.eth.getTransactionCount(default_account);
  tx_data.chainId = chainId;

  console.log(tx_data);
  const transaction_obj = { ...tx_data };
  console.log({ transaction_obj });


  // if(!web3.browser_wallet_unlocked) return toastr()



  let transactionHash;
 fn.send(transaction_obj) 
    .on("transactionHash", async transactionHash => {
      transactionHash = transactionHash;
      console.log(transactionHash);
      dispatch({ type: "WEB3_TRANSACTION_IN_PROGRESS", flag: true });

      /* TODO possible push these to server, or save somewehre, local storage? */
      await $.post("/add_transactionHash_to_account", {
        transactionHash,
        default_account,
        _csrf
      });
      check_if_mined(transactionHash, web3)
      if(onTxHash) onTxHash({transactionHash})
      // console.log({resp})
      /* Metamask will give me this hash, but not tell me when its mined */
      /* Need to check if wallet type = metamask */
      /* If it is, set interval to check for mined transaction hash */
      /* TODO */
    })

    .on("receipt", async receipt => {
      console.log('onRecept event')
      dispatch({ type: "WEB3_TRANSACTION_IN_PROGRESS", flag: false });

      console.log(receipt);
      /* DECIDED NOT TO DO< BUT SAVING :P */
      // var receipt = JSON.stringify(receipt)
      // const resp = await $.post('/add_receipt_to_account', {
      //   receipt, default_account, _csrf
      // }, {dataType:'json'})
      // console.log({resp})
      update_ui_based_on_events({ receipt, dispatch, _csrf, props });
      /* TODO add a large switch statement  */
      /* here to catch events and update UI accordingly */
      if(onReceipt) onReceipt({ receipt });
    })
    .on("error", (error) => {
      dispatch({ type: "WEB3_TRANSACTION_IN_PROGRESS", flag: false });
      /* No need to await, we dont care for response */
      // $.post('/add_failed_transactionHash_to_account', {
      //   transactionHash, default_account, _csrf
      // })

      if(error.message)toastr.error(`${error.message}`)
      else toastr.error(`Sorry an error occured`)
      // console.log((error.split(' ')));
      // console.log(error.Error);
      console.log(error);
      if(onError) onError({ error });

      console.log(error.message);
      toastr.error(error.message);//TODO set up a a switch to handle these?
      //Returned error: sender account not recognized //Means we need to unlick wallet
      /* Errors some times not enough gas, so retry with little more gas? */
      // return {error}
    });
  }catch(error){
    console.log(error)
      if(onError) onError({ error });

    return false
  }
}

async function update_ui_based_on_events({ receipt, dispatch, _csrf, props }) {
  /* update walelt data dst and eth balance */
  update_wallet(props.web3.web3.eth.defaultAccount, props)
  let { events } = receipt;
  for (let key in events) {
    switch (key) {
      /* Campaign deployed */
      case "Campaign_Deployed":{
      let campaign_deployed_data =await set_campaign_deployed_flag({ _csrf, receipt });
      if(!campaign_deployed_data) return toastr.error("Sorry an error occured")
      const {new_crowdsale_data, updated_user} = campaign_deployed_data
      if(!new_crowdsale_data || !updated_user)return toastr.error('Sorry an error occured!!')
      console.log(new_crowdsale_data)
      console.log(updated_user)
      
      dispatch(
        SET_USER(updated_user)
        );
        dispatch(
          SET_USER_CROWDSALE(new_crowdsale_data)
          )
          Router.push("/campaign-manage");
          
          break;
        }
          /* Terms_and_agreement_signed */
      case "Terms_and_agreement_signed":{
        return dispatch(
          UPDATE_USER_PROFILE({
            key: "signed_terms_and_agreement",
            value: true
          })
        );
      }
    }
  }
}

function display_receipt(receipt) {
  console.log("display_receipt");
  const { gasPrice, gas, blockNumber } = receipt;
  // const { NEW_ETH_PRICE } = events;
  // const { returnValues } = NEW_ETH_PRICE;
  console.log(receipt);
  console.log({ gas, gasPrice, blockNumber });

  // get_events("NEW_ETH_PRICE", blockNumber - 30, "latest");
  // listen_for_events()
  return;
}

function check_if_mined(hash, web3) {
  var null_blockNumber_bug_count = 0;
  const miner_timer = setInterval(async () => {
    const receipt = await web3.eth.getTransaction(hash);
    // console.log({receipt})
    if (!receipt.blockNumber) {
      null_blockNumber_bug_count++;
      console.log({ null_blockNumber_bug_count });
      return;
    }
    clearInterval(miner_timer);
    display_receipt(receipt);
  }, 3000);
}

async function set_campaign_deployed_flag({ _csrf, receipt }) {
  const { transactionHash, blockNumber, events } = receipt;
  const deployed_campaign_data = events.Campaign_Deployed.returnValues;
  console.log(deployed_campaign_data);

  const {
    campaign_address,
    token_address,
    wallet_address
  } = deployed_campaign_data;
  let resp = await $.post("/user/set_campaign_deployed", {
    campaign_address,
    token_address,
    wallet_address,
    _csrf,
    transactionHash,
    blockNumber
  });
  if (resp.err) {
    // toastr.error(resp.err);
    console.log(`ERROR set_campaign_deployed_flag ${resp.err}`);
    return {new_crowdsale_data:null, updated_user:null}
  } else {
    console.log(resp);
    const {new_crowdsale_data, updated_user} = resp
    /* Need to get the user_crowdsale data resp.user_crowdsale? */
    return {new_crowdsale_data, updated_user}

  }
}
