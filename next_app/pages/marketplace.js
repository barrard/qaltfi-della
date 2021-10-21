import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { withRouter } from "next/router";
import $ from "jquery";

import Main_Layout from "../layouts/Main_Layout.js";
import Two_Factor_auth from "../components/modals/Two_Factor_auth.js";

class Contracts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // user: user,
      // crowdsales: crowdsales,
      place:'',
      map: null,
      map_marker_icons: [],
      infowindow: null,
      current_crowdsale_selected: "",
      zoomed_on_map: "", //for zooming in on google maps
      // sale_data:{},
      tokens_for_sale_markup: "",
      bids_for_tokens_markup: "",
      token_amount_bid_for_tokens_input: 1,
      total_ether_bid_for_tokens_input: 0.001,
      //two_factor_auth
      // current_eth_price,
      balance: 0, //if not already present....
      transaction_processing: false,
      verifying_wallet_password: false,
      incorrect_wallet_password: false
    };
  }

  componentDidMount() {
    var map_marker = {
      lat: 43.7875445,
      lng: -116.44492709999997
    };
    var map = new google.maps.Map(document.getElementById("marketplace_map"), {
      zoom: 5,
      center: map_marker,
      disableDefaultUI: true
    });
    this.map = map;
    const input = document.getElementById("token_search_input");
    const autocomplete_options = {
      types: ["address"]
    };
    var autocomplete = new google.maps.places.Autocomplete(
      input,
      autocomplete_options
    );
    autocomplete.addListener("place_changed", () => {
      console.log("maps1");
      this.state.place = autocomplete.getPlace();
      let lng = this.state.place.geometry.location.lng();
      let lat = this.state.place.geometry.location.lat();
      console.log({ lat, lng });
      let map_marker = {
        lat: lat,
        lng: lng
      };
      console.log(this.state.place);
      console.log(map);
      map.panTo(new google.maps.LatLng(lat, lng));
      map.setZoom(15);
      // var iconBase = 'https://maps.google.com/mapfiles/kml/pal3/';

      var map1_marker = new google.maps.Marker({
        position: map_marker,
        map: map,
        icon: this.state.place.icon
        // icon: iconBase + 'icon23.png'
      });
    });

    this.props.crowdsales.forEach(crowdsale => {
      console.log(crowdsale.lat);
      console.log(crowdsale.lng);
      this.set_marker(
        crowdsale.lat,
        crowdsale.lng,
        crowdsale.formatted_address,
        crowdsale.photos[0]
      );
    });

    // CREATED
    //TODO FINISH SOCKETS LATER

    //Purchase_Tokens_For_Sale_Event
    // socket.on("Purchase_Tokens_For_Sale_Event", data => {
    //   console.log("Purchase_Tokens_For_Sale_Event");
    //   console.log(data);
    //   this.remove_token_for_sale_from_crowdsale(data);
    // });
    // //Tokens_For_Sale_Event
    // socket.on("Tokens_For_Sale_Event", data => {
    //   console.log("Tokens_For_Sale_Event");
    //   console.log(data);
    //   this.add_token_for_sale(data);
    // });
    // //Cancel_Tokens_For_Sale_Event
    // socket.on("Cancel_Tokens_For_Sale_Event", data => {
    //   console.log("Cancel_Tokens_For_Sale_Event");
    //   console.log(data);
    //   this.remove_token_for_sale_from_crowdsale(data);
    // });
    // //Bid_For_tokens_Accepted_Event
    // socket.on("Bid_For_tokens_Accepted_Event", data => {
    //   console.log("Bid_For_tokens_Accepted_Event ");
    //   console.log(data);
    //   this.remove_bid_from_crowdsale(data);
    // });
    // //Cancel_Bid_For_Tokens_Event
    // socket.on("Cancel_Bid_For_Tokens_Event", data => {
    //   console.log("Cancel_Bid_For_Tokens_Event");
    //   console.log(data);
    //   this.remove_bid_from_crowdsale(data);
    // });
    // //Bid_For_Tokens_Event
    // socket.on("Bid_For_Tokens_Event", data => {
    //   console.log("Bid_For_Tokens_Event");
    //   this.add_bid_for_tokens(data);
    // });

    //TODO FINISH SOCKETS LATER

    //get data

    console.log("created");
    this.state.current_crowdsale_selected = this.props.crowdsales[0];
  }

  submit_singed_tansaction() {
    hide_modal("two_factor_auth_modal");
    console.log("SEND IT!");
    console.log(this.props.two_factor_auth.fn_data);
    let fn = this.props.two_factor_auth.fn_data.fn;
    let args = this.props.two_factor_auth.fn_data.args;
    fn(...args);
  } //for two factor auth modal

  go_to_on_map(index) {
    console.log("Slider was clicked, index " + index);
    if (this.zoomed_on_map === index) return;
    this.zoomed_on_map = index;
    google.maps.event.trigger(this.map_marker_icons[index], "click");
  }

  create_bid_for_tokens(token_address) {
    if (!marketplace_vue.user)
      return alert("You must be logged in to create bids for tokens");
    const token_amount = this.token_amount_bid_for_tokens_input;
    const total_ether = this.total_ether_bid_for_tokens_input;

    disable_ui($("#total_token_bid_input"));
    disable_ui($("#total_ether_bid_input"));
    disable_ui($("#create_bid_btn"));
    hide_modal("bid_for_tokens_modal");
    //two factor auth modal
    var two_factor_auth = JSON.stringify(this.props.two_factor_auth);
    //after we have the info, the user needs to enter a password / verify authority
    this.props.web3.transaction_in_progress = true;
    if (this.props.two_factor_auth.wallet_password) {
      start_spinner("Verifying password");
      this.verifying_wallet_password = true;
    } else {
      start_spinner();
    }
    //two factor auth modal
    console.log({ token_address, token_amount, total_ether });

    $.post(
      "/create_bid_for_tokens",
      {
        token_amount,
        total_ether,
        token_address,
        _csrf,
        two_factor_auth
      },
      resp => {
        console.log(resp);
        stop_spinner();
        enable_ui($("#total_token_bid_input"));
        enable_ui($("#total_ether_bid_input"));
        enable_ui($("#create_bid_btn"));
        this.props.web3.transaction_in_progress = false; //two factor auth
        this.verifying_wallet_password = false; //two factor auth

        // first check for errors
        if (resp.err) {
          show_modal("bid_for_tokens_modal");
          this.props.two_factor_auth.gas_estimate = 0;
          this.props.two_factor_auth.wallet_password = "";
          console.log("show it?"); //dont show two factor auth modal
          toast("Error trying to Offer Tokens For Sale", "ERROR");
          // show_modal('two_factor_auth_modal')
          toast(resp.err, "ERROR");
        }

        //if no err, then look for posible responses
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
              fn: this.create_bid_for_tokens,
              args: [token_address]
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
            this.second_transaction_gas_estimate = 0; //specific to offer tokens for sale
            hide_modal("two_factor_auth_modal");

            dynamic_message("warning", "Transaction Processing......");
            return toast("Transaction processing.....", "INFO");
            //two factor auth

            this.token_amount_bid_for_tokens_input = 0;
            this.total_ether_bid_for_tokens_input = 0;
          }
        }
      }
    );
  }
  html_for_bid_for_tokens(bid_for_tokens, index) {
    let eth_price = web3.fromWei(bid_for_tokens.wei_amount, "ether");
    return `
      <div className="card">
        <div className="card-body p-4">
          <div className="absolute top right">
            <p className="card-text">ETH per token - ${eth_price /
              bid_for_tokens.token_amount}</p>

          </div>

          <p className="card-text">Number of tokens - ${
            bid_for_tokens.token_amount
          }</p>
          <p className="card-text">Total price in ETH - ${eth_price}</p>
          <span className="card-text absolute bottom right">Posted on ${moment(
            bid_for_tokens.time * 1000
          ).format("MM/DD/YY hh:mm:ss a")}</span>
          <span className="card-text absolute bottom left">Bidder ${short_address(
            bid_for_tokens.bidder_address
          )}</span>


          <a href="#" data-dismiss="modal" onclick="marketplace_vue.accept_bid_for_token_marketplace(${index})"  className="btn btn-outline-danger">SELL</a>
        </div>
      </div>
      `;
  }
  create_crowdsale_bid_for_tokens_data_view(crowdsale) {
    this.bids_for_tokens_markup = "";

    // console.log(crowdsale)
    // const crowdsale = crowdsale
    this.state.current_crowdsale_selected = crowdsale;

    const bids_for_tokens = crowdsale.bids_for_tokens;
    bids_for_tokens.forEach((bid_for_tokens, index) => {
      this.bids_for_tokens_markup += this.html_for_bid_for_tokens(
        bid_for_tokens,
        index
      );
    });
  }
  html_for_tokens_for_sale(token_for_sale, index) {
    let eth_price = web3.fromWei(token_for_sale.wei_amount, "ether");

    return `
      <div className="card">
        <div className="card-body p-4">
          <div className="absolute top right">
            <p className="card-text">ETH per token - ${eth_price /
              token_for_sale.token_amount}</p>

          </div>

          <p className="card-text">Number of tokens - ${
            token_for_sale.token_amount
          }</p>
          <p className="card-text">Total price in ETH - ${eth_price}</p>
          <span className="card-text absolute bottom right">Posted on ${moment(
            token_for_sale.time * 1000
          ).format("MM/DD/YY hh:mm:ss a")}</span>
          <span className="card-text absolute bottom left">Seller ${short_address(
            token_for_sale.seller_address
          )}</span>
          

          <a href="#" data-dismiss="modal" onclick="marketplace_vue.buy_token_marketplace(${index})" className="btn btn-outline-success">BUY</a>
        </div>
      </div>
      `;
  }
  create_crowdsale_tokens_for_sale_data_view(crowdsale) {
    this.setState({
      tokens_for_sale_markup: ""
    });

    this.setState({ current_crowdsale_selected: crowdsale });

    const tokens_for_sale = crowdsale.tokens_for_sale;
    tokens_for_sale.forEach((token_for_sale, index) => {
      this.state.tokens_for_sale_markup += this.html_for_tokens_for_sale(
        token_for_sale,
        index
      );
    });
  }

  accept_bid_for_token_marketplace(index) {
    if (!marketplace_vue.user) return alert("You must be logged in to do that");
    // disable_ui(e.target)
    const crowdsale = this.state.current_crowdsale_selected;
    const bid_for_token_data = crowdsale.bids_for_tokens[index];
    console.log(bid_for_token_data);
    //two factor auth modal
    var two_factor_auth = JSON.stringify(this.props.two_factor_auth);
    //after we have the info, the user needs to enter a password / verify authority
    this.props.web3.transaction_in_progress = true;
    if (this.props.two_factor_auth.wallet_password) {
      start_spinner("Verifying password");
      this.verifying_wallet_password = true;
    } else {
      start_spinner();
    }
    //two factor auth modal

    $.post(
      "/accept_bid_for_token",
      {
        ...bid_for_token_data,
        _csrf,
        two_factor_auth,
        user_address: this.props.user.wallet_addresses[0]
      },
      resp => {
        console.log(resp);
        stop_spinner();

        this.props.web3.transaction_in_progress = false; //two factor auth
        this.verifying_wallet_password = false; //two factor auth
        // first check for errors
        if (resp.err) {
          this.props.web3.transaction_in_progress = false;
          this.props.two_factor_auth.gas_estimate = 0;
          this.props.two_factor_auth.wallet_password = "";
          console.log("show it?"); //dont show two factor auth modal
          toast("Error trying to Accept Bid For Tokens", "ERROR");
          // show_modal('two_factor_auth_modal')
          toast(resp.err, "ERROR");
        }
        //if no err, then look for posible responses
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
            this.second_transaction_gas_estimate = 87343; //to include the second transaction for selling tokens..

            this.props.two_factor_auth.fn_data = {
              fn: this.accept_bid_for_token_marketplace,
              args: [index]
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
            this.second_transaction_gas_estimate = 0; //specific to offer tokens for sale
            hide_modal("two_factor_auth_modal");

            dynamic_message("warning", "Transaction Processing......");
            return toast("Transaction processing.....", "INFO");
          }
        }
      }
    );
  }

  buy_token_marketplace(index) {
    if (!marketplace_vue.user) return alert("You must be logged in to do that");
    const token_for_sale_data = this.state.current_crowdsale_selected
      .tokens_for_sale[index];
    console.log(token_for_sale_data);
    //two factor auth modal
    var two_factor_auth = JSON.stringify(this.props.two_factor_auth);
    //after we have the info, the user needs to enter a password / verify authority
    this.props.web3.transaction_in_progress = true;
    if (this.props.two_factor_auth.wallet_password) {
      start_spinner("Verifying password");
      this.verifying_wallet_password = true;
    } else {
      start_spinner();
    }
    //two factor auth modal
    $.post(
      "/buy_token_marketplace",
      {
        ...token_for_sale_data,
        _csrf,
        two_factor_auth
      },
      resp => {
        console.log(resp);
        stop_spinner();
        this.props.web3.transaction_in_progress = false; //two factor auth
        this.verifying_wallet_password = false; //two factor auth
        // first check for errors
        if (resp.err) {
          // show_modal('bid_for_tokens_modal')
          this.props.web3.transaction_in_progress = false;
          this.props.two_factor_auth.gas_estimate = 0;
          this.props.two_factor_auth.wallet_password = "";
          console.log("show it?"); //dont show two factor auth modal
          toast("Error trying to Offer Tokens For Sale", "ERROR");
          // show_modal('two_factor_auth_modal')
          toast(resp.err, "ERROR");
        }
        //if no err, then look for posible responses
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
            // this.second_transaction_gas_estimate = 420609//to include the second transaction..

            this.props.two_factor_auth.fn_data = {
              fn: this.buy_token_marketplace,
              args: [index]
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
            this.second_transaction_gas_estimate = 0; //specific to offer tokens for sale
            hide_modal("two_factor_auth_modal");

            dynamic_message("warning", "Transaction Processing......");
            return toast("Transaction processing.....", "INFO");
            //two factor auth

            this.token_amount_bid_for_tokens_input = 0;
            this.total_ether_bid_for_tokens_input = 0;
          }
        }
      }
    );
  }
  like(crowdsale_id) {
    console.log(crowdsale_id);
    $.post(
      "/like",
      {
        crowdsale_id: crowdsale_id,
        _csrf: _csrf
      },
      resp => {
        if (resp.resp) {
          console.log(resp.resp);
          this.props.user.liked_crowdsales = resp.resp.updated_user_likes;
          this.props.crowdsales.user_likes = resp.resp.updated_crowdsale_user_likes;
        } else if (resp.err) {
          toast("Error", "ERROR");
        }
      }
    );
  }

  set_marker(lat, lng, formatted_address, img_src) {
    console.log("set");

    var map1_marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      title: formatted_address,
      animation: google.maps.Animation.DROP

      // icon: place.icon
      // icon: iconBase + 'icon23.png'
    });
    // var infowindow
    map1_marker.addListener("click", function() {
      if (marketplace_vue.infowindow) marketplace_vue.infowindow.close();
      this.map.setZoom(15);
      this.map.panTo(map1_marker.getPosition());
      //incase there is no IMG, but ofcourse there WILL be, right?
      const crowdsale_img = img_src
        ? `/crowdsale_photos/${img_src}`
        : `/img/house-placeholder.jpg`;
      marketplace_vue.infowindow = new google.maps.InfoWindow({
        content: `<img height="40px" src="${crowdsale_img}"></img><br />${formatted_address}`,
        maxWidth: 100
      });
      marketplace_vue.infowindow.open(this.map, map1_marker);
    });
    this.map_marker_icons.push(map1_marker);
  }
  get_tokens_for_sale(token_address, crowdsale_index) {
    $.get(`/get_total_token_objs_for_sale/${token_address}`, resp => {
      console.log(resp);
      console.log(crowdsale_index);
      // var new_crowdsale_data = {...marketplace_vue.crowdsales[crowdsale_index], bids_for_tokens:resp.resp.number_of_token_objects }
      // $(`[data-tokens_for_sale = "${token_address}"]`).text(resp.resp.number_of_token_objects)
    });
  }
  get_total_bids_for_token(token_address, crowdsale_index) {
    $.get(`/get_total_bids_for_token/${token_address}`, resp => {
      console.log(resp);
      console.log(crowdsale_index);
      // var new_crowdsale_data = {...marketplace_vue.crowdsales[crowdsale_index], bids_for_tokens:resp.resp.number_of_token_objects }
      $(`[data-bid_count = "${token_address}"]`).text(resp.resp.bid_count);
    });
  }
  remove_bid_from_crowdsale(data) {
    console.log({ data });
    const { bidder_index, token_index, token_address } = data;
    const crowdsale_index = marketplace_vue.crowdsales.findIndex(crowdsale => {
      return crowdsale.token_address == token_address;
    });
    console.log({ crowdsale_index });
    const bid_index = marketplace_vue.crowdsales[
      crowdsale_index
    ].bids_for_tokens.findIndex(bid => {
      return bid.bidder_index == bidder_index && bid.token_index == token_index;
    });
    console.log({ bid_index });
    marketplace_vue.crowdsales[crowdsale_index].bids_for_tokens.splice(
      bid_index,
      1
    );

    this.create_crowdsale_bid_for_tokens_data_view(
      marketplace_vue.current_crowdsale_selected
    );
  }
  remove_token_for_sale_from_crowdsale(data) {
    console.log(data);
    const { seller_index, token_index, token_address } = data;
    const crowdsale_index = marketplace_vue.crowdsales.findIndex(crowdsale => {
      return crowdsale.token_address == token_address;
    });
    console.log({ crowdsale_index });
    const sale_index = marketplace_vue.crowdsales[
      crowdsale_index
    ].tokens_for_sale.findIndex(bid => {
      marketplace_vue.crowdsales[index].tokens_for_sale.splice(sale_index, 1);
      return bid.seller_index == seller_index && bid.token_index == token_index;
    });
    console.log({ sale_index });
    this.create_crowdsale_tokens_for_sale_data_view(
      marketplace_vue.current_crowdsale_selected
    );
  }

  add_token_for_sale(data) {
    const crowdsale_index = marketplace_vue.crowdsales.findIndex(cs => {
      return cs.token_address == data.token_address;
    });
    marketplace_vue.crowdsales[crowdsale_index].tokens_for_sale.push(data);
    this.create_crowdsale_tokens_for_sale_data_view(
      marketplace_vue.current_crowdsale_selected
    );
  }

  add_bid_for_tokens(data) {
    const {
      token_address,
      bidder_address,
      token_amount,
      wei_amount,
      bidder_index,
      token_index
    } = data;
    const index = marketplace_vue.crowdsales.findIndex(crowdsale => {
      return crowdsale.token_address == token_address;
    });
    marketplace_vue.crowdsales[index].bids_for_tokens.push({
      token_address,
      bidder_address,
      token_amount,
      time: new Date().getTime() / 1000,
      wei_amount,
      bidder_index,
      token_index
    });
    this.create_crowdsale_bid_for_tokens_data_view(
      marketplace_vue.current_crowdsale_selected
    );
  }

  render() {
    return (
      <Main_Layout>
        {/* <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=<%=GOOGLE_MAPS_API_KEY %>&libraries=places"></script> */}
        {/* <!-- <script src="/js/markerWithLabel.js"></script> --> */}
        <div className="container-fluid">
          <br />
          <br />
          <div className="row">
            <div className="col-sm-6">
              <ul className="nav">
                <li className="nav-item">
                  <a className="nav-link active" href="#">
                    Appreciation
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    New
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    More Filters
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-sm-6">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">
                    <i
                      style={{fontSize: '30px'}}
                      className="fa fa-search pr-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <input
                  id="token_search_input"
                  type="text"
                  className="form-control"
                  placeholder="Address search"
                  aria-label="Address search"
                  aria-describedby="basic-addon1"
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <div className="row no-gutters">
                {this.props.crowdsales.map((crowdsale, key) => (
                  <div onClick={this.go_to_on_map(key)} className="col-lg-6">
                    {/* //TODO MINI-SLIDER */}
                    {/* <mini-slider
                  :user="user"
                  :zillow_data="crowdsale.zillow_data"
                  :photos="crowdsale.photos" 
                  :crowdsale_id="crowdsale._id"
                   :formatted_address="crowdsale.formatted_address"
                   :crowdsale="crowdsale"
                   v-on:like="like"
                   v-on:show_crodsale_tokens_for_sale='create_crowdsale_tokens_for_sale_data_view'
                   v-on:show_crodsale_bids_for_tokens='create_crowdsale_bid_for_tokens_data_view'
                   
                  ></mini-slider> */}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-sm-6">
              <div id="marketplace_map" />
            </div>
          </div>

          {/* <!-- TOKENS FOR SALE MODAL --> */}
          {/* TODO COMPONENTIZE */}
          {this.state.current_crowdsale_selected &&
          <div
            className="modal fade tokens_for_sale_modal"
            tabindex="-1"
            role="dialog"
          >
            <div className="modal-dialog " role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {this.state.current_crowdsale_selected.formatted_address}
                    <br /> estimated home value{" "}
                    {
                      this.state.current_crowdsale_selected.zillow_data
                        .zestimate
                    }
                    <br /> Total tokens -{" "}
                    {this.state.current_crowdsale_selected.goal /
                      this.state.current_crowdsale_selected.rate}
                  </h5>
                  <button
                    onClick={() =>
                      this.create_crowdsale_bid_for_tokens_data_view(
                        current_crowdsale_selected
                      )
                    }
                    className="btn btn-outline-secondary"
                    data-dismiss="modal"
                    data-toggle="modal"
                    data-target="bid_for_tokens_modal"
                  >
                    BID
                  </button>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="container-fluid">
                    {this.state.tokens_for_sale_markup}
                  </div>
                </div>
                <div className="modal-footer">
                  {/* <!-- <button type="button" className="btn btn-primary">Save changes</button> --> */}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>}
          {/* <!-- TOKENS FOR SALE MODAL --> */}

          {/* <!-- BID FOR TOKENS MODAL --> */}
          {this.state.current_crowdsale_selected &&
          <div
            className="modal fade bid_for_tokens_modal"
            tabindex="-1"
            role="dialog"
            id="bid_for_tokens_modal"
          >
            <div className="modal-dialog " role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {this.state.current_crowdsale_selected.formatted_address}
                    <br /> estimated home value $
                    {
                      this.state.current_crowdsale_selected.zillow_data
                        .zestimate
                    }
                    <br /> Total tokens -{" "}
                    {this.state.current_crowdsale_selected.goal /
                      this.state.current_crowdsale_selected.rate}
                  </h5>
                  <button
                    onClick={() =>
                      this.create_crowdsale_tokens_for_sale_data_view(
                        current_crowdsale_selected
                      )
                    }
                    className="btn btn-outline-success"
                    data-toggle="modal"
                    data-target="tokens_for_sale_modal"
                    data-dismiss="modal"
                    aria-label="tokens for sale"
                  >
                    SALE
                  </button>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row" v-html="">
                    <div className="row">
                      <div className="col-sm-12 center-text">
                        <p>Create a bid for this token</p>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-3 mx-auto">
                        <div className="form-group row">
                          <label
                            for="token_amount"
                            className="col-sm-12 col-form-label"
                          >
                            Token Amount
                          </label>
                          <div className="col-sm-12">
                            <input
                              id="total_token_bid_input"
                              className="form-control form-control-sm"
                              type="number"
                              name="token_amount"
                              v-model="token_amount_bid_for_tokens_input"
                              placeholder="# tokens you want to bid for"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-3 mx-auto">
                        <div className="form-group row">
                          <label
                            for="total_ether"
                            className="col-sm-12 col-form-label"
                          >
                            Total Ether
                          </label>
                          <div className="col-sm-12">
                            <input
                              id="total_ether_bid_input"
                              className="form-control form-control-sm"
                              type="number"
                              name="total_ether"
                              v-model="total_ether_bid_for_tokens_input"
                              placeholder="total amount of ether for you bid"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-3 mt-4 mx-auto">
                        <button
                          id="create_bid_btn"
                          onClick={() =>
                            this.create_bid_for_tokens(
                              current_crowdsale_selected.token_address
                            )
                          }
                          className="btn btn-outline-success"
                        >
                          CREATE BID
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="Name">{this.state.bids_for_tokens_markup}</div>
                </div>
                <div className="modal-footer">
                  {/* <!-- <button type="button" className="btn btn-primary">Save changes</button> --> */}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>}
          {/* <!-- BID FOR TOKENS MODAL --> */}
          <Two_Factor_auth />
        </div>
        <script src="/js/components/like-btn.js" />
        <script src="/js/components/mini-slider.js" />
        <script src="/js/components/boots-carousel.js" />
        <script src="/js/components/test-carousel.js" />

        {/* TODO getInitialProps */}
        {/* var crowdsales = <%- JSON.stringify(tradeable_crowdsales)%> */}
      </Main_Layout>
    );
  }
}

function mapStateToProps(state) {
  const { user, csrf, locals, crowdsales, two_factor_auth } = state;
  return { ...user, ...csrf, ...locals, ...crowdsales, ...two_factor_auth };
}

export default connect(mapStateToProps)(withRouter(Contracts));
