import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { withRouter } from "next/router";
import Head from "next/head";
// import $ from "jquery";

import {Can_Start_Campaign} from '../components/Admin_Components/Can_Start_Campaign.js'
import  View_Allowed_Campaign from "../components/Admin_Components/View_Allowed_Campaign.js";
import {Della_abi, Della_address} from '../components/contract_abi.js'
import {Formatted_Date_Time, To_Eth} from '../components/small_ui_items.js'

import Main_Layout from "../layouts/Main_Layout.js";
class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allowed_campaign_goal:'',
      address_to_allow:'',
      all_receipts: [],
      all_users: [],
      selected_data: "",
      selected_property: "",
      selected_value: undefined,
      hidden_prop_values: {},
      properties: [],
      values: {},
      list_of_data: [],
      hide_list: [],
      single_data: {},
      missing_transaction_event_data: null,
      //approval model
      user_address_for_approval: "0x77609a839d8e2acfdf24ee763d48f495a8f062aa",
      //edit_data modal
      edit_data: { prop: "", current_val: "", new_val: "", index: "" },
      admin_address: "0x763D9dD7401266BCEAB676a57935606808083a58",
      //two_factor_auth
      balance: 100, //if not already present....
      transaction_processing: false,
      verifying_wallet_password: false,
      incorrect_wallet_password: false,
      // ADMIN_ACCOUNT_ADDRESS:"0x82BF2A0Cb4939F3BC865a5b47A0863856895c163"//metamask account 2
      ADMIN_ACCOUNT_ADDRESS:"0x8acb9cfc0a1884d4cfe58d738a4479d693b87be6"//ganache account
      // ADMIN_ACCOUNT_ADDRESS:"0x763D9dD7401266BCEAB676a57935606808083a58"//metamask account
    };
    this.send_allow_campaign_data =this.send_allow_campaign_data.bind(this)
    this.handle_state_input = this.handle_state_input.bind(this)
    this.approve_user = this.approve_user.bind(this)
    this.show_all_users = this.show_all_users.bind(this)
    this.get_local = this.get_local.bind(this);
  }

  componentDidMount() {
    // if(user)this.two_factor_auth.user_id = user._id

    const hide_list = this.get_local("hide_list");
    if (hide_list) {
      // console.log('hide list')
      this.hide_list = hide_list;

      // console.log(this.hide_list)
    } else {
      this.save_local("hide_list", []);
    }
    const hidden_prop_values = this.get_local("hidden_prop_values");
    if (hidden_prop_values) {
      this.hidden_prop_values = hidden_prop_values;
    } else {
      this.save_local("hidden_prop_values", {});
    }

    const all_crowdsales = this.get_local("all_crowdsales");
    if (all_crowdsales) {
      this.all_crowdsales = all_crowdsales;
    }
    const all_users = this.get_local("all_users");
    if (all_users) {
      this.all_users = all_users;
    }
    const all_receipts = this.get_local("all_receipts");
    if (all_receipts) {
      this.all_receipts = all_receipts;
    }

    const selected_data = this.get_local("selected_data");
    if (selected_data) {
      this.state.selected_data = selected_data;
      this.extract_properties_of();
    }

    const selected_property = this.get_local("selected_property");
    if (selected_property) {
      this.selected_property = selected_property;
      this.new_property_selected();
    }
    const selected_value = this.get_local("selected_value");
    if (selected_value) {
      this.selected_value = selected_value;
      this.set_list_of_data();
      // this.extract_properties_of()
    }
    //watch nav_height
    // var div = $('#nav_row');

    // this.nav_height = div.offset().top + div.height();
    // console.log(this.nav_height)
    // this.set_main_content_height(this.nav_height)

    $("#data_modal").on("hidden.bs.modal", function() {
      this.state.missing_transaction_event_data = null;
    });
  }

  async send_allow_campaign_data(){
    const {address_to_allow, allowed_campaign_goal} = this.state
    console.log(allowed_campaign_goal)


    let address = this.state.user_address_for_approval;
    const {web3} = this.props.web3
    //disable UI to prevent double sending
    // var btn = e.target;
    // $(btn).prop("disabled", true);
    // $("#user_address_for_approval").prop("disabled", true);

    console.log(`allow ${address_to_allow} to make campaign for ${allowed_campaign_goal}`)
    if(!allowed_campaign_goal || ! address_to_allow) return toastr.error('Please eneter an address and goal to allow')
    /* Make the contract object */
    const Della_Contract = new web3.eth.Contract(Della_abi, Della_address);

    // const function_call = 
    let resp = await Della_Contract.methods.set_can_start_campaign(
      address_to_allow, allowed_campaign_goal
    ).send({
      from:this.state.ADMIN_ACCOUNT_ADDRESS
    })
    .on('transactionHash', (transactionHash)=> console.log(transactionHash))
    // .on('confirmation', function(confNumber, receipt){ 
    //   console.log('CONFIRMATION')
    //   console.log({confNumber, receipt})
    //  })

    .on('receipt', receipt => console.log( receipt))
    .on('error', error => console.log( error))

  }


  handle_state_input(key, value) {
    console.log(key)
    console.log(value)
    this.setState({ [key]: value });

  }


  get_local(key) {
    const val = localStorage.getItem(key);
    if (val) return JSON.parse(val);
  }
  save_local(k, v) {
    localStorage.setItem(k, JSON.stringify(v))
  
  }
  

  async approve_user(e) {
    let address = this.state.user_address_for_approval;
    const {web3} = this.props.web3
    //disable UI to prevent double sending
    var btn = e.target;
    // $(btn).prop("disabled", true);
    // $("#user_address_for_approval").prop("disabled", true);

    start_spinner();
    console.log(`Approve ${address}`)
    if(!address) return toastr.error('Please eneter an address to approve')
    /* Make the contract object */
    const Della_Contract = new web3.eth.Contract(Della_abi, Della_address);

    // const function_call = 
    let resp = await Della_Contract.methods.set_authorized_investor(
      address, true
    ).send({
      from:this.state.ADMIN_ACCOUNT_ADDRESS

    })
    .on('transactionHash', (transactionHash)=> console.log(transactionHash))
    // .on('confirmation', function(confNumber, receipt){ 
    //   console.log('CONFIRMATION')
    //   console.log({confNumber, receipt})
    //  })

    .on('receipt', receipt => console.log( receipt))
    .on('error', error => console.log( error))


    // $.post("/approve_user", { address, _csrf, two_factor_auth }, resp => {
    //   console.log(resp);
    //   this.verifying_wallet_password = false;
    //   $("#user_address_for_approval").prop("disabled", false);
    //   $(btn).prop("disabled", true);
    //   stop_spinner();
    //   if (resp.err) {
    //     toastr.error("Error trying to fundraiser approved");
    //     toastr.info(resp.err);
    //   } else if (!resp.err && resp.resp) {
    //     //two factor auth
    //     if (resp.resp.incorrect_wallet_password) {
    //       this.incorrect_wallet_password = true;
    //       return toastr.error("Incorrect Password");
    //     }
    //     if (resp.resp.two_factor_auth) {
    //       console.log("Got gas estimate");
    //       this.two_factor_auth.gas_estimate =
    //         resp.resp.two_factor_auth.gas_estimate;
    //       this.two_factor_auth.to = resp.resp.two_factor_auth.to;
    //       this.two_factor_auth.from = resp.resp.two_factor_auth.from;
    //       this.two_factor_auth.value = resp.resp.two_factor_auth.value;
    //       this.two_factor_auth.fn_data = {
    //         fn: this.approve_user,
    //         args: [e]
    //       };

    //       setTimeout(async () => {
    //         const { median_price, median_time } = await gas_station_data();
    //         this.two_factor_auth.gas_price = median_price;
    //         this.two_factor_auth.median_time = median_time;
    //         setTimeout(() => {
    //           show_two_factor_auth_modal();
    //         }, 0);
    //       }, 0);
    //     } else if (resp.resp.transaction_processing) {
    //       console.log("Transaction is processing");
    //       //Password was matched, and we will notify via sockets when done!
    //       //reset two_factor_auth credentials
    //       this.two_factor_auth.gas_estimate = undefined;
    //       this.two_factor_auth.wallet_password = undefined;
    //       this.two_factor_auth.to = undefined;
    //       this.two_factor_auth.from = undefined;
    //       this.two_factor_auth.value = undefined;
    //       this.two_factor_auth.transaction_type = "";

    //       // dynamic_message('warning', 'Transaction Processing......')
    //       setTimeout(() => {
    //         hide_two_factor_auth_modal();
    //       }, 0);
    //       return toastr.info("Transaction processing.....");
    //     }
    //   }
    // });
  }

  set_main_content_height(height) {
    const main_content = $("#main_content");
    main_content.css("top", this.nav_height);
  }
  send_edit_data() {
    console.log("change data for");
    console.log(this.edit_data.prop);
    console.log(this.edit_data.current_val);
    console.log(this.edit_data.new_val);
    console.log(this.edit_data.index);
    console.log(this.state.selected_data);

    console.log(this[this.state.selected_data][this.edit_data.index]);
    // $.post('/edit_data', {

    // })
  }
  init_edit_data(prop, current_val, index) {
    console.log({ prop, current_val, index });
    this.edit_data.prop = prop;
    this.edit_data.current_val = current_val;
    this.edit_data.index = index;
  }

  remove_prop_value_from_hidden_list(prop, val) {
    console.log(`remove ${prop} : ${val}`);
    var values_array = this.hidden_prop_values[prop];
    const index = values_array.indexOf(val);
    values_array.splice(index, 1);
    this.save_local("hidden_prop_values", this.hidden_prop_values);
    this.set_list_of_data();
  }
  hide_prop_val(prop, val) {
    console.log({ prop, val });
    if (!this.hidden_prop_values[prop]) this.hidden_prop_values[prop] = [];
    var val_array = this.hidden_prop_values[prop];
    if (val_array.indexOf(val) == -1)
      this.hidden_prop_values[prop].push(String(val));
    this.save_local("hidden_prop_values", this.hidden_prop_values);

    this.set_list_of_data();
    // this.state.list_of_data = this.state.list_of_data.filter((data)=> data[prop] != val )
  }

  add_recovered_event_data(data) {
    if (!confirm("You sure?")) return;
    console.log(data);
    if (data.event_recieved) {
      if (!confirm("event_recieved is true already")) return;
    }
    console.log("OK adding data");
    const { blockNumber, to, transaction_type } = data;

    $.get(
      `/admin_data/add_missed_transaction_event_data/${to}/${transaction_type}/${blockNumber}`,
      resp => {
        console.log(resp);
      }
    );
  }

  async get_event_data_for_tx_hash(data) {
    const { transactionHash } = data;
    let resp = await $.get(
      `/admin_data/get_event_data_for_tx_hash/${transactionHash}`
    );
    // , (resp) => {
    console.log(resp);
  }

  get_transaction(data) {
    const { blockNumber, to, transaction_type } = data;
    console.log(data);
    // console.log({ blockNumber, transaction_type, to})
    $.get(
      `/admin_data/get_missed_transaction_event_data/${to}/${transaction_type}/${blockNumber}`,
      resp => {
        console.log("resp");
        console.log(resp);
        try {
          console.log(JSON.parse(resp));
          resp = JSON.parse(resp);
        } catch (error) {
          console.log("its not JSON parsable");
          console.log(resp);
        }
        if (Array.isArray(resp.resp) && resp.resp) {
          toastr.success("Got an event " + resp.resp.event);
          admin_vue.missing_transaction_event_data = {
            returnValues: resp.resp[0].returnValues,
            event: resp.resp.event
          };
          if (resp.resp.length > 1)
            toastr.error("Got more than one event returned");
        } else if (typeof resp.resp == "string") {
          toastr.info(resp.resp);
        } else if (resp.err) {
          // console.log('Error?')
          // console.log(resp.err)
          toastr.error("Sorry no event, " + resp.err);
        }
      }
    );
  }
  show_data_details(count) {
    // console.log(count)
    // console.log(this[this.state.selected_data][count])
    this.single_data = this[this.state.selected_data][count];
  }

  show_prop(prop) {
    // console.log(prop)
    const index = this.hide_list.indexOf(prop);
    if (index == -1) return;
    this.hide_list.splice(index, 1);
    this.save_local("hide_list", this.hide_list);
    this.set_list_of_data();
  }
  hide_prop(prop) {
    // console.log(prop)

    if (this.hide_list.indexOf(prop) == -1) {
      // console.log(prop)
      this.hide_list.push(prop);

      this.save_local("hide_list", this.hide_list);
      this.set_list_of_data();
    }
  }
  new_property_value_selected() {
    this.save_local("selected_value", this.selected_value);
    this.state.list_of_data = [];
    // console.log(`filter down ${this.state.selected_data} who have ${this.selected_property} to value${this.selected_value}`)
    this.set_list_of_data();
  }
  new_property_selected() {
    // console.log('propertry selceted')
    this.selected_value = undefined;
    // console.log(this.selected_property)
    this.save_local("selected_property", this.selected_property);
    console.log(this[`all_${this.state.selected_data}`]);
    const all_items = this[this.state.selected_data];
    this.values = {};

    all_items.forEach(item => {
      const val = item[this.selected_property];
      if (!this.values[val]) {
        this.values[val] = 1;
      } else {
        this.values[val]++;
      }
    });
    //push all props but selected to hide
    // console.log('set list selected prop '+this.selected_property)

    this.set_list_of_data();
  }
  set_list_of_data() {
    //start with frash array of data
    if (this.state.selected_data) {
      // console.log(`list of data is set to ${this.state.selected_data}`)
      this.state.list_of_data = this[this.state.selected_data]; //set list of data to all of one selected_type[user, crowdsale, receipt]
    }
    //add the index property to every item
    this.state.list_of_data = this.state.list_of_data.map((data, index) => {
      return { ...data, __index: index };
    });

    //remove properties on the hide list via filter
    if (this.hide_list.length) {
      //  console.log('Have items on the hide list')
      this.state.list_of_data = this.state.list_of_data.map(data => {
        const obj = {};
        for (let k in data) {
          if (this.hide_list.indexOf(k) == -1) {
            obj[k] = data[k];
          }
        }
        return obj;
      });
    }

    if (this.selected_value && this.selected_property) {
      // console.log('selected value and selcted property are set')
      this.state.list_of_data = this.state.list_of_data.filter(data => {
        return (
          String(data[this.selected_property]) == String(this.selected_value)
        );
      });
    }

    this.state.list_of_data = this.state.list_of_data.filter(data => {
      // console.log(data)
      var flag;
      for (let k in data) {
        var hidden_prop_values_array = this.hidden_prop_values[k];
        // console.log(k)
        // console.log(hidden_prop_values_array)
        if (!hidden_prop_values_array) hidden_prop_values_array = [];
        // console.info('looking for ')
        // console.info(data[k])
        // console.info('inside here')
        // console.log(hidden_prop_values_array)
        flag = hidden_prop_values_array.indexOf(String(data[k])) == -1;
        if (!flag) {
          return false;
        }
      }
      return true;
    });
  }

  extract_properties_of() {
    const properties = this[this.state.selected_data][0];
    this.properties = [];
    // this.hide_list = []
    this.values = {};
    // console.log(this[type])
    for (let property in properties) {
      // console.log(property)
      this.properties.push(property);
    }
    this.set_list_of_data();
  }

  show_all_crowdsales() {
    // console.log('show_all_crowdsales')
    this.state.selected_data = "all_crowdsales";
    this.save_local("selected_data", "all_crowdsales");

    if (!this.all_crowdsales.length) {
      $.get("/admin_data/show_all_crowdsales", resp => {
        // console.log(resp)
        this.all_crowdsales = resp;
        this.save_local("all_crowdsales", resp);
        if (!resp.length) return;

        this.show_all_crowdsales();
      });
    } else {
      // const properties = this.all_crowdsales[0]
      // console.log(properties)
      this.extract_properties_of();
    }
  }
  show_all_receipts() {
    // console.log('show_all_receipts')
    this.state.selected_data = "all_receipts";
    this.save_local("selected_data", "all_receipts");

    if (!this.all_receipts.length) {
      $.get("/admin_data/show_all_receipts", resp => {
        // console.log(resp)
        this.all_receipts = resp;
        this.save_local("all_receipts", resp);
        if (!resp.length) return;

        this.show_all_receipts();
      });
    } else {
      // const properties = this.all_receipts[0]
      // console.log(properties)
      this.extract_properties_of();
    }
  }
  show_all_users() {
    // console.log('show_all_users')
    this.state.selected_data = "all_users";
    this.save_local("selected_data", "all_users");

    if (!this.all_users.length) {
      $.get("/admin_data/show_all_users", resp => {
        // console.log(resp)
        this.all_users = resp;
        this.save_local("all_users", resp);
        if (!resp.length) return;

        this.show_all_users();
      });
    } else {
      // const properties = this.all_users[0]
      // console.log(properties)
      this.extract_properties_of();
    }
  }

  render() {
    return (
      <Main_Layout>
        <Head>
          <link rel="stylesheet" href="/static/css/admin.css" />
          <title>Admin</title>
        </Head>
        <br />

        <div className="container-fluid">
          <div id="tx_spinner_progress_bar_container" className="progress">
            <div
              id="tx_spinner_progress_bar"
              className="progress-bar progress-bar-animated progress-bar-striped"
              role="progressbar"
              style={{width: '100%'}}
              aria-valuenow="50"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              Blockchain transaction in progress
              <span id="transaction_timer" />
            </div>
          </div>

          <div className="row" id="nav_row">
            <div className="col-sm-12">
              <nav className="navbar navbar-expand-lg navbar-light bg-light">
                {/* <!-- <a className="navbar-brand" href="#">Admin</a> --> */}
                <div className="">
                  <h3>{this.state.selected_data}</h3>
                  <p>{this.state.list_of_data.length} - Data found</p>

                  <div className="row">
                    <div className="col-sm-6">
                      <div className="row">Properties</div>
                      <div className="row">
                        <select
                          onChange={this.new_property_selected}
                          value={this.state.selected_property}
                          name="properties"
                          id="properties"
                        >
                          {this.state.properties.map((prop, index) => (
                            <option value={prop}>
                              {index} - {prop}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="row">Values</div>
                      <div className="row">
                        <select
                          onChange={this.new_property_value_selected}
                          value={this.state.selected_value}
                          name="prop_values"
                          id="prop_values"
                        >
                          {Object.keys(this.state.values).map((value, key) => (
                            <option value={key}>
                              {key} - {value}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon" />
                </button>

                <div
                  className="collapse navbar-collapse"
                  id="navbarSupportedContent"
                >
                  <div className="mr-auto">
                    <button
                      data-toggle="modal"
                      data-target="#approve_user_modal"
                      className="btn btn-outline-success"
                      type="button"
                    >
                      APPROVE USER
                    </button>
                    <span>{this.props.locals.CURRENT_ETH_PRICE}</span>

                  </div>
   
                </div>

              </nav>
            </div>
          </div>

          <div className="row main" id="main_content">
          <div className='row justify-content-center'>
            <div className='col-sm-12'>
            <Can_Start_Campaign 
                    send_allow_campaign_data={this.send_allow_campaign_data}
                    address_to_allow={this.state.address_to_allow}
                    handle_state_input={this.handle_state_input}
                  />
                <View_Allowed_Campaign>
                  
                </View_Allowed_Campaign>
            </div>
          </div>
            <div className="col-sm-9 card">
              <div className="row">
                <div className="col-sm-12 main_list_of_data">
                  {this.state.list_of_data.map((data, count) => (
                    <div className="card">
                      <div className="data_divider list-group-item">
                        <button
                          onClick={() =>
                            this.show_data_details(data.__index || count)
                          }
                          className="btn btn-sm btn-outline-info"
                          data-toggle="modal"
                          data-target="#data_modal"
                        >
                          VIEW #{count}
                        </button>
                        <ul className="list-group">
                          {data.map((val, prop) => (
                            <li className="list-group-item item_gradient">
                              <button
                                onClick={() => this.hide_prop(prop)}
                                type="button"
                                className="mr-3 btn btn-sm btn-outline-danger  float-left"
                              >
                                HIDE
                              </button>
                              <span className="red">{prop}</span> -{" "}
                              <span className="green"> {val}</span>
                              <button
                                onClick={() =>
                                  this.init_edit_data(
                                    prop,
                                    val,
                                    data["__index"]
                                  )
                                }
                                data-toggle="modal"
                                data-target="#edit_data_modal"
                                type="button"
                                className="ml-3 btn btn-sm btn-outline-info"
                              >
                                EDIT
                              </button>
                              <button
                                onClick={() => this.hide_prop_val(prop, val)}
                                type="button"
                                className="ml-3 btn btn-sm btn-outline-secondary"
                              >
                                HIDE
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-sm-3 card">
              <button
                onClick={this.clear_storage}
                className="btn btn-lg btn-outline-info"
              >
                RESET
              </button>

              <button
                onClick={this.show_all_users}
                className="btn btn-outline-info"
              >
                USERS{" "}
                <span className="badge badge-light">
                  {this.state.all_users.length}
                </span>
              </button>
              <button
                onClick={this.show_all_crowdsales}
                className="btn btn-outline-info"
              >
                CROWDSALES{" "}
                <span className="badge badge-light">
                  {this.props.crowdsales.length}
                </span>
              </button>
              <button
                onClick={this.show_all_receipts}
                className="btn btn-outline-info"
              >
                RECEIPTS{" "}
                <span className="badge badge-light">
                  {this.state.all_receipts.length}
                </span>
              </button>

              <div className="row mt-3 max-height-70">
                <div className="col-sm-12 center-text scroll">
                  SHOW/HIDE
                  <div className="list-group">
                    {this.state.hide_list.map(item => (
                      <div className="list-group-item">
                        <small className=" float-left">{item}</small>
                        <button
                          onClick={() => this.show_prop(item)}
                          type="button"
                          className="btn btn-sm btn-outline-success  float-right"
                        >
                          SHOW
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row bottom container-fluid">
            <div className="col-sm-12 scroll">
              hidden prop_values
              {Object.keys(this.state.hidden_prop_values).map((values_array, prop) => (
                <>
                  {values_array.length > 0 && (
                    <div className="list-group-item flex">
                      <strong>{prop}</strong>
                      {values_array.map(value => (
                        <div className="px-1">
                          <button
                            onClick={() =>
                              this.remove_prop_value_from_hidden_list(
                                prop,
                                value
                              )
                            }
                            type="button"
                            className="btn btn-sm btn-outline-danger  float-right"
                          >
                            {value}
                            <div className="inline card">SHOW</div>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
          {/* <!-- End of footer --> */}

          {/* <!-- edit data modal --> */}

          <div className="modal fade" id="edit_data_modal">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit data</h5>
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
                  <div className="form-group">
                    <strong>
                      <label htmlFor="user_address">
                        {this.state.edit_data.prop}
                      </label>
                    </strong>
                    <p>Current value</p>
                    <p>{this.state.edit_data.current_val}</p>
                    <input 
                      onChange={()=>this.setState({
                        ...edit_data, new_val:event.target.value

                      })}
                      value={this.state.edit_data.new_val} 
                      type="text" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    onClick={this.send_edit_data}
                    type="button"
                    className="btn btn-primary"
                  >
                    SEND
                  </button>
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
          </div>
          {/* <!-- edit data modal --> */}

          {/* <!-- approve user modale --> */}
          <div className="modal fade" id="approve_user_modal">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Approve a user to create a crowdsale
                  </h5>
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
                  <div className="form-group">
                    <label htmlFor="user_address">User Address</label>
                    <input
                      id="user_address_for_approval"
                      value={this.state.user_address_for_approval}
                      onChange={()=>this.setState({
                        user_address_for_approval:event.target.value

                      })}
                      type="text"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    onClick={this.approve_user}
                    data-dismiss="modal"
                    type="button"
                    className="btn btn-primary"
                  >
                    APPROVE USER
                  </button>
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
          </div>
          {/* <!-- approve user modale --> */}

          {/* <!-- view transaction --> */}
          <div className="modal fade" id="data_modal">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    transaction_type {this.state.single_data.transaction_type}
                  </h5>
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
                  <p>
                    <strong>Date:</strong>{" "}
                    <Formatted_Date_Time date={this.state.single_data.date}/>
                    .
                  </p>
                  <p>
                    <strong>Error:</strong> {this.state.single_data.error}.
                  </p>
                  <p>
                    <strong>Event_data:</strong>{" "}
                    {this.state.single_data.event_data}.
                  </p>
                  <p>
                    <strong>on_receipt:</strong>{" "}
                    {this.state.single_data.on_receipt}.
                  </p>
                  <p>
                    <strong>event_recieved:</strong>{" "}
                    {this.state.single_data.event_recieved}.
                  </p>
                  <p>
                    <strong>timestamp:</strong>{" "}
                    <Formatted_Date_Time date={this.state.single_data.timestamp} />.
                  </p>
                  <p>
                    <strong>transactionHash:</strong>
                    <small> {this.state.single_data.transactionHash}</small>.
                  </p>
                  <p>
                    <strong>value:</strong>{" "}
                    
                    <To_Eth  wei={this.state.single_data.value}/>
                     Ether.
                  </p>
                  <p>
                    <strong>blockNumber:</strong>{" "}
                    {this.state.single_data.blockNumber}.
                  </p>
                  <p>
                    <strong>gasUsed:</strong> {this.state.single_data.gasUsed}.
                  </p>
                  <p>
                    <strong>to:</strong> {this.state.single_data.to}.
                  </p>
                  <p>
                    <strong>cumulativeGasUsed:</strong>{" "}
                    {this.state.single_data.cumulativeGasUsed}.
                  </p>

                  {this.state.missing_transaction_event_data && (
                    <div className="container">
                      <strong>
                        {this.state.missing_transaction_event_data.event}
                      </strong>
                      {this.state.missing_transaction_event_data.returnValues.map(
                        (event_data, value) => (
                          <div className="list-group-item">
                            {isNaN(value) && (
                              <p>
                                <strong>{value}</strong>: {event_data}
                              </p>
                            )}
                          </div>
                        )
                      )}
                      <button
                        onClick={() =>
                          this.add_recovered_event_data(single_data)
                        }
                      >
                        ADD EVENT DATA
                      </button>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    onClick={() => this.get_event_data_for_tx_hash(single_data)}
                    type="button"
                    className="btn btn-primary"
                  >
                    Get Receipt
                  </button>
                  <button
                    onClick={() => this.get_transaction(single_data)}
                    type="button"
                    className="btn btn-primary"
                  >
                    Get Transaction
                  </button>
                  <button
                    onClick={() =>
                      this.SetState({ missing_transaction_event_data: null })
                    }
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- view transaction --> */}

          {/* <% include partials/two_factor_auth.ejs%> */}

          {/* <!-- end of vue document --> */}
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

export default connect(mapStateToProps)(withRouter(Admin));
