import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { withRouter } from "next/router";

import Main_Layout from "../layouts/Main_Layout.js";
import { Campaign_Builder_Breadcrumbs } from "../components/small_ui_items.js";

class Pre_Qualify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { pathname } = this.props.router;

    return (
      <Main_Layout>
        <br />
        <br />
        <br />
        <div className="container" id="about">
          <div className="row">
            <div className="col-sm-12">
              <Campaign_Builder_Breadcrumbs pathname={pathname} />
            </div>

            <div className="col-sm-12">
              <h1>Know Your Customer, and .</h1>
              <h1>Anti-Money Laundering</h1>
              {/* <!-- <p>Possible a good spot to have users review all this while they are in the proccess of starting the shared equity agreement contract thing.</p> --> */}

              <div>
                <div className="post">
                  <b>What is KYC ?</b>
                  <br />
                  <br />
                  Know your customer (KYC) refers to due diligence activities
                  that financial institutions and other regulated companies must
                  perform to ascertain relevant information from their clients
                  for the purpose of doing business with them. The term is also
                  used to refer to the bank regulation which governs these
                  activities. Know Your Customer processes are also employed by
                  companies of all sizes for the purpose of ensuring their
                  proposed agents', consultants' or distributors' anti-bribery
                  compliance. Banks, insurers and export credit agencies are
                  increasingly demanding that customers provide detailed
                  anti-corruption due diligence information, to verify their
                  probity and integrity.
                  <br />
                  <br />
                  <br />
                  <b>Who has to enforce KYC ?</b>
                  <br />
                  <br />
                  Know your customer (KYC) falls under the responsability of
                  each financial institution and/or regulated company.
                  <br />
                  <br />
                  The regulations require these entities to adopt KYC
                  procedures. &nbsp;It assists them in knowing / understanding
                  the customers and their financial dealings better to monitor
                  their transactions for identification and prevention of
                  suspicious transactions.
                  <br />
                  <br />
                  <br />
                  <b>KYC Recommendations</b>
                  <br />
                  <br />
                  KYC controls typically include the following:
                  <br />
                  <br />- Collection and analysis of basic identity information
                  (referred to in US regulations and practice a "Customer
                  Identification Program" or CIP)
                  <br />- Name matching against lists of known parties (such as
                  "politically exposed person" or PEP)
                  <br />- Determination of the customer's risk in terms of
                  propensity to commit money laundering, terrorist finance, or
                  identity theft
                  <br />- Creation of an expectation of a customer's
                  transactional behavior
                  <br />- Monitoring of a customer's transactions against their
                  expected behaviour and recorded profile as well as that of the
                  customer's peers
                  <br />
                  <br />
                  <b>KYC Jurisdiction and Locality</b>
                  <br />
                  <br />
                  KYC regulations are local, and differ from country to country.
                  Jurisdiction is also, on a coutry to country basis.
                  <br />
                  <br />
                  To know more about your specific country, visit:
                  <a className="ul" href="http://kycmap.com">
                    http://kycmap.com
                  </a>
                  <br />
                  <br />
                  <br />
                  <b>KYC and Bitcoin Exchanges</b>
                  <br />
                  <br />
                  Stricter KYC policies:
                  <br />
                  <br />
                  Bitstamp&nbsp;&nbsp;&nbsp;
                  <a
                    className="ul"
                    href="https://www.bitstamp.net/privacy-policy/"
                  >
                    https://www.bitstamp.net/privacy-policy/
                  </a>
                  <br />
                  Bitfinex &nbsp; &nbsp; &nbsp;
                  <a className="ul" href="https://www.bitfinex.com/pages/tos">
                    https://www.bitfinex.com/pages/tos
                  </a>{" "}
                  &nbsp;or refer inquiries to
                  <a href="mailto:compliance@bitfinex.com">
                    compliance@bitfinex.com
                  </a>
                  <br />
                  BTCChina&nbsp;&nbsp;&nbsp;(only since new PBOC guidance, Dec
                  2013) (link?)
                  <br />
                  Cavirtex&nbsp;&nbsp;&nbsp;
                  <a className="ul" href="https://www.cavirtex.com/faq">
                    https://www.cavirtex.com/faq
                  </a>
                  <br />
                  Coinbase &nbsp; &nbsp;
                  <a className="ul" href="https://coinbase.com/legal/privacy">
                    https://coinbase.com/legal/privacy
                  </a>
                  <br />
                  Kraken &nbsp; &nbsp; &nbsp;
                  <a
                    className="ul"
                    href="https://www.kraken.com/legal/verification"
                  >
                    https://www.kraken.com/legal/verification
                  </a>{" "}
                  (their General Counsel, Constance Choi is a well known
                  specialist in the Regulatory and Compliance field)
                  <br />
                  Cryptonit&nbsp; &nbsp;
                  <a className="ul" href="https://cryptonit.net/regulations">
                    https://cryptonit.net/regulations
                  </a>
                  <br />
                  <br />
                  <br />
                  Loose or non-existant KYC policies:
                  <br />
                  <br />
                  BTC-e&nbsp;&nbsp;&nbsp;(??)
                  <br />
                  Crypsty&nbsp;&nbsp;&nbsp;(??)
                  <br />
                  LocalBitcoin (p2p based, limited KYC?)
                  <br />
                  <br />
                  <br />
                  <hr />
                  <br />
                  <b>What is AML?</b>
                  <br />
                  <br />
                  Standing for "Anti-money Laundering", it is a set of
                  procedures, laws or regulations designed to stop the practice
                  of generating income through illegal actions. In most cases
                  money launderers hide their actions through a series of steps
                  that make it look like money coming from illegal or unethical
                  sources was earned legitimately.
                  <br />
                  <br />
                  <b>Who has to enforce AML?</b>
                  <br />
                  <br />
                  In response to mounting concern over money laundering, the
                  Financial Action Task Force on Money Laundering (FATF) was
                  established by the G-7 Summit that was held in Paris in 1989.
                  <br />
                  <br />
                  The Task Force was given the responsibility of examining money
                  laundering techniques and trends, reviewing the action which
                  had already been taken at a national or international level,
                  and setting out the measures that still needed to be taken to
                  combat money laundering. In April 1990, less than one year
                  after its creation, the FATF issued a report containing a set
                  of Forty Recommendations, which provide a comprehensive plan
                  of action needed to fight against money laundering.
                  <br />
                  <br />
                  The FATF calls upon all countries to take the necessary steps
                  to bring their national systems for combating money laundering
                  and terrorism financing into compliance with the new FATF
                  Recommendations, and to effectively implement these measures.
                  <br />
                  <br />
                  Again, as in the case of KYC, financial institutions and/or
                  regulated companies are responsible for the implementation of
                  internal AML policies.
                  <br />
                  <br />
                  <b>AML Jurisdiction and Locality</b>
                  <br />
                  <br />
                  AML regulations are also local, and differ from country to
                  country. Some countries choose a top-down approach, inheriting
                  much of their AML policies from the FATF, while others go for
                  a bottom-up approach and then have to reconcile both policies.
                  Extreme countries where such reconciliation is impossible
                  (generally due to Government unwillingness) are excluded from
                  the FATF membership, with the corollary of increased
                  complications to access the international markets and
                  financing.
                  <br />
                  <br />
                  For a full list of FATF members,
                  visit:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <a
                    className="ul"
                    href="http://en.wikipedia.org/wiki/Financial_Action_Task_Force_on_Money_Laundering"
                  >
                    http://en.wikipedia.org/wiki/Financial_Action_Task_Force_on_Money_Laundering
                  </a>
                  <br />
                  <br />
                  <b>AML and Bitcoin Exchanges</b>
                  <br />
                  <br />
                  Currently in compliance:
                  <br />
                  <br />
                  Bitstamp&nbsp;&nbsp;&nbsp;
                  <a className="ul" href="https://www.bitstamp.net/aml-policy/">
                    https://www.bitstamp.net/aml-policy/
                  </a>
                  <br />
                  Bitfinex &nbsp; &nbsp; &nbsp;
                  <a className="ul" href="https://www.bitfinex.com/pages/tos">
                    https://www.bitfinex.com/pages/tos
                  </a>{" "}
                  or refer inquiries to
                  <a href="mailto:compliance@bitfinex.com">
                    compliance@bitfinex.com
                  </a>
                  <br />
                  Cavirtex&nbsp;&nbsp;&nbsp;
                  <a
                    className="ul"
                    href="https://www.cavirtex.com/why_virtex#proactively_working"
                  >
                    https://www.cavirtex.com/why_virtex#proactively_working
                  </a>
                  <br />
                  Coinbase &nbsp; &nbsp;
                  <a className="ul" href="https://coinbase.com/legal/privacy">
                    https://coinbase.com/legal/privacy
                  </a>
                  <br />
                  Kraken &nbsp; &nbsp; &nbsp;
                  <a className="ul" href="https://www.kraken.com/legal/aml">
                    https://www.kraken.com/legal/aml
                  </a>{" "}
                  (their General Counsel, Constance Choi is a well known
                  specialist in the Regulatory and Compliance field)
                  <br />
                  Cryptonit&nbsp; &nbsp;
                  <a className="ul" href="https://cryptonit.net/regulations">
                    https://cryptonit.net/regulations
                  </a>
                  <br />
                  <br />
                  Unknown status:
                  <br />
                  <br />
                  BTCChina&nbsp;&nbsp;&nbsp;(unclear since new PBOC guidance,
                  Dec 2013) (are they financial institutions?)
                  <br />
                  BTC-e&nbsp;&nbsp;&nbsp;
                  <a className="ul" href="https://btc-e.com/page/1">
                    https://btc-e.com/page/1
                  </a>
                  <br />
                  LocalBitcoin (p2p based, limited or no AML?)
                  <br />
                  <br />
                  <hr />
                  <br />
                  <b>WARNING:</b>
                  <br />
                  Assume that restrictions for any Bitcoin to National Currency
                  exchange may become more restrictive at any time in the
                  future. Many exchanges in the past have&nbsp;
                  <a
                    className="ul"
                    href="https://www.bitstamp.net/article/bitstamp-new-verification-requirements/"
                  >
                    restricted currency deposits or withdrawals proactively as
                    BitStamp has
                  </a>
                  , without any explicit order from a government agency to do so
                  at the time. Others like&nbsp;
                  <a
                    className="ul"
                    href="http://www.coindesk.com/btc-china-now-requires-id-accounts/"
                  >
                    BTCChina have in response to concerns made even the ability
                    to continue to login to their platform contingent on
                    supplying further identifying information
                  </a>
                  . In the past surprise changes to AML/KYC requirements have
                  lead users of exchanges to have their access to deposited
                  funds substantially delayed while complying with new
                  requirements or even lost access to their deposited funds
                  completely if they could not comply with the new requirements.
                  Changing AML/KYC exchange enacted AML/KYC requirements have
                  affected users of all major exchanges that handle both Bitcoin
                  and National currency. People who continue using such
                  exchanges should prepare for the contingency that their
                  exchange of choice will change their AML/KYC requirements in
                  the future.
                </div>
              </div>

              <br />
              <br />
              <br />
            </div>

            <div className="col-sm-12">
              <Campaign_Builder_Breadcrumbs pathname={pathname} />
            </div>
          </div>
          <br />
          <br />
          <br />
        </div>

        <nav
          className="navbar fixed-bottom navbar-light bg-faded"
          style={{
            background: "#fff",
            borderTop: "1px solid #eee"
          }}
        />
      </Main_Layout>
    );
  }
}

function mapStateToProps(state) {
  const { user, csrf, locals, crowdsales, two_factor_auth } = state;
  return { ...user, ...csrf, ...locals, ...crowdsales, ...two_factor_auth };
}

export default connect(mapStateToProps)(withRouter(Pre_Qualify));
