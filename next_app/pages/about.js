import React from 'react';
import { connect } from 'react-redux';


import Landing_Page_Layout from '../layouts/Landing_Page_Layout.js';
import Main_Footer from "../components/Main_Footer.js";

class About extends React.Component{
  constructor(props) {
    super(props);
    this.state={}
  }
  render(){
    return(
      <Landing_Page_Layout>

<div className="container-fluid">
  <div className="bs-docs-section">
    <div className="row mt-5 mb-5">
      <div className="col-lg-12">
        <div className="page-header text-center mb-5">
          <h1>About us</h1>
          <h2 className="text-muted">We believe everyone's dream should come true</h2>
        </div>
      </div>
    </div>


    <div className="row mt-5">
      <div className="col-lg-8 offset-lg-2">
        <div className="bs-component">
          <h3>What we believe in</h3>
          <p>We believe everyone deserves a home and the realization of the American dream! Frustrated with esoteric lending options and the lack of make sense lending we grew tired of watching the opportunity of homeownership slip away from good people.</p>
          <p>We help homebuyers, homeowners and all around good people (funders) who are dissatisfied with current residential lending and real estate liquidity options. Our Blockchain smart contracts allow homebuyers and homeowners to tokenize and share
            appreciation in their home. Unlike a traditional mortgage from conventional mortgage lender tokenization provides homeowners and funders with flexibility, liquidity and allow funders to share in appreciation growth.</p><br/>

          <h3>Who are We?</h3>

          <div className="row mt-5 mb-5">

            <div className="col-sm-3 text-center">
              <img src="https://d1qb2nb5cznatu.cloudfront.net/users/58422-large?1518820718" className="rounded-circle mb-4" />
              <h4 className="text-center">Will</h4>
              <p>CEO/founder</p>
            </div>

            <div className="col-sm-3 text-center">
              <img src="https://d1qb2nb5cznatu.cloudfront.net/users/7515205-large?1524157874" className="rounded-circle mb-4" />
              <h4 className="text-center">Dave</h4>
              <p>CIO/founder</p>
            </div>

            <div className="col-sm-3 text-center">
              <img src="https://d1qb2nb5cznatu.cloudfront.net/users/173308-large?1455080985" className="rounded-circle mb-4" />
              <h4 className="text-center">Travis</h4>
              <p>CTO/founder</p>
            </div>



          </div>
        </div>

      </div>
    </div>


  </div>

</div>


      


      <Main_Footer/>
      </Landing_Page_Layout>
    )
  }
}


function mapStateToProps(state) {
  const { user, csrf, locals } = state;
  return { ...user, ...csrf, ...locals };
}


export default connect(mapStateToProps)(About);