import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { withRouter } from "next/router";
import { retry } from "../utils/index.js";
import { To_Eth } from "../../components/small_ui_items.js";
import { Hover_To_Copy } from "../../components/small_ui_items.js";

class Wallet_Details extends React.Component {
  _is_mounted = false;
  constructor(props) {
    super(props);
    this.state = {
      balance: "",
      wallet_img: undefined
    };
    this.copy_address = this.copy_address.bind(this);
  }

  componentDidMount() {
    this._is_mounted = true;
    this.get_balance();
  }
  componentWillUnmount() {
    this._is_mounted = false;
  }
  get_balance() {
    if (this.state.fetching_balance) return;
    this.setState({ fetching_balance: true });
    retry("wallet_details_balance", 2000, async () => {
      // console.log(this.props);
      const { web3, selected_account, browser_wallet_unlocked } = this.props;
      const { type, address } = selected_account;
      console.log("WHATS THE BALANCE??");
      // console.log(this.props);
      if (!this.props.web3) return false;
      console.log(`DOES GET BALANCE EVER FINISH?`);

      let balance = await this.props.web3.eth.getBalance(address);
      console.log(balance);
      if (!this._is_mounted) return true;
      this.setState({ balance });
      this.setState({ fetching_balance: false });

      return true;
    });
  }

  copy_address() {
    console.log(this.props.selected_account.address);
  }

  get_wallet_type() {
    const { selected_account } = this.props;
    const { type } = selected_account;
    switch (type) {
      case "BROWSER":
        return "browser-wallet.png";
      case "METAMASK":
        return "metamask.png";
      default:
        return undefined;
    }
  }
  render() {
    // console.log(this.props);
    const { browser_wallet_unlocked, has_wallet, web3 } = this.props;

    return (
      <>
        {has_wallet && this.get_wallet_type() && (
          <ul onMouseEnter={() => this.get_balance()} className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                onClick={() => $(".wallet-dropdown-toggle").dropdown("toggle")}
                href="#"
                className="avatar nav-link wallet-dropdown-toggle dropdown-toggle"
                data-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img
                  src={`/static/img/${this.get_wallet_type()}`}
                  width="45"
                  className={`${
                    browser_wallet_unlocked ? `is_valid` : `is_invalid`
                  } 
                  img-fluid rounded`}
                />
              </a>
              <div className="dropdown-menu" id="user_profile_nav_dropdown">
                <div>
                  {this.state.fetching_balance && `Loading..`}
                  {!this.state.fetching_balance && (
                    <>
                      <To_Eth web3={web3} wei={this.state.balance} /> ETH
                    </>
                  )}
                </div>
                {!browser_wallet_unlocked && (
                  <span
                    onClick={() => $("#unlock_wallet_modal").modal("show")}
                    className="clickable badge badge-success"
                  >
                    Unlock Wallet
                  </span>
                )}
                <div className="row justify-content-center">
                  <div className="col-sm-12">
                    <Hover_To_Copy
                      value={this.props.selected_account.address}
                      el_id={"current_selected_address"}
                    />
                  </div>
                </div>
                {/* <div className="row justify-content-center">
                  <div className="col-sm-12">
                    <button className="btn btn-primary">
                      Buy Della Stable Tokens
                    </button>
                  </div>
                </div> */}

                {}
              </div>
            </li>
          </ul>
        )}
      </>
    );
  }
}

function mapStateToProps(state) {
  const { web3 } = state;
  return { ...web3 };
}

export default connect(mapStateToProps)(withRouter(Wallet_Details));
