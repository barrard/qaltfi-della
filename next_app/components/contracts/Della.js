import { Della_abi, Della_address } from "../contract_abi.js";
import { run_transaction } from "./transaction_helper.js";

export const sign_terms_and_agreement = async ({
  user_signature,
  IP,
  props
}) => {
      const { web3 } = props.web3;
  const Della_Contract = _make_contract(web3);
  console.log({ user_signature, IP });

  const resp = await run_transaction({
    to: Della_address,
    fn: Della_Contract.methods.sign_terms_and_agreement(user_signature, IP),
    value: "0",
    props
  });
  return resp
};

export async function make_tokenized_campaign(props, cb){
  const {  user_crowdsale } = props
  const {web3} =  props.web3
  console.log(web3)
  const { dollar_goal} = user_crowdsale
  console.log({web3, dollar_goal})
  const Della_Contract = _make_contract(web3);

  run_transaction({
    to:Della_address,
    fn:Della_Contract.methods.make_tokenized_campaign(
      dollar_goal, (1*60*60*24)//one day for testing//TODO this should be a defult on the smart contract
    ),
    value:'0', props, onTxHash:cb, onError:cb, onReceipt:cb
  }, )
}

export async function has_signed_terms_and_agreement({ web3, address }) {
  console.log({ address });
  const Della_Contract = _make_contract(web3);
  let has_signed = await Della_Contract.methods
    .has_signed_terms_and_agreement(address)
    .call();
  console.log({ has_signed });
  return has_signed;
}

export async function is_authorized_investor({ web3, address }) {
  console.log({ address });
  const Della_Contract = _make_contract(web3);
  let is_authorized = await Della_Contract.methods
    .is_authorized_investor(address)
    .call();
  console.log({ is_authorized });
  return is_authorized;
}

function _make_contract(web3) {
  return new web3.eth.Contract(Della_abi, Della_address);
}
