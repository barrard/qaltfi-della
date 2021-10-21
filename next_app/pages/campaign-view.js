import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import web3 from "web3";
// import $ from "jquery";
import { get_token_details_data } from "../components/contracts/Della_Token.js";
// import { buy_campaign_tokens } from "../components/contracts/Della_Campaign.js";
import { send_dst_tokens } from "../components/contracts/Della_Stable_Token.js";
import {
  listen_for_campaign_tokens_purchased,
  get_refund,
  check_depositsOf
} from "../components/contracts/Della_Campaign.js";
import Like_Btn from "../components/user/Like_Btn.js";
import moment from "moment";
import Main_Layout from "../layouts/Main_Layout.js";
import { retry } from "../components/utils/index.js";
import { Profile_Img } from "../components/user/Profile_Img.js";
import {
  Formatted_Date_Time,
  To_Eth,
  To_Number
} from "../components/small_ui_items.js";
import { set_campaign_view_data } from "../redux/store.js";
import Campaign_Comment from '../components/Campaign_View_Components/Campaign_Comment.js'

class Campaign extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props);
    this.state = {
      token_details_fetching: false,
      refund_value: null,
      user_has_this_token: false,
      number_tokens_user_has: 0,
      transaction_sent: false,
      number_tokens_to_purchase: 0,
      web3: props.web3.web3,

      goal: parseInt(props.campaign_view_data.dollar_goal).toLocaleString(
        "en-US"
      ),
      downpayment: parseInt(
        props.campaign_view_data.downpayment
      ).toLocaleString("en-US"),
      new_comment: "",
      total_token_supply: 0,
      crowdsale_token_balance: 0,
      days_left: "",
      hours_left: "",
      minutes_left: "",
      campaign_events: [],
      campaign_socket_room: {}
    };
    this.submit_comment = this.submit_comment.bind(this);
    this.check_refund = this.check_refund.bind(this);
    this.get_token_details = this.get_token_details.bind(this);
    this.buy_tokens = this.buy_tokens.bind(this);
    // this.get_token_details = this.get_token_details.bind(this)
    // this.get_token_details = this.get_token_details.bind(this)
  }

  static async getInitialProps( ctx) {
    const {query, reduxStore} = ctx
    const state = reduxStore.getState()
    
    const API_SERVER = state.locals.locals.API_SERVER
    console.log({API_SERVER})
    console.log(query);
    // log(`${API_SERVER}/crowdsale/get_campaign/${crowdsale_id}`)
    let campaign = await fetch(`
    ${API_SERVER}/crowdsale/get_campaign/${query.campaign_id}
    `);
    let campaign_view_data = await campaign.json();
    const campaign_owner_data = await fetch(`
    ${API_SERVER}/user/get_campaign_owner/${campaign_view_data.user_id}
    `);
    console.log("campaign_owner_data");
    const campaign_owner = await campaign_owner_data.json();

    // console.log({ campaign_view_data, campaign_owner });

    return { campaign_view_data, campaign_owner };
  }
  componentWillUnmount() {
    console.log("UNMOUNTING CAMPAING VIEW!!!!!");
    if (this.state.Tokens_received_For_Tokens_subscription) {
      console.log("UNsubscribing from tokens for tokens event");
      // console.log(this.state.Tokens_received_For_Tokens_subscription);
      // console.log(
      //   this.state.Tokens_received_For_Tokens_subscription.unsubscribe()
      // );
      this.state.Tokens_received_For_Tokens_subscription.unsubscribe(
        (err, success) => console.log({ err, success })
      );
    }
  }
  componentWillMount() {
    this.props.dispatch(set_campaign_view_data(this.props.campaign_view_data));

    console.log("MOUNTED");
    retry(
      "waiting for web3 to start event listener for campaign tokens purchase",
      2000,
      async () => {
        const campaign_address = this.props.campaign_view_data.deployed_address;
        const web3_props = this.props.web3;
        const { props } = this;
        if (!web3_props.web3) return false;
        console.log(
          this.state.Tokens_received_For_Tokens_subscription ? true : false
        );
        if (this.state.Tokens_received_For_Tokens_subscription) return true;
        let get_token_details = this.get_token_details;
        this.setState({
          Tokens_received_For_Tokens_subscription: await listen_for_campaign_tokens_purchased(
            { get_token_details, props, campaign_address }
          )
        });
        console.log(Tokens_received_For_Tokens);
        return true;
      }
    );
    /* TODO SET UP SOCKETS!! */
    // socket.on("token_purchase_confirm", updated_crowdsale_data => {
    //   console.log("");
    //   console.log(updated_crowdsale_data.stable_tokens_raised);
    //   console.log(this.props.campaign_view_data.stable_tokens_raised);
    //   this.props.campaign_view_data.stable_tokens_raised = updated_crowdsale_data.stable_tokens_raised;
    //   toast("A token was just purchased", "INFO");
    //   // for(k in updated_crowdsale_data){//WTF is this?  updated crowdsale has los of other keys dont need
    //   // 	if(this.crowdsale[k] == undefined) continue
    //   // 	 this.crowdsale[k] = updated_crowdsale_data[k]
    //   // }
    //   console.log(this.props.campaign_view_data.stable_tokens_raised);
    //   console.log(updated_crowdsale_data);
    //   this.get_token_details();
    //   get_eth_balance(web3.selected_account.address, eth_balance => {
    //     if (eth_balance.err) {
    //       this.balance = "Error gettign eth balance";
    //     } else {
    //       this.balance = eth_balance.resp.balance;
    //     }
    //     console.log(eth_balance);
    //   });
    // });
    this.props.campaign_view_data.events.forEach(event => {
      let parsed_event = {};
      let event_details = JSON.parse(event);
      parsed_event.event = event_details.event;
      parsed_event.time = event_details.event_time;
      parsed_event.blockNumber = event_details.blockNumber;
      parsed_event.blockHash = event_details.blockHash;
      parsed_event.transactionHash = event_details.transactionHash;
      for (let key in event_details.returnValues) {
        if (isNaN(key)) {
          parsed_event[key] = event_details.returnValues[key];
        }
      }
      this.state.campaign_events.push(parsed_event);
    });
  }

  componentDidMount() {
    /* Emsure this does run until mounted */
    $(".nav-tabs a").click(function(e) {
      // console.log(e.target.getAttribute('href'))
      e.preventDefault();
      // const tab_content = e.target.getAttribute('href')
      // $(`a[herf="#${tab_content}"]`).tab('show')
      $(this).tab("show");
    });
    const { selected_account } = this.props.web3;
    //init map is crowdsale has map info
    // if(this.props.campaign_view_data.formatted_address){
    console.log("has an address");
    var map_marker = {
      lat: this.props.campaign_view_data.lat,
      lng: this.props.campaign_view_data.lng
    };
    if (typeof google !== "undefined") {
      //make sure google is loaded

      var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: map_marker,
        disableDefaultUI: true
      });
      console.log(map);
      // var map_marker = {lat: 19.4590307, lng: -155.409995};
      // var map2 = new google.maps.Map(document.getElementById('map2'), {
      //   zoom: 7,
      //   center: map_marker,
      //   disableDefaultUI: true
      // });

      var iconBase = "https://maps.google.com/mapfiles/kml/pal3/";

      var map_marker = new google.maps.Marker({
        position: map_marker,
        map: map,
        icon: iconBase + "icon23.png"
      });
    }

    //check state of campaign, look for goal, finalized, time??

    //check time
    var close = new moment(this.props.campaign_view_data.closingTime * 1000);
    var now = new moment();
    if (close > now) {
      console.log("AASDASDDASDSAASDASDSADASDSADSADSDA");
      var data = moment.duration(close.diff(now));
      this.setState({
        days_left: data._data.days,
        hours_left: data._data.hours,
        minutes_left: data._data.minutes
      });
    } else {
      console.log("THIS IS OVER!!");
      if (!this.props.campaign_view_data.hasClosed) {
        this.props.campaign_view_data.hasClosed = true;
      }
    }

    if (this.props.campaign_view_data.is_deployed) {
      retry("get_token_details", 2000, () => {
        const { web3, selected_account } = this.props.web3;
        const user_address = selected_account.address;
        if (!web3 || !user_address) return false;
        this.get_token_details();
        return true;
      });
    }

    /* Listn for token purchase events on this campaign */
  }

  claim_refund() {
    const refund_btn = $("#refund_btn");

    disable_ui(refund_btn);
    const campaign_address = this.props.campaign_view_data.deployed_address;
    const { props } = this;
    get_refund({ campaign_address, props });

    // $.post(`/claim_refund/`, {
    //   two_factor_auth,
    //   crowdsale_address,
    //   _csrf
    // }).then(resp => {
    //   stop_spinner();
    //   enable_ui(refund_btn);
    //   console.log(resp);

    //   this.props.user.transaction_in_progress = false; //two factor auth
    //   this.verifying_wallet_password = false; //two factor auth
    //   // first check for errors
    //   if (resp.err) {
    //     this.props.user.transaction_in_progress = false;
    //     this.two_factor_auth.gas_estimate = 0;
    //     this.two_factor_auth.wallet_password = "";
    //     console.log("show it?"); //dont show two factor auth modal
    //     toast("Error trying to Claim Refund", "ERROR");
    //     // show_modal('two_factor_auth_modal')
    //     toast(resp.err, "ERROR");
    //   }
    //   //if no err, then look for posible responses
    //   if (!resp.err && resp.resp) {
    //     if (resp.resp.incorrect_wallet_password) {
    //       this.incorrect_wallet_password = true;
    //       show_two_factor_auth_modal();
    //       return toast("Incorrect Password", "ERROR");
    //     }
    //     if (resp.resp.two_factor_auth) {
    //       console.log("Got gas estimate");
    //       start_spinner("Getting gas estimate");
    //       this.two_factor_auth.gas_estimate =
    //         resp.resp.two_factor_auth.gas_estimate;
    //       this.two_factor_auth.to = resp.resp.two_factor_auth.to;
    //       this.two_factor_auth.from = resp.resp.two_factor_auth.from;
    //       this.two_factor_auth.value = resp.resp.two_factor_auth.value;
    //       // this.second_transaction_gas_estimate = 87343//to include the second transaction for selling tokens..

    //       this.two_factor_auth.fn_data = {
    //         fn: this.claim_refund,
    //         args: []
    //       };

    //       setTimeout(async () => {
    //         const { median_price, median_time } = await gas_station_data();
    //         this.two_factor_auth.gas_price = median_price;
    //         this.two_factor_auth.median_time = median_time;
    //         stop_spinner();
    //         show_modal("two_factor_auth_modal");
    //       }, 0);
    //     } else if (resp.resp.transaction_processing) {
    //       //Password was matched, and we will notify via sockets when done!
    //       this.props.user.transaction_in_progress = true;
    //       //reset two_factor_auth credentials
    //       this.two_factor_auth.gas_estimate = undefined;
    //       this.two_factor_auth.wallet_password = undefined;
    //       this.two_factor_auth.to = undefined;
    //       this.two_factor_auth.from = undefined;
    //       this.two_factor_auth.value = undefined;
    //       this.second_transaction_gas_estimate = 0; //specific to offer tokens for sale
    //       hide_modal("two_factor_auth_modal");

    //       dynamic_message("warning", "Transaction Processing......");
    //       return toast("Transaction processing.....", "INFO");
    //     }
    //   }
    // });
  }

  check_refund() {
    this.setState({
      token_details_fetching: true
    });
    console.log("depositsOf");
    const { props } = this;
    const campaign_address = this.props.campaign_view_data.deployed_address;
    check_depositsOf({ campaign_address, props });
    // $.get(`/check_refund_balance/${this.props.campaign_view_data.vault}`).then(
    //   balance => {
    //     this.token_details_fetching = false;
    //     console.log(balance);
    //     console.log(balance.resp);
    //     this.setState({
    //       refund_value: web3.utils.fromWei(balance.resp, "ether")
    //     });
    //   }
    // );
  }

  async sent_dst_to_campaign(r) {
    console.log(r);
  }

  async buy_tokens(e) {
    try {
      if (!this.state.number_tokens_to_purchase) {
        toastr.info("Please specify how many tokens you want to buy");
        return;
      }
      if (this.props.web3.transaction_sent) {
        toastr.warning("One transaction at a time");
        return;
      }
      if (
        parseInt(this.state.number_tokens_to_purchase) >
        parseInt(this.state.crowdsale_token_balance)
      )
        return toastr.error(
          `You can't buy ${
            this.state.number_tokens_to_purchase
          } tokens when tere are only ${
            this.state.crowdsale_token_balance
          } are remaining`
        );
      console.log(
        this.state.number_tokens_to_purchase,
        this.state.crowdsale_token_balance
      );
      console.log(
        parseInt(this.state.number_tokens_to_purchase) >
          parseInt(this.state.crowdsale_token_balance)
      );
      const btn = e.target;

      $(btn).prop("disabled", true);
      $("#number_tokens_to_purchase_input").prop("disabled", true);

      const token_amount = this.state.number_tokens_to_purchase;

      const { props } = this;
      let to = props.campaign_view_data.deployed_address;
      let amount = token_amount;
      let resp = await send_dst_tokens({
        props,
        amount,
        to,
        onReceipt: this.sent_dst_to_campaign
      });
      console.log({ resp });

      $(btn).prop("disabled", false);
      $("#number_tokens_to_purchase_input").prop("disabled", false);
      this.setState({
        number_tokens_to_purchase: 0
      });

      // let resp = await $.post(`/buy_token`, {
      //   _csrf: _csrf,
      //   crowdsale_address: this.props.campaign_view_data.deployed_address,
      //   token_amount: this.state.number_tokens_to_purchase,
      //   two_factor_auth
      //   // account_number:0 //user needs to choose which accoun they want to use
      // });

      // stop_spinner();
      // this.transaction_sent = false;
      // $(btn).prop("disabled", false);
      // $("#number_tokens_to_purchase_input").prop("disabled", false);
      // this.props.user.transaction_in_progress = false; //two factor auth
      // this.verifying_wallet_password = false; //two factor auth

      // this.get_token_details();
    } catch (err) {
      console.log("err");
      console.log(err);
    }

    // if (resp.err) {
    //   this.state.number_tokens_to_purchase = 0;
    //   this.props.user.transaction_in_progress = false;
    //   this.two_factor_auth.gas_estimate = 0;
    //   this.two_factor_auth.wallet_password = "";
    //   console.log("show it?");
    //   toast("Error trying to Buy tokens", "ERROR");
    //   // show_two_factor_auth_modal()
    //   toast(resp.err, "ERROR");
    // }

    // if (!resp.err && resp.resp) {
    //   if (resp.resp.incorrect_wallet_password) {
    //     this.incorrect_wallet_password = true;
    //     show_two_factor_auth_modal();
    //     return toast("Incorrect Password", "ERROR");
    //   }

    //   if (resp.resp.two_factor_auth) {
    //     start_spinner("Getting Gas Cost Average");
    //     console.log("Got gas estimate");
    //     this.two_factor_auth.gas_estimate =
    //       resp.resp.two_factor_auth.gas_estimate;
    //     this.two_factor_auth.to = resp.resp.two_factor_auth.to;
    //     this.two_factor_auth.from = resp.resp.two_factor_auth.from;
    //     this.two_factor_auth.value = resp.resp.two_factor_auth.value;
    //     this.two_factor_auth.fn_data = {
    //       fn: this.buy_tokens,
    //       args: [e]
    //     };

    //     setTimeout(async () => {
    //       const { median_price, median_time } = await gas_station_data();
    //       this.two_factor_auth.gas_price = median_price;
    //       this.two_factor_auth.median_time = median_time;
    //       stop_spinner();
    //       show_modal("two_factor_auth_modal");
    //     }, 0);
    //   } else if (resp.resp.transaction_processing) {
    //     this.state.number_tokens_to_purchase = 0;
    //     //Password was matched, and we will notify via sockets when done!
    //     this.props.user.transaction_in_progress = true;
    //     //reset two_factor_auth credentials
    //     this.two_factor_auth.gas_estimate = undefined;
    //     this.two_factor_auth.wallet_password = undefined;
    //     this.two_factor_auth.to = undefined;
    //     this.two_factor_auth.from = undefined;
    //     this.two_factor_auth.value = undefined;
    //     this.two_factor_auth.transaction_type = "";
    //     hide_modal("two_factor_auth_modal");

    //     dynamic_message("warning", "Transaction Processing......");
    //     return toast("Transaction processing.....", "INFO");
    //   }
    // }
  }

  focus_comment_textarea() {
    const comments_tab = $('[href="#comments"]');
    comments_tab.click();
    const textarea = $("#comment_textarea");
    textarea.focus();
  }

  async submit_comment() {
    if (this.state.new_comment.length < 2) return;
    let _csrf = this.props.csrf;
    let text = this.state.new_comment;
    let author_id = this.props.user._id;
    let user_img = this.props.user.main_profile_img;
    let author_name = `${this.props.user.firstname} ${
      this.props.user.lastname
    }`;
    let crowdsale_id = this.props.campaign_view_data._id;
    let resp = await $.post("/crowdsale/create_comment", {
      _csrf,
      text,
      author_id,
      crowdsale_id
    });

    try {
      console.log(resp);
      this.props.campaign_view_data.comments.push({
        text,
        date: new Date(),
        author_id: {
          main_profile_img: this.props.user.main_profile_img,
          firstname: this.props.user.firstname,
          lastname: this.props.user.lastname
        }
      });
      this.setState({ new_comment: "" });
      toastr.info("Comment Submited!");
    } catch (err) {
      logger.log("err".bgRed);
      logger.log(err);
      toastr.error("An error occured....");
    }
  }

  async get_token_details() {
    // console.log(this.props.campaign_view_data);
    const { token_address, deployed_address } = this.props.campaign_view_data;
    const campaign_address = deployed_address;
    const { web3, selected_account } = this.props.web3;
    // console.log(typeof web3);
    // console.log(web3);
    const user_address = selected_account.address;
    this.setState({
      token_details_fetching: true
    });
    console.log({ web3, token_address, campaign_address, user_address });
    console.log(this.props);

    let token_details = await get_token_details_data({
      web3,
      token_address,
      campaign_address,
      user_address
    });
    if (!token_details) return toastr.error("Error getting token delatils");
    console.log(token_details);

    this.setState({
      token_details_fetching: false
    });
    console.log(token_details);
    if (token_details) {
      // var data = JSON.parse(token_details.body)
      var data = token_details;
      this.setState({
        total_token_supply: data.total_supply,
        crowdsale_token_balance: web3.utils.fromWei(
          data.crowdsale_balance.toString(),
          "ether"
        )
      });

      if (data.user_balance || data.user_balance == "0") {
        this.setState({
          number_tokens_user_has: data.user_balance
        });
      }
    }
  }

  stable_tokens_raised() {
    return this.props.campaign_view_data.stable_tokens_raised;
  }
  calculated_dollar_raised() {
    return this.stable_tokens_raised();
  }

  calculated_amount_tokens() {
    return Math.ceil(
      this.props.campaign_view_data.dollar_goal /
        this.props.locals.DOLLARS_PER_TOKEN
    );
  }
  calculated_eth_per_token() {
    return (
      Math.round(
        (this.props.locals.DOLLARS_PER_TOKEN /
          this.props.web3.eth_price_data.eth_price) *
          1000
      ) / 1000
    );
  }
  calculated_total_eth() {
    return (
      Math.round(
        this.calculated_amount_tokens() * this.calculated_eth_per_token() * 1000
      ) / 1000
    );
  }
  calculated_percent_funded() {
    // const { web3 } = this.state;
    if (this.props.campaign_view_data.is_deployed) {
      // return "TODO";
      return (
        web3.utils
          .toBN(this.props.campaign_view_data.stable_tokens_raised)
          .div(web3.utils.toBN(this.props.campaign_view_data.goal)) * 100
      ).toFixed(2);
    } else {
      return (
        (this.props.campaign_view_data.downpayment /
          this.props.campaign_view_data.dollar_goal) *
        100
      ).toFixed(2);
    }
  }
  calculated_end_of_crowdsale_total_raised_enough() {
    console.log(
      this.calculated_total_eth() * this.props.web3.eth_price_data.eth_price
    );
    console.log(
      this.calculated_total_eth() * this.props.web3.eth_price_data.eth_price >=
        this.props.campaign_view_data.dollar_goal
    );
    return (
      this.calculated_total_eth() * this.props.web3.eth_price_data.eth_price >=
      this.props.campaign_view_data.dollar_goal
    );
  }

  handle_state_input(key, value) {
    this.setState({ [key]: value });
  }

  render() {
    const { web3 } = this.props.web3;

    const { campaign_view_data } = this.props;

    return (
      <Main_Layout>
        {/* <!-- SHARE THIS --> */}
        {/* <script type='text/javascript' src='//platform-api.sharethis.com/js/sharethis.js#property=5bab45436b67f20011e39aec&product=inline-share-buttons' async='async'></script> */}
        <script
          type="text/javascript"
          src="//platform-api.sharethis.com/js/sharethis.js#property=5bab3a4e6b67f20011e39ae5&product=inline-share-buttons"
          async="async"
        />

        <div className="container inner">
          <div className="row">
            <div className="col-sm-7">
              <div className="row">
                <div className="col-sm-12">
                  <div className="row">
                    {/* <!-- <div className="col-sm-2">
							<div className="avatar-me-wrapper"><span className="avatar-me">A</span></div>
						</div> --> */}

                    <div className="col-sm-10">
                      <br />
                      <br />
                      {!this.props.campaign_view_data.parsed_youtube_link && (
                        <img
                          src="/static/img/youtube_pic.png"
                          className="img-fluid"
                        />
                      )}
                      {this.props.campaign_view_data.parsed_youtube_link && (
                        <iframe
                          width="100%"
                          height="250"
                          allowFullScreen
                          src={
                            this.props.campaign_view_data.parsed_youtube_link
                          }
                          frameborder="0"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        />
                      )}

                      <h3>{this.props.campaign_view_data.formatted_address}</h3>
                      <br />
                      <p className="mb-1">
                        <To_Number
                          num={
                            (this.props.crowdsales.campaign_view_data
                              .stable_tokens_raised /
                              this.props.crowdsales.campaign_view_data.goal) *
                            100
                          }
                        />
                        %{" "}
                        {this.props.campaign_view_data.is_deployed
                          ? "Raised"
                          : "funded"}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${(this.props.crowdsales.campaign_view_data
                              .stable_tokens_raised /
                              this.props.crowdsales.campaign_view_data.goal) *
                              100}%`
                          }}
                          aria-valuenow={`${this.calculated_percent_funded()}`}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        />
                      </div>

                      <div className="row">
                        {this.props.campaign_view_data.is_deployed && (
                          <div className="col-sm-6">
                            <p className="mb-1 text-muted">Amount Raised</p>
                            <h3>
                              $
                              <To_Number
                                num={
                                  this.props.crowdsales.campaign_view_data
                                    .stable_tokens_raised
                                }
                              />
                            </h3>
                          </div>
                        )}

                        {!this.props.campaign_view_data.is_deployed && (
                          <div className="col-sm-6">
                            <p className="mb-1 text-muted">Downpayment</p>
                            <h3>
                              <To_Number
                                num={this.props.campaign_view_data.downpayment}
                              />
                            </h3>
                          </div>
                        )}
                        <div className="col-sm-6 text-right">
                          <p className="mb-1">Goal</p>
                          <h3>
                            $
                            <To_Number
                              num={this.props.campaign_view_data.dollar_goal}
                            />
                          </h3>
                        </div>

                        <div className="row justify-content-center">
                          <div className="col-sm-12">
                            <Like_Btn
                              campaign_id={this.props.campaign_view_data._id}
                            />
                            <span className="mb-1 ml-2">
                              liked by{" "}
                              {this.props.campaign_view_data.user_likes.length}{" "}
                              people
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <br />
                  <br />
                  <div className="row">
                    <div className="col-md-12">
                      <h3>Property Information</h3>
                      <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item">
                          <a
                            className="nav-link active"
                            href="#property_photos"
                          >
                            Photos
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="#property_details">
                            Details
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="#property_map">
                            Location
                          </a>
                        </li>

                        <li className="nav-item" style={{ width: "100%" }} />
                      </ul>
                    </div>
                  </div>
                  <br />
                  <br />
                  {/* <!-- Property info Tab panes --> */}

                  <div className="tab-content">
                    <div
                      className="tab-pane overflow-y md_fixed_height col-sm-12 active"
                      id="property_photos"
                      role="tabpanel"
                    >
                      <div className="row ">
                        {this.props.campaign_view_data.photos.length > 0 && (
                          <div className="wrap flex">
                            {this.props.campaign_view_data.photos.map(
                              (photo, key) => (
                                <img
                                  key={key}
                                  className="gallery_img"
                                  src={`/static/crowdsale_photos/${photo}`}
                                  height="277px"
                                />
                              )
                            )}
                          </div>
                        )}
                        {this.props.campaign_view_data.photos.length == 0 && (
                          <div>
                            <img
                              src={`/static/img/house-placeholder.jpg`}
                              className="img-fluid"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      className="tab-pane col-sm-12 md_fixed_height overflow-y"
                      id="property_details"
                      role="tabpanel"
                    >
                      <div v-if="this.props.campaign_view_data.zillow_data">
                        <div className="row">
                          <div className="col-sm-6 align_end">
                            <h2>
                              $
                              {
                                this.props.campaign_view_data.zillow_data
                                  .zestimate
                              }
                            </h2>
                          </div>
                          <div className="col-sm-6 align_start">
                            <small>Automated Valuation</small>
                          </div>
                        </div>
                        <div className="row my-2">
                          <div className="col-sm-12">
                            <small>
                              {
                                this.props.campaign_view_data.zillow_data
                                  .home_style
                              }{" "}
                              |{" "}
                              {
                                this.props.campaign_view_data.zillow_data
                                  .bedrooms
                              }{" "}
                              bd |
                              {
                                this.props.campaign_view_data.zillow_data
                                  .bathrooms
                              }{" "}
                              bath |
                              {
                                this.props.campaign_view_data.zillow_data
                                  .finished_sqft
                              }{" "}
                              sqft | built{" "}
                              {
                                this.props.campaign_view_data.zillow_data
                                  .year_built
                              }{" "}
                              | lot
                              {
                                this.props.campaign_view_data.zillow_data
                                  .lot_size_sqft
                              }
                              sqft
                            </small>
                          </div>
                        </div>
                        <div className="row mt-4">
                          <div className="col-sm-6">
                            <p>
                              Valuatiion High $
                              {this.props.campaign_view_data.zillow_data
                                .valuation_range_high || "N/A"}
                            </p>
                            <p>
                              Valuatiion Low $
                              {this.props.campaign_view_data.zillow_data
                                .valuation_range_low || "N/A"}
                            </p>
                            <p>
                              Tax Assesment $
                              {this.props.campaign_view_data.zillow_data
                                .tax_assessment || "N/A"}{" "}
                              |
                              {this.props.campaign_view_data.zillow_data
                                .tax_assessment_year || "N/A"}
                            </p>
                            <p>
                              Last Sold $
                              {this.props.campaign_view_data.zillow_data
                                .last_sold_price || "N/A"}{" "}
                              |{" "}
                              {this.props.campaign_view_data.zillow_data
                                .last_sold_date || "N/A"}
                            </p>
                            <p>
                              30 Day Change $
                              {this.props.campaign_view_data.zillow_data
                                .monthly_value_change || "N/A"}
                            </p>
                          </div>
                          <div className="col-sm-6">chart</div>
                        </div>
                        <div className="absolute bottom right">
                          <small>
                            Last Updated{" "}
                            {
                              this.props.campaign_view_data.zillow_data
                                .last_updated
                            }
                          </small>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane col-sm-12 md_fixed_height overflow-y"
                      id="property_map"
                      role="tabpanel"
                    >
                      <p>Map of location</p>
                      <span>
                        {this.props.campaign_view_data.formatted_address}
                      </span>
                      <div id="map" className="campaign_map" />
                    </div>
                  </div>

                  <br />

                  <div className="row">
                    <div className="col-md-12">
                      <h3>Campaign Information</h3>
                      <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item">
                          <a
                            className="nav-link active"
                            data-toggle="tab"
                            href="#home"
                            role="tab"
                          >
                            STORY
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            data-toggle="tab"
                            href="#updates"
                            role="tab"
                          >
                            UPDATES{" "}
                            {this.props.campaign_view_data.updates.length}
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            data-toggle="tab"
                            href="#events"
                            role="tab"
                          >
                            EVENTS {this.props.campaign_view_data.events.length}
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            data-toggle="tab"
                            href="#comments"
                            role="tab"
                          >
                            COMMENTS{" "}
                            {this.props.campaign_view_data.comments.length}
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            data-toggle="tab"
                            href="#likes"
                            role="tab"
                          >
                            LIKES {this.props.campaign_view_data.likes}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <br />
                  <br />

                  {/* <!-- Campaign info Tab panes --> */}
                  <div className="tab-content row">
                    {/* <!-- Home --> */}
                    <div
                      className="md_fixed_height overflow-y tab-pane col-sm-12 active"
                      id="home"
                      role="tabpanel"
                    >
                      <h6>
                        Ethos: Let the crowd that you're a credible person
                      </h6>
                      <p>{this.props.campaign_view_data.written_story}</p>
                      <br />
                      <h6>
                        Pathos: Appeal to their emotions with logic and reason
                      </h6>
                      <p>{this.props.campaign_view_data.written_story}</p>
                      <br />
                    </div>
                    {/* <!-- end home --> */}

                    {/* <!-- Updates --> */}
                    <div
                      className="md_fixed_height overflow-y tab-pane col-sm-12"
                      id="updates"
                      role="tabpanel"
                    >
                      {/* <!-- v-for loop through updates --> */}
                      {this.props.campaign_view_data.updates.map(
                        (update, key) => (
                          <div className="card mb-4" key={key}>
                            <div className="card-block">
                              <h5 className="card-title">{update.title}</h5>
                              {/* <!-- <h6 className="card-subtitle mb-2 text-muted">{update.date.toLocaleString('en-US')}</h6> --> */}
                              <p className="card-text">
                                {update.text}
                                {/* <!-- <a href="#" className="card-link">Read more</a> --> */}
                                <small>
                                  {moment(update.date).format(
                                    "MMMM Do YYYY, h:mma"
                                  )}
                                </small>
                              </p>
                            </div>
                          </div>
                        )
                      )}
                      {/* <!-- end v-loop updates --> */}
                    </div>
                    {/* <!-- End updates --> */}
                    {/* <!-- Events --> */}
                    <div
                      className="md_fixed_height overflow-y tab-pane col-sm-12"
                      id="events"
                      role="tabpanel"
                    >
                      {/* <!-- v-for loop through events --> */}
                      {this.state.campaign_events.map(event => (
                        <div className="card mb-4">
                          <div className="card-block">
                            <h5 className="card-title">{event.event}</h5>
                            {/* <!-- <h6 className="card-subtitle mb-2 text-muted">{update.date.toLocaleString('en-US')}</h6> --> */}
                            <p className="card-text">
                              {event.amount && (
                                <p>
                                  <strong>Amount</strong> : {event.amount}
                                </p>
                              )}
                              {event.value && (
                                <p>
                                  <strong>Value</strong>:{" "}
                                  {web3.utils.fromWei(event.value, "ether")}
                                </p>
                              )}
                              {event.purchaser && (
                                <p>
                                  <strong>Purchaser</strong>:{" "}
                                  {short_address(event.purchaser)}
                                </p>
                              )}
                              {event.time && (
                                <p>
                                  <strong>Time</strong>:{" "}
                                  {event.time
                                    ? moment(event.time * 1000).format(
                                        "MM/DD/YY hh:mm:ss a"
                                      )
                                    : "NA"}
                                </p>
                              )}
                              {event.blockNumber && (
                                <p>
                                  <strong>Block Number</strong>:{" "}
                                  {event.blockNumber}
                                </p>
                              )}
                            </p>
                            <a
                              href={`https://rinkeby.etherscan.io/tx/${
                                event.transactionHash
                              }`}
                              className="card-link"
                            >
                              Read more
                            </a>
                          </div>
                        </div>
                      ))}
                      {/* <!-- end v-loop events --> */}
                    </div>
                    {/* // <!-- End events --> */}

                    {/* // <!-- Comments --> */}
                    <div
                      className="md_fixed_height overflow-y tab-pane col-sm-12"
                      id="comments"
                      role="tabpanel"
                    >
                      <div className="row">
                        <div className="col-sm-12">
                          <ul className="comment-section mt-0">
                            {/* <!-- check if comment author == this.props.campaign_view_data.user_id --> */}
                            {this.props.campaign_view_data.comments.map(
                              (comment, index) => (
                                <Campaign_Comment 
                                index={index}
                                key={index}
                                comment={comment}
                                campaign_owner_id_data={campaign_view_data.user_id}
                                />
                              )
                            )}
                            {/* <!-- end v-for comment loop --> */}

                            {/* <!-- add new comment --> */}
                            {this.props.user && (
                              <>
                                <a name="comment" />

                                <li className="write-new">
                                  <textarea
                                    id="comment_textarea"
                                    placeholder="Write your comment here"
                                    value={this.state.new_comment}
                                    onChange={event =>
                                      this.handle_state_input(
                                        "new_comment",
                                        event.target.value
                                      )
                                    }
                                  />

                                  <div>
                                    <Profile_Img
                                      width="35"
                                      user={this.props.user}
                                    />
                                    <button
                                      onClick={this.submit_comment}
                                      className="btn btn-primary"
                                    >
                                      Submit
                                    </button>
                                  </div>
                                </li>
                              </>
                            )}
                            {/* <!-- end new comment --> */}
                          </ul>
                        </div>
                      </div>
                    </div>
                    {/* <!-- end comments --> */}
                    {/* <!-- Likes --> */}
                    <div
                      className="md_fixed_height overflow-y tab-pane col-sm-12"
                      id="likes"
                      role="tabpanel"
                    >
                      <div>
                        <h2>People who liked this</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Right side  --> */}
            <div className="col-sm-5">
              <div className="row">
                <div className="col-sm-11 offset-sm-1">
                  <div className="card ">
                    <div className="card-block" className="pb-1">
                      <div className="row ">
                        <div className="col-sm-12 center-text">
                          <h4>Started by</h4>
                        </div>
                      </div>

                      <div className="row ">
                        <div className="col-sm-12 center-text">
                          {this.props.campaign_owner.main_profile_img && (
                            <div className="">
                              <img
                                src={`/static/user_profile_imgs/${
                                  this.props.campaign_owner.main_profile_img
                                }`}
                                style={{ maxHeight: "300px" }}
                                className="img-fluid rounded-circle"
                              />
                            </div>
                          )}

                          {!this.props.campaign_owner.main_profile_img && (
                            <div style={{ position: "relative" }} className="">
                              <img
                                src="/static/img/profile-placeholder.jpg"
                                className="img-fluid rounded-circle"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="row ">
                        <div className="col-sm-12 center-text">
                          {/* <!-- <div className="col-sm-6"> --> */}
                          <h4 className="mb-0">
                            <strong>
                              {this.props.campaign_owner.firstname}{" "}
                              {this.props.campaign_owner.lastname}
                            </strong>
                          </h4>

                          <br />
                          <br />
                        </div>
                      </div>
                      <div className="row ">
                        <div className="col-sm-12 center-text">
                          <a href="#">
                            <p className="">View Profile</p>
                          </a>
                        </div>
                      </div>

                      {!this.props.campaign_view_data.goalReached &&
                        this.props.user && this.props.campaign_view_data.is_deployed &&
                        !this.props.campaign_view_data.hasClosed && (
                          <div className="row ">
                            <div className="col-sm-12">
                              <p className="form-text text-muted">
                                Your Della Stable Token balance{" "}
                                <strong>
                                  <To_Eth
                                    web3={web3}
                                    wei={
                                      this.props.web3.selected_account
                                        .dst_balance
                                    }
                                  />
                                </strong>
                                .
                              </p>
                              <div className="form-group">
                                <p className="form-text text-muted alert-success">
                                  Each token costs:{" "}
                                  <strong>
                                    {this.props.campaign_view_data.TOTAL_RATE}
                                  </strong>{" "}
                                  Della Stable Tokens
                                </p>
                                <label
                                  className="alert alert-primary"
                                  htmlFor="number_tokens_to_purchase_input"
                                >
                                  <h4>
                                    Please enter the amount of tokens you's like
                                    to buy.
                                  </h4>
                                </label>{" "}
                                <input
                                  id="number_tokens_to_purchase_input"
                                  className="form-control"
                                  type="number"
                                  onChange={event =>
                                    this.handle_state_input(
                                      "number_tokens_to_purchase",
                                      event.target.value
                                    )
                                  }
                                  value={this.state.number_tokens_to_purchase}
                                  placeholder="# of tokens"
                                />
                                <p className="form-text text-muted">
                                  Total Della Stable Tokens{" "}
                                  <strong
                                    className={
                                      this.state.number_tokens_to_purchase <=
                                      parseInt(
                                        this.state.crowdsale_token_balance
                                      )
                                        ? "is_valid"
                                        : "is_invalid"
                                    }
                                  >
                                    <To_Number
                                      num={parseInt(
                                        this.state.number_tokens_to_purchase
                                      )}
                                    />
                                  </strong>{" "}
                                  X{" "}
                                  <strong>
                                    {this.props.campaign_view_data.TOTAL_RATE}
                                  </strong>{" "}
                                  ={" "}
                                  <strong
                                    className={
                                      web3.utils.fromWei(
                                        this.props.web3.selected_account
                                          .dst_balance
                                          ? this.props.web3.selected_account.dst_balance.toString()
                                          : "0",
                                        "ether"
                                      ) >
                                      this.props.campaign_view_data.TOTAL_RATE *
                                        this.state.number_tokens_to_purchase
                                        ? "is_valid"
                                        : "is_invalid"
                                    }
                                  >
                                    <To_Number
                                      num={
                                        this.props.campaign_view_data
                                          .TOTAL_RATE *
                                        this.state.number_tokens_to_purchase
                                      }
                                    />
                                  </strong>
                                </p>
                                {/* <p className="form-text text-muted">
                                    ETH/Token{" "}
                                    <To_Eth
                                     web3={web3}
                                      wei={this.props.campaign_view_data.rate}
                                    />
                                    .
                                  </p> */}
                              </div>
                              <div className="col-sm-12 center-text">
                                <button
                                  type="button"
                                  onClick={this.buy_tokens}
                                  className="btn btn-primary"
                                >
                                  Buy Tokens
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                      {this.props.campaign_view_data.is_deployed &&
                        !this.props.campaign_view_data.goalReached &&
                        this.props.campaign_view_data.hasClosed && (
                          <div className="row">
                            <div className="col-sm-12 center-text">
                              <div className="alert alert-warning" role="alert">
                                <strong>This Campaign is closed</strong>
                              </div>
                            </div>
                            {/* <transition name="fade"> */}
                            {this.state.token_details_fetching && (
                              <div
                                className="col-sm-12 center-text"
                                key="fetching"
                              >
                                <h1>Fetching Token Details</h1>
                                <div className="data_fetch_loader" />
                              </div>
                            )}
                            {!this.state.token_details_fetching && (
                              <div
                                key="not_fetching"
                                className="col-sm-12 center-text"
                              >
                                <strong>
                                  You have {this.state.number_tokens_user_has}{" "}
                                  tokens from this campaign
                                </strong>
                                {this.state.number_tokens_user_has > 0 && (
                                  <div
                                    className="alert alert-info"
                                    role="alert"
                                  >
                                    <p>
                                      Would you like to check your refund?
                                      <a onClick={this.check_refund} href="#">
                                        REFUND
                                      </a>
                                    </p>
                                    {this.state.refund_value && (
                                      <div className="col-sm-12">
                                        <h2>The refund vault has</h2>
                                        {this.state.refund_value > 0 && (
                                          <div>
                                            <p>
                                              <strong>
                                                {this.state.refund_value}
                                              </strong>{" "}
                                              eth of yours, click button to
                                              claim.
                                            </p>
                                            <button
                                              id="refund_btn"
                                              onClick={this.claim_refund}
                                              className="btn btn-primary"
                                            >
                                              CLAIM REFUND
                                            </button>
                                          </div>
                                        )}
                                        {this.state.refund_value < 0 && (
                                          <div>0 eth of yours</div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                            {/* </transition> */}
                          </div>
                        )}

                      {this.props.campaign_view_data.goalReached && (
                        <div className="row">
                          <div className="col-sm-12 center-text alert alert-della della-shadow">
                            <h5>
                              <strong>
                                This Campaign's goal has been reached!
                              </strong>
                            </h5>
                          </div>
                        </div>
                      )}

                      {!this.props.campaign_view_data.hasClosed && (
                        <div className="row ">
                          <div className="col-sm-12 center-text">
                            <strong>Time Remaining:</strong>
                          </div>
                          <div className="col-sm-4 center-text">
                            <div className="row">
                              <div className="col-sm-12">
                                <strong>Days</strong>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-12 center-text">
                                {this.state.days_left}
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-4 center-text">
                            <div className="row">
                              <div className="col-sm-12">
                                <strong>Hours</strong>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-12 center-text">
                                {this.state.hours_left}
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-4 center-text">
                            <div className="row">
                              <div className="col-sm-12">
                                <strong>Minutes</strong>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-12 center-text">
                                {this.state.minutes_left}
                              </div>
                            </div>
                          </div>
                          <hr />
                        </div>
                      )}

                      {this.props.campaign_view_data.is_deployed && (
                        <div className="container-fluid">
                          <div className="row">
                            <div className="col-sm-12 center-text">
                              <strong>Deployed address:</strong>
                            </div>
                          </div>
                          <div className="row">
                            {this.props.campaign_view_data.deployed_address}
                          </div>
                          <div className="row ">
                            <div className="col-sm-12 center-text">
                              <strong>Total Token Supply:</strong>{" "}
                              <To_Eth
                                web3={web3}
                                wei={this.state.total_token_supply}
                              />
                            </div>
                          </div>
                          <div className="row ">
                            <div className="col-sm-12 center-text">
                              <strong>Closing Time:</strong> <br />
                              <Formatted_Date_Time
                                date={
                                  this.props.campaign_view_data.closingTime *
                                  1000
                                }
                              />
                              <br />
                            </div>
                          </div>
                          <div className="row ">
                            <div className="col-sm-12 center-text">
                              <strong>Tokens Remaining:</strong>{" "}
                              {this.state.crowdsale_token_balance}
                            </div>
                          </div>
                          <div className="row ">
                            <div className="col-sm-12 center-text">
                              <strong>Tokens Sold:</strong>{" "}
                              {web3 /* May only be a dev bug, but this need to be defined before we can do any more */ && (
                                <To_Number
                                  num={
                                    web3.utils.fromWei(
                                      this.state.total_token_supply.toString(),
                                      "ether"
                                    ) - this.state.crowdsale_token_balance
                                  }
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {this.props.user && (
                        <div className="row mt-3">
                          <div className="col-sm-12 justify_center">
                            <button
                              type="button"
                              className="btn ml-2"
                              onClick={this.focus_comment_textarea}
                            >
                              Leave a Comment
                            </button>
                          </div>
                        </div>
                      )}

                      {!this.props.user && (
                        <div>
                          <a href="/login">Login</a> or{" "}
                          <a href="/signup">Signup</a> to participate
                        </div>
                      )}

                      {!this.props.campaign_view_data.is_deployed && (
                        <div className="row mt-3">
                          <div className="col-sm-12 justify_center">
                            <strong className="text-danger">
                              This campaign is still in the setup phase, and is
                              not yet deployed to the Ethereum Network
                            </strong>
                          </div>
                        </div>
                      )}

                      <div className="row mt-3">
                        <div className="col-sm-12 justify_center">
                          <span
                            style={{ zIndex: "1" }}
                            className="sharethis-inline-share-buttons"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <br />
              <br />
            </div>
          </div>
          {/* <Two_Factor_Auth /> */}
        </div>
      </Main_Layout>
    );
  }
}
function mapStateToProps(state) {
  const { user, csrf, locals, web3, crowdsales } = state;
  return { ...user, ...csrf, ...locals, web3, crowdsales };
}

export default connect(mapStateToProps)(Campaign);
