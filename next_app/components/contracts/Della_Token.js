import { Della_Security_Token_abi } from "../contract_abi.js";
import { run_transaction } from "./transaction_helper.js";

async function balance_of(token_address, address, web3) {
  // console.log({token_address, address})

  const token = _make_token_contract({web3,token_address});
  try {
    return await token.methods.balanceOf(address).call();
  } catch (error) {
    return error;
  }
}

export const get_token_details_data = async ({
  web3,
  user_address,
  token_address,
  campaign_address
}) => {

try {
  const Della_Security_Token = _make_token_contract({web3, token_address});
  let total_supply = await Della_Security_Token.methods.totalSupply().call();
  let crowdsale_balance = await balance_of(token_address, campaign_address, web3);

  var user_balance = null;

  if (user_address) {
    user_balance = await balance_of(token_address, user_address, web3);
    console.log(user_balance);
  }
  return { total_supply, crowdsale_balance, user_balance };
} catch (err) {
  console.log('err')
  console.log(err)
  console.log(err.message)
}


};

function _make_token_contract({web3, token_address}) {
  return new web3.eth.Contract(Della_Security_Token_abi, token_address);
}
