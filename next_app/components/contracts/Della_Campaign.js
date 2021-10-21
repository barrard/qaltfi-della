import { Campaign_Crowdsale_abi, RefundEscrow_abi } from "../contract_abi.js";
import { run_transaction } from "./transaction_helper.js";
// import { get_wallet_balance_details } from "../../redux/web3_reducers.js";


// export async function buy_campaign_tokens({ token_amount, props }) {
//   const campaign_address = props.campaign_view_data.deployed_address;
//   const { web3, selected_account } = props.web3;
//   const {TOTAL_RATE} = props.campaign_view_data
//   const sending_address = selected_account.address;
//   console.log({sending_address, campaign_address, token_amount})
//   if (!campaign_address || !token_amount) {
//     return { err: "missing data for the request" };
//   }
//   try {
//     let Della_Campaign = _make_campaign_contract({ web3, campaign_address });

//     console.log({ TOTAL_RATE, token_amount });
//     let total_amount = TOTAL_RATE * token_amount;
//     console.log({ total_amount });
//     let total_value = total_amount.toString();

//     /* All we need to do, is send the tokens */
//     send_dst_tokens

//     const resp = await run_transaction({
//       to: campaign_address,
//       fn: Della_Campaign.methods.buyTokens(sending_address),
//       value: total_value,
//       props
//     });
//     console.log(resp);
//   } catch (err) {
//     console.log(err);
//     if (err.message) err = err.message;
//     console.log(err)
//     // The database state my be incorrct
//     // let crowdsale_data = await module.exports.get_current_state_of_crowdsale_on_blockchain(
//     //   campaign_address
//     // );
//     // Crowdsale.update_data(crowdsale_data, campaign_address);

//     throw err;
//   }
// }

export async function check_depositsOf({campaign_address, props}){
  const web3_props = props.web3
  const {web3} = web3_props
  const user_Address = web3.eth.defaultAccount
  const campaign = await _make_campaign_contract(web3, campaign_address)
  const refund_Address = await campaign.methods.escrow_address().call()
  console.log({refund_Address})
  const escrow = await _make_escrow_contract(web3, refund_Address)
  const refund_balance = await escrow.methods.depositsOf(user_Address).call()
  // console.log(refund_balance)
  // console.log(refund_balance)
  // console.log(refund_balance)


}

export async  function get_refund({campaign_address,props}){
  const web3_props = props.web3
  const {web3} = web3_props
  const user_address = web3.eth.defaultAccount

  const della_campaign = await _make_campaign_contract(web3, campaign_address)

      const resp = await run_transaction({
      to: campaign_address,
      fn: della_campaign.methods.claimRefund(user_address),
      value: 0,
      props
    });

}

async function handle_Tokens_received_For_Tokens({get_token_details, props, err, data}){
  try {
    console.log('hamdler tokens purchased with tokens event')
    const {dispatch} = props
    const web3= props.web3.web3

    console.log({err, data})
    /* ping the server to update */
    let campaign_id = data.address
    /* get some bc data? */
    update_after_token_purchase(get_token_details,web3, campaign_id, dispatch)
    // let {returnValues} = data
    // let crowdsale= await $.get(`/crowdsale/get_campaign/${campaign_id}`)
  } catch (err) {
    console.log('err'.bgRed)
    console.log(err)
  }
}

export async function listen_for_campaign_tokens_purchased({get_token_details, props, campaign_address}) {
  const web3_props = props.web3

  console.log('SETTING UP ETH PRICE EVENT LISTENER')
  var {ws_web3, web3, events_web3} = web3_props
  const WS_campaign_crowdsale = _make_campaign_contract(ws_web3, campaign_address);
  const Tokens_received_For_Tokens =  WS_campaign_crowdsale.events.Tokens_received_For_Tokens({
    fromBlock:'latest'
  }, (err, data)=>handle_Tokens_received_For_Tokens( {get_token_details, props, err, data}) )

  return Tokens_received_For_Tokens

}

async function update_after_token_purchase(get_token_details, web3, crowdsale_address, dispatch){
 console.log('update_after_token_purchase')
  const della_campaign = await _make_campaign_contract(web3, crowdsale_address)

      /* Get token details... */
      console.log('GET TOKEN DETAILS')
      get_token_details()

      const data_array = [
    "stable_tokens_raised",
    "hasClosed",
    "finalized",
  ]
  // let crowdsale_data = {};

    // await Promise.all(
    data_array.map(async property => {
      let data = await get_property(della_campaign, property);
      dispatch({
        type:"SET_CAMPAIGN_VIEW_DATA_PROPERTY",
        property, value:data[property]
      })

      // crowdsale_data = { ...crowdsale_data, ...data };

    })



    

}


export async function get_current_state_of_campaign_on_blockchain(web3, crowdsale_address){
  console.log("Getting current state of crowdsale on blockchain");
  const della_campaign = await _make_campaign_contract(web3, crowdsale_address)
  let crowdsale_data = {};

  
  const data_array = [
    "goal",
    "TOTAL_RATE",
    "owner",
    "wallet",
    "token",
    "stable_tokens_raised",
    "escrow_address",
    "openingTime",

    "goalReached",
    "hasClosed",
    "closingTime",
    "finalized",

  ];
  // await Promise.all(
  await Promise.all(
    data_array.map(async property => {
      console.log(`looping for this ${property}`);
      let data = await get_property(della_campaign, property);
      // console.log(data);

      // console.log(`WHOGOT THAT D ${data}`.bgYellow);
      switch (property) {
        case "owner":
        case "wallet":
        case "token":
        case "escrow_address":
          // console.log(property)
          // console.log(value[property])
          try {
            data[property] = data[property].toLowerCase();
          } catch (err) {
            console.log("err".bgRed);
            console.log(`data ${data} property ${property}`);
            console.log(err);
          }
          break;

        default:
          break;
      }
      crowdsale_data = { ...crowdsale_data, ...data };
    })
  );
  /* Might aswell save this */
  // Campaign.find
  /* ABORT, too much for one function, save, somewehre else */

  return crowdsale_data;
}


function _make_campaign_contract( web3, campaign_address ) {
  return new web3.eth.Contract(Campaign_Crowdsale_abi, campaign_address);
}

function _make_escrow_contract( web3, escrow_address ) {
  return new web3.eth.Contract(RefundEscrow_abi, escrow_address);
}

RefundEscrow_abi

async function get_property(della_campaign, property) {

  try {
    let resp = await della_campaign.methods[property]().call();
    return { [property]: resp };
  } catch (err) {
    console.log(`err on ${property}`)
    throw err;
  }
}
