import React from "react";
import { connect } from "react-redux";

import Landing_Page_Layout from "../layouts/Landing_Page_Layout.js";
import Main_Footer from "../components/Main_Footer.js";

class FAQS extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Landing_Page_Layout>
        <div className="container-fluid">
          <div className="bs-docs-section">
            <div className="row mt-5 mb-5">
              <div className="col-lg-12">
                <div className="page-header text-center mb-5">
                  <h1>Frequently asked questions (FAQ)</h1>
                </div>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-lg-8 offset-lg-2">
                <div className="bs-component">
                  <p>
                    <h4>
                      No mortgage payment? How does that work? What do I pay?
                    </h4>
                    This is an Appreciation-Share Agreement (ASA) with no
                    mortgage and a shared appreciation ownership you will not
                    have a monthly mortgage payment. Homeowner has Exclusive
                    Right to Occupy the subject property and will be responsible
                    for maintenance upkeep, property taxes, homeowner’s
                    insurance and HOA fees. We will establish a side escrow
                    contract you will deposit a small monthly maintenance upkeep
                    fee (avg $25). This is your reserve to help you if you need
                    to fix something. The full amount is returned to you once
                    your contract is up.
                  </p>
                  <p>
                    <h4>When I purchase a token what happens?</h4>On the day of
                    the crowdfund when you buy a token your funds will be held
                    in the smart contract vault. At the end of crowdfund or once
                    the goal is met the owner will acknowledge the successful
                    crowdsale and finalize. Contributes will receive a token
                    that they can trade, sell or keep for later.
                  </p>
                  <p>
                    <h4>What if the crowdfund is not successful?</h4>The smart
                    contract will acknowledge the unsuccessful crowdfunding, the
                    vault will release the funds back to the original
                    contributors.
                  </p>
                  <p>
                    <h4>Who manages the crowdsale and the vault?</h4>The smart
                    contracts act as autonomous agents on the blockchain.
                  </p>
                  <p>
                    <h4>Can I renovate and fix-up the home?</h4>Minor repairs at
                    homeowners own expense. Larger scale greater than $1,000
                    require review per the smart contract. Capital Contribution
                    Home Improvements & Repairs: Must be approved and are not
                    typically shared by the crowd. It will not increase the
                    homeowner’s equity share.
                  </p>
                  <p>
                    <h4>Maintenance and Improvements</h4>Basic Necessary
                    Standard of Living Yearly Maintenance $1,000 can be
                    conducted by the homeowner “Self-help”. Require Review: A
                    home inspection by licensed professional every 18 months
                    will determine the condition of the home and required
                    maintenance if needed.{" "}
                    <ul>
                      <li>
                        Yearly Maintenance - Yearly Maintenance can be conducted
                        by the homeowner “Self-help”. All other work > $1,000
                        must be completed by a licensed contractor.
                      </li>
                      <li>
                        Natural Disaster - if Insurance does not cover 80% a
                        forced sale is triggered.
                      </li>
                      <li>Renovation - requires full approval</li>
                      <li>
                        <a href="login">Creat your campaign and learn more</a>
                      </li>
                    </ul>
                  </p>
                  <p>
                    <h4>Full Contract Terms</h4> To learn the full ins and outs
                    and to review the smart contract please log in. Check out
                    our <a href="#">Smart Contract Primer</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Main_Footer />
      </Landing_Page_Layout>
    );
  }
}

function mapStateToProps(state) {
  const { user, csrf, locals } = state;
  return { ...user, ...csrf, ...locals };
}

export default connect(mapStateToProps)(FAQS);
