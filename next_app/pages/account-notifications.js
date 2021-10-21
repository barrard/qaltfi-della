import React from "react";
import { connect } from "react-redux";

import Account_Menu from "../components/user/Account_Menu.js";
import Main_Layout from "../layouts/Main_Layout.js";

class Account_Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Main_Layout>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
            <br />
            <div className='row hidden-sm-down'>
                <br />
              </div>
              <h1>Notifications</h1>
              <br />
              <br />
              <Account_Menu />

              <br />
              <br />

              <fieldset>
                <div className="row" />
                <hr />
              </fieldset>
            </div>
          </div>
        </div>
      </Main_Layout>
    );
  }
}

function mapStateToProps(state) {
  const { user, csrf, locals } = state;
  return { ...user, ...csrf, ...locals };
}

export default connect(mapStateToProps)(Account_Notifications);
