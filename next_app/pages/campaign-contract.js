import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { withRouter } from "next/router";

import { Campaign_Builder_Breadcrumbs } from "../components/small_ui_items.js";

import Main_Layout from "../layouts/Main_Layout.js";
class Contracts extends React.Component {
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
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <Campaign_Builder_Breadcrumbs pathname={pathname} />
            </div>

            <div className="col-sm-8 scroll-overflow">
              <h1>Not sure what to put here.</h1>
              <h3>Contract option details?</h3>
              <p>
                Could show surrounding realestate? or estimated return on
                investment? this is something the user does durring the setup of
                the crowdsale (campaign).
              </p>
              <p>
                <strong>User Contract Agreement?</strong>
              </p>

              <div className="form-group light-blue">
                <div className="row">
                  <div className="col-md-3">
                    <strong>contract #1</strong>
                    <br />
                    <p>10 people have used this contract</p>
                    <ul>
                      <li>
                        <a href="#"> list of feed back </a>
                      </li>
                      <li>
                        <a href="#"> Testimonials </a>
                      </li>
                      <li>
                        <a href="#"> from people who used this contract </a>
                      </li>
                    </ul>
                  </div>

                  <div className="col-md-9">
                    <div className="form-group row">
                      <label
                        htmlFor="example-text-input"
                        className="col-3 col-form-label"
                      >
                        Title
                      </label>
                      <div className="col-9">
                        <h3>
                          Section 1.10.33 of "de Finibus Bonorum et Malorum",
                          written by Cicero in 45 BC
                        </h3>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label
                        htmlFor="example-search-input"
                        className="col-3 col-form-label"
                      >
                        Pledge amount
                      </label>
                      <div className="col-9">
                        <p>
                          "Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua. Ut enim ad minim veniam, quis
                          nostrud exercitation ullamco laboris nisi ut aliquip
                          ex ea commodo consequat. Duis aute irure dolor in
                          reprehenderit in voluptate velit esse cillum dolore eu
                          fugiat nulla pariatur. Excepteur sint occaecat
                          cupidatat non proident, sunt in culpa qui officia
                          deserunt mollit anim id est laborum."
                        </p>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label
                        htmlFor="example-email-input"
                        className="col-3 col-form-label"
                      >
                        Description
                      </label>
                      <div className="col-9">
                        <p>
                          "Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua. Ut enim ad minim veniam, quis
                          nostrud exercitation ullamco laboris nisi ut aliquip
                          ex ea commodo consequat. Duis aute irure dolor in
                          reprehenderit in voluptate velit esse cillum dolore eu
                          fugiat nulla pariatur. Excepteur sint occaecat
                          cupidatat non proident, sunt in culpa qui officia
                          deserunt mollit anim id est laborum."
                        </p>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label
                        htmlFor="example-url-input"
                        className="col-3 col-form-label"
                      >
                        Estimated&nbsp;delivery
                      </label>
                      <div className="col-9" />
                    </div>
                    <div className="form-group row">
                      <label htmlFor="signature" className="col-3 col-form-label">
                        Signature
                      </label>
                      <div className="col-9">
                        <input
                          className="form-control"
                          type="text"
                          v-model="signature"
                          placeholder="Your Name"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="row">
                <div className="col-sm-10 offset-sm-2">
                  <br />
                  <strong>Preview something?</strong>
                  <hr />
                </div>
              </div>
            </div>

            <div className="col-sm-12">
              <Campaign_Builder_Breadcrumbs pathname={pathname} />
            </div>
          </div>
          <br />
          <br />
          <br />
        </div>
      </Main_Layout>
    );
  }
}

function mapStateToProps(state) {
  const { user, csrf, locals } = state;
  return { ...user, ...csrf, ...locals };
}

export default connect(mapStateToProps)(withRouter(Contracts));
