import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
// import $ from "jquery";

import Main_Layout from "../layouts/Main_Layout.js";
import Account_Menu from "../components/user/Account_Menu.js";
// import { Formatted_Date_Time } from "../components/small_ui_items.js";
import Transaction_View_Modal from "../components/modals/Transaction_View_Modal.js";
import Add_Account_Modal from "../components/modals/Add_Account_Modal.js";
import {
  Create_in_browser_wallet,
  Wallet_Options,
  Connect_Metamask,
  Wallet_Balance_Details,
  Edit_Wallet_Buttons
} from "../components/Account_Wallet_Components.js";
import { Fade_Left } from "../components/transitions/Slide_Transition.js";
import {
  // set_has_wallet,
  get_all_browser_addresses_and_balances,
  REMOVE_ADDRESS_FROM_WALLET,
  add_new_account_address,
  set_metamask_wallet,
  set_selected_account,
  // get_eth_balance,
  wallet_created
} from "../redux/web3_reducers.js";

import {  dst_balance_of } from "../components/contracts/Della_Stable_Token_balance.js";
import { buy_della_stable_tokens } from "../components/contracts/Della_Stable_Token.js";
import { retry } from "../components/utils/index.js";
// import Web3_Client from '../components/web3/Web3_Client.js'

class Account_Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number_dst_tokens_purchase: 0,
      add_private_key:
        "0x38389bcec9beda5392e238004b9e9e218e3da7a66961dd5e79130410f4e55595",
      load_wallet_btn_txt: "Load Wallet",
      browser_wallet_in_storage: false,
      metamask_wallet_is_set: false,
      wallet_password: undefined,
      show_metamask: true,
      show_browser_wallet: true,
      show_opera: true,
      make_in_browser_wallet: false,
      connect_metamask_wallet: false,
      connect_opera_wallet: false,
      transactions: [] /* transactions.reverse() */,
      // main_account: this.props.user.wallet_addresses[0],

      eth_recipient: "0x8acb9cfc0a1884d4cfe58d738a4479d693b87be6",
      // eth_recipient: "0x763D9dD7401266BCEAB676a57935606808083a58",
      eth_val: 0.1,
      pw: "1",
      pw2: "1",
      random_text: this.generate_random_text(),
      current_eth_price: this.props.locals.CURRENT_ETH_PRICE
    };
    this.buy_stable_tokens = this.buy_stable_tokens.bind(this);
    this.remove_account = this.remove_account.bind(this);
    this.set_selected_account = this.set_selected_account.bind(this);
    this.set_metamask_wallet = this.set_metamask_wallet.bind(this);
    this.reset_wallet = this.reset_wallet.bind(this);
    this.test_wallet = this.test_wallet.bind(this);
    this.add_private_key_to_wallet = this.add_private_key_to_wallet.bind(this);
    this.set_wallet_option = this.set_wallet_option.bind(this);
    this.reset_wallet_options = this.reset_wallet_options.bind(this);
    this.create_wallet = this.create_wallet.bind(this);
    this.send_ether = this.send_ether.bind(this);
    this.handle_input = this.handle_input.bind(this);
  }

  static async getInitialProps() {
    // const transactions = <%- JSON.stringify(transactions) %>
    return {};
  }

  componentDidMount() {
    if (
      document.getElementById("total_eth_input") &&
      this.state.number_dst_tokens_purchase == 0
    )
      //remoove any CSS from 0 DST
      document
        .getElementById("total_eth_input")
        .classList.remove("is_valid", "is_invalid");
  }

  componentDidUpdate() {
    if (
      document.getElementById("total_eth_input") &&
      this.state.number_dst_tokens_purchase == 0
    ) {
      //remoove any CSS from 0 DST
      document
        .getElementById("total_eth_input")
        .classList.remove("is_valid", "is_invalid");
    }
  }

  buy_stable_tokens() {
    // if(!)
    console.log(this.state.number_dst_tokens_purchase);
    const { number_dst_tokens_purchase } = this.state;
    const { eth_price } = this.props.web3.eth_price_data;
    /* BUY DELLA STABLE TOKENS */
    const eth_val = number_dst_tokens_purchase / eth_price;
    console.log({eth_val})
    buy_della_stable_tokens(this.props, eth_val);
  }

  submit_singed_tansaction() {
    hide_two_factor_auth_modal();

    console.log("SEND IT!");
    console.log(this.state.two_factor_auth.fn_data);
    let fn = this.state.two_factor_auth.fn_data.fn;
    let args = this.state.two_factor_auth.fn_data.args;
    fn(...args);
  }

  async send_ether(e) {
    console.log("SEND ETH!!!!!!!!!!!!!!");
    console.log(e);
    console.log("RUN IT");
    console.log("DONE IT");
    const { web3, selected_account } = this.props.web3;
    const { eth_recipient, eth_val } = this.state;
    const { address } = selected_account;
    //disable UI to prevent double sending
    var btn = e.target;
    $(btn).prop("disabled", true);
    $("#ether_val_input").prop("disabled", true);
    let default_account = web3.eth.defaultAccount;
    console.log(default_account);
    const tx_data = {
      from: address,
      to: eth_recipient,
      value: web3.utils.toWei(eth_val.toString(), "ether")
      // data: ""
    };
    console.log(tx_data);
    if (!address) return toastr.error("Need to set an account");
    // nonce, //default is web3.eth.getTransactionCount().
    // chainId, // default will use web3.eth.net.getId().
    // to, //The recevier of the transaction, can be empty when deploying a contract.
    // data, //The call data of the transaction, can be empty for simple value transfers.
    // value, //The value of the transaction in wei.
    // gasPrice //default web3.eth.getGasPrice
    console.log(tx_data);
    const gas = await web3.eth.estimateGas(tx_data);
    console.log({ gas });
    tx_data.gas = gas;
    const chainId = await web3.eth.net.getId();
    tx_data.gasPrice = await web3.eth.getGasPrice();
    tx_data.nonce = await web3.eth.getTransactionCount(address);
    tx_data.chainId = chainId;
    console.log(tx_data);
    // const signed_tx = await web3.eth.accounts.signTransaction(
    //   tx_data, privKey
    // );
    // console.log(signed_tx)
    // console.log(tx_data);
    try {
      const reciept = await web3.eth
        .sendTransaction(tx_data)
        .on("transactionHash", transactionHash => {
          console.log({ transactionHash });
          toastr.success(`Transaction ${transactionHash} was sent`);
          $(btn).prop("disabled", false);
          $("#ether_val_input").prop("disabled", false);
        })
        .on("receipt", receipt => {
          console.log({ receipt });
          toastr.success(`Receipt received`);
          $(btn).prop("disabled", false);
          $("#ether_val_input").prop("disabled", false);
          /* dispatch update balances */
          this.props.dispatch(get_all_browser_addresses_and_balances({ web3 }));
        })
        .on("error", error => {
          console.log({ error });
          $(btn).prop("disabled", false);
          $("#ether_val_input").prop("disabled", false);
          this.props.dispatch(get_all_browser_addresses_and_balances({ web3 }));
        });
      // console.log({reciept})
    } catch (err) {
      console.log("Send transaction err");
      console.log(err);
    }
    // const tx_receipt = await web3.eth.sendSignedTransaction()

    //two factor auth modal
    // var two_factor_auth = JSON.stringify(this.state.two_factor_auth);
    // //after we have the info, the user needs to enter a password / verify authority
    // if (this.state.two_factor_auth.wallet_password)
    //   this.verifying_wallet_password = true;
    // this.props.web3.transaction_in_progress = true;
    // if (this.state.two_factor_auth.wallet_password)
    //   start_spinner("Verifying password");
    // else start_spinner();
    // //two factor auth modal

    // $.post(
    //   "/send_eth_to",
    //   {
    //     to,
    //     val,
    //     _csrf: this.props.csrf,
    //     two_factor_auth
    //   },
    //   resp => {
    //     this.props.web3.transaction_in_progress = false;
    //     stop_spinner();
    //     console.log("send_ether ajax response");
    //     console.log(resp);
    //     $(btn).prop("disabled", false);
    //     $("#ether_val_input").prop("disabled", false);
    //     this.props.web3.transaction_in_progress = false; //two factor auth
    //     this.verifying_wallet_password = false; //two factor auth

    //     if (resp.err) {
    //       console.log("show it?");
    //       this.props.web3.transaction_in_progress = false;
    //       this.state.two_factor_auth.gas_estimate = 0;
    //       this.state.two_factor_auth.wallet_password = "";
    //       show_modal("two_factor_auth_modal");
    //       toast(resp.err, "ERROR");
    //     }

    //     if (!resp.err && resp.resp) {
    //       if (resp.resp.incorrect_wallet_password) {
    //         this.incorrect_wallet_password = true;
    //         show_two_factor_auth_modal();
    //         return toast("Incorrect Password", "ERROR");
    //       }

    //       if (resp.resp.two_factor_auth) {
    //         console.log("Got gas estimate");
    //         start_spinner("Looking up average Gas price...");
    //         this.state.two_factor_auth.gas_estimate =
    //           resp.resp.two_factor_auth.gas_estimate;
    //         this.state.two_factor_auth.to = resp.resp.two_factor_auth.to;
    //         this.state.two_factor_auth.from = resp.resp.two_factor_auth.from;
    //         this.state.two_factor_auth.value = resp.resp.two_factor_auth.value;
    //         // this.state.two_factor_auth.transaction_type = "Send Ether"
    //         this.state.two_factor_auth.fn_data = {
    //           fn: this.send_ether,
    //           args: [e]
    //         };
    //         start_spinner("getting average gas price");
    //         setTimeout(async () => {
    //           const { median_price, median_time } = await gas_station_data();
    //           this.state.two_factor_auth.gas_price = median_price;
    //           this.state.two_factor_auth.median_time = median_time;
    //           stop_spinner();
    //           show_modal("two_factor_auth_modal");
    //         }, 0);
    //       } else if (resp.resp.transaction_processing) {
    //         //Password was matched, and we will notify via sockets when done!
    //         this.props.web3.transaction_in_progress = true;
    //         //reset two_factor_auth credentials
    //         this.state.two_factor_auth.gas_estimate = undefined;
    //         this.state.two_factor_auth.wallet_password = undefined;
    //         this.state.two_factor_auth.to = undefined;
    //         this.state.two_factor_auth.from = undefined;
    //         this.state.two_factor_auth.value = undefined;
    //         this.state.two_factor_auth.transaction_type = "";
    //         hide_modal("two_factor_auth_modal");

    //         dynamic_message("warning", "Transaction Processing......");
    //         return toast("Transaction processing.....", "INFO");
    //       }
    //     }

    //   }
    // );
  }
  add_invalid_to_input(input_names) {
    input_names.forEach(input_name => {
      let input_element = document.querySelector(`input[name="${input_name}"]`);
      input_element.classList.add("is_invalid");
    });
  }
  remove_invalid_to_input(input_names) {
    console.log(input_names);
    input_names.forEach(input_name => {
      let input_element = document.querySelector(`input[name="${input_name}"]`);
      input_element.classList.remove("is_invalid");
    });
  }
  generate_random_text() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 100; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  async set_selected_account(selected_account) {
    console.log(selected_account);
    const { web3, browser_wallet_unlocked, type } = this.props.web3;
    const { address, index } = selected_account;
    console.log(address, index);
    // let unlocked_account = await web3.eth.personal.unlockAccount(address, '1')
    // console.log({unlocked_account})
    this.props.dispatch(set_selected_account(selected_account, web3));
    if (type == "BROWSER" && !browser_wallet_unlocked)
      console.log("Need to unlock account");
    toastr.info(`${address} address selected`);
  }

  async create_wallet() {
    /* remove error class to inputs */
    this.remove_invalid_to_input(["pw", "pw2"]);

    /* Should maybe check for wallet? */
    const already_has_wallet = localStorage.getItem("web3js_wallet");
    if (already_has_wallet) {
      const conf = confirm(
        "Looks like you already have a wallet, this action will errase your current walle,t are yo usure yo uwant to proceed?"
      );
      if (!conf) return;
    }

    /* web3 api create wallet web3.eth.account */
    /* web3.eth.accounts.wallet.create(account#, random text) */
    const { pw, pw2, random_text } = this.state;
    // console.log({ pw, pw2, random_text });
    /* Verify pw and pw2 exist */
    if (!pw || !pw2) {
      /* add error class to inputs */
      this.add_invalid_to_input(["pw", "pw2"]);
      return toastr.error("A password is required to keep your wallet secure");
    } else if (pw != pw2) {
      /* add error class to inputs */
      this.add_invalid_to_input(["pw", "pw2"]);
      toastr.error("Your passwords must match");
    }
    const { web3 } = this.props.web3;
    console.log(web3);
    console.log(web3);
    /* web3 api create wallet web3.eth.account */
    /* web3.eth.accounts.wallet.create(account#, random text) */
    const wallet = web3.eth.accounts.wallet.create(1, random_text);
    console.log(wallet);
    console.log(wallet[0]);
    console.log(wallet["0"]);
    const has_wallet = web3.eth.accounts.wallet.save(pw);
    // const has_wallet = true
    console.log(has_wallet);
    if (has_wallet) {
      const { address } = wallet[0];
      const _csrf = this.props.csrf;
      $.post("/user/add_account_address", { address, _csrf });

      this.setState({
        make_in_browser_wallet: !has_wallet
      });
      console.log(web3);
      console.log("WALLET CERATED!!");

      this.props.dispatch(get_all_browser_addresses_and_balances({ web3 }));
      /* Get dst blalance */
      retry("waiting for accounts data to populate", 1000, () => {
        const { accounts_data } = this.props.web3;
        console.log(accounts_data);
        if (!accounts_data.length) return false;
        console.log(this.props.web3.accounts_data);
        console.log("WALLET CERATED!!");

        this.props.dispatch(
          wallet_created({
            has_wallet,
            wallet,
            browser_wallet_unlocked: true,
            has_browser_wallet: true,
            wallet_password: pw
          })
        );
        accounts_data.map(data =>
          dst_balance_of(this.props.dispatch, web3, data.address)
        );
        return true;
      });
    } else {
      toastr.error("Sorry unable to create a Browser Wallet");
    }
    // const ecrypted_wallet = new_wallet.encrypt(pw)
    // console.log(ecrypted_wallet)
  }

  test_wallet() {
    console.log("reset_wallet");
    const web3_wallet = this.props.web3.web3.eth.accounts.wallet;
    const { web3 } = this.props;
    const browser_wallet = JSON.parse(localStorage.getItem("web3js_wallet"));
    console.log({ browser_wallet, web3_wallet, web3 });
  }
  reset_wallet() {
    console.log("reset_wallet");
    // console.log(this.props.web3);
    const { web3 } = this.props.web3;
    const cleared_wallet = web3.eth.accounts.wallet.clear();
    console.log({ cleared_wallet });
  }

  remove_account(address) {
    const _csrf = this.props.csrf;
    const { web3, browser_wallet_unlocked } = this.props.web3;
    console.log("REMOVE ADDRESS");
    const { wallet_password } = this.state;
    if (!browser_wallet_unlocked) {
      return toastr.warning("You need to unlock your rowser wallet first");
    }
    try {
      const conf = confirm("Are You sure?");
      if (!conf) return;
      console.log(address);
      let removed_account = web3.eth.accounts.wallet.remove(address);
      if (!removed_account)
        return toastr.error(`account ${address} was unable to be removed`);
      console.log(`resaving wallet with password ${wallet_password}`);
      web3.eth.accounts.wallet.save(wallet_password);
      toastr.success(`Account ${address} was removed`);
      this.props.dispatch(REMOVE_ADDRESS_FROM_WALLET(address));
      $.post("/user/remove_account_address", {
        address,
        _csrf
      });
    } catch (err) {
      console.log("err");
      console.log(err);
    }
  }

  add_private_key_to_wallet() {
    const { web3, browser_wallet_unlocked, wallet_password } = this.props.web3;
    const _csrf = this.props.csrf;
    const { add_private_key } = this.state;
    let account_obj;
    try {
      // if(!wallet_password){
      //   console.log({wallet_password})
      //   return  $('#unlock_wallet_modal').modal('show')

      // }

      // if (!browser_wallet_unlocked) {
      //   this.load_wallet();
      // }
      account_obj = web3.eth.accounts.wallet.add(add_private_key);
      console.log(`Saving with password ${wallet_password}`);
      let saved_wallet = web3.eth.accounts.wallet.save(wallet_password);
      // console.log({saved_wallet})
      console.log(account_obj);
      const { address } = account_obj;
      $.post("/user/add_account_address", { address, _csrf });
      toastr.success(`Added ${address} to your wallet`);
      this.props.dispatch(
        add_new_account_address({
          web3,
          address
        })
      );
    } catch (err) {
      console.log("err");
      console.log(err);
      toastr.error(
        "Could not add account, please check the private key is valid"
      );
    }
  }

  set_wallet_option(option) {
    console.log("SET WALLET FUNCTIONS");
    this.setState({
      show_browser_wallet: false,
      show_metamask: false,
      show_opera: false
    });
    this.setState({
      [option]: true
    });
    if (option == "show_metamask") {
      this.setState({ connect_metamask_wallet: true });
    }
    if (option == "show_opera") this.setState({ connect_opera_wallet: true });
    if (option == "show_browser_wallet")
      this.setState({ make_in_browser_wallet: true });
  }

  reset_wallet_options() {
    this.setState({
      show_browser_wallet: true,
      show_metamask: true,
      show_opera: true,
      connect_metamask_wallet: false,
      connect_opera_wallet: false,
      make_in_browser_wallet: false
    });
  }

  handle_input(obj) {
    for (let key in obj) {
      this.setState({
        [key]: obj[key]
      });
    }
  }
  async set_metamask_wallet() {
    const { metamask_wallet_is_set } = this.state;
    if (metamask_wallet_is_set) return;
    console.log("set_metamask_wallet");
    try {
      const { web3, has_metamask_wallet } = { ...this.props.web3 };
      const { dispatch } = this.props;
      console.log(this.props.web3.has_metamask_wallet);
      console.log(this.props.web3.has_metamask_wallet);
      console.log(this.props.web3.has_metamask_wallet);
      console.log(this.props.web3.has_metamask_wallet);
      console.log(this.props.web3.has_metamask_wallet);
      if (this.props.web3.has_metamask_wallet)
        throw "Already has_metamask_wallet";
      const accounts = await ethereum.enable();
      this.props.dispatch(set_metamask_wallet(web3, accounts[0]));
      this.setState({ metamask_wallet_is_set: true });
      // dst_balance_of(dispatch, web3, accounts[0])
      // get_all_account_balances(web3, account_addresses)
      return;
    } catch (err) {
      console.log("err");
      console.log(err);
      toastr.error("Failed to enable Metamask");
    }
  }

  render() {
    return (
      <Main_Layout>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <br />
              <div className="row hidden-sm-down">
                <br />
              </div>
              <h1>Wallet</h1>

              <br />
              <br />
              <Account_Menu has_wallet={this.props.web3.has_wallet} />
              <br />
              <br />
              <Edit_Wallet_Buttons
                has_browser_wallet={this.props.web3.has_browser_wallet}
                set_make_in_browser_wallet={() =>
                  this.setState({
                    make_in_browser_wallet: !this.state.make_in_browser_wallet
                  })
                }
                browser_wallet_unlocked={
                  this.props.web3.browser_wallet_unlocked
                }
                metamask_wallet_is_set={this.props.web3.has_metamask_wallet}
                set_matamask={this.set_metamask_wallet}
                reset_wallet={this.reset_wallet}
                test_wallet={this.test_wallet}
                // add_private_key_to_wallet={this.add_private_key_to_wallet}
              />
              {/* If choose to make in browser wallet */}
              <Fade_Left show={this.state.make_in_browser_wallet}>
                <Create_in_browser_wallet
                  browser_wallet={this.state.browser_wallet_in_storage}
                  pw={this.state.pw}
                  pw2={this.state.pw2}
                  random_text={this.state.random_text}
                  handle_input={this.handle_input}
                  create_wallet={this.create_wallet}
                  wallet_password={this.wallet_password}
                  load_wallet={this.load_wallet}
                  load_wallet_btn_txt={this.state.load_wallet_btn_txt}
                />
              </Fade_Left>

              <div className="row">
                <div className="col-sm-12">
                  {/* <transition name="fade"> */}
                  <Fade_Left show={!this.props.web3.has_wallet}>
                    {/* {!this.props.web3.has_wallet && ( */}
                    <div key="not_has_wallet">
                      <p>
                        To use this app, you need a connection to the Ethereum
                        Blockchain
                      </p>

                      {/* Create browser Wallet */}
                      <div className="row">
                        <Wallet_Options
                          set_matamask={this.set_metamask_wallet}
                          select={this.set_wallet_option}
                          reset={this.reset_wallet_options}
                          show_metamask={this.state.show_metamask}
                          show_browser_wallet={this.state.show_browser_wallet}
                          show_opera={this.state.show_opera}
                        />
                      </div>

                      {/* Look for metamask */}
                      {this.state.connect_metamask_wallet && (
                        /* Should have ethereum object available */
                        <Connect_Metamask
                          set_matamask={this.set_metamask_wallet}
                          reset={this.reset_wallet_options}
                        />
                      )}
                    </div>
                  </Fade_Left>

                  {/* TRANSITION */}

                  <Fade_Left show={this.props.web3.has_wallet}>
                    {/* TRANSITION FADE HAS WALLET */}
                    {/* {this.props.web3.has_wallet && ( */}
                    <Wallet_Balance_Details
                      accounts_set={this.props.web3.accounts_set}
                      number_dst_tokens_purchase={
                        this.state.number_dst_tokens_purchase
                      }
                      buy_stable_tokens={this.buy_stable_tokens}
                      eth_price_data={this.props.web3.eth_price_data}
                      remove_account={this.remove_account}
                      selected_account={this.props.web3.selected_account}
                      set_selected_account={this.set_selected_account}
                      eth_val={this.state.eth_val}
                      eth_recipient={this.state.eth_recipient}
                      send_ether={this.send_ether}
                      web3={this.props.web3}
                      handle_input={this.handle_input}
                    />
                  </Fade_Left>

                  {/* </transition> */}
                </div>
              </div>
            </div>
          </div>
          <br />
          <br />
          <br />

          <Add_Account_Modal
            wallet_password={this.state.wallet_password}
            browser_wallet_unlocked={this.props.web3.browser_wallet_unlocked}
            add_account={this.add_private_key_to_wallet}
            handle_input={this.handle_input}
            add_private_key={this.state.add_private_key}
          />

          <Transaction_View_Modal />

          {/* <% include partials/two_factor_auth.ejs%> */}
        </div>
      </Main_Layout>
    );
  }
}

function mapStateToProps(state) {
  const { user, csrf, locals, web3 } = state;
  return { ...user, ...csrf, ...locals, web3 };
}

export default connect(mapStateToProps)(Account_Wallet);
