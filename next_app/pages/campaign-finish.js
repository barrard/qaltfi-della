import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { withRouter } from "next/router";
import $ from "jquery";

// import PDFObject from 'pdfobject'
import Main_Layout from "../layouts/Main_Layout.js";
import { Campaign_Builder_Breadcrumbs } from "../components/small_ui_items.js";
import {
  sign_terms_and_agreement,
  has_signed_terms_and_agreement,
  is_authorized_investor,
  make_tokenized_campaign
} from "../components/contracts/Della.js";
import { retry } from "../components/utils/index.js";
import { Block_Spinner } from "../components/transitions/spinners.js";
import { UPDATE_USER_PROFILE } from "../redux/store.js";
import Two_Factor_auth from "../components/modals/Two_Factor_auth.js";
import Transaction_Popup from "../components/forms/Transaction_Popup.js";
import Router from "next/router";
import User_Terms_And_Agreement_Modal from "../components/modals/User_Terms_And_Agreement_Modal.js";
import { Fade_Left } from "../components/transitions/Slide_Transition.js";
class Campaign_Finish extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaign_is_being_deployed: false,
      show_pw_input: false,
      // crowdsale: crowdsale,
      // user: user,
      // transaction_sent: false,
      needs_more_eth: false,
      has_not_read_user_agreement: false, //TODO get scroll of PDF seems impossible
      user_signature: "",
      //two_factor_auth
      // CURRENT_ETH_PRICE,
      balance: 0, //if not already present....
      transaction_processing: false,
      verifying_wallet_password: false,
      incorrect_wallet_password: false,
      IP: "0.0.0.0"
    };
    this.deploy_campaign = this.deploy_campaign.bind(this);
    this.handle_state_input = this.handle_state_input.bind(this);
    this.agree_to_terms = this.agree_to_terms.bind(this);
  }

  static async getInitialProps() {
    console.log("getInitialProps campaign finish");
    return {};
  }

  async componentDidMount() {
    if (this.props.user.crowdsale_deployed) {
      Router.push("/campaign-manage");
    }
    /* Get IP */
    console.log("get IP");
    const signature_resp = await $.get("/signature_data");
    console.log(signature_resp);
    this.setState({
      IP: signature_resp.ip
    });

    /* Use web3 to check is approved and terms signed */
    retry("Checking investors status to start campaign", 500, async () => {
      const { web3 } = this.props.web3;
      const address = web3.eth.defaultAccount;
      // const address = undefined
      console.log({ address });
      console.log(address ? "got addres" : "no address");
      if (!address) throw "No address try again";
      const has_signed = await has_signed_terms_and_agreement({
        web3,
        address
      });
      const is_authorized = await is_authorized_investor({ web3, address });
      console.log({ has_signed, is_authorized });
      // if (has_signed || is_authorized) {
      this.props.dispatch(
        UPDATE_USER_PROFILE({
          key: "signed_terms_and_agreement",
          value: has_signed
        })
      );
      this.props.dispatch(
        UPDATE_USER_PROFILE({
          key: "is_approved",
          value: is_authorized
        })
      );
      // }
      return true;
    });

    // this.get_balance();

    // socket.on("notification", data => {
    //   console.log("EDIT-FINALIZE NOTIFICATION");
    //   console.log(data);
    //   if (data.data.transaction_type == "Agree to terms")
    //     this.props.user.signed_terms_and_agreement = true;
    //   if (data.data.transaction_type == "Fundraiser Approved")
    //     this.props.user.is_approved = true;
    //   if (data.data.transaction_type == "Create Crowdsale") {
    //     console.log("reload??");
    //     start_spinner("Waiting for Campaign Deployed Event....");

    //   }
    //   if (data.data.transaction_type == "Crowdsale_Started_Event") {
    //     location.reload();
    //   }
    // });

    if (this.props.user_crowdsale.is_deployed) {
      console.log("IT DEPLOYED");
      Router.push("/campaign-manage");
    }

    const pdf_options = {
      height: "400px",
      pdfOpenParams: { view: "FitV", page: "12" }
    };
    PDFObject.embed(
      "/static/pdf/Sample_BasicEquity_Sharing_Agreement.pdf",
      "#contract_pdf",
      pdf_options
    );
  }

  show_terms_and_agreement() {
    show_modal("terms_and_agreement");
  }
  get_balance() {
    this.balance = "Aquiring balance";
    get_eth_balance(this.props.user.wallet_addresses[0], resp => {
      console.log(resp);
      if (resp.err) {
        this.balance = "Error gettign eth balance";
      } else {
        this.balance = resp.resp.balance;
      }
    });
  } //if not already present

  //for two factor auth modal
  submit_singed_tansaction() {
    setTimeout(() => {
      hide_two_factor_auth_modal();
    }, 0);
    console.log("SEND IT!");
    console.log(this.props.two_factor_auth.fn_data);
    let fn = this.props.two_factor_auth.fn_data.fn;
    let args = this.props.two_factor_auth.fn_data.args;
    fn(...args);
  } //for two factor auth modal

  async agree_to_terms(e) {
    const { user_signature, IP } = this.state;

    if (!user_signature || !IP) {
      return toast("You must sign the agreement");
    }

    //disable UI to prevent double sending
    var btn = e.target;
    $(btn).prop("disabled", true);
    $("#user_signature").prop("disabled", true);
    hide_modal("terms_and_agreement");
    let has_signed = await sign_terms_and_agreement({
      user_signature,
      IP,
      props: this.props
    });
    // console.log({has_signed})
    // const { transactionHash, receipt, error } = has_signed;
    // if(error)toastr.error('And error occured please try again later')
    // if (receipt) {
    //   this.props.dispatch(
    //     UPDATE_USER_PROFILE({
    //       key: "signed_terms_and_agreement",
    //       value: has_signed
    //     })
    //   );
    // }
    //two factor auth modal
    // var two_factor_auth = JSON.stringify(this.props.two_factor_auth);
    // //after we have the info, the user needs to enter a password / verify authority
    // if (this.props.two_factor_auth.wallet_password)
    //   this.verifying_wallet_password = true;
    // this.props.web3.transaction_in_progress = true;
    // if (this.props.two_factor_auth.wallet_password)
    //   start_spinner("Verifying password");
    // else start_spinner();
    //two factor auth modal

    // $.post(
    //   "/agree_to_terms",
    //   { name: user_signature, _csrf: this.props.csrf, two_factor_auth },
    //   resp => {
    //     console.log(resp);
    //     stop_spinner();
    //     $(btn).prop("disabled", false);
    //     $("#user_signature").prop("disabled", false);
    //     this.props.web3.transaction_in_progress = false; //two factor auth
    //     this.verifying_wallet_password = false; //two factor auth

    //     if (resp.err) {
    //       this.props.web3.transaction_in_progress = false;
    //       this.props.two_factor_auth.gas_estimate = 0;
    //       this.props.two_factor_auth.wallet_password = "";
    //       console.log("show it?");
    //       toastr.error("Error trying to sign Terms and Agreement");
    //       show_modal("two_factor_auth_modal");
    //       toastr.error(resp.err);
    //     }

    //     if (!resp.err && resp.resp) {
    //       if (resp.resp.incorrect_wallet_password) {
    //         this.incorrect_wallet_password = true;
    //         show_two_factor_auth_modal();
    //         return toastr.error("Incorrect Password");
    //       }

    //       if (resp.resp.two_factor_auth) {
    //         console.log("Got gas estimate");
    //         start_spinner("Getting Gas estimates");
    //         this.props.two_factor_auth.gas_estimate =
    //           resp.resp.two_factor_auth.gas_estimate;
    //         this.props.two_factor_auth.to = resp.resp.two_factor_auth.to;
    //         this.props.two_factor_auth.from = resp.resp.two_factor_auth.from;
    //         this.props.two_factor_auth.value = resp.resp.two_factor_auth.value;
    //         this.props.two_factor_auth.transaction_type =
    //           resp.resp.two_factor_auth.transaction_type;
    //         this.props.two_factor_auth.fn_data = {
    //           fn: this.agree_to_terms,
    //           args: [e]
    //         };

    //         setTimeout(async () => {
    //           const { median_price, median_time } = await gas_station_data();
    //           this.props.two_factor_auth.gas_price = median_price;
    //           this.props.two_factor_auth.median_time = median_time;
    //           stop_spinner();
    //           show_modal("two_factor_auth_modal");
    //         }, 0);
    //       } else if (resp.resp.transaction_processing) {
    //         //Password was matched, and we will notify via sockets when done!
    //         this.props.web3.transaction_in_progress = true;
    //         //reset two_factor_auth credentials
    //         this.props.two_factor_auth.gas_estimate = undefined;
    //         this.props.two_factor_auth.wallet_password = undefined;
    //         this.props.two_factor_auth.to = undefined;
    //         this.props.two_factor_auth.from = undefined;
    //         this.props.two_factor_auth.value = undefined;
    //         this.props.two_factor_auth.transaction_type = "";
    //         hide_modal("two_factor_auth_modal");
    //         dynamic_message("warning", "Transaction Processing......");
    //         return toastr.info("Transaction processing.....");
    //       }
    //     }
    //   }
    // );
  }
  user_agreement_scroll_pos(event) {
    var percent_read = (
      (event.target.scrollTop / event.target.scrollHeight) *
      100
    ).toFixed(0);
    console.log(percent_read);
    if (percent_read > 80) {
      console.log("TODO check if they read it");
      // this.setState({
      //   has_not_read_user_agreement:false
      // })
    }
  }

  async deploy_campaign(e) {
    // if (this.transaction_sent) {
    //   toastr.warning("One transaction at a time");
    //   return;
    // }
    // this.transaction_sent = true;
    var btn = e.target;
    // $(btn).prop("disabled", true);
    // console.log(this.props);
    console.log(this.props.user_crowdsale);
    const { web3 } = this.props.web3;
    const address = web3.eth.defaultAccount;
    const goal = this.props.user_crowdsale.dollar_goal.toString();
    const _csrf = this.props.csrf;
    console.log({ goal, address, web3 });
    make_tokenized_campaign(this.props, resp => {
      const { error, transactionHash, receipt } = resp;
      this.setState({ campaign_is_being_deployed: true });
      if (error) {
        if (error.message) toastr.error(error.message);
        this.setState({ campaign_is_being_deployed: false });
      } else if (transactionHash) {
        console.log(transactionHash);
        toastr.info(`Transaction hash ${transactionHash}`);
      } else if (receipt) {
        console.log(receipt);
        toastr.info(`receipt received for ${transactionHash}`);
      }
    });

    // const { transactionHash, receipt, error } = campaign_deployed;
    // if(error)toastr.error('And error occured please try again later')
    // if (receipt) {
    //   console.log('Update user campaign is deployed')
    //   // this.props.dispatch(
    //   //   UPDATE_USER_PROFILE({
    //   //     key: "signed_terms_and_agreement",
    //   //     value: has_signed
    //   //   })
    //   // );
    // }
    // //two factor auth modal
    // var two_factor_auth = JSON.stringify(this.props.two_factor_auth);
    // //after we have the info, the user needs to enter a password / verify authority
    // if (this.props.two_factor_auth.wallet_password) {
    //   start_spinner("Verifying password");
    //   this.verifying_wallet_password = true;
    // } else {
    //   start_spinner();
    // } //two factor auth modal

    // $.post(
    //   `/create_new_crowdsale`,
    //   {
    //     name: "QAltFi",
    //     goal: this.props.user_crowdsale.dollar_goal,
    //     two_factor_auth,
    //     _csrf: _csrf
    //   },
    //   resp => {
    //     stop_spinner();
    //     this.transaction_sent = false;
    //     console.log("making crowdsale");
    //     console.log(resp);
    //     this.props.web3.transaction_in_progress = false; //two factor auth
    //     this.verifying_wallet_password = false; //two factor auth
    //     if (resp.err) {
    //       console.log(resp.err);
    //       $(btn).prop("disabled", false);
    //       toastr.error("Error trying to deploy campaign");
    //       toastr.error(resp.err);
    //       if (
    //         resp.err ==
    //         "Returned error: insufficient funds for gas * price + value"
    //       ) {
    //         this.setState({ needs_more_eth: true });
    //       }
    //     } else if (!resp.err && resp.resp) {
    //       //two factor auth
    //       if (resp.resp.incorrect_wallet_password) {
    //         this.incorrect_wallet_password = true;
    //         show_modal("two_factor_auth_modal");
    //         return toast("Incorrect Password", "ERROR");
    //       }
    //       if (resp.resp.two_factor_auth) {
    //         console.log("Got gas estimate");
    //         start_spinner("Getting gas estimate");
    //         this.props.two_factor_auth.gas_estimate =
    //           resp.resp.two_factor_auth.gas_estimate;
    //         this.props.two_factor_auth.to = resp.resp.two_factor_auth.to;
    //         this.props.two_factor_auth.from = resp.resp.two_factor_auth.from;
    //         this.props.two_factor_auth.value = resp.resp.two_factor_auth.value;
    //         // this.props.two_factor_auth.transaction_type = "create crowdsale"//hardcoded do not change
    //         this.props.two_factor_auth.fn_data = {
    //           fn: this.deploy_campaign,
    //           args: [e]
    //         };

    //         setTimeout(async () => {
    //           const { median_price, median_time } = await gas_station_data();
    //           this.props.two_factor_auth.gas_price = median_price;
    //           this.props.two_factor_auth.median_time = median_time;
    //           // setTimeout(() => {
    //           // show_two_factor_auth_modal()
    //           stop_spinner();
    //           show_modal("two_factor_auth_modal");
    //           // }, 0);
    //         }, 0);
    //       } else if (resp.resp.transaction_processing) {
    //         console.log("Transaction is processing");
    //         //Password was matched, and we will notify via sockets when done!
    //         this.props.web3.transaction_in_progress = true;
    //         //reset two_factor_auth credentials
    //         this.props.two_factor_auth.gas_estimate = undefined;
    //         this.props.two_factor_auth.wallet_password = undefined;
    //         this.props.two_factor_auth.to = undefined;
    //         this.props.two_factor_auth.from = undefined;
    //         this.props.two_factor_auth.value = undefined;
    //         this.props.two_factor_auth.transaction_type = "";

    //         // dynamic_message('warning', 'Transaction Processing......')
    //         this.props.user.signed_terms_and_agreement = true;
    //         // setTimeout(() => {
    //         // hide_two_factor_auth_modal()
    //         hide_modal("two_factor_auth_modal");

    //         // }, 0);
    //         return toastr.info("Transaction processing.....");
    //       }
    //     }

    //     // client_side_resp_handling_toast(resp)
    //   }
    // );
  }

  calculated_amount_tokens() {
    return Math.ceil(
      this.props.user_crowdsale.dollar_goal /
        this.props.locals.DOLLARS_PER_TOKEN
    );
    //TODO hard foded price in USD per token
  }
  calculated_eth_per_token() {
    return (
      Math.round(
        (this.props.locals.DOLLARS_PER_TOKEN /
          this.props.locals.CURRENT_ETH_PRICE) *
          10000000000
      ) / 10000000000
    );
  }
  calculated_total_eth() {
    return (
      Math.round(
        this.calculated_amount_tokens() *
          this.calculated_eth_per_token() *
          100000000
      ) / 100000000
    );
  }
  calculated_end_of_crowdsale_total() {
    // console.log(
    //   this.calculated_total_eth() * this.props.locals.CURRENT_ETH_PRICE
    // );
    // console.log(
    //   this.calculated_total_eth() * this.props.locals.CURRENT_ETH_PRICE >=
    //     this.props.user_crowdsale.dollar_goal
    // );
    return this.calculated_total_eth() * this.props.locals.CURRENT_ETH_PRICE;
  }
  calculated_eth_for_downpayment() {
    return (
      this.props.user_crowdsale.downpayment /
      this.props.locals.CURRENT_ETH_PRICE
    );
  }
  calculated_tokens_for_downpayment() {
    // console.log("NE TOO?!?!!?");
    return Math.floor(
      this.calculated_eth_for_downpayment() / this.calculated_eth_per_token()
    );
  }

  handle_state_input(key, value) {
    console.log(this.state);
    console.log(key);
    console.log(value);
    this.setState({
      [key]: value
    });
  }
  render() {
    const { pathname } = this.props.router;

    return (
      <Main_Layout>
        <div>
          {/* <Transaction_Popup
            show_pw_input="show_pw_input"
            gas_estimate={this.props.two_factor_auth.gas_estimate}
            transaction_type={this.props.two_factor_auth.transaction_type}
            on_gas_price_changed={this.on_gas_price_changed}
            on_gas_estimate_changed={this.on_gas_estimate_changed}
            handle_submit={this.handle_submit}
          /> */}

          <br />
          <br />
          <br />
          <div className="container">
            <div className="row">
              <div className="col-sm-12">
                <Campaign_Builder_Breadcrumbs pathname={pathname} />
              </div>

              <div className="col-sm-12 center-text">
                <h2>Deploy Campaign</h2>
              </div>
              <div class="col ">
                <div class="row justify-content-center align-items-center">
                  <p>
                  Deploy your campaign to the BlockChan 
                  Deploy your campaign to the BlockChan 
                  Deploy your campaign to the BlockChan 
                  </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <h2>Goal: </h2>
                <h3>
                  $
                  {parseInt(
                    this.props.user_crowdsale.dollar_goal
                  ).toLocaleString("en-US")}
                </h3>
              </div>
            </div>

            <div className="col text-center">
              <p className="mt-0 mb-0">
                # of Tokens(goal/$
                {this.props.locals.DOLLARS_PER_TOKEN})
              </p>
              <h6 className="mt-0 mb-0">
                <strong>
                  {parseInt(this.calculated_amount_tokens()).toLocaleString(
                    "en-US"
                  )}{" "}
                  Tokens
                </strong>
              </h6>
            </div>
            <div className="col text-center">
              <p className="mt-0 mb-0">
                ETH cost per token ( ${this.props.locals.DOLLARS_PER_TOKEN} /
                current eth price( ${this.props.locals.CURRENT_ETH_PRICE})){" "}
              </p>
              <h6 className="mt-0 mb-0">
                <strong>{this.calculated_eth_per_token()} ETH/Token</strong>
              </h6>
            </div>
            <div className="col text-center">
              <p className="mt-0 mb-0">Current ETH price USD/ETH</p>
              <h6 className="mt-0 mb-0">
                <strong>${this.props.locals.CURRENT_ETH_PRICE} </strong>
              </h6>
            </div>

            <div className="col text-center">
              <p className="mt-0 mb-0">
                Calculated total ETH (
                {parseInt(this.calculated_amount_tokens()).toLocaleString(
                  "en-US"
                )}
                Tokens X {this.calculated_eth_per_token()} ETH/Token)
              </p>
              <h6 className="mt-0 mb-0">
                <strong>
                  ETH {this.calculated_total_eth().toLocaleString()}
                </strong>
              </h6>
            </div>
            <div className="col text-center">
              <p className="mt-0 mb-0">
                Estimated total USD when complete ({this.calculated_total_eth()}{" "}
                ETH x ${this.props.locals.CURRENT_ETH_PRICE} USD/ETH)
              </p>
              <h6 className="mt-0 mb-0">
                <strong>
                  {" "}
                  $
                  {parseInt(
                    this.calculated_end_of_crowdsale_total()
                  ).toLocaleString("en-US")}
                </strong>
              </h6>
            </div>

            <div className="row">
              <div className="col-sm-4">
                <h2>Downpayment</h2>
                <h3>
                  $
                  {parseInt(
                    this.props.user_crowdsale.downpayment
                  ).toLocaleString("en-US")}
                </h3>
              </div>
            </div>

            <div className="col text-center">
              <p className="mt-0 mb-0">
                ETH for Downpayment ($
                {`${parseInt(
                  this.props.user_crowdsale.downpayment
                ).toLocaleString("en-US")} / ${
                  this.props.locals.CURRENT_ETH_PRICE
                } USD/ETH)`}
              </p>
              <h6 className="mt-0 mb-0">
                <strong>
                  {" "}
                  {parseInt(
                    this.calculated_eth_for_downpayment()
                  ).toLocaleString("en-US")}{" "}
                  ETH
                </strong>
              </h6>
            </div>

            <div className="col text-center">
              <p className="mt-0 mb-0">
                Tokens for downpayment (
                {`${this.calculated_eth_for_downpayment()} / ${this.calculated_eth_per_token()} USD/ETH)`}
              </p>
              <h6 className="mt-0 mb-0">
                <strong>
                  {" "}
                  {this.calculated_tokens_for_downpayment().toLocaleString()}{" "}
                  Tokens
                </strong>
              </h6>
            </div>

            <div className="col text-center">
              <p className="mt-0 mb-0">
                ETH to start Campaign (
                {this.calculated_tokens_for_downpayment()} Tokens X{" "}
                {this.calculated_eth_per_token()} ETH/Token)
              </p>
              <h6 className="mt-0 mb-0">
                <strong>
                  {" "}
                  {this.calculated_tokens_for_downpayment() *
                    this.calculated_eth_per_token()}{" "}
                  ETH
                </strong>
              </h6>
            </div>

            <Fade_Left
              show={!this.state.campaign_is_being_deployed}
              key={`campaign_is_not_being_deployed`}
            >
              <div className="row">
                <div className="col-sm-12">
                  {/* <transition name="slide-fade"> */}
                  {/* <!-- User needs to sign user agreement --> */}
                  {!this.props.user.signed_terms_and_agreement &&
                    this.props.web3.has_wallet && (
                      <div key="not_signed_agreement">
                        <div
                          className="center-text alert alert-danger"
                          role="alert"
                        >
                          <p>
                            Please read and sign the
                            <a onClick={this.show_terms_and_agreement} href="#">
                              Terms and Agreement
                            </a>
                          </p>
                        </div>
                      </div>
                    )}
                  {/* </transition> */}
                  {/* <transition name="slide-fade"> */}
                  {/* <!-- User isnt approved yet --> */}
                  {!this.props.user.is_approved && (
                    <div key="not_approved">
                      <div
                        className="center-text alert alert-danger"
                        role="alert"
                      >
                        <p>You aren't approved yet</p>
                      </div>
                    </div>
                  )}
                  {/* </transition> */}

                  {/* <transition name="slide-fade"> */}
                  {/* <!-- User needs a wallet --> */}
                  {!this.props.web3.has_wallet && (
                    <div key="no_wallet">
                      <div
                        className="center-text alert alert-info"
                        role="alert"
                      >
                        <p>
                          You must Create a wallet Before you can deploy to the
                          blockchain
                        </p>
                        <button
                          onClick={() => Router.push("/account-wallet")}
                          type="button"
                          className="btn success btn-lg"
                        >
                          Create Wallet
                        </button>
                      </div>
                    </div>
                  )}
                  {/* </transition> */}

                  {/* <!-- User needs more eth --> */}
                  {/* <transition name="slide-fade"> */}

                  {this.state.needs_more_eth && (
                    <div key="no_eth" className="alert alert-danger">
                      <p>
                        Looks like you dont have enough Ether to complete this
                        transaction
                      </p>
                      <p>
                        Visit your
                        <Link prefetch href="/account-profile">
                          <a className="alert-link">profile</a>, and select your
                        </Link>
                        <Link prefetch href="account-wallet">
                          <a className="alert-link">account wallet</a> to
                          request more free test Ether
                        </Link>
                      </p>
                    </div>
                  )}
                  {/* </transition> */}

                  {/* <!-- Everything is good to Go! --> */}
                  <Fade_Left
                    show={
                      this.props.web3.has_wallet &&
                      !this.state.needs_more_eth &&
                      this.props.user.is_approved &&
                      this.props.user.signed_terms_and_agreement
                    }
                  >
                    <div key="ready">
                      <button
                        onClick={this.deploy_campaign}
                        type="button"
                        className="btn success btn-lg clickable"
                      >
                        Start Campaign
                      </button>
                    </div>
                  </Fade_Left>
                </div>
              </div>
            </Fade_Left>
            {/* campaign_is_being_deployed */}

            <Fade_Left
              show={this.state.campaign_is_being_deployed}
              key={`campaign_is_being_deployed`}
            >
              <div class="row justify-content-center align-items-center">
                <div className="alert alert-success center-text">
                  Campaign is being deployed
                </div>
                <Block_Spinner />
              </div>
            </Fade_Left>

            <div class='row justify-content-center align-items-center'>
            <div className="col-sm-12">
              <Campaign_Builder_Breadcrumbs pathname={pathname} />
            </div>
            </div>
          </div>

          <br />
          <br />
          <br />

          <User_Terms_And_Agreement_Modal
            user_agreement_scroll_pos={this.user_agreement_scroll_pos}
            user_signature={this.state.user_signature}
            handle_state_input={this.handle_state_input}
            has_not_read_user_agreement={this.has_not_read_user_agreement}
            agree_to_terms={this.agree_to_terms}
          />
          <Two_Factor_auth />
        </div>
      </Main_Layout>
    );
  }
}

function mapStateToProps(state) {
  const { user, csrf, locals, crowdsales, two_factor_auth, web3 } = state;
  return {
    ...user,
    ...csrf,
    ...locals,
    ...crowdsales,
    ...two_factor_auth,
    web3
  };
}

export default connect(mapStateToProps)(withRouter(Campaign_Finish));
