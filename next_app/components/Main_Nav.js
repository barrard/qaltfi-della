import React from "react";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import Wallet_Details from '../components/Nav_Components/Wallet_Details.js'
import {
  Logout_btn,
  Profile_Nav_Dropdown,
  Start_Campaign_Nav_Button,
  Learn_More_Nav_Dropdown,
  Marketplace_Explore_Nav_Buttons,
  
} from "./small_ui_items.js";

import Link from "next/link";
class Main_Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.add_absolute_position_to_dropdown = this.add_absolute_position_to_dropdown.bind(
      this
    );
  }

  add_absolute_position_to_dropdown() {
    var dropdown = document.querySelector("#user_profile_nav_dropdown");
    console.log(dropdown);
    if (!dropdown) document.querySelector("#learn_more_nav_dropdown");

    console.log(dropdown);
    return;
    dropdown.classList.toggle("absolute");
  }
  render() {
    let { pathname } = this.props.router;

    return (
      <nav className="navbar navbar-toggleable-sm navbar-light card fixed-top">
        <div className="container top-nav">
          <button
            className="navbar-toggler navbar-toggler-right"
            type="button"
            data-toggle="collapse"
            data-target="#main_navigation"
            aria-controls="main_navigation"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <Link href="/landing" as="/">
            <a className="navbar-brand">
              <img
                className="nav_bar_logo"
                src="/static/img/della_logo.png"
                alt=""
              />
            </a>
          </Link>

          <div
            className="collapse navbar-collapse container"
            id="main_navigation"
          >
            <Marketplace_Explore_Nav_Buttons 
              pathname={pathname}
            />


            {this.props.user && Object.keys(this.props.user).length == 0 && (
              <>
                <Learn_More_Nav_Dropdown 
                pathname={pathname}
                />
              </>
            )}

            {this.props.user && Object.keys(this.props.user).length > 0 && (
              <>
                <Start_Campaign_Nav_Button
                  pathname={pathname}
                  user={this.props.user}
                />
                <Profile_Nav_Dropdown user={this.props.user} />

              <Wallet_Details 
              />
                </>
            )}
          </div>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  const { user, csrf, locals, web3 } = state;
  return { ...user, ...csrf, ...locals, web3 };
}

export default connect(mapStateToProps)(withRouter(Main_Nav));
