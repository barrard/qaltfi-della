import { Della_Stable_Token_abi,
  Della_Stable_Token_address } from "../contract_abi.js";
import { run_transaction } from "./transaction_helper.js";
import {get_user_balance} from '../../redux/web3_reducers.js'
import { dst_balance_of } from "./Della_Stable_Token_balance.js";

export async function send_dst_tokens({to, amount, props, onReceipt}){
  const web3 = props.web3.web3
  const Della_Stable_Token = _make_token_contract(web3);
  const {dispatch, campaign_view_data} = props
  const {TOTAL_RATE} =  campaign_view_data
  const total_dst_tokens_to_send = web3.utils.toWei((amount*TOTAL_RATE).toString(), 'ether')
  console.log({total_dst_tokens_to_send})
  
  const resp = await run_transaction({
    to: Della_Stable_Token_address,
    fn: Della_Stable_Token.methods.send(
      to, 
      total_dst_tokens_to_send, 
      web3.utils.utf8ToHex("Purchasing Campaign Security Token")),
    value: 0,
    props, onReceipt
  });

}


export async function buy_della_stable_tokens(props, eth_val){
  console.log({eth_val})
  //
  var eth_val = Math.ceil(parseFloat(eth_val).toFixed(7)*1000000)/1000000
  if( eth_val.toString() == 'NaN') return console.log(eth_val)
  const {web3}=props.web3
  const address = web3.eth.defaultAccount
  console.log(eth_val)
  console.log(Math.ceil(parseFloat(eth_val).toFixed(7)*1000000)/1000000)
  const weiValue = web3.utils.toWei(eth_val.toString(), 'ether')
  const Della_Stable_Token = await _make_token_contract(web3)
  console.log({weiValue})
  console.log({address})
  
  
  const resp = await run_transaction({
    to: Della_Stable_Token_address,
    fn: Della_Stable_Token.methods.buy_DST(address, address),
    value: weiValue,
    props, 
    // onTxHash:()=>update_wallet(address, props),
    onReceipt:()=>update_wallet(address, props)
  });
  
}

export function update_wallet(address, props){
  const {dispatch} = props;
  const web3 = props.web3
  const {selected_account} = web3
  const { wallet_index} = selected_account
  dst_balance_of( dispatch, web3.web3, address) 
  dispatch(get_user_balance(web3.web3, address, wallet_index))

}




function _make_token_contract(web3) {
  return new web3.eth.Contract(Della_Stable_Token_abi, Della_Stable_Token_address);
}
