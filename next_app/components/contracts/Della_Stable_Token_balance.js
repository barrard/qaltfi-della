import { Della_Stable_Token_abi,
  Della_Stable_Token_address } from "../contract_abi.js";

export async function dst_balance_of( dispatch, web3, address) {
  // console.log({token_address, address})

  const token = _make_token_contract(web3);
  try {
    console.log(`Get DST balance of ${address}`)
    let balance = await token.methods.balanceOf(address).call();
    console.log({balance})
    dispatch({ 
      type: "DST_BALANCE" ,
      address, balance
    });
    return balance
  } catch (error) {
    return error;
  }
}


function _make_token_contract(web3) {
  return new web3.eth.Contract(Della_Stable_Token_abi, Della_Stable_Token_address);
}
