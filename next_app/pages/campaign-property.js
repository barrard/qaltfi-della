import React from "react";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import {
  Campaign_Builder_Breadcrumbs,
  To_Number
} from "../components/small_ui_items.js";
import { Property_Edit_Box } from "../components/campaign_property_components/Property_Edit_Box.js";
import { toastr } from "react-redux-toastr";
import $ from "jquery";

import {
  SET_USER_CROWDSALE,
  SET_MAIN_USER_CROWDSALE_IMGS
} from "../redux/store.js";
import Main_Layout from "../layouts/Main_Layout.js";
class Edit_Property extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // user: user,
      // crowdsale:crowdsale,

      save_state: true,
      window_width: "",
      // current_eth_price: current_eth_price,
      gps_message: "",
      map_marker: null
    };
    this.auto_save = this.auto_save.bind(this);
    this.toggle_save_state = this.toggle_save_state.bind(this);
    this.handle_input = this.handle_input.bind(this);
    this.handle_auto_save = this.handle_auto_save.bind(this);
    this.handle_img_upload = this.handle_img_upload.bind(this);
  }

  static async getInitialProps(app) {
    let { reduxStore } = app;
    let state = reduxStore.getState();
    // console.log(state);

    var { user } = state;
    var { user } = user;
    let { crowdsale_id } = user;
    console.log(crowdsale_id);
    /* If we have an ID, we beter have the object in store? */
    if (crowdsale_id) {
      let { crowdsales } = state;
      // console.log(crowdsales);
      let { user_crowdsale } = crowdsales;
      // console.log(user_crowdsale);
      // console.log(user_crowdsale);
      // if(!Object.keys(user_crowdsale).length){
      //   console.log('Better go get it')
      // }
    }

    return {};
  }

  componentDidMount() {
    this.setState({ window_width: window.innerWidth });
    //AUTO_SAVE
    var all_inputs = $("input");
    all_inputs = [...all_inputs, $("textarea")];
    all_inputs = [...all_inputs, $("select")];
    $.each(all_inputs, (index, input) => {
      //remove this from the gooogle input box
      if (input.id != "address_search" && input.type !== "file")
        this.add_auto_save(index, input);
    });
    // $.each(all_selects, (index, input)=>{
    //   this.add_auto_save(index, input)
    // })

    var map_marker = {};
    if (this.props.user_crowdsale.lat && this.props.user_crowdsale.lng) {
      map_marker = {
        lat: this.props.user_crowdsale.lat,
        lng: this.props.user_crowdsale.lng
      };
    } else {
      map_marker = {
        lat: 37.7875445,
        lng: -116.44492709999997
      };
    }
    if (typeof google !== "undefined") {
      var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: map_marker,
        disableDefaultUI: true
      });
      this.map_marker = new google.maps.Marker({
        position: map_marker,
        map: map
        // icon: place.icon
        // icon: iconBase + 'icon23.png'
      });
      const input = document.getElementById("address_search");

      const autocomplete_options = {
        types: ["address"]
      };
      var autocomplete = new google.maps.places.Autocomplete(
        input,
        autocomplete_options
      );
      autocomplete.addListener("place_changed", () => {
        // console.log('account_profile_map')
        var place = autocomplete.getPlace();
        console.log(place);
        this.get_place(place, map);
      });
    }
  }

  handle_input(value, type, key) {
    console.log({ value, type, key });
    this.props.dispatch({ type, value, key });
  }

  dollar_goal() {
    return parseInt(this.props.user_crowdsale.dollar_goal).toLocaleString(
      "en-US"
    );
  }
  parsed_eth_goal() {
    return parseInt(this.props.user_crowdsale.dollar_goal).toLocaleString(
      "en-US"
    );
  }
  downpayment() {
    return parseInt(this.props.user_crowdsale.downpayment).toLocaleString(
      "en-US"
    );
  }
  photo_count() {
    return this.props.user_crowdsale.photos.length;
  }
  // fixed:function(){
  //   return this.window_width > 580 ? 'fixed_card ' : ' no'
  // }
  calculated_amount_tokens() {
    return Math.ceil(
      this.props.user_crowdsale.dollar_goal /
        this.props.locals.DOLLARS_PER_TOKEN
    ); 
  }
  calculated_eth_per_token() {
    return (
      Math.round(
        (this.props.locals.DOLLARS_PER_TOKEN /
          this.props.locals.CURRENT_ETH_PRICE) *
          100000
      ) / 100000
    );
  }
  calculated_total_eth() {
    return (
      Math.round(
        this.calculated_amount_tokens() *
          this.calculated_eth_per_token() *
          100000
      ) / 100000
    );
  }
  calculated_percent_funded() {
    return (
      (this.props.user_crowdsale.downpayment /
        this.props.user_crowdsale.dollar_goal) *
      100
    ).toFixed(2);
  }
  calculated_end_of_crowdsale_total_raised_enough() {
    console.log(this.calculated_total_eth());
    console.log(
      this.calculated_total_eth() * this.props.locals.CURRENT_ETH_PRICE
    );
    console.log(
      this.calculated_total_eth() * this.props.locals.CURRENT_ETH_PRICE >=
        this.props.user_crowdsale.dollar_goal
    );
    return (
      this.calculated_total_eth() * this.props.locals.CURRENT_ETH_PRICE >=
      this.props.user_crowdsale.dollar_goal
    );
  }

  focus_address_search() {
    console.log("please focus");
    document.getElementById("address_search").focus();
  }
  handle_img_upload(event) {
    console.log("img upload being handled");
    //append the image immediatly
    // this.props.user_crowdsale.photos.push(1)
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
          let first_upladed_img = false;
          if (!this.props.user_crowdsale.photos.length)
            first_upladed_img = true;
          console.log("phot array");
          this.props.dispatch({
            type: "SET_CROWDSALE_PHOTOS",
            photos_array: photos_array
          });
          if (first_upladed_img)
            this.set_main_img(this.props.user_crowdsale.photos[0]);
        }
      }
    );
  }
  async set_main_img(img) {
    console.log("set main img ");
    console.log(img);
    await this.props.dispatch(SET_MAIN_USER_CROWDSALE_IMGS(img));
    this.save_state = false;
    console.log(this.props.user_crowdsale.main_crowdsale_img);

    this.auto_save();
  }
  auto_save() {
    console.log("RUN AUTO SAVE");
    this.save_crowdsale_update();
  }
  async save_crowdsale_update() {
    if (this.save_state) return;
    console.log("save_crowdsale_update");

    console.log(this.props.user_crowdsale.main_crowdsale_img);

    const {
      dollar_goal,
      downpayment,
      tax_id,
      description,
      main_crowdsale_img
    } = this.props.user_crowdsale;
    console.log({
      dollar_goal,
      downpayment,
      tax_id,
      description,
      main_crowdsale_img
    });
    console.log("user_crowdsale data");

    try {
      let updated_crowdsale = await $.post("/crowdsale/save_crowdsale_update", {
        dollar_goal,
        downpayment,
        tax_id,
        description,
        main_crowdsale_img,
        _csrf: this.props.csrf
      });

      console.log(updated_crowdsale);
      if (!updated_crowdsale) return toastr.error("Save failed");

      this.props.dispatch(SET_USER_CROWDSALE(updated_crowdsale.resp));

      toastr.success("Campaign saved!");
      this.state.save_state = true;
    } catch (err) {
      console.log("err");
      console.log(err);
    }
  }
  toggle_save_state() {
    // console.log("input");
    this.state.save_state = false;
    console.log(this.state.save_state);
  }
  handle_auto_save() {
    console.log("blur");
    if (!this.state.save_state) {
      console.log("SAVE ME");
      console.log(this.state.save_state);
      this.auto_save();
    }

    if (this.state.save_state) {
      console.log(this.state.save_state);
      console.log("DONT SAVE ME!!!");
    }
  }
  add_auto_save(index, input) {
    $(input).on("input", this.toggle_save_state);
    $(input).on("blur", this.handle_auto_save);
    $(input).on("focus", () => console.log(input));
  }

  async get_place(place, map) {
    //get lat lng
    let lng = place.geometry.location.lng();
    let lat = place.geometry.location.lat();
    // console.log({ lat, lng })
    let map_marker = {
      lat: lat,
      lng: lng
    };
    // console.log(map_marker)

    map.panTo(new google.maps.LatLng(lat, lng));
    map.setZoom(15);

    // var iconBase = 'https://maps.google.com/mapfiles/kml/pal3/';
    //clear previous marker if there is one
    if (this.map_marker) this.map_marker.setMap(null);
    //we only want one marker at a time
    this.map_marker = new google.maps.Marker({
      position: map_marker,
      map: map,
      icon: place.icon
      // icon: iconBase + 'icon23.png'
    });
    console.log(place);
    //get address from the data
    // this.parse_address(place);
    /* Send this to the server? */
    let resp = await $.post("/crowdsale/lookup_address", {
      place: JSON.stringify(place),
      _csrf: this.props.csrf
    });
    console.log(resp);
    if (resp.error) {
      toastr.error(resp.error);
      this.props.dispatch(SET_USER_CROWDSALE(resp.removed_zillow_data));
      return;
    }
    if (resp.updated_crowdsale) {
      toastr.success("Found Property Data");
      /* dispatch event */
      this.props.dispatch(SET_USER_CROWDSALE(resp.updated_crowdsale));
    }
  }

  render() {
    const { pathname } = this.props.router;

    return (
      <Main_Layout>
        <br />
        <br />
        <br />
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <Campaign_Builder_Breadcrumbs pathname={pathname} />
            </div>

            <div className="col-sm-8">
              <h1>Let’s get started.</h1>
              <p> Upload images, property description, and address.</p>

              {/* <!-- <form enctype="multipart/form-data" method="POST" action="/create_crowdsale"> --> */}
              <div className="form-group light-blue">
                <label htmlFor="Property Images">Property image</label>
                <p className="form-text text-muted">
                  Include photos on interior, exterior, and property
                </p>

                <div
                  style={{
                    border: "1px dashed #000",
                    background: "#fff",
                    width: "100%",
                    display: "block",
                    padding: "20px"
                  }}
                  className="text-center"
                >
                  <p className="form-control-static text-center">
                    <strong>Choose an image from your computer</strong>
                  </p>

                  <input
                    className="text-center"
                    onChange={this.handle_img_upload}
                    multiple
                    type="file"
                  />
                  <br />

                  <p>
                    At least
                    <strong>1024x576 pixels</strong>• 16:9 aspect ratio
                  </p>
                </div>
                <p className="form-text text-muted">
                  JPEG, PNG, GIF, or BMP • 50MB file limit
                </p>
                <div className="progress">
                  <div className="progress-bar" role="progressbar" />
                </div>
              </div>
              <div className="form-group light-blue">
                <label htmlFor="set main profile pic">Set main photo</label>

                {this.props.user_crowdsale.photos &&
                  this.props.user_crowdsale.photos.length > 0 && (
                    <div className=" overflow-x">
                      <div className="">
                        {this.props.user_crowdsale.photos.map((img, key) => (
                          <img
                            key={key}
                            className="thumbnail"
                            onClick={() => this.set_main_img(img)}
                            src={`/static/crowdsale_photos/${img}`}
                            alt="Crowdsale Photo"
                          />
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              <div className="form-group light-blue">
                <label htmlFor="gps_coords">Property location</label>
                <div className="input-group  input-group-lg">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">
                      <i
                        style={{ fontSize: "30px" }}
                        className="fa fa-search pr-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <input
                    key={"address_search"}
                    value={this.props.user_crowdsale.formatted_address}
                    id="address_search"
                    type="text"
                    className="form-control"
                    placeholder="Begin typing address"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    onChange={event =>
                      this.handle_input(
                        event.target.value,
                        "UPDATE_CROWDSALE",
                        "formatted_address"
                      )
                    }
                  />
                </div>
                <div className="light-blue">
                  <div className="campaign_map" id="map" />
                </div>
              </div>

              <div className="form-group light-blue">
                <div className="row">
                  <div className="col-sm-12">
                    {this.props.user_crowdsale.zillow_data && (
                      <div>
                        <div className="row">
                          <div className="col-sm-6 align_end">
                            <h2>
                              ${this.props.user_crowdsale.zillow_data.zestimate}
                            </h2>
                          </div>
                          <div className="col-sm-6 align_start">
                            <small>Automated Valuation</small>
                          </div>
                        </div>
                        <div className="row my-2">
                          <div className="col-sm-12">
                            <small>
                              {this.props.user_crowdsale.zillow_data.home_style}{" "}
                              | {this.props.user_crowdsale.zillow_data.bedrooms}{" "}
                              bd |{" "}
                              {this.props.user_crowdsale.zillow_data.bathrooms}{" "}
                              bath |
                              {
                                this.props.user_crowdsale.zillow_data
                                  .finished_sqft
                              }{" "}
                              sqft | built{" "}
                              {this.props.user_crowdsale.zillow_data.year_built}{" "}
                              | lot{" "}
                              {
                                this.props.user_crowdsale.zillow_data
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
                              {
                                this.props.user_crowdsale.zillow_data
                                  .valuation_range_high
                              }
                            </p>
                            <p>
                              Valuatiion Low $
                              {
                                this.props.user_crowdsale.zillow_data
                                  .valuation_range_low
                              }
                            </p>
                            <p>
                              Tax Assesment $
                              {
                                this.props.user_crowdsale.zillow_data
                                  .tax_assessment
                              }{" "}
                              |{" "}
                              {
                                this.props.user_crowdsale.zillow_data
                                  .tax_assessment_year
                              }
                            </p>
                            <p>
                              Last Sold $
                              {
                                this.props.user_crowdsale.zillow_data
                                  .last_sold_price
                              }{" "}
                              |{" "}
                              {
                                this.props.user_crowdsale.zillow_data
                                  .last_sold_date
                              }
                            </p>
                            {!this.props.user_crowdsale.zillow_data
                              .monthly_value_change && (
                              <p
                                onClick={this.focus_address_search}
                                className="clickable alert alert-info"
                              >
                                <strong>Please update the address</strong>
                              </p>
                            )}

                            {this.props.user_crowdsale.zillow_data
                              .monthly_value_change && (
                              <p
                                className={`
                      ${
                        parseInt(
                          this.props.user_crowdsale.zillow_data
                            .monthly_value_change
                        ) > 0
                          ? "alert-success"
                          : "alert-danger"
                      } 
                      alert`}
                              >
                                30 Day Change $
                                {
                                  this.props.user_crowdsale.zillow_data
                                    .monthly_value_change
                                }
                              </p>
                            )}
                          </div>
                          <div className="col-sm-6">chart</div>
                        </div>
                        <div className="absolute bottom right">
                          <small>
                            Last Updated{" "}
                            {this.props.user_crowdsale.zillow_data.last_updated}
                          </small>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* THIS NEED TO BE MADE A COMPONENT */}
              <div className="form-group light-blue">
                <label htmlFor="goal">
                  Funding goal $
                  <To_Number num={this.props.user_crowdsale.dollar_goal} />
                </label>
                <div className="input-group  col-10">
                  <div className="input-group-prepend">
                    <div className="input-group-text">$</div>
                  </div>

                  <input
                    key={"dollar_goal"}
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="The total price on the property"
                    value={this.props.user_crowdsale.dollar_goal}
                    onChange={event =>
                      this.handle_input(
                        event.target.value,
                        "UPDATE_CROWDSALE",
                        "dollar_goal"
                      )
                    }
                    aria-describedby="basic-addon2"
                  />
                </div>
                <p id="passwordHelpBlock" className="form-text text-muted">
                  If your campaign is successfully funded, the funds are
                  transfered to the Home Seller, and Title is owned by the
                  address of the token created when the Campaign is Deployed
                  Live to the <a href="https://www.ethereum.org/">Ethereum</a>{" "}
                  Network
                </p>
                <hr />
                <div className="row sm-center justify-content-center align-items-center">
                  <div className="col-sm-6 ">
                    <div className="row sm-center justify-content-end align-items-center">
                      <h2 className="">
                        <span className="float-right badge badge-secondary ">
                          Token Rate:
                        </span>
                      </h2>
                    </div>
                  </div>
                  <div className="col-sm-6 ">
                    <div className="row justify-content-start align-items-center sm-center">
                      <h3 className='ml-2 '>
                        <span className="float-left badge badge-info ">
                          $
                          <To_Number
                            num={this.props.locals.DOLLARS_PER_TOKEN}
                          />
                        </span>
                        {/* <span className="float-left badge badge-success ">
                        Per/Token
                      </span> */}
                      </h3>
                    </div>
                  </div>
                </div>

                <br />
                <div className="row justify-content-center align-items-center">
                  <div className="col-sm-6">
                    <div className="row sm-center justify-content-end align-items-center">
                      <h2>
                        <span className=" float-right  badge  badge-secondary">
                          Total Tokens
                        </span>
                      </h2>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="row sm-center justify-content-start align-items-center">
                      <h3 className='ml-2'>
                        <span className="  badge badge-info">
                          <To_Number num={this.calculated_amount_tokens()} />
                        </span>
                      </h3>
                    </div>
                  </div>
                </div>

                <hr />

                  <div className="row justify-content-center align-items-center">
                    <div className="col-sm-6">
                      <div className="row sm-center justify-content-end align-items-center">
                        <h2>
                          <span className="   badge  badge-secondary">
                            Target Goal
                          </span>
                        </h2>
                      </div>
                    </div>
                    <div className="col-sm-6 ">
                      <div className="row sm-center justify-content-start align-items-center">
                        <h3 className='ml-2'>
                          <span className="float-left  badge badge-info">
                            $
                            <To_Number
                              num={
                                this.calculated_total_eth() *
                                this.props.locals.CURRENT_ETH_PRICE
                              }
                            />
                          </span>
                        </h3>
                      </div>
                    </div>
                  </div>
              </div>
              {/* END OF FUNDING GOAL */}

              {/* START DOWNPAYMENT COMPOENT */}
              <div className="form-group light-blue">
                <label htmlFor="downpayment">
                  Downpayment $
                  <To_Number num={this.props.user_crowdsale.downpayment} />
                </label>
                <div className="input-group  col-10">
                  <div className="input-group-prepend">
                    <div className="input-group-text">$</div>
                  </div>
                  <input
                    key={"downpayment"}
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Your Downpyment"
                    value={this.props.user_crowdsale.downpayment}
                    onChange={event =>
                      this.handle_input(
                        event.target.value,
                        "UPDATE_CROWDSALE",
                        "downpayment"
                      )
                    }
                    aria-describedby="basic-addon2"
                  />
                </div>
                <p id="passwordHelpBlock" className="form-text text-muted">
                  Your downpayment will determin your staring share of the
                  property
                  <span className="text-muted">
                    Your starting share %{this.calculated_percent_funded()}
                  </span>
                </p>
                <div className="justify-content-center alert alert-info">
                  To Start your Campaign, you will need to send $
                  <To_Number num={this.props.user_crowdsale.downpayment} />
                </div>
              </div>
              {/* DOWNPAYMENT COMPOENT END */}

              <div className="form-group light-blue">
                <label htmlFor="crowdsale_tax_id">Property Tax ID</label>
                <input
                  type="text"
                  key={"tax_id"}
                  className="form-control form-control-lg"
                  id="crowdsale_tax_id"
                  value={this.props.user_crowdsale.tax_id}
                  onChange={event =>
                    this.handle_input(
                      event.target.value,
                      "UPDATE_CROWDSALE",
                      "tax_id"
                    )
                  }
                  aria-describedby="tax_id"
                  placeholder="Property Tax ID"
                  name="crowdsale_tax_id"
                />
                <p className="form-text text-muted">
                  In order to properly identify which property you wish to raise
                  funds for, the tax id is require
                </p>
              </div>
              <div className="form-group light-blue">
                <label htmlFor="Legal description">Legal Description</label>
                <textarea
                  key={"description"}
                  value={this.props.user_crowdsale.description}
                  onChange={event =>
                    this.handle_input(
                      event.target.value,
                      "UPDATE_CROWDSALE",
                      "description"
                    )
                  }
                  className="form-control form-control-lg"
                  placeholder="Legal description of the proerty"
                  rows="3"
                />
                <p className="form-text text-muted">
                  Legal description of the property.
                </p>
              </div>

              <br />
              <br />
              <br />
            </div>

            <div className="col-sm-4">
              <div className="row">
                <div className="col-sm-10 offset-sm-2">
                  <strong>Preview Property Details</strong>
                  <hr />
                  <Property_Edit_Box
                    crowdsale={this.props.user_crowdsale}
                    current_eth_price={this.props.locals.CURRENT_ETH_PRICE}
                    DOLLARS_PER_TOKEN={this.props.locals.DOLLARS_PER_TOKEN}
                  />

                  {/* <%- include partials/property_box_vue %> */}
                </div>
              </div>
            </div>

            <div className="col-sm-12">
              <Campaign_Builder_Breadcrumbs pathname={pathname} />
            </div>
          </div>
          <br />
          <br />
          <br />
        </div>
      </Main_Layout>
    );
  }
}

function mapStateToProps(state) {
  const { user, csrf, locals, crowdsales } = state;
  return { ...user, ...csrf, ...locals, ...crowdsales };
}

export default connect(mapStateToProps)(withRouter(Edit_Property));
