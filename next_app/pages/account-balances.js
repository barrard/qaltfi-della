import React from "react";
import { connect } from "react-redux";
import $ from "jquery";

import Main_Layout from "../layouts/Main_Layout.js";
import Account_Menu from "../components/user/Account_Menu.js";
import { UPDATE_USER_PROFILE } from "../redux/store.js";
import { get_balance } from "../redux/web3_reducers.js";
class Account_Balances extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // user: user,//props
      // tokens: {},
      token_address: "",
      crowdsale_address: "",
      error_message: "",
      number_token_offer_for_sale: 1,
      total_price_for_tokens: 0.0001,
      available_tokens: 0,
      //two_factor_auth
      balance: this.props.user.balance || 0, //if not already present....
      transaction_processing: false,
      verifying_wallet_password: false,
      incorrect_wallet_password: false,
      two_factor_auth: {
        second_transaction_gas_estimate: 0,
        user_id: "",
        gas_estimate: 21000,
        wallet_password: "",
        gas_price: 8,
        median_time: 30,
        transaction_type: "",
        to: "",
        from: "",
        value: 0,
        fn_data: {
          fn: "",
          args: []
        }
      }
    };
  }

  componentDidMount() {
    if (this.props.user)
      this.state.two_factor_auth.user_id = this.props.user._id;

    /*     //TODO set up sockets later */
    // socket.on('Cancel_Bid_For_Tokens_Event', (data)=>{
    //   console.log('Cancel_Bid_For_Tokens_Event')
    //     console.log(data)
    //     const {
    //       bidder_address,bidder_index,time,token_address,token_amount,token_index,wei_amount
    //     } = data
    //     const bid_for_tokens_index = my_tokens_vue.user.bids_for_tokens.findIndex((bft) => {
    //       console.log(bft)
    //       return (
    //         bft.token_address == token_address
    //         && bft.bidder_index == bidder_index
    //         && bft.token_index == token_index
    //       )
    //     })
    //     my_tokens_vue.user.bids_for_tokens.splice(bid_for_tokens_index, 1)

    //     toast('Bid For Tokens has been cancled', "DONE")
    //   })

    // socket.on('Cancel_Tokens_For_Sale_Event', (data)=>{
    //   console.log('Cancel_Tokens_For_Sale_Event')
    //     console.log(data)
    //     const {
    //       seller_address,token_address,token_amount,seller_index,token_index,wei_amount,time
    //     } = data
    //       const tokens_for_sale_index = my_tokens_vue.user.tokens_for_sale.findIndex((t) => {
    //         console.log(t)
    //         return (
    //         t.token_address == token_address
    //         && t.seller_index == seller_index
    //         && t.token_index == token_index
    //               )
    //       })
    //     my_tokens_vue.user.tokens_for_sale.splice(tokens_for_sale_index, 1)
    //     const tokens_index = my_tokens_vue.user.tokens.findIndex((t) => {
    //       return t.token_address == token_address
    //     })
    //     my_tokens_vue.user.tokens[tokens_index].amount += parseInt(token_amount)

    //     toast('Token sale has been cancled', "DONE")
    //   })

    // socket.on('Tokens_For_Sale_Event', (data)=>{
    //   console.log('Tokens_For_Sale_Event')
    //   console.log(data)
    //   const {token_address,token_amount,wei_amount,seller_address} = data
    //     const index = my_tokens_vue.user.tokens.findIndex((t) => {
    //       console.log(t)
    //       return t.token_address == token_address
    //     })
    //   my_tokens_vue.user.tokens[index].amount -= token_amount
    //   my_tokens_vue.user.tokens_for_sale.push(data)
    //   toast('Tokens are now in the market place', "DONE")
    // })
    /*     //TODO set up sockets later */
    /*     //TODO set up sockets later */
    /*     //TODO set up sockets later */
    /*     //TODO set up sockets later */



    //   eth_balance => {
    //   if (eth_balance.err) {
    //     UPDATE_USER_PROFILE({
    //       key: "balance",
    //       value: "Error gettign eth balance"
    //     });
    //   } else {
    //     UPDATE_USER_PROFILE({
    //       key: "balance",
    //       value: eth_balance.resp.balance
    //     });
    //   }
    //   console.log(eth_balance);
    // });
  }

  submit_singed_tansaction() {
    hide_modal("two_factor_auth_modal");
    console.log("SEND IT!");
    console.log(this.state.two_factor_auth.fn_data);
    let fn = this.state.two_factor_auth.fn_data.fn;
    let args = this.state.two_factor_auth.fn_data.args;
    fn(...args);
  } //for two factor auth modal

  cancel_bid_for_tokens(event, index, token_address, bidder_index) {
    let event_target = event.target;
    //two factor auth modal
    var two_factor_auth = JSON.stringify(this.state.two_factor_auth);
    //after we have the info, the user needs to enter a password / verify authority
    this.props.web3.transaction_in_progress = true;
    if (this.state.two_factor_auth.wallet_password) {
      start_spinner("Verifying password");
      this.state.verifying_wallet_password = true;
    } else {
      start_spinner();
    }
    //two factor auth modal

    disable_ui(event_target);
    console.log({ token_address, bidder_index });
    $.post(
      `/cancel_bid`,
      {
        token_address,
        bidder_index,
        _csrf,
        two_factor_auth
      },
      resp => {
        console.log(resp);
        stop_spinner();
        this.props.web3.transaction_in_progress = false; //two factor auth
        this.state.verifying_wallet_password = false; //two factor auth
        if (resp.err) {
          this.props.web3.transaction_in_progress = false;
          this.state.two_factor_auth.gas_estimate = 0;
          this.state.two_factor_auth.wallet_password = "";
          console.log("show it?");
          toastr.error("Error trying to sign Cancel Bid For Tokens");
          // show_modal('two_factor_auth_modal')
          toastr.error(resp.err);
        }
        if (!resp.err && resp.resp) {
          if (resp.resp.incorrect_wallet_password) {
            this.state.incorrect_wallet_password = true;
            show_two_factor_auth_modal();
            return toastr.error("Incorrect Password");
          }
          if (resp.resp.two_factor_auth) {
            console.log("Got gas estimate");
            start_spinner("Getting gas estimate");
            this.state.two_factor_auth.gas_estimate =
              resp.resp.two_factor_auth.gas_estimate;
            this.state.two_factor_auth.to = resp.resp.two_factor_auth.to;
            this.state.two_factor_auth.from = resp.resp.two_factor_auth.from;
            this.state.two_factor_auth.value = resp.resp.two_factor_auth.value;
            // this.second_transaction_gas_estimate = 420609//to include the second transaction..

            this.state.two_factor_auth.fn_data = {
              fn: this.cancel_bid_for_tokens,
              args: [event, index, token_address, bidder_index]
            };

            setTimeout(async () => {
              const { median_price, median_time } = await gas_station_data();
              this.state.two_factor_auth.gas_price = median_price;
              this.state.two_factor_auth.median_time = median_time;
              stop_spinner();
              show_modal("two_factor_auth_modal");
            }, 0);
          } else if (resp.resp.transaction_processing) {
            //Password was matched, and we will notify via sockets when done!
            this.props.web3.transaction_in_progress = true;
            //reset two_factor_auth credentials
            this.state.two_factor_auth.gas_estimate = undefined;
            this.state.two_factor_auth.wallet_password = undefined;
            this.state.two_factor_auth.to = undefined;
            this.state.two_factor_auth.from = undefined;
            this.state.two_factor_auth.value = undefined;
            // this.second_transaction_gas_estimate = 0 //specific to offer tokens for sale and accept bid for token
            hide_modal("two_factor_auth_modal");

            dynamic_message("warning", "Transaction Processing......");
            return toastr.info("Transaction processing.....");
          }
        }
      }
    );
  }
  cancel_token_for_sale($event, index, token_address, seller_index) {
    console.log({ token_address, seller_index });

    //two factor auth modal
    var two_factor_auth = JSON.stringify(this.state.two_factor_auth);
    //after we have the info, the user needs to enter a password / verify authority
    if (this.state.two_factor_auth.wallet_password)
      this.state.verifying_wallet_password = true;
    this.props.web3.transaction_in_progress = true;
    if (this.state.two_factor_auth.wallet_password)
      start_spinner("Verifying password");
    else start_spinner();
    //two factor auth modal

    $.post(
      `/cancel_tokens_for_sale`,
      {
        token_address: token_address,
        seller_index: seller_index,
        two_factor_auth,
        _csrf: this.props.csrf
      },
      resp => {
        stop_spinner();
        console.log(resp);

        this.props.web3.transaction_in_progress = false; //two factor auth
        this.state.verifying_wallet_password = false; //two factor auth

        if (resp.err) {
          this.props.web3.transaction_in_progress = false;
          this.state.two_factor_auth.gas_estimate = 0;
          this.state.two_factor_auth.wallet_password = "";
          console.log("show it?"); //dont show the modal!
          // show_modal('two_factor_auth_modal')
          toast(resp.err, "ERROR");
          toast("Error trying to sign Cancel Tokens For Sale", "ERROR");
        }

        if (!resp.err && resp.resp) {
          if (resp.resp.incorrect_wallet_password) {
            this.state.incorrect_wallet_password = true;
            show_two_factor_auth_modal();
            return toast("Incorrect Password", "ERROR");
          }
          if (resp.resp.two_factor_auth) {
            console.log("Got gas estimate");
            start_spinner("Getting gas estimate");
            this.state.two_factor_auth.gas_estimate =
              resp.resp.two_factor_auth.gas_estimate;
            this.state.two_factor_auth.to = resp.resp.two_factor_auth.to;
            this.state.two_factor_auth.from = resp.resp.two_factor_auth.from;
            this.state.two_factor_auth.value = resp.resp.two_factor_auth.value;
            this.state.two_factor_auth.fn_data = {
              fn: this.cancel_token_for_sale,
              args: [$event, index, token_address, seller_index]
            };

            setTimeout(async () => {
              const { median_price, median_time } = await gas_station_data();
              this.state.two_factor_auth.gas_price = median_price;
              this.state.two_factor_auth.median_time = median_time;
              stop_spinner();
              show_modal("two_factor_auth_modal");
            }, 0);
          } else if (resp.resp.transaction_processing) {
            //Password was matched, and we will notify via sockets when done!
            this.props.web3.transaction_in_progress = true;
            //reset two_factor_auth credentials
            this.state.two_factor_auth.gas_estimate = undefined;
            this.state.two_factor_auth.wallet_password = undefined;
            this.state.two_factor_auth.to = undefined;
            this.state.two_factor_auth.from = undefined;
            this.state.two_factor_auth.value = undefined;
            hide_modal("two_factor_auth_modal");

            dynamic_message("warning", "Transaction Processing......");
            return toast("Transaction processing.....", "INFO");
          }
        }
      }
    );
  }
  offer_tokens_for_sale() {
    let token_address = this.state.token_address;
    let token_amount = this.state.number_token_offer_for_sale;

    //two factor auth modal
    var two_factor_auth = JSON.stringify(this.state.two_factor_auth);
    //after we have the info, the user needs to enter a password / verify authority
    this.props.web3.transaction_in_progress = true;
    if (this.state.two_factor_auth.wallet_password) {
      start_spinner("Verifying password");
      this.state.verifying_wallet_password = true;
    } else {
      start_spinner();
    }
    //two factor auth modal

    $.post(
      `/offer_tokens_for_sale`,
      {
        _csrf: this.props.csrf,
        token_address: token_address,
        token_amount: token_amount,
        wei_amount: this.state.total_price_for_tokens,
        user_address: this.props.user.wallet_addresses[0],
        two_factor_auth
      },
      resp => {
        console.log(resp);
        stop_spinner();

        this.props.web3.transaction_in_progress = false; //two factor auth
        this.state.verifying_wallet_password = false; //two factor auth
        // first check for errors
        if (resp.err) {
          this.props.web3.transaction_in_progress = false;
          this.state.two_factor_auth.gas_estimate = 0;
          this.state.two_factor_auth.wallet_password = "";
          console.log("show it?"); //dont show two factor auth modal
          toast("Error trying to Offer Tokens For Sale", "ERROR");
          // show_modal('two_factor_auth_modal')
          toast(resp.err, "ERROR");
        }
        //if no err, then look for posible responses
        if (!resp.err && resp.resp) {
          if (resp.resp.incorrect_wallet_password) {
            this.state.incorrect_wallet_password = true;
            show_two_factor_auth_modal();
            return toast("Incorrect Password", "ERROR");
          }
          if (resp.resp.two_factor_auth) {
            console.log("Got gas estimate");
            start_spinner("Getting gas estimate");
            this.state.two_factor_auth.gas_estimate =
              resp.resp.two_factor_auth.gas_estimate;
            this.state.two_factor_auth.to = resp.resp.two_factor_auth.to;
            this.state.two_factor_auth.from = resp.resp.two_factor_auth.from;
            this.state.two_factor_auth.value = resp.resp.two_factor_auth.value;
            this.second_transaction_gas_estimate = 420609; //to include the second transaction..

            this.state.two_factor_auth.fn_data = {
              fn: this.offer_tokens_for_sale,
              args: []
            };

            setTimeout(async () => {
              const { median_price, median_time } = await gas_station_data();
              this.state.two_factor_auth.gas_price = median_price;
              this.state.two_factor_auth.median_time = median_time;
              stop_spinner();
              show_modal("two_factor_auth_modal");
            }, 0);
          } else if (resp.resp.transaction_processing) {
            //Password was matched, and we will notify via sockets when done!
            UPDATE_USER_PROFILE({
              key: "transaction_in_progress",
              value: true
            });
            // this.props.web3.transaction_in_progress = true
            //reset two_factor_auth credentials
            this.state.two_factor_auth.gas_estimate = undefined;
            this.state.two_factor_auth.wallet_password = undefined;
            this.state.two_factor_auth.to = undefined;
            this.state.two_factor_auth.from = undefined;
            this.state.two_factor_auth.value = undefined;
            this.state.two_factor_auth.second_transaction_gas_estimate = 0; //specific to offer tokens for sale
            hide_modal("two_factor_auth_modal");

            //TODO not sure if ill keep this session message thing
            // dynamic_message('warning', 'Transaction Processing......')
            return toast("Transaction processing.....", "INFO");
          }
        }
      }
    );
  }
  get_balance_of(token_address) {
    const user_address = this.props.user.wallet_addresses[0];
    $.get(`/token_balance_of/${token_address}/${user_address}`, resp => {
      console.log(resp);
      if (resp.resp) {
        this.setState({ available_tokens: resp.resp });
        // this.state.available_tokens = resp.resp
      } else {
        this.setState({ available_tokens: "Balance unavailable" });
        // this.available_tokens = 'Balance unavailable'
      }
    });
  }
  check_if_tradable(token_address, crowdsale_address) {
    this.setState({ error_message: "" });
    this.setState({ crowdsale_address });

    console.log({ token_address });
    this.get_balance_of(token_address);
    this.setState({ token_address });

    start_spinner("Verifying data");
    $.get(`/check_if_tradeable/${token_address}`, resp => {
      console.log(resp);
      if (resp.err) {
        this.setState({ error_message: "Sorry there was an error" });
      } else {
        const crowdsale = resp.resp;
        if (!crowdsale.isFinalized) {
          this.setState({
            error_message:
              "Sorry this token is from a campaign that is not yet finalized"
          });
        }

        show_modal("sell_tokens_modal");
      }
      stop_spinner();
    });
  }
  formatted_time(time) {
    console.log(time);
    return moment(time * 1000).format("MM/D/YY hh:mm:ss a");
  }

  // For two factor auth modal
  transaction_in_progress() {
    if (user) {
      return user.transaction_in_progress;
    }
  }
  remaining_balance() {
    return this.balance - this.total_transaction_cost;
  }
  value_ether() {
    return toEth(this.state.two_factor_auth.value);
  }
  total_transaction_cost() {
    return parseFloat(
      parseFloat(this.value_ether) + parseFloat(this.eth_transaction_cost)
    ).toFixed(6);
  }
  eth_transaction_cost() {
    //this number is Gwei, 1 million wei
    return toEth(
      this.state.two_factor_auth.gas_estimate *
        (this.state.two_factor_auth.gas_price * 1000000000)
    );
  }
  dollar_transaction_cost() {
    let val = (
      this.eth_transaction_cost * this.props.locals.CURRENT_ETH_PRICE
    ).toFixed(6);
    return val;
  } // For two factor auth modal

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
              <h1>Your Tokens</h1>
              <br />
              <br />
              <Account_Menu has_wallet={this.props.user.has_wallet} />
              <br />
              <br />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 overflow-y md_fixed_height">
              <div className="row">
                <h2>Your Tokens</h2>
                {this.props.user.tokens.length > 0 && (
                  <div className="col-sm-12">
                    <table>
                      <tr>
                        <th>Token Address</th>
                        <th>Total </th>
                        <th />
                        <th />
                      </tr>

                      {this.props.user.tokens.map((token, index) => (
                        <tr>
                          <td>{short_address(token.token_address)}</td>
                          <td>{token.amount}</td>
                          <td>
                            <a href={`/campaign/${token.crowdsale_address}`}>
                              <button className="btn btn-info">VIEW</button>
                            </a>
                          </td>
                          <td>
                            <button
                              onClick={() =>
                                check_if_tradable(
                                  token.token_address,
                                  token.crowdsale_address
                                )
                              }
                              data-target=".sell-tokens-lg"
                              className="btn clickable"
                            >
                              Sell
                            </button>
                          </td>
                        </tr>
                      ))}
                    </table>
                  </div>
                )}{" "}
                {/* User has token*/}
                {!this.props.user.tokens.length && (
                  <div className="col-sm-12">You don't have any tokens</div>
                )}
                {/* User has NO TOKENS */}
              </div>
            </div>
            <div className="col-sm-6 overflow-y md_fixed_height">
              <div className="row">
                <h2>Your Bids</h2>
                {this.props.user.bids_for_tokens.length > 0 && (
                  <div className="col-sm-12">
                    <table>
                      <tr>
                        <th>Token Address</th>
                        <th>Total Tokens</th>
                        <th>Total Ether</th>
                        <th />
                      </tr>

                      {this.props.user.bids_for_tokens.map(
                        (bid_for_tokens, index) => (
                          <tr>
                            <td>
                              {short_address(bid_for_tokens.token_address)}
                            </td>
                            <td>{bid_for_tokens.token_amount}</td>
                            <td>{toEth(bid_for_tokens.wei_amount)}</td>
                            <td>
                              <button
                                onClick={() =>
                                  this.cancel_bid_for_tokens(
                                    $event,
                                    index,
                                    bid_for_tokens.token_address,
                                    bid_for_tokens.bidder_index
                                  )
                                }
                                className="btn clickable"
                              >
                                CANCEL
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </table>
                  </div>
                )}

                {!this.props.user.bids_for_tokens.length && (
                  <div className="col-sm-12">
                    You don't have any bids for tokens
                  </div>
                )}
                {/* User has NO BIDS for  TOKENS */}
              </div>
            </div>
            <div className="col-sm-6 overflow-y md_fixed_height">
              <div className="row">
                <h2>Your Tokens For Sale</h2>
                {this.props.user.tokens_for_sale.length > 0 && (
                  <div className="col-sm-12">
                    <table>
                      <tr>
                        <th>Token Address</th>
                        <th>Total Tokens</th>
                        <th>Total Ether</th>
                        <th />
                      </tr>

                      {this.props.user.tokens_for_sale.map(
                        (token_for_sale, index) => (
                          <tr>
                            <td>
                              {short_address(token_for_sale.token_address)}
                            </td>
                            <td>{token_for_sale.token_amount}</td>
                            <td>{toEth(token_for_sale.wei_amount)}</td>
                            <td>
                              <button
                                onClick={() =>
                                  this.cancel_token_for_sale(
                                    $event,
                                    index,
                                    token_for_sale.token_address,
                                    token_for_sale.seller_index
                                  )
                                }
                                className="btn clickable"
                              >
                                CANCEL
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </table>
                  </div>
                )}
                {!this.props.user.tokens_for_sale.length && (
                  <div className="col-sm-12">
                    You don't have any tokens for sale
                  </div>
                )}
                {/* User has NO BIDS for  TOKENS */}
              </div>
            </div>
          </div>
          <br />
          <br />
          <br />

          {/* <!-- MODAL to sell tokens --> */}

          {/* <% include partials/two_factor_auth.ejs%> */}
        </div>
      </Main_Layout>
    );
  }
}

function mapStateToProps(state) {
  const { user, csrf, locals } = state;
  return { ...user, ...csrf, ...locals };
}
export default connect(mapStateToProps)(Account_Balances);
