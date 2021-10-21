
import { Escrow_abi } from "../contract_abi.js";
import { run_transaction } from "./transaction_helper.js";


export function check_deposits_of(user_address, escrow_address){
  const Refund_Vault = _make_escrow_contract(escrow_address)

  let deposits = await Refund_Vault.methods.depositsOf(user_address).call()
  console.log(deposits)
}


/* depositsOf */
function _make_escrow_contract({web3, escrow_address}) {
  return new web3.eth.Contract(Escrow_abi, escrow_address);
}
