import React from "react";
import { connect } from "react-redux";

import { withRouter } from "next/router";
import Link from "next/link";

class Account_Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    console.log('ACCOUNT ENU')
    //TODO ake this better with rendering an array?
    // links=[{path:/account, name:'Account'}] etc....
    let { pathname } = this.props.router;

    return (
      <>
        <ul className="nav nav-tabs hidden-sm-down">
          <li className="nav-item">
            <Link prefetch href="/account" as="/account">
              <a
                className={
                  "nav-link " + (pathname === "/account" ? "active" : "")
                }
              >
                Account
              </a>
            </Link>
          </li>
          <li className="nav-item">
            <Link prefetch href="/account-profile" as="/account-profile">
              <a
                className={
                  "nav-link " +
                  (pathname === "/account-profile" ? "active" : "")
                }
              >
                Profile
              </a>
            </Link>
          </li>
          <li className="nav-item">
            <Link prefetch href="/account-balances" as="/account-balances">
              <a
                className={
                  "nav-link " +
                  (pathname === "/account-balances" ? "active" : "")
                }
              >
                Token Balance
              </a>
            </Link>
          </li>
          <li className="nav-item">
            <Link prefetch href="/account-wallet" as="/account-wallet">
              <a
                className={`
                ${!this.props.web3.has_wallet ? " must_create_wallet " : ""} 
                ${pathname === "/account-wallet" ? "active" : ""} nav-link`}

                
              >
                Wallet
              </a>
            </Link>
          </li>
          <li className="nav-item">
            <Link prefetch href="/account-notifications" as="/account-notifications">
              <a
                className={
                  "nav-link " +
                  (pathname === "/account-notifications" ? "active" : "")
                }
              >
                Notifications
              </a>
            </Link>
          </li>
        </ul>

        <div
          className="btn-group  btn-block  btn-group-justified hidden-md-up"
          role="group"
          aria-label="Button group with nested dropdown"
        >
          <div className="btn-group   btn-block" role="group">
            <button
              id="btnGroupDrop1"
              type="button"
              className="btn btn-secondary btn-block dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {this.props.title}
            </button>
            <div
              className="dropdown-menu"
              style={{ width: "100%" }}
              aria-labelledby="btnGroupDrop1"
            >
              <li className="nav-item">
                <Link prefetch href="/account" as="/account">
                  <a
                    className={
                      "nav-link " + (pathname === "/account" ? "active" : "")
                    }
                    href="/account"
                  >
                    Account
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link prefetch href="/account-profile" as="/account-profile">
                  <a
                    className={
                      "nav-link " +
                      (pathname === "/account-profile" ? "active" : "")
                    }
                  >
                    Profile
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link prefetch href="/account-balances" as="/account-balances">
                  <a
                    className={
                      "nav-link " +
                      (pathname === "/account-balances" ? "active" : "")
                    }
                  >
                    Token Balance
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link prefetch href="/account-wallet" as="/account-wallet">
                  <a
                    className={
                      !this.props.has_wallet ? " must_create_wallet " : ""
                    }
                    className={
                      "nav-link " +
                      (pathname === "/account-wallet" ? " active " : "")
                    }
                  >
                    Wallet
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link prefetch href="/account-notifications" as="/account-notifications">
                  <a
                    className={
                      "nav-link " +
                      (pathname === "/account-notifications" ? "active" : "")
                    }
                  >
                    Notifications
                  </a>
                </Link>
              </li>
            </div>
          </div>
        </div>
      </>
    );
  }
}
function mapStateToProps(state) {
  const { user, csrf, locals, web3 } = state;
  return { ...user, ...csrf, ...locals, web3 };
}
export default connect(mapStateToProps)(withRouter(Account_Menu));

