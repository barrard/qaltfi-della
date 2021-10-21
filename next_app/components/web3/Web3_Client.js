// import Web3 from "web3";

// import React from "react";
// import { connect } from "react-redux";
// import { toastr } from "react-redux-toastr";
// import { withRouter } from "next/router";

// class Web3_Client extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       loading: "Loading.....",
//       web3: null,
//       metamask: false
//     };
//   }

//   componentDidMount() {
//     const { PRODUCTION, BLOCKCHAIN_NETWORK, INFURA_KEY } = this.props.locals;
//     console.log(`COMPONENT WEB# CLIENT DID MOUNT!!`);
//     const provider_url = PRODUCTION
//       ? `https://${BLOCKCHAIN_NETWORK}.infura.io/v3/${INFURA_KEY}`
//       : "ws://localhost:8545";
//       console.log(provider_url)
//       console.log(provider_url)
//       console.log(provider_url)
//       console.log(provider_url)
//       console.log(provider_url)
//       console.log(provider_url)
//       console.log(provider_url)
//     /* Initialize web3 */
//     while (!this.state.web3) {
//       this.state.web3 = new Web3(
//         new Web3.providers.HttpProvider(Web3.givenProvider || provider_url)
//       );
//     }
//     console.log(this.state);

//     console.log(window.ethereum ? true : false);

//     if (this.props.user) {
//       this.determin_provider();
//     } else {
//       console.log("WTF??????");
//       return;
//     }
//   }

//   determin_provider() {
//     console.log("Does user have wallet?");
//     // console.log(this.props.user.has_wallet)
//     if (typeof this.state.web3 !== "undefined") {
//       console.log("this.state.web3 is enabled");
//       if (this.state.web3.currentProvider.host === "metamask") {
//         console.log("MetaMask is active");
//         this.setState({
//           metamask: true
//         });
//       } else {
//         // console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2`)

//         // console.log(this.state.web3.givenProvider)
//         // console.log(this.state.web3.utils)
//         // console.log(this.state.web3.currentProvider)
//         // console.log(this.state.web3._currentProvider)
//         // console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2`)
//         console.log("MetaMask is not available");
//         this.setState({
//           metamask: false
//         });
//       }
//     } else {
//       console.log("this.state.web3 is not found");
//       this.setState({
//         web3: false
//       });
//     }
//     console.log(this.state.web3);
//     const { web3 } = this.state;
//     web3.eth.get;
//     // console.log(this.state.web3.currentProvider)
//     // console.log(this.state.web3.version)

//     // let walet = this.state.web3.eth.accounts.wallet.create(2, '123456789')
//     // console.log(walet)
//     // console.log(this.state.web3.eth.accounts.wallet)
//     // let wall = this.state.web3.eth.accounts.wallet.load('password')
//     // console.log(wall)
//     return;
//   }
//   render() {
//     return <></>;
//   }
// }

// function mapStateToProps(state) {
//   const { user, csrf, locals, crowdsales, two_factor_auth } = state;
//   return { ...user, ...csrf, ...locals, ...crowdsales, ...two_factor_auth };
// }

// export default connect(mapStateToProps)(withRouter(Web3_Client));
