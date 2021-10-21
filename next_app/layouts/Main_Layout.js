import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { withRouter } from "next/router";
import Main_Head from "../components/Main_Head.js";
import Main_Nav from "../components/Main_Nav.js";
import Main_Footer from "../components/Main_Footer.js";

import { Fragment } from "react";
import { web3Connect } from "../redux/web3_reducers.js";
import { Spinner } from "../components/transitions/Loading_Spinner.js";
import Wallet from "../components/wallet/Wallet.js";
import {get_current_eth_price} from '../components/contracts/Eth_Price_Oracle.js'
class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    // console.log(this.props)


    if (!this.props.web3.isConnected) {
      const { BLOCKCHAIN_ENV, BLOCKCHAIN_NETWORK, INFURA_KEY } = this.props.locals;
      console.log({BLOCKCHAIN_ENV, BLOCKCHAIN_NETWORK, INFURA_KEY})


      this.props.dispatch(web3Connect({BLOCKCHAIN_ENV, BLOCKCHAIN_NETWORK, INFURA_KEY}));
    } else {
      console.log("Already connected to web3!!!");
      // const {web3}=this.props.web3
      // let eth_price = await get_current_eth_price(web3)
      // console.log({eth_price})
    }

  }
  render() {
    const {loading_message} = this.props.web3
    return (
      <div>
        {this.props.web3.loading && <Spinner msg={loading_message} />}
        <Main_Head />

        <Main_Nav />
        <Wallet />
        <Fragment>
          <main>{this.props.children}</main>
        </Fragment>
        <Main_Footer />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {  web3, locals } = state;
  return {  web3, ...locals };
}

export default connect(mapStateToProps)(withRouter(Layout));
