import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { withRouter } from "next/router";
import Link from "next/link";
import moment from "moment";
import $ from "jquery";

import Main_Layout from "../layouts/Main_Layout.js";
import Two_Factor_auth from "../components/modals/Two_Factor_auth.js";

import {
  Short_Address,
  Click_To_Copy,
  Formatted_Date_Time,
  To_Number
} from "../components/small_ui_items.js";

class Campaign_Manage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // crowdsale: crowdsale,
      // current_eth_price,
      // user: user,
      transaction_sent: false,
      new_update_text: "",
      new_update_title: "",
      update_title_active: false,
      update_text_active: false,
      parsed_updates: [],
      main_gallery_img: "",
      update_text_min_length: 50,
      update_title_min_length: 10,
      token_transfer_events: "",
      days_left: "",
      hours_left: "",
      minutes_left: "",
      crowdsale_has_ended: false
      //two_factor_auth
      // balance: 0,//if not already present....
      // transaction_processing: false,
      // verifying_wallet_password: false,
      // incorrect_wallet_password: false,
      // two_factor_auth: {
      //   second_transaction_gas_estimate: 0,
      //   user_id: '',
      //   gas_estimate: 21000,
      //   wallet_password: '',
      //   gas_price: 8,
      //   median_time: 30,
      //   transaction_type: '',
      //   to: '',
      //   from: '',
      //   value: 0,
      //   fn_data: {
      //     fn: '',
      //     args: []
      //   }
      // },
    };
    this.add_new_update = this.add_new_update.bind(this);
    this.delete_photo = this.delete_photo.bind(this);
    this.handle_img_upload = this.handle_img_upload.bind(this);
    this.activate_update_title = this.activate_update_title.bind(this);
    this.activate_update_text = this.activate_update_text.bind(this);
    this.update_title_long_enough = this.update_title_long_enough.bind(this);
    this.update_text_long_enough = this.update_text_long_enough.bind(this);
  }

  static async getInitialProps( ctx) {
    /* Spaghetti code to ensure we have the blockchain DATA */
    // if(ctx.req){
    //   logger.log(ctx.req.user?'got user':'NO USER??')
    // }
    // if(!ctx.req ){
    //   console.log(ctx.reduxStore.getState().user)
    // }
    // const API_SERVER = "http://localhost:3000";

    // log(`${API_SERVER}/crowdsale/get_campaign/${crowdsale_id}`)
    // let campaign = await fetch(`
    // ${API_SERVER}/crowdsale/get_campaign/${query.campaign_id}
    // `);
    // let campaign_view_data = await campaign.json();
    // const campaign_owner_data = await fetch(`
    // ${API_SERVER}/user/get_campaign_owner/${campaign_view_data.user_id}
    // `);
    // console.log("campaign_owner_data");
    // const campaign_owner = await campaign_owner_data.json();

    // console.log({ campaign_view_data, campaign_owner });

    return {  };
  }

  componentDidMount() {
    // setTimeout(()=>{
      // console.log(this.props)
      // const {web3} = this.props.web3
      // console.log(web3)
      // console.log(web3.utils.toBN(11111111111))
    // }, 3000)
    // socket.on('notification', (data) => {
    //   if (data.transaction_type == "Campaign Finalized") {
    //     this.props.user_crowdsale.isFinalized = true
    //     console.log('Campaign Finalized true')

    //   }
    // })

    /* Initialize the main gallery state */
    if (this.props.user_crowdsale.photos.length) {
      this.state.main_gallery_img = this.props.user_crowdsale.photos[0];
    }

    //check time

    var close = new moment(this.props.user_crowdsale.closingTime * 1000);
    var now = new moment();

    if (close > now) {
      var data = moment.duration(close.diff(now));
      this.setState({
        days_left: data._data.days,
        hours_left: data._data.hours,
        minutes_left: data._data.minutes
      });
    } else {
      this.setState({
        crowdsale_has_ended: true
      });
      console.log("THIS IS OVER!!");
    }

    //TODO this should be on the layout page??
    // get_eth_balance(this.props.user.wallet_addresses[0], (eth_balance) => {
    //   if (eth_balance.err) {
    //     this.balance = 'Error gettign eth balance'
    //   } else {
    //     this.balance = eth_balance.resp.balance
    //   }
    //   console.log(eth_balance)
    // })

    //Lets get the last few comments and display them
    // $.get(`/get_crowdsale_comments/${this.props.user.crowdsale_id}`, (resp)=>{
    //   if(!resp.err && resp.resp){
    //     console.log(resp)
    //     this.props.user_crowdsale.comments = resp.resp

    //   }
    // })

    //put the lst update in an array to be displayed via a loop....
    // ifstate.(this.parsed_updates.length){
    //  state. this.parsed_updates.push(JSON.parse(this.props.user_crowdsale.updates[this.props.user_crowdsale.updates.length - 1]))
    // }
  }

  // copy (el_id) {
  //   console.log(el_id)
  //   var el = document.querySelector(`#${el_id}`)
  //   var resp = selectElementContents(el)
  //   console.log(resp)
  // }

  has_closed(end) {
    if (!end) return false;
    return Date.now() > end ? true : false;
  }

  handle_img_upload(event) {
    //append the image immediatly
    // manage_vue.crowdsale.photos.push(1)
    // start_spinner(5, 'Image pre-processing')
    handle_img_upload(
      this.props.csrf,
      event.target,
      "/crowdsale/upload_crowdsale_photos",
      photos_array => {
        console.log(photos_array);
        if (photos_array.img_processing) {
          console.log(photos_array.img_processing);
          // update the Bootstrap progress bar with the new percentage
          $(".progress-bar").text(
            photos_array.img_processing + "% Pre-processing imgs"
          );
          $(".progress-bar").width(photos_array.img_processing + "%");

          // once the upload reaches 100%, set the progress bar text to done
          if (photos_array.img_processing > 99) {
            $(".progress-bar").html("Processing done, Begin uploading");
          }
        } else {
          console.log("phot array");
          this.props.dispatch({
            type: "UPDATE_CROWDSALE",
            key: "photos",
            value: photos_array
          });
          this.setState({
            photos_array: photos_array[photos_array.length - 1] //setting the last uplaoded image as main
          });

          // stop_spinner()
        }
      }
    );
  }

  delete_photo(photo, index) {
    console.log(photo);
    // $(`img[src="${photo}"]`)
    //   .parent()
    //   .addClass("img-remove-spinner-overlay");
    const ask = confirm("Are you sure you want to delete this photo");

    if (ask) {
      console.log("Delete " + photo);
      ajax_delete_photo(
        photo,
        this.props.csrf,
        "/crowdsale/delete_crowdsale_photo",
        returned_photo_array => {
          if (returned_photo_array.err) {
            console.log("error deleteing photo");
          } else {
            console.log(returned_photo_array);
            this.props.dispatch({
              type: "SET_CROWDSALE_PHOTOS",
              photos_array: [...returned_photo_array]
            });
            console.log(returned_photo_array);
            // manage_vue.crowdsale.photos.splice(index, 1)
            if (this.state.main_gallery_img == photo)
              this.setState({ main_gallery_img: null });
          }
        }
      );
    }
  }

  add_new_update() {
    // if(!verify_data())return
    if (this.state.new_update_text.length < this.state.update_text_min_length) {
      alert("The update TEXT needs more content");
      $("textarea").focus();
      return;
    }
    if (
      this.state.new_update_title.length < this.state.update_title_min_length
    ) {
      alert("The update TITLE needs more content");
      $("#update_title_input").focus();
      return;
    }
    var data = {
      text: this.state.new_update_text,
      title: this.state.new_update_title
      // date: new Date().getTime()
    };
    console.log(data);
    $.post(
      "/crowdsale/add_new_update",
      { data, _csrf: this.props.csrf },

      // author_id: this.this.props.user._id,
      // user_img: this.this.props.user.main_profile_img,
      // author_name: `${this.this.props.user.firstname} ${this.this.props.user.lastname}`,
      // crowdsale_id: this.props.user_crowdsale._id
      resp => {
        if (resp.err) {
          console.log(resp.err);
          toastr.error("An error occured....");
        } else {
          console.log(resp);
          this.state.parsed_updates[0] = data;
          toastr.success("Comment Submited!");
          this.setState({
            new_update_text: "",
            new_update_title: "",
            update_title_active: false,
            update_text_active: false
          });
        }
      }
    );
  }
  async get_token_transfer_events() {
    console.log("get token events");
    // Tree.init()
    const events = await $.get("/get_token_transfer_events");
    console.log(events);
  }

  set_main_gallery_img(img) {
    console.log(img);
    this.setState({ main_gallery_img: img });
  }

  cancel_campaign() {
    alert("Cancel crowdsale no yet implemented");
  }

  //TODO
  finalize_campaign(e) {
    disable_ui(e.target);
    console.log("Finalize it!");
    this.transaction_sent = true;
    //two factor auth modal
    var two_factor_auth = JSON.stringify(this.props.two_factor_auth);
    //after we have the info, the user needs to enter a password / verify authority
    if (this.props.two_factor_auth.wallet_password)
      this.verifying_wallet_password = true;
    this.props.web3.transaction_in_progress = true;
    if (this.props.two_factor_auth.wallet_password)
      start_spinner("Verifying password");
    else start_spinner();
    //two factor auth modal

    $.post(
      "/finalize_crowdsale",
      {
        _csrf: this.props.csrf,
        two_factor_auth
      },
      resp => {
        stop_spinner();
        enable_ui(e.target);
        this.transaction_sent = false;
        console.log(resp);

        this.props.web3.transaction_in_progress = false; //two factor auth
        this.verifying_wallet_password = false; //two factor auth

        if (!resp.err && resp.resp) {
          if (resp.resp.incorrect_wallet_password) {
            this.incorrect_wallet_password = true;
            show_two_factor_auth_modal();
            return toast("Incorrect Password", "ERROR");
          }

          if (resp.resp.two_factor_auth) {
            console.log("Got gas estimate");
            start_spinner("Getting gas estimate");
            this.props.two_factor_auth.gas_estimate =
              resp.resp.two_factor_auth.gas_estimate;
            this.props.two_factor_auth.to = resp.resp.two_factor_auth.to;
            this.props.two_factor_auth.from = resp.resp.two_factor_auth.from;
            this.props.two_factor_auth.value = resp.resp.two_factor_auth.value;
            this.props.two_factor_auth.fn_data = {
              fn: this.finalize_campaign,
              args: [e]
            };

            setTimeout(async () => {
              const { median_price, median_time } = await gas_station_data();
              this.props.two_factor_auth.gas_price = median_price;
              this.props.two_factor_auth.median_time = median_time;
              stop_spinner();
              show_modal("two_factor_auth_modal");
            }, 0);
          } else if (resp.resp.transaction_processing) {
            //Password was matched, and we will notify via sockets when done!
            this.props.web3.transaction_in_progress = true;
            //reset two_factor_auth credentials
            this.props.two_factor_auth.gas_estimate = undefined;
            this.props.two_factor_auth.wallet_password = undefined;
            this.props.two_factor_auth.to = undefined;
            this.props.two_factor_auth.from = undefined;
            this.props.two_factor_auth.value = undefined;
            hide_modal("two_factor_auth_modal");

            dynamic_message("warning", "Transaction Processing......");
            return toast("Transaction processing.....", "INFO");
          }
        }
      }
    );
  }

  activate_update_title() {
    console.log("active title");
    this.setState({ update_title_active: true });
  }

  activate_update_text() {
    console.log("active text");
    this.setState({ update_text_active: true });
  }

  update_title_long_enough() {
    return (
      this.state.update_title_min_length - this.state.new_update_title <= 0
    );
  }

  update_text_long_enough() {
    return this.state.update_text_min_length - this.state.new_update_text <= 0;
  }

  render() {
    return (
      <Main_Layout>
        {/* <link rel="stylesheet" href="/vendor/treant-js-master/Treant.css"> */}
        <div className="container-fluid">
          <br />
          <br />
          <div className="row">
            <div className="col-sm-12 center-text">
              <h1>Manage Camapaign</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 card">
              <div className="row">
                <div className="col-sm-6">
                  <h4>Campaign Address</h4>
                  <Link
                    href={`
                  /campaign-view?campaign_id=${this.props.user_crowdsale._id}`}
                  >
                    <a>
                      <p className="hidden-off-screen" id="crowdsale_address">
                        {this.props.user_crowdsale.deployed_address}
                      </p>
                      <h6
                        title={this.props.user_crowdsale.deployed_address}
                        className="mt-2 ml-2"
                      >
                        <Short_Address
                          address={this.props.user_crowdsale.deployed_address}
                        />
                      </h6>
                    </a>
                  </Link>
                  <span>
                    <Click_To_Copy el_id={"crowdsale_address"} />

                    {/* <button
                      onClick={()=>this.copy('crowdsale_address')}
                      className="btn btn-sm copy-address-btn"
                    >
                      COPY
                    </button> */}
                  </span>
                </div>
                <div className="col-sm-6">
                  <h4>Token Address</h4>
                  <Link prefetch href={`
                  /campaign-view?campaign_id=${this.props.user_crowdsale._id}`}>
                  <a >
                    <p className="hidden-off-screen" id="token_address">
                      {this.props.user_crowdsale.token_address}
                    </p>
                    <h6
                      title={this.props.user_crowdsale.token_address}
                      className="mt-2 ml-2"
                    >
                      <Short_Address
                        address={this.props.user_crowdsale.token_address}
                      />
                    </h6>
                  </a>
                  </Link>
                  <span>
                    <Click_To_Copy el_id={"token_address"} />
                    {/* <button
                      onClick={()=>this.copy('token_address')}
                      className="btn btn-sm copy-address-btn"
                    >
                      COPY
                    </button> */}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-sm-6 card">
              <h5 className="center-text">Campaign status</h5>
              {this.props.user_crowdsale.hasClosed &&
                !(this.props.user_crowdsale.goal == this.props.user_crowdsale.stable_tokens_raised) && (
                  <div>
                    <strong>
                      Your campaign has{" "}
                      <span className="text-danger">closed</span>, and the
                      goal was{" "}
                      <span className="text-danger">not reached</span>
                    </strong>
                    <p>Please try again soon</p>
                    <p>
                      Refunds are available
                      <a href={`/campaign/${this.props.user_crowdsale._id}`}>
                        HERE
                      </a>
                    </p>
                  </div>
                )}
              {!this.props.user_crowdsale.goal_reached &&
                !this.props.user_crowdsale.hasClosed && (
                  <div>
                    <h3>The campaign is live and active.</h3>
                    <p>
                      View{" "}
                      <Link
                    href={`
                  /campaign-view?campaign_id=${this.props.user_crowdsale._id}`}
                  >
                    <a>
                      HERE
                    </a>
                  </Link>
                    </p>
                    Percent to goal: %
                    <To_Number num={(this.props.user_crowdsale.stable_tokens_raised /
                      this.props.user_crowdsale.goal) *
                      100}/>
                    {!this.props.user_crowdsale.hasClosed && (
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
                  </div>
                )}

              {(this.props.user_crowdsale.goal == this.props.user_crowdsale.stable_tokens_raised) &&
                this.props.user_crowdsale.finalized == true &&
                this.props.user_crowdsale.hasClosed == true && (
                  <div className="col-sm-12 center-text">
                    <h3>The goal has been reached!</h3>
                    <p>
                      Click the button to finalize this campaign, and recieve
                      the funds
                    </p>
                    <p>
                      This will also enable the tokens to be tradeable on the
                      <a href="/marketplace">Market Place</a>
                    </p>
                    {/* <button
                      onClick={this.finalize_campaign}
                      type="button"
                      disabled={this.transaction_in_progress}
                      className="btn btn-success btn-lg"
                    >
                      Finalize Campaign
                    </button> */}
                  </div>
                )}

              {this.props.user_crowdsale.goal_reached &&
                this.props.user_crowdsale.isFinalized == true && (
                  <div className="col-sm-12 center-text">
                    <h3>
                      Crowdsale is
                      <span className="text-success">complete</span>, and
                      <span className="text-success">finalized</span>. Tokens
                      can now be traded
                    </h3>
                    <span>View </span>
                    <Link prefetch href="/account-balances">
                      <a>Your Tokens</a>
                    </Link>
                    <br />
                    <span>Sell/Buy/Trade Tokens At The </span>
                    <Link prefetch href="/marketplace">
                      <a>Market Place</a>
                    </Link>
                  </div>
                )}
            </div>
          </div>
          <div className="row">
            <div className="card col-sm-6">
              <div className="">
                <h5>
                  Add updates to keep the crowd up to date on your campaign
                </h5>
                <div className="write-new write-new-update">
                  <div className="form-group">
                    <label htmlFor="title">Update Title</label>
                    <br />
                    {this.state.update_title_min_length -
                      this.state.new_update_title.length >
                      0 &&
                      this.state.update_title_active && (
                        <small
                          className={`${
                            !this.update_title_long_enough()
                              ? " green_glow "
                              : " red_glow "
                          } 
              ${this.state.update_text_active ? " active_update " : " "}`}
                        >
                          ...min length{" "}
                          {this.state.update_title_min_length -
                            this.state.new_update_title.length}
                        </small>
                      )}

                    <div className="controls">
                      <input
                        id="update_title_input"
                        placeholder="Update Title"
                        type="text"
                        onFocus={this.activate_update_title}
                        value={this.state.new_update_title}
                        onChange={(event) =>
                          this.setState({
                            new_update_title: event.target.value
                          })
                        }
                      />
                      <small className="form-text text-muted">
                        Title of your update message to the crowd
                      </small>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="update">Update Message</label>
                    <br />
                    {this.state.update_text_min_length -
                      this.state.new_update_text.length >
                      0 &&
                      this.state.update_text_active && (
                        <small
                          className={`${
                            !this.update_text_long_enough()
                              ? " green_glow "
                              : " red_glow "
                          }
                ${this.state.update_text_active ? " active_update " : " "}`}
                        >
                          ...min length{" "}
                          {this.state.update_text_min_length -
                            this.state.new_update_text.length}
                        </small>
                      )}

                    <textarea
                      placeholder="Write your update here"
                      onFocus={this.activate_update_text}
                      value={this.state.new_update_text}
                      onChange={(event) =>
                        this.setState({ new_update_text: event.target.value })
                      }
                    />
                    <small className="form-text text-muted">
                      Full blown text editor comming soon....
                    </small>
                  </div>

                  <div>
                    {this.props.user.main_profile_img && (
                      <img
                        src={`/static/user_profile_imgs/${
                          this.props.user.main_profile_img
                        }`}
                        width="35"
                        alt={
                          this.props.user.firstname +
                          " " +
                          this.props.user.lastname
                        }
                        title={
                          this.props.user.firstname +
                          " " +
                          this.props.user.lastname
                        }
                      />
                    )}
                    {!this.props.user.main_profile_img && (
                      <img
                        src="/static/img/profile-placeholder.jpg"
                        width="35"
                        alt="new user"
                        title="new user"
                      />
                    )}
                    <button
                      onClick={this.add_new_update}
                      className="btn btn-primary"
                    >
                      Add New Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card col-sm-6">
              <div className="row">
                <div className="col-12">
                  <h2>Your last update</h2>
                </div>
                <div className="col-12">
                  {this.state.parsed_updates.map((update, key) => (
                    <div key={key} className="card mb-4">
                      <div className="card-block">
                        <h5 className="card-title">{update.title}</h5>
                        <p className="card-text">{update.text}</p>

                        <a href="#" className="card-link">
                          Read more
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-12">
                  <h3>recent comments</h3>
                </div>
                <div className="col-12">
                  <ul className="list-group">
                    {this.props.user_crowdsale.comments.map((comment, key) => (
                      <li
                        key={key}
                        className="comment row"
                        className={
                          comment.author_id == this.props.user_crowdsale.user_id
                            ? "author-comment"
                            : "user-comment"
                        }
                      >
                        <div className="col-sm-7">
                          <p>{comment.text}</p>
                        </div>

                        <div className="col-sm-5">
                          <div className="row">
                            <div className="col-sm-5">
                              <a className="avatar" href="#">
                                {comment.author_id.main_profile_img != "" && (
                                  <img
                                    src={`/static/user_profile_imgs/${
                                      comment.user_img
                                    }`}
                                    width="35"
                                    alt="Profile Avatar"
                                    title={comment.author_name}
                                  />
                                )}

                                {comment.author_id.main_profile_img == "" && (
                                  <img
                                    src="/static/img/profile-placeholder.jpg"
                                    width="55"
                                    alt="profile-placeholder"
                                    title="profile-placeholder"
                                  />
                                )}
                              </a>
                            </div>
                            <div className="col-sm-7">
                              <div className="info">
                                <a href="#">
                                  {comment.author_id.firstname +
                                    " " +
                                    comment.author_id.lastname}
                                </a>
                                <span>
                                  {get_time_since(
                                    new Date(comment.date).getTime()
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 center-text">
              <h3>Edit campaign photos</h3>
            </div>
            <div className="col-sm-6 center-text">
              <div className="form-group">
                <label htmlFor="Upload photos">Upload photo</label>
                <input
                  type="file"
                  onChange={this.handle_img_upload}
                  name="files[]"
                  multiple
                />
              </div>
              <div className="progress">
                <div className="progress-bar" role="progressbar" />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12 center-text">
              <h3>Photo gallery</h3>
            </div>
          </div>
          {this.props.user_crowdsale.photos.length && (
            <div className="row lg_fixed_height">
              <div className="col-sm-8 card main-gallery-container">
                {this.state.main_gallery_img && (
                  <img
                    className=" main-gallery-item"
                    src={`/static/crowdsale_photos/${
                      this.state.main_gallery_img
                    }`}
                    alt=""
                  />
                )}
              </div>
              <div className="col-sm-4 overflow-y gallery inner-shadow">
                {this.props.user_crowdsale.photos.length > 0 && (
                  <>
                    {this.props.user_crowdsale.photos.map((photo, key) => (
                      <div className="card relative gallery_img" key={key}>
                        <div className="edit-box">
                          <button
                            onClick={() => this.delete_photo(photo, key)}
                            className="btn btn-sm btn-danger"
                          >
                            X
                          </button>
                        </div>
                        {/* {!isNaN(photo) && (
                      <img
                        className="img-fluid"
                        src="/static/img/load-spinner.webp"
                        alt=""
                      />
                    )} */}

                        {
                          <img
                            onClick={() => this.set_main_gallery_img(photo)}
                            src={`/static/crowdsale_photos/${photo}`}
                            className="img-fluid"
                            alt=""
                          />
                        }
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          {/* <div className='row'>
    tracing the tokens
    <button @click="get_token_transfer_events" className="btn btn-sm btn-info">Find Tokens</button>
    <div id="tree-simple" style="width:335px; height: 160px"> </div>

    
    {token_transfer_events}
    
  </div> */}
          <Two_Factor_auth />
        </div>
        {/* <!-- Container --> */}

        {/* <script src="/vendor/treant-js-master/vendor/raphael.js"></script> */}
        {/* <script src="/vendor/treant-js-master/Treant.js"></script> */}
        {/* <script src="/js/tree.js"></script> */}
      </Main_Layout>
    );
  }
}

function mapStateToProps(state) {
  const { user, csrf, locals, crowdsales, web3 } = state;
  return { ...user, ...csrf, ...locals, ...crowdsales, web3 };
}

export default connect(mapStateToProps)(withRouter(Campaign_Manage));
