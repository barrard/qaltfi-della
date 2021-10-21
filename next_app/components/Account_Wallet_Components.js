// import {Transition} from 'react-transition-group';
import { toastr } from "react-redux-toastr";
import { Fade_Up, Fade_Left } from "../components/transitions/Slide_Transition.js";
import { To_Eth, To_Number } from "./small_ui_items.js";
import { Block_Spinner } from "../components/transitions/spinners.js";


const Type_Badge = ({ type }) => {
  var color;
  if (type == "BROWSER") color = "primary";
  if (type == "METAMASK") color = "warning";
  return <span className={`badge badge-${color}`}>{type}</span>;
};

export const Connect_Metamask = ({ reset, status, set_matamask }) => {
  console.log("CONNECT METTMASK");
  if (!window.ethereum) {
    alert("Not found");
    return <div>NOT FOUND</div>;
  } else {
    set_matamask();
    return <div>{status || "requesting...."}</div>;
  }
};

export const Edit_Wallet_Buttons = ({
  metamask_wallet_is_set,
  browser_wallet_unlocked,
  set_make_in_browser_wallet,
  set_matamask,
  test_wallet,
  unlock_account,
  has_browser_wallet
}) => {
  // const wallet_unlocks =       if(!wallet_password){
  //       console.log({wallet_password})
  //       return  $('#unlock_wallet_modal').modal('show')

  //     }
  return (
    <>
      {!metamask_wallet_is_set && (
        <button
          onClick={set_matamask}
          type="button"
          className="btn btn-warning"
          // data-toggle="modal"
          // data-target="#add_account_key_modal"
        >
          Metamask
        </button>
      )}
      {!browser_wallet_unlocked && (
        <button
          type="button"
          className="btn btn-success"
          data-toggle="modal"
          data-target="#unlock_wallet_modal"
        >
          Unlock Browser Wallet
        </button>
      )}
      {browser_wallet_unlocked && (
        <button
          type="button"
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#add_account_key_modal"
        >
          Add Account
        </button>
      )}

      {!has_browser_wallet && (
        <button
          onClick={set_make_in_browser_wallet}
          type="button"
          className="btn btn-primary"
        >
          Create Browser Wallet
        </button>
      )}
      {/*<button onClick={test_wallet} type="button" className="btn btn-danger">
        TEST
      </button>
      <button
        onClick={unlock_account}
        type="button"
        className="btn btn-primary"
      >
        unlock
      </button> */}
    </>
  );
};

