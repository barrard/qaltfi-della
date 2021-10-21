

import { Eth_price_Oracle_abi,
  Eth_price_Oracle_address } from "../contract_abi.js";
// import { run_transaction } from "./transaction_helper.js";
import {retry} from '../utils/index.js'

export async function get_current_eth_price(web3){
  const Eth_price_Oracle = _make_token_contract(web3)
  const eth_price = await Eth_price_Oracle.methods.get_eth_price().call()
  console.log({eth_price})
  return eth_price
}

function _make_token_contract(web3) {
  return new web3.eth.Contract(Eth_price_Oracle_abi,Eth_price_Oracle_address);
}

export async function get_eth_price_on_chain({web3_props, dispatch}){
  const {web3} = web3_props
  const Eth_Price_Oracle = _make_token_contract(web3);
  let eth_price_data = await Eth_Price_Oracle.methods.get_eth_price().call()
  console.log(eth_price_data[0])
  const eth_price = eth_price_data[0]/100;
  const eth_price_time = eth_price_data[1];
  const eth_price_url = eth_price_data[2];


            dispatch({
              type:'NEW_ETH_PRICE',
              eth_price, eth_price_url, eth_price_time
            })

}

async function get_events(Eth_Price_Oracle,event, from, to, dispatch) {
  try {
    console.log('get_eventsget_eventsget_eventsget_events')
    console.log({ event, from, to });
    // WS_Eth_Price_Oracle.events.NEW_ETH_PRICE({fromBlock: from,
    //   toBlock: to}, (err, data)=>console.log({err, data}))
    /* Get eth_price_from the source!! */
    // retry('Getting Ether price event', 2000, ()=>{
    //   Eth_Price_Oracle.getPastEvents(
    //     event,
    //     {
    //       fromBlock: from,
    //       toBlock: to
    //     },
    //     (err, events) => {
    //       if(events.length){
    //         let {returnValues} = events[0]
    //         let {price, price_timestamp} = returnValues
    //         console.log({price, price_timestamp})
    //         dispatch({
    //           type:'NEW_ETH_PRICE',
    //           eth_price:price/100
    //         })
    //       }else{ throw 'we need this'}
    //     }
    //   );
    // })
  } catch (err) {
    console.log("err".bgRed);
    console.log(err);
  }
}

function handle_new_eth_price_data({dispatch, err, data}){
  if(err)return err
  console.log({err, data})
  const {price, price_timestamp}=data.returnValues
  dispatch({
    type:'NEW_ETH_PRICE',
      eth_price:price/100, eth_price_time:price_timestamp
  })
}

export function NEW_ETH_PRICE_EVENT_INIT({web3_props, dispatch}) {
  console.log('SETTING UP ETH PRICE EVENT LISTENER')
  var {ws_web3, web3, events_web3} = web3_props
  const WS_Eth_Price_Oracle = _make_token_contract(ws_web3);
  const Eth_Price_Oracle = _make_token_contract(web3);
  WS_Eth_Price_Oracle.events.NEW_ETH_PRICE({
    fromBlock:'latest'
  }, (err, data)=>handle_new_eth_price_data({dispatch, err, data}) )
  // .on('data', (event_data)=> (dispatch)=> handle_eth_data({event_data, dispatch}))
  // .on('changed', (event_changed)=> console.log({event_changed}))
  // .on('error', (error)=> console.log({error}))

  // setInterval(()=>{
    // get_events(Eth_Price_Oracle, "NEW_ETH_PRICE", "latest", "latest", dispatch);
  // }, 10000)

}

