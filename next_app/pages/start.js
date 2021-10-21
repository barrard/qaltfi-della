import React from "react";
import { connect } from "react-redux";
import {Formatted_Date_Time} from "../components/small_ui_items.js"
import Router from 'next/router'
import { withRouter } from 'next/router'

import {toastr} from 'react-redux-toastr'
import Link from 'next/link'
import Main_Layout from "../layouts/Main_Layout.js";
import $ from "jquery";

class Start_Campaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dollar_goal: "",
      downpayment: ""
    };
    this.init_new_crowdsale = this.init_new_crowdsale.bind(this)
  }

  static async getInitialProps(app){

    /* The user cannot have already started a crowdsale, check crowdsale_init */

    // if(!this.props.user)
    return {}
  }

  componentDidMount(){

    var {user} =  this.props;//Hacky shit from bad store setup?
    // var {user} = user;
    let {crowdsale_init} = user
    if(crowdsale_init)Router.push('/campaign-property')
    
    // console.log(user)

  }

  parsed_dollar_goal() {
    var val = parseInt(this.state.dollar_goal).toLocaleString("en-US");
    if (val == "NaN") val = 0;
    return val;
  }
  parsed_downpayment() {
    var val = parseInt(this.state.downpayment).toLocaleString("en-US");
    if (val == "NaN") val = 0;

    return val;
  }

  init_new_crowdsale() {
    start_spinner("Creating New Campaign");

    $.post(
      "/crowdsale/init_crowdsale",
      {
        dollar_goal: this.state.dollar_goal,
        downpayment: this.state.downpayment,
        _csrf: this.props.csrf
      },
      resp => {
        if (resp.err) {
          stop_spinner();

          console.log("errors init crowdsale");
          resp.err.forEach(err => {
            toastr.error(err.msg)
          });
        } else if (resp.user_crowdsale && resp.updated_user) {
          
          const {user_crowdsale, updated_user} = resp
          console.log("success init crowdsale");

          toastr.success('Initialized Crowdsale')
          toastr.success('Redirecting to Edit Campaign Page')
          this.props.dispatch({
            type: 'SET_USER_CROWDSALE', user_crowdsale
          })
          this.props.dispatch({
            type:"SET_USER", user:{...updated_user}
          })
          
          setTimeout(() => {
            this.props.router.push('/campaign-property');
          }, 2000);
          this.props.router.prefetch('/campaign-property')
        }
      }
    );
  }

  render() {
    return (
      <Main_Layout>
          <div className="row justify-content-center container-fluid">
            <div className="col-sm-8 ">
            <br />
            <div className='row hidden-sm-down'>
            <br />{/* needed for styleing on smaller screen */}
            <br />
              </div>
              <h1>Start Your Shared Equity Campaign</h1>
              <br />
              <br />
              <div className='row justify-content-center'>
                <div className='col-md-8'>
                <div className="form-group">
                <label htmlFor="dollar_goal">
                  How much money would you like to raise?: <br />
                  ${this.parsed_dollar_goal()}.00
                </label>
                <div className="input-group mb-3">

<div className="input-group-prepend">
<span className="input-group-text" id="basic-addon1">$</span>
</div>
                <input
                  type="number"
                  className="form-control form-control-lg"
                  value={this.state.dollar_goal}
                  onChange={(event) =>
                    this.setState({ dollar_goal: event.target.value })
                  }
                  aria-describedby="dollar goal"
                  placeholder="$500,000"
                />
                </div>
                {/* <p>
                  Current dollar value of Etherum:
                  <span>${this.props.locals.CURRENT_ETH_PRICE}</span> @
                  <span id="eth_price_timestamp">
                    <Formatted_Date_Time />
                  </span>
                </p> */}
              </div>
                </div>
              </div>
              <div className='row justify-content-center'>
                <div className='col-md-8'>
                <div className="form-group">
                <label htmlFor="downpayment">
                  How much do you have for a downpayment <br />
                   ${this.parsed_downpayment()}.00
                </label>
                <div className="input-group mb-3">

                <div className="input-group-prepend">
    <span className="input-group-text" id="basic-addon1">$</span>
  </div>
                <input
                  type="number"
                  className="form-control form-control-lg"
                  value={this.state.downpayment}
                  onChange={(event) =>
                    this.setState({ downpayment: event.target.value })
                  }
                  aria-describedby="downpayment"
                  placeholder="$10,000 "
                />
                </div>
                <p id="passwordHelpBlock" className="form-text text-muted" />
              </div>
                </div>
              </div>

              <button onClick={this.init_new_crowdsale} className="btn btn-primary">
                Create a crowdsale
              </button>
            </div>
          </div>
          <br />
          <br />
          <br />
      </Main_Layout>
    );
  }
}

function mapStateToProps(state) {
  const { user, csrf, locals } = state;
  return { ...user, ...csrf, ...locals };
}

export default connect(mapStateToProps)(withRouter(Start_Campaign));
