import React from "react";
import { connect } from "react-redux";
import { UPDATE_TWO_FACTOR_AUTH } from "../../redux/store.js";
import { Short_Address } from "../small_ui_items.js";

class Two_Factor_Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verifying_wallet_password: false



    };
  }

  static async getInitialProps(){
    console.log('TWO FAACOR!!!!')
  }

  componentDidMount() {
    //TWO FACTOR AUTH
    if (this.props.user)
      this.props.dispatch(
        UPDATE_TWO_FACTOR_AUTH({value:this.props.user._id, key:"user_id"})
      );
  }

  // For two factor auth modal
  transaction_in_progress() {
    if (user) {
      return this.props.web3.transaction_in_progress;
    }
  }
  remaining_balance() {
    return this.balance - this.total_transaction_cost;
  }
  value_ether() {
    return toEth(this.props.two_factor_auth.value);
  }
  total_transaction_cost() {
    return parseFloat(
      parseFloat(this.value_ether) + parseFloat(this.eth_transaction_cost)
    ).toFixed(6);
  }
  eth_transaction_cost() {
    //this number is Gwei, 1 million wei
    return toEth(
      this.props.two_factor_auth.gas_estimate *
        (this.props.two_factor_auth.gas_price * 1000000000)
    );
  }
  dollar_transaction_cost() {
    let val = (
      this.eth_transaction_cost * this.props.locals.CURRENT_ETH_PRICE
    ).toFixed(6);
    return val;
  } // For two factor auth modal

  // For two factor auth modal
  transaction_in_progress() {
    if (user) {
      return this.props.web3.transaction_in_progress;
    }
  }
  remaining_balance() {
    return this.balance - this.total_transaction_cost;
  }
  value_ether() {
    return toEth(this.props.two_factor_auth.value);
  }
  total_transaction_cost() {
    return parseFloat(
      parseFloat(this.value_ether) + parseFloat(this.eth_transaction_cost)
    ).toFixed(6);
  }
  eth_transaction_cost() {
    //this number is Gwei, 1 million wei
    return toEth(
      this.props.two_factor_auth.gas_estimate *
        (this.props.two_factor_auth.gas_price * 1000000000)
    );
  }
  dollar_transaction_cost() {
    let val = (
      this.eth_transaction_cost * this.props.locals.CURRENT_ETH_PRICE
    ).toFixed(6);
    return val;
  } // For two factor auth modal


  //for two factor auth modal
  submit_singed_tansaction() {
    hide_modal('two_factor_auth_modal')
    console.log('SEND IT!')
    // console.log(this.props.two_factor_auth.fn_data)
    let fn = this.props.two_factor_auth.fn_data.fn
    let args = this.props.two_factor_auth.fn_data.args
    fn(...args)
  }//for two factor auth modal

  render() {
    return (
      <div
        className="modal fade"
        id="two_factor_auth_modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="two_factor_auth_modal"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div
            className="modal-content"
            style={{
              background: "transparent",
              border: "none"
            }}
          >
            <div className="modal-body">
              <div className="row">
                <div className="col-sm-12">
                  <div className="row">
                    <div className="col-md-11 col-sm-12">
                      <h4
                        style={{
                          color: "#fff",
                          fontWeight: "100"
                        }}
                      >
                        Send Transaction
                      </h4>
                      <a
                        href="#"
                        data-dismiss="modal"
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0"
                        }}
                      >
                        <i
                          className="icon-close icons"
                          aria-hidden="true"
                          style={{
                            color: "#fff",
                            fontSize: "26px"
                          }}
                        />
                      </a>

                      <div
                        className="card  mt-3"
                        style={{
                          background: "#fff",
                          padding: "10px"
                        }}
                      >
                        {/* <!-- <h4>Please review the transaction details below</h4> --> */}
                        <p>Transaction Type</p>
                        <small>
                          {this.props.two_factor_auth.transaction_type}
                        </small>
                        <div className="row flex_center">
                          <div className="col-sm-6 ">
                            <hr />
                          </div>
                        </div>
                        <div className="container-fluid">
                          Current Eth Price $
                          {this.props.locals.CURRENT_ETH_PRICE}
                        </div>

                        <div>
                          <div className="row">
                            <div className="col-sm-6">
                              <hr />
                            </div>
                            <div className="col-sm-6">
                              <hr />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-6 flex_center">
                              Avg. Gas Price (Gwei)
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-sm-6 flex_center">
                              <input
                                className="gas_price_input"
                                step="0.1"
                                type="number"
                                value={this.props.two_factor_auth.gas_price}
                                onChange={(event) =>
                                  this.props.dispatch(
                                    UPDATE_TWO_FACTOR_AUTH(
                                      event.target.value,
                                      "gas_price"
                                    )
                                  )
                                }
                              />
                            </div>
                            <div className="col-sm-6">
                              <div className="row">
                                <div className="col-sm-12 flex_center">
                                  <small>
                                    Data provided by
                                    <a
                                      target="_blank"
                                      href="https://ethgasstation.info/index.php"
                                    >
                                      ETH Gas Station
                                    </a>
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-6">
                            <hr />
                          </div>
                          <div className="col-sm-6">
                            <hr />
                          </div>
                        </div>

                        <div className="container">
                          <div className="row">
                            <div className="col-sm-7 flex_center">
                              Total gas required.
                            </div>
                            <div className="flex_center col-sm-4">
                              {this.props.two_factor_auth.gas_estimate +
                                this.props.two_factor_auth
                                  .second_transaction_gas_estimate}
                            </div>
                          </div>
                          <div className="row">
                            <div className="flex_center col-sm-7">
                              Transaction Fee ETH @
                              {this.props.two_factor_auth.gas_price} GWei:
                            </div>
                            <div className="flex_center col-sm-4">
                              {this.props.two_factor_auth.eth_transaction_cost}
                            </div>
                          </div>
                          <div className="row">
                            <div className="flex_center col-sm-7">
                              Transaction Fee USD
                            </div>
                            <div className="col-sm-4 flex_center">
                              ${this.dollar_transaction_cost()}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-12">
                              <hr />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-4 flex_center">To:</div>
                            <div
                              className="col-sm-4 flex_center"
                              title={this.props.two_factor_auth.to}
                            >
                              <Short_Address
                                address={this.props.two_factor_auth.to}
                              />
                            </div>
                            <div className="col-sm-4 flex_center">
                              <span>
                                <button
                                  onClick={()=>this.copy('to_address')}
                                  className="btn btn-sm"
                                >
                                  COPY
                                </button>
                              </span>
                              <p className="hidden-off-screen" id="to_address">
                                {this.props.two_factor_auth.to}
                              </p>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-4 flex_center">From:</div>
                            <div
                              className="col-sm-4 flex_center"
                              title={this.props.two_factor_auth.from}
                            >
                              <Short_Address
                                address={this.props.two_factor_auth.from}
                              />
                              <p
                                className="hidden-off-screen"
                                id="from_address"
                              >
                                {this.props.two_factor_auth.from}
                              </p>
                            </div>
                            <div className="col-sm-4 flex_center">
                              <span>
                                <button
                                  onClick={()=>this.copy('from_address')}
                                  className="btn btn-sm"
                                >
                                  COPY
                                </button>
                              </span>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-4 flex_center">Value Sent</div>
                            <div className="col-sm-4 flex_center">
                              Trasaction Fee
                            </div>
                            <div className="col-sm-4 flex_center">Total</div>
                          </div>
                          <div className="row">
                            <div className="col-sm-4 flex_center">
                              {this.props.two_factor_auth.value_ether}
                            </div>
                            <div className="col-sm-4 flex_center">
                              {this.props.two_factor_auth.eth_transaction_cost}
                            </div>
                            <div className="col-sm-4 flex_center">
                              {this.props.two_factor_auth.total_transaction_cost}
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-sm-6 flex_center">
                              <label htmlFor="Current Balace">Current Balace</label>
                            </div>
                            <div className="col-sm-6 flex_center">
                              Balance remaining
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-6 flex_center">{this.state.balance}</div>
                            <div
                              className={`${
                                this.props.two_factor_auth.remaining_balance < 0 ? "alert-danger" : ""
                              } col-sm-6 flex_center`}
                            >
                              {this.props.two_factor_auth.remaining_balance}
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-sm-12">
                              <hr />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-4 flex_center">
                              <label htmlFor="Wallet Password">Password</label>
                            </div>
                            <div className="col-sm-4 flex_center">
                              <input
                                className={
                                  !this.state.incorrect_wallet_password
                                    ? "is_valid"
                                    : "is_invalid"
                                }
                                type="password"
                                placeholder="Wallet Password"
                                value={
                                  this.props.two_factor_auth.wallet_password
                                }
                                onChange={(event) =>
                                  this.props.dispatch(
                                    UPDATE_TWO_FACTOR_AUTH(
                                      event.target.value,
                                      "wallet_password"
                                    )
                                  )
                                }
                              />
                            </div>

                            <div className="col-sm-4 flex_center">
                              <button
                                onClick={this.submit_singed_tansaction}
                                disabled={
                                  this.props.two_factor_auth.remaining_balance < 0 ||
                                  this.props.two_factor_auth.transaction_in_progress ||
                                  !this.props.two_factor_auth.wallet_password
                                }
                                className="btn btn-sm btn-primary"
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                          {/* <transition name="slide-fade"> */}
                          {this.state.verifying_wallet_password && (
                            <div className="row" key="verifying_wallet_password">
                              <div className="col-sm-12 flex_center">
                                <small className="alert-link">
                                  Verifying Password...
                                </small>
                              </div>
                            </div>
                          )}
                          {!this.state.verifying_wallet_password && (
                            <div
                              className="row"
                              key="not_verifying_wallet_password"
                            >
                              <div className="col-sm-6 flex_center">
                                <small className="alert-link">
                                  <a href="#recover_wallet_password">
                                    Forgot your password?
                                  </a>
                                </small>
                              </div>
                              {/* <transition name="slide-fade"> */}

                              {this.state.incorrect_wallet_password && (
                                <div
                                  key="incorrect_wallet_password"
                                  className="col-sm-6"
                                >
                                  <small className="text-danger">
                                    Incorrect wallet password
                                  </small>
                                </div>
                              )}
                              {/* </transition> */}
                            </div>
                          )}
                          {/* </transition> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user, csrf, locals, two_factor_auth } = state;
  return { ...user, ...csrf, ...locals, ...two_factor_auth };
}

export default connect(mapStateToProps)(Two_Factor_Auth);
