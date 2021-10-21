import React from "react";
import { connect } from "react-redux";

import Landing_Page_Layout from "../layouts/Landing_Page_Layout.js";
import Main_Footer from "../components/Main_Footer.js";

class How_It_Works extends React.Component {
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
                  <h1>How it works</h1>
                </div>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-lg-8 offset-lg-2">
                <div className="bs-component">
                <h4>Qualify in a matter of minutes</h4>
                  <p>
                     We leverage
                    artificial intelligence and machine learning to qualify you.
                    We call this Altruistic Proofs. We believe people are more
                    than their credit score. Altruistic Proofs use ethos,
                    pathos, logos to arrive at what we see as the QAltFi model.
                    We do sprinkle in a few old school metrics although we use
                    lighting fast technology for instant asset and income
                    verification. In most cases you will receive your Commitment
                    to Close immediately, 24 hours max. It’s advantageous to
                    start the process a month prior to familiarize yourself with
                    the process.
                  </p>
                  <h4>Skin in the game.</h4>
                  <p>
                     You will be required to
                    contribute to the purchase. Your down payment can be as
                    little as two month rent payment based on average rent in
                    your selected area. Need help with the down payment we’ve
                    got your back, contact us and we will get you dialed in.
                  </p>
                  <h4>Ready set let’s roll..</h4>
                  <p>
                     We will issue Commitment to
                    Close. This will allow you to purchase the home immediately
                    via an all cash offer, this eliminates any and all financing
                    addendums or hang-ups during the process. We purchase the
                    home with you no need for 3rd party agents or brokers.
                  </p>
                  <h4>Closing time.</h4>
                  <p>
                     Use our buying power to purchase
                    making an “all cash offer”. appreciation sharing is a simple
                    form of shared ownership. We buy the home together. You sign
                    a 3-year shared appreciation agreement with a 90-day right
                    to buy out our share. We each contribute to the purchase you
                    have Exclusive Right to Occupy the subject property.{" "}
                  </p>
                  <h4>Moving time!</h4>
                  <p>
                     You move in as soon as we record. You
                    maintain the upkeep, and are responsible for property taxes,
                    homeowner’s insurance and HOA fees, in the end the all
                    parties share the home appreciation.
                  </p>
                  <h4>
                      Tokenization of homeownership and shared appreciation
                    </h4>
                  <p>
                    
                    Upon the purchase of your home you will finalize your shared
                    tokenization. The crowd will participate up to your down
                    payment, creating your final shared token.
                  </p>

                  <br />
                  <hr/>
                  <h3 className="flex_center">Homebuyer Journey / Contract Life Cycle</h3>
                  <br />
                  <h4>Shared appreciation Process</h4>
                  <p>
                     James homebuyer is
                    purchasing 5150 Blue Sky street with 20% down contributing
                    to the purchase. Upon his pre-approval he creates a
                    Three-Year Term for a Shared Equity Crowdfund Campaign. The
                    crowd participates in James’s purchase contributing 80% to
                    the purchase.
                  </p>

                  <p>
                    The Campaign Contract assigned 20% future appreciation to
                    James and 80% to the crowd.
                  </p>

                  <p>
                    Since this is a purchase with no mortgage and a shared
                    appreciation ownership James will not have a monthly
                    mortgage payment. He will be responsible for upkeep,
                    property taxes, homeowner’s insurance and HOA fees.
                  </p>

                  <p>
                    At the end of the three-year term, James can become sole
                    owner of 5150 Blue Sky street by repaying the initial 80%
                    contribution plus 80% of the appreciation (based on
                    appraised value). If he opts to sell rather than refinancing
                    or initiating another crowd funded shared appreciation
                    campaign, the property will be sold, the initial crowd
                    contributions returned, and appreciation appreciation is
                    split 20% to James and 80% to the crowd.
                  </p>
                  <h4>
                    How does the Blockchain and smart contract handle this?
                  </h4>
                  <p>
                    Individuals purchase a token which rewards them the
                    possibility of the return of their initial contribution
                    along with a percent of shared ownership appreciation based
                    on the number of tokens they purchased. If after three years
                    the price goes down, they may not be able to get initial
                    purchase returned.
                  </p>

                  <p>
                    During the term the token holders can opt to sell on the
                    marketplace. Creating liquidity in a non-liquid market. The
                    marketplace facilitates this by allowing tokens holders to
                    offer tokens for sale at the Automated Valuation Model (AVM)
                    price, buyers can purchase tokens for a chosen price.
                  </p>

                  <p>
                    At the end of the term the initial percentage of
                    contribution plus percentage of the appreciation will be
                    delivered to the token holder on the date of re-funding.{" "}
                    <a href="faqs">Smart Contract FAQ</a>
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

export default connect(mapStateToProps)(How_It_Works);