export const Wallet_Balance_Details = ({
  web3,
  handle_input,
  eth_val,
  send_ether,
  eth_recipient,
  set_selected_account,
  selected_account,
  remove_account,
  number_dst_tokens_purchase,
  eth_price_data,
  buy_stable_tokens,
  accounts_set
}) => {
  return (
    <div key="has_wallet">
      <div className="row">
        <div className="col-sm-12">
        <Fade_Up show={accounts_set}>

          <table className="table mt-5">
            <thead className="thead-inverse">
              <tr>
                <th className="center-text">#</th>
                <th className="center-text">Type</th>
                <th className="center-text">Account</th>
                <th className="center-text">ETH Balance</th>
                <th className="center-text">della Tokens</th>
                {/* <th className="center-text">Actions</th> */}
                <th className="center-text">View account details</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {/* if not accounts_set then we are still gathing data, show loader */}
                {web3.accounts_data.map((account_data, index) => (
                  <tr
                    key={index}
                    className={`${
                      selected_account.address == account_data.address
                        ? " table-active "
                        : " "
                    }`}
                  >
                    <td className="center-text">{index}</td>
                    <td className="center-text">
                      <div className="row justify-content-center">
                        <div className="col-sm-6">
                          <Type_Badge type={account_data.type} />
                        </div>
                        <div className="col-sm-6">
                          <button
                            type="button"
                            className="btn btn-sm btn-info"
                            onClick={() => set_selected_account(account_data)}
                          >
                            USE
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="center-text">{account_data.address}</td>
                    <td
                      className="center-text"
                      data-account_balance={account_data.address}
                    >
                      <To_Number num={account_data.balance}/>
                    </td>
                    <td className="center-text">
                      <To_Eth  web3={web3.web3} wei={account_data.dst_balance} />
                    </td>
                    {/* <td className="center-text">
        
                  </td> */}
                    <td className="center-text">
                      <div className="row justify-content-center">
                        <div className="col-sm-6">
                          <button
                            data-toggle="modal"
                            data-target=".transactions-modal-lg"
                            className="btn clickable"
                            type="button"
                            className="btn btn-sm btn-info"
                          >
                            View Transactions
                          </button>
                        </div>
                        <div className="col-sm-6" />
                      </div>
                    </td>
                    <td>
                      {" "}
                      <button
                        className="btn clickable"
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => remove_account(account_data.address)}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
              </Fade_Up>

            <Fade_Left show={!accounts_set}>

            <div className="row justify-content-center align-items-center">
              LOADING ACCOUNT DATA
              <div className="col-sm-4 col-offset-3">
                <Block_Spinner />
              </div>
            </div>
            </Fade_Left>
          
          {/* <!-- <button type="button" className="btn btn-primary" v-on:click="request_test_ether">Request Test Ether</button> --> */}
          <br />
          <br />

          <div className="row container-fluid">
            <div className="col-sm-6 justify-content-center align-items-center ">
              <h3>Send Ether</h3>
              <div className="form-group">
                <label>Value</label>
                <input
                  className="form-control"
                  onChange={
                    event => handle_input({ eth_val: event.target.value })
                    // this.setState({
                    //   eth_val: event.target.value
                    // })
                  }
                  value={eth_val}
                  id="ether_val_input"
                  type="number"
                />

                <small id="" className="form-text text-muted">
                  Amount of Ether you wish to send.
                </small>
              </div>
              <div className="form-group">
                <label>To</label>
                <input
                  className="form-control"
                  name="eth_recipient"
                  type="text"
                  value={eth_recipient}
                  onChange={
                    event => handle_input({ eth_recipient: event.target.value })

                    // this.setState({
                    //   eth_recipient: event.target.value
                    // })
                  }
                />{" "}
                <small id="emailHelp" className="form-text text-muted">
                  Address you wish to send Ether to.
                </small>
              </div>

              <br />
              <br />

              <br />
              <br />

              <button
                type="button"
                className="btn btn-primary"
                onClick={send_ether}
              >
                Send Ether
              </button>
            </div>
            <div className="col-sm-6  ">
              <div className="row justify-content-center align-items-center flex">
                <div className="col-sm-12">
                  <div className="row justify-content-center align-items-center">
                    <h3>BUY Della Stable Tokens</h3>
                  </div>
                </div>
                <hr />
                <div className="row form-group flex justify-content-center ">
                  <label>
                    Number of Della Stable Tokens you wish to purchase
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    onChange={event => {
                      handle_input({
                        number_dst_tokens_purchase: event.target.value
                      });
                      //Maybe needs to be tweaked....
                      //   if( (number_dst_tokens_purchase / eth_price_data.eth_price) > selected_account.balance)
                      //     toastr.error('Not enough funds')
                    }}
                    value={number_dst_tokens_purchase}
                  />
                </div>
                <div className="col-sm-12">
                  <div className="row justify-content-center align-items-center">
                    Current Eth Price is ${eth_price_data.eth_price}
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="row justify-content-center align-items-center">
                    Your current Balance = <To_Number num={selected_account.balance} />
                  </div>
                </div>
                <div className="col-sm-12">
                  <div
                    id="total_eth_input"
                    className={`${
                      number_dst_tokens_purchase / eth_price_data.eth_price <=
                      selected_account.balance
                        ? " is_valid "
                        : " is_invalid "
                    }row justify-content-center align-items-center`}
                  >
                    Total:<To_Number num={number_dst_tokens_purchase}/> / $
                    <To_Number num={eth_price_data.eth_price} /> ={" "}
                    <To_Number num={number_dst_tokens_purchase / eth_price_data.eth_price}/> ETH
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="row justify-content-center align-items-center">
                    <button
                      onClick={buy_stable_tokens}
                      className="btn btn-primary"
                    >
                      BUY Stable Tokens
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Create_in_browser_wallet = ({
  pw,
  pw2,
  random_text,
  wallet_password,
  wallet_name,
  onChange,
  create_wallet,
  browser_wallet,
  load_wallet,
  load_wallet_btn_txt
}) => {
  return (
    <>
      <div className="row justify-content-center">
        {browser_wallet && (
          <div className="col-md-6 form-group">
            <div className="row justify-content-center">
              <h2>Looks like this browser already has a wallet</h2>
              <h3>Load an existing wallet</h3>
            </div>

            <label htmlFor="wallet password">Wallet Password</label>

            <input
              className="form-control form-control-lg"
              type="password"
              onChange={event =>
                handle_input({ wallet_password: event.target.value })
              }
              // onChange={(event) =>
              //   this.setState({ pw: event.target.value })
              // }
              value={wallet_password}
              placeholder="Please enter your wallet password"
            />
            <div className="row justify-content-center">
              <button className="btn btn-primary" onClick={load_wallet}>
                {load_wallet_btn_txt}
              </button>
            </div>
          </div>
        )}

        {!browser_wallet && (
          <div className="col-sm-6">
            <div className="row justify-content-center">
              <h3>Create a New Wallet</h3>
            </div>
            <div className="row justify-content-center">
              {/* <label htmlFor="Wallet Name">Wallet Name</label>

            <input
              className="form-control form-control-lg"
              type="test"
              onChange={(event) => onChange({ wallet_name: event.target.value })}
              // onChange={(event) =>
              //   this.setState({ pw: event.target.value })
              // }
              value={wallet_name}
              placeholder="Dave's wallet"
            /> */}
            </div>
            <div className="row justify-content-center">
              <div className="form-group col-md-6 ">
                <label htmlFor="random_text">
                  Add random text to create more entropy for a more secure
                  wallet
                </label>

                <textarea
                  value={random_text}
                  onChange={event =>
                    handle_input({ random_text: event.target.value })
                  }
                  placeholder="add random text to create more entropy for your new wallet. See BIP39 "
                  className="form-control form-control-lg"
                  name="rndom_text"
                  id=""
                  cols="30"
                  rows="5"
                />
              </div>

              <div className="col-md-6 form-group">
                <label htmlFor="pw">Password</label>

                <input
                  className="form-control form-control-lg"
                  type="password"
                  name="pw"
                  onChange={event => handle_input({ pw: event.target.value })}
                  // onChange={(event) =>
                  //   this.setState({ pw: event.target.value })
                  // }
                  value={pw}
                  placeholder="please dont forget your password"
                />
                <br />
                <label htmlFor="pw2">Confirm Password</label>

                <input
                  onChange={event => handle_input({ pw2: event.target.value })}
                  className="form-control form-control-lg"
                  type="password"
                  name="pw2"
                  value={pw2}
                  placeholder="please dont forget your password"
                />
              </div>
            </div>
            <div className="row justify-content-center">
              <br />
              <br />
              <button onClick={create_wallet} className="btn btn-primary">
                Create a Wallet
              </button>
              <br />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const Wallet_Options = ({
  show_metamask,
  show_browser_wallet,
  show_opera,
  reset,
  select
}) => (
  <>
    <div className="col-sm-12">
      <div className="row justify-content-center">
        <Fade_Up show={!show_metamask || !show_browser_wallet || !show_opera}>
          {(!show_metamask || !show_browser_wallet || !show_opera) && (
            <button onClick={reset} type="button" className="btn btn-link">
              BACK
            </button>
          )}
        </Fade_Up>
      </div>
    </div>

    <div className="col-sm-12">
      <div className="row justify-content-center">
        {/* Show metamask transition */}

        {/* <Fade_Up keyy="metamask" show={show_metamask}> */}
        {show_metamask && (
          <div className="col-sm-3">
            <img
              onClick={() => select("show_metamask")}
              src="../static/img/metamask.png"
              alt=""
              className="img-thumbnail"
            />
          </div>
        )}
        {/* </Fade_Up> */}

        {/* Show browser allet transition */}

        {/* <Fade_Up keyy="browser wallet" show={show_browser_wallet}> */}
        {show_browser_wallet && (
          <div className="col-sm-3">
            <img
              onClick={() => select("show_browser_wallet")}
              src="../static/img/browser-wallet.png"
              alt=""
              className="img-thumbnail"
            />
          </div>
        )}
        {/* </Fade_Up> */}
        {/* Show opera transition */}
        {/* <Fade_Up keyy="opera" show={show_opera}> */}
        {show_opera && (
          <div className="col-sm-3">
            <img
              onClick={() => select("show_opera")}
              src="../static/img/opera-logo.png"
              alt=""
              className="img-thumbnail"
            />
          </div>
        )}
        {/* </Fade_Up> */}
      </div>
    </div>
  </>
);
// export default Create_in_browser_wallet
