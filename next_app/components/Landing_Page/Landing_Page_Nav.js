import React from "react";
import Link from "next/link";
import { withRouter } from "next/router";
import {
  // Logout_btn,
  // Profile_Nav_Dropdown,
  // Start_Campaign_Nav_Button,
  Learn_More_Nav_Dropdown,
  Marketplace_Explore_Nav_Buttons
} from "../small_ui_items.js";

class Landing_Page_Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

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
          <Link href="landing" as="/">
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
          <Marketplace_Explore_Nav_Buttons />

            <Learn_More_Nav_Dropdown 
                pathname={pathname}
                />


          </div>
        </div>
      </nav>
    );
  }
}
export default withRouter(Landing_Page_Nav);
