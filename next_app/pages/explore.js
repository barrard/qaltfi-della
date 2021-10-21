import React from "react";
import { connect } from "react-redux";
import Link from "next/link";

import { toastr } from "react-redux-toastr";
import { home_styles } from "../components/utils/index.js";
// import $ from "jquery";
import {
  Formatted_Date_Time,
  To_Number
} from "../components/small_ui_items.js";

import Main_Layout from "../layouts/Main_Layout.js";
import Like_Btn from "../components/user/Like_Btn.js";

class Explore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaign_status_radio_input: "",
      // user: user,
      all_crowdsales: [],
      sorted_crowdsales: {},
      crowdsales: [],
      home_style: "",
      arrange_by: "",
      home_styles,
      url_hash: "",
      arrange_by_types: [
        "Show All",
        "Most Likes",
        "Time started",
        "Goal",
        "Amount Raised",
        "Downpayment"
      ]
    };
    this.set_home_style = this.set_home_style.bind(this);
    this.set_arrange_by = this.set_arrange_by.bind(this);
    this.set_url_hash = this.set_url_hash.bind(this);
    this.search_crowdsales = this.search_crowdsales.bind(this);
  }

  static async getInitialProps(ctx) {
    const { reduxStore} = ctx
    const state = reduxStore.getState()
    
    const API_SERVER = state.locals.locals.API_SERVER
    // const API_SERVER = "http://localhost:3000";

    console.log({API_SERVER})
    // console.log(query);
    // log(`${API_SERVER}/crowdsale/get_campaign/${crowdsale_id}`)
    let all_campaigns = await fetch(`
    ${API_SERVER}/crowdsale/get_all_campaigns
		`);
    // console.log(all_campaigns);
    console.log("hi");
    let all_campaigns_data = await all_campaigns.json();
    // console.log(all_campaigns_data);
    // const campaign_owner_data = await fetch(`
    // ${API_SERVER}/user/get_campaign_owner/${campaign_view_data.user_id}
    // `);
    // console.log("campaign_owner_data");
    // const campaign_owner = await campaign_owner_data.json();

    // console.log({ all_campaigns_data });

    return { all_campaigns_data };
  }

  componentDidMount() {
    // const sorted_crowdsales = {}
    if (this.props.all_campaigns_data)
      this.props.all_campaigns_data.forEach((crowdsale, key) => {
        const style = crowdsale.zillow_data.home_style;
        if (this.state.sorted_crowdsales[style]) {
          /* push styles into each own array */
          this.state.sorted_crowdsales[style].push(crowdsale);
        } else {
          /* make empty array and push */
          this.state.sorted_crowdsales[style] = [];
          this.state.sorted_crowdsales[style].push(crowdsale);
        }
      });
    console.log("mounted");
    this.state.url_hash = window.location.hash;
    if (this.state.url_hash == "")
      this.state.url_hash = "#Single%20Family/Show%20All";
    window.location.hash = this.state.url_hash;
    var hash = window.location.hash.split("/");
    var style = hash[0];
    var type = hash[1];
    this.search_crowdsales(style, type);
  }

  has_closed(end) {
    if (!end) return false;
    //blockchain time is in seconds, not miliseconds, so change one by factor of 1000
    return Date.now() > end * 1000 ? true : false;
  }

  status_labels(crowdsale, key) {
    var status_label = [];

    if (!crowdsale.is_deployed) {
      status_label.push(
        <span key={`${key}-not-deployed`} className="badge badge-pill badge-warning">Not Deployed</span>
      );
    } else {
      if (crowdsale.goal_reached) {
        status_label.push(
          <span key={`${key}-goal-reached`} className="badge badge-pill badge-success">Goal Reached</span>
        );

        if (crowdsale.isFinalized) {
          status_label.push(
            <span key={`${key}-finalized`} className="badge badge-pill badge-secondary">Finalized</span>
          );
        } else {
          status_label.push(
            <span key={`${key}-not-finalized`} className="badge badge-pill badge-danger">Not Finalized</span>
          );
        }
      } else {
        status_label.push(
          <span key={`${key}-goal-not-reached`} className="badge badge-pill badge-warning">
            Goal Not Reached
          </span>
        );
      }

      if (
        crowdsale.is_deployed &&
        !crowdsale.hasClosed &&
        !this.has_closed(crowdsale.closingTime)
      ) {
        status_label.push(
          <span key={`${key}-active`} className="badge badge-pill badge-success">Active</span>
        );
      } else {
        status_label.push(
          <span key={`${key}-ended`} className="badge badge-pill badge-info">Ended</span>
        );
      }

      if (crowdsale.is_canceled) {
        status_label.push(
          <span key={`${key}-canceled`} className="badge badge-pill badge-danger">Canceled</span>
        );
      }
    }

    return status_label;
  }

  like(crowdsale_id, index) {
    $.post(
      "/like",
      {
        crowdsale_id: crowdsale_id,
        _csrf: _csrf
      },
      resp => {
        console.log(resp);
        if (resp.resp) {
          //TODO set up dispatchers
          this.props.user.liked_crowdsales = resp.resp.updated_user_likes;
          this.props.all_campaigns_data.user_likes =
            resp.resp.updated_crowdsale_user_likes;
          this.sorted_crowdsales[this.state.home_style][index].user_likes =
            resp.resp.updated_crowdsale_user_likes;
        } else if (resp.err) {
          toastr.error("Unable to Like this, try again later.....");
        }
      }
    );
  }

  set_home_style(style) {
    console.log("set this style " + style);
    this.set_url_hash(style);
  }

  set_arrange_by(type) {
    console.log(`set this type ${type}`);
    this.set_url_hash(null, type);
  }

  set_url_hash(new_style, new_type) {
    var hash = window.location.hash.split("/");
    var style = hash[0];
    var type = hash[1];
    if (new_style) style = new_style;
    if (new_type) type = new_type;
    hash = `${style}/${type}`;

    window.location.hash = hash;
    this.search_crowdsales(style, type);
  }

  search_crowdsales(style, type) {
    if (style.startsWith("#")) style = style.split("#")[1];
    this.state.home_style = decodeURI(style);
    this.state.arrange_by = decodeURI(type);
    console.log(`I shall search for ${style} by ${type}`);
    // $.get('/search_crowdsales/:style/:type')
    this.set_crowdsales(this.state.home_style, this.state.arrange_by);
  }

  set_crowdsales(style, type) {
    this.setState({
      crowdsales: []
    });

    const filtered = this.props.all_campaigns_data.filter(crowdsale => {
      // console.log(crowdsale);
      return crowdsale.zillow_data.home_style == style;
    });
    console.log(`homes of style ${style}`);
    // console.log(filtered);
    this.setState({
      crowdsales: [...this.state.crowdsales, ...filtered]
    });
  }

  render() {
    // console.log(this.props);
    return (
      <Main_Layout>
        <div className="container inner mt-5">
          <br />
          <br />
          <div className="row">
            <div className="col-sm-12 text-center">
              <h3>Fund campaigns you love.</h3>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-10 offset-md-1 text-center">
              <div className="row">
                <div className="col-sm-6">
                  {/* <!-- Large button groups (default and split) --> */}
                  <div className="btn-group  btn-block">
                    <button
                      className="btn btn-secondary btn-lg  btn-block dropdown-toggle"
                      type="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Home Style
                    </button>
                    <div className="dropdown-menu" style={{ width: "100%" }}>
                      {this.state.home_styles.map((style, key) => (
                        <button
                          key={key}
                          onClick={() => this.set_home_style(style)}
                          className={
                            `${
                              this.state.home_style == style ? " active " : " "
                            }` + " dropdown-item button center-text "
                          }
                          //  :href="`#${style}`"
                        >
                          {style}
                          {this.state.sorted_crowdsales[style] && (
                            <span className="float-right">
                              {this.state.sorted_crowdsales[style].length}
                            </span>
                          )}

                          {!this.state.sorted_crowdsales[style] && (
                            <span className="float-right">0</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  {/* <!-- Large button groups (default and split) --> */}
                  <div className="btn-group  btn-block">
                    <button
                      className="btn btn-secondary btn-lg  btn-block dropdown-toggle"
                      type="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Arrange by
                    </button>
                    <div className="dropdown-menu" style={{ width: "100%" }}>
                      {this.state.arrange_by_types.map((type, key) => (
                        <button
                          key={key}
                          onClick={() => this.set_arrange_by(type)}
                          className={`${
                            this.state.arrange_by == type ? " active " : " "
                          } dropdown-item button center-text`}
                          href="#"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {/*<div className="col-sm-4">
					 <!-- Large button groups (default and split) -->
					{/* <!-- <div className="btn-group  btn-block">
				<button className="btn btn-secondary btn-lg  btn-block dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					Trending
				</button>
				<div className="dropdown-menu" style={width: '100%'}>
				<a className="dropdown-item" href="#">Most popular</a>
					<a className="dropdown-item" href="#">Recently updated</a>
					<a className="dropdown-item" href="#">Featured</a>
				</div>
				</div> --> 
				 </div> */}
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="col-12 center-text">
            <strong>Home Style</strong>
            <h2>{this.state.home_style}</h2>
            <strong>Arrange by</strong>
            <h2>{this.state.arrange_by}</h2>
            <a
              href=""
              className="float-right"
              data-toggle="collapse"
              data-target="#filters"
            >
              TOGGLE FILTERS
            </a>
          </div>
          <br />
          <hr />
          <div id="filters" className="collapse id">
            <div className="row">
              <div className="col-md-4 col-sm-6">
                <h6>Percent funded</h6>
                <label className="custom-control custom-radio">
                  <input
                    id="radio1"
                    name="radio"
                    type="radio"
                    className="custom-control-input"
                    defaultChecked
                  />
                  <span className="custom-control-indicator" />
                  <span className="custom-control-description">All</span>
                </label>
                <br />
                <label className="custom-control custom-radio">
                  <input
                    id="radio1"
                    name="radio"
                    type="radio"
                    className="custom-control-input"
                  />
                  <span className="custom-control-indicator" />
                  <span className="custom-control-description">0 - 25%</span>
                </label>
                <br />
                <label className="custom-control custom-radio">
                  <input
                    id="radio1"
                    name="radio"
                    type="radio"
                    className="custom-control-input"
                  />
                  <span className="custom-control-indicator" />
                  <span className="custom-control-description">25 - 75%</span>
                </label>
                <br />
                <label className="custom-control custom-radio">
                  <input
                    id="radio1"
                    name="radio"
                    type="radio"
                    className="custom-control-input"
                  />
                  <span className="custom-control-indicator" />
                  <span className="custom-control-description">75 - 100+%</span>
                </label>
              </div>
              {/* <!-- <div className="col-md-4 col-sm-6">
				<h6>Goal type</h6>
				<label className="custom-control custom-radio">
  					<input id="radio1" name="radio_goal" type="radio" className="custom-control-input" defaultChecked />
  					<span className="custom-control-indicator"></span>
  					<span className="custom-control-description">All</span>
				</label><br />
								<label className="custom-control custom-radio">
  					<input id="radio1" name="radio_goal" type="radio" className="custom-control-input" />
  					<span className="custom-control-indicator"></span>
  					<span className="custom-control-description">Fixed</span>
				</label><br />
								<label className="custom-control custom-radio">
  					<input id="radio1" name="radio_goal" type="radio" className="custom-control-input" />
  					<span className="custom-control-indicator"></span>
  					<span className="custom-control-description">Flexible</span>
				</label><br />
			</div> --> */}
              <div className="col-md-4 col-sm-6">
                <h6>Location</h6>
                <label className="custom-control custom-radio">
                  <input
                    id="radio1"
                    name="radio_location"
                    type="radio"
                    className="custom-control-input"
                    defaultChecked
                  />
                  <span className="custom-control-indicator" />
                  <span className="custom-control-description">Everywhere</span>
                </label>
                <br />
                <label className="custom-control custom-radio">
                  <input
                    id="radio1"
                    name="radio_location"
                    type="radio"
                    className="custom-control-input"
                  />
                  <span className="custom-control-indicator" />
                  <span className="custom-control-description">Near me</span>
                </label>
                <br />
                <label className="custom-control custom-radio">
                  <input
                    id="radio1"
                    name="radio_location"
                    type="radio"
                    className="custom-control-input"
                  />
                  <span className="custom-control-indicator" />
                  <span className="custom-control-description">Flexible</span>
                </label>
                <br />
              </div>
              <div className="col-md-4 col-sm-6">
                <h6>Project status</h6>
                <label className="custom-control custom-radio">
                  <input
                    value={this.state.campaign_status_radio_input}
                    onChange={this.handle_status_filter}
                    value="All"
                    type="radio"
                    className="custom-control-input"
                    defaultChecked
                  />
                  <span className="custom-control-indicator" />
                  <span className="custom-control-description">All</span>
                </label>
                <br />
                <label className="custom-control custom-radio">
                  <input
                    value={this.state.campaign_status_radio_input}
                    onChange={this.handle_status_filter}
                    value="Active"
                    type="radio"
                    className="custom-control-input"
                  />
                  <span className="custom-control-indicator" />
                  <span className="custom-control-description">Active</span>
                </label>
                <br />

                <label className="custom-control custom-radio">
                  <input
                    value={this.state.campaign_status_radio_input}
                    onChange={this.handle_status_filter}
                    value="New/Initiated"
                    type="radio"
                    className="custom-control-input"
                  />
                  <span className="custom-control-indicator" />
                  <span className="custom-control-description">
                    New/Initiated
                  </span>
                </label>
                <br />
                <label className="custom-control custom-radio">
                  <input
                    value={this.state.campaign_status_radio_input}
                    onChange={this.handle_status_filter}
                    value="Goal Reached"
                    type="radio"
                    className="custom-control-input"
                  />
                  <span className="custom-control-indicator" />
                  <span className="custom-control-description">
                    Goal Reached
                  </span>
                </label>
                <br />
                <label className="custom-control custom-radio">
                  <input
                    value={this.state.campaign_status_radio_input}
                    onChange={this.handle_status_filter}
                    value="Cancled/Failed"
                    type="radio"
                    className="custom-control-input"
                  />
                  <span className="custom-control-indicator" />
                  <span className="custom-control-description">
                    Cancled/Failed
                  </span>
                </label>
                <br />
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="row mb-5">
            {this.props.all_campaigns_data &&
              !this.props.all_campaigns_data.length == 0 && (
                <div className="col-12">
                  <div className="">
                    <div className="card-body center-text">
                      <h5 className="card-title">{this.state.home_style}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        {this.state.arrange_by}
                      </h6>
                      <p className="card-text">
                        Sorry there are no campaigns of this type.
                      </p>
                      {/* <!-- <a href="#" className="card-link">Card link</a>
								<a href="#" className="card-link">Another link</a> --> */}
                    </div>
                  </div>
                </div>
              )}

            {this.props.all_campaigns_data &&
              this.props.all_campaigns_data.length > 0 && (
                <>
                  {this.props.all_campaigns_data.map((crowdsale, count) => (
                    <div key={count} className="col-sm-6 col-md-4 mb-4">
                      <div className="card flex">
                        <div className="status_label">
                          {this.status_labels(crowdsale, count)}
                        </div>

                        <Link
                          href={`
                  /campaign-view?campaign_id=${crowdsale._id}`}
                        >
                          <a className="text-center">
                            {!crowdsale.main_crowdsale_img && (
                              <div>
                                <img
                                  className="img-fluid margin-top"
                                  src="/static/img/house-placeholder.jpg"
                                />
                              </div>
                            )}
                            {crowdsale.main_crowdsale_img && (
                              <div>
                                <img
                                  className="img-fluid box_image_size"
                                  src={`/static/crowdsale_photos/${
                                    crowdsale.main_crowdsale_img
                                  }`}
                                />
                              </div>
                            )}
                          </a>
                        </Link>

                        <div
                          className="card-block"
                          className="pb-1"
                          style={{
                            position: "relative",
                            paddingBottom: "60px",
                            minHeight: "250px"
                          }}
                        >
                          <h6>
                            <a href={`/campaign/${crowdsale._id}`}>
                              {crowdsale.formatted_address}
                            </a>
                          </h6>
                          <p className="text-muted">
                            Created
                            <strong>
                              <Formatted_Date_Time
                                date={crowdsale.time_user_created}
                              />
                            </strong>
                          </p>

                          <p className="desc">
                            <strong>Description</strong>
                            {crowdsale.description.slice(0, 150)}
                            <a
                              className="trailing-text-link"
                              href={`/campaign/${crowdsale._id}`}
                            >
                              ...
                            </a>
                          </p>

                          <div
                            style={{
                              position: "absolute",
                              bottom: "10px",
                              width: "86%"
                            }}
                          >
                            {!crowdsale.is_deployed && (
                              <div>
                                <div className="progress">
                                  <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{
                                      width: `${(crowdsale.downpayment /
                                        crowdsale.dollar_goal) *
                                        100}%`
                                    }}
                                  />
                                </div>
                                <p className="mb-1">
                                  {(
                                    (crowdsale.downpayment /
                                      crowdsale.dollar_goal) *
                                    100
                                  ).toFixed(2)}
                                  % Downpayment
                                </p>
                              </div>
                            )}
                            {crowdsale.is_deployed && (
                              <div>
                                <div className="progress">
                                  <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{
                                      width: `${(crowdsale.stable_tokens_raised /
                                        crowdsale.dollar_goal) *
                                        100}%`
                                    }}
                                  />
                                </div>
                                <p className="mb-1">
                                  <To_Number
                                    num={
                                      (crowdsale.stable_tokens_raised /
                                        crowdsale.dollar_goal) *
                                      100
                                    }
                                  />
                                  % Funded
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="card-footer text-muted">
                          <div className="row ">
                            <div className="col-12" />
                            <div className="col-12">
                              <div className="row">
                                <div className="col-2 text-center">
                                  <Like_Btn
                                    campaign_id={
                                      crowdsale._id
                                    }
                                  />
                                </div>
                                <div className="col-10 text-center">
                                  <p className="mt-0 mb-0">
                                    Interested investors
                                  </p>
                                  <h6 className="mt-0 mb-0">
                                    <strong>
                                      {crowdsale.user_likes.length}
                                    </strong>
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
          </div>
          <div className="mt-5 pt-2 pb-2">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 col-md-10 offset-md-1">
                  <div className="card ">
                    <div className="card-block">
                      <div className="row">
                        <div className="col-sm-8">
                          <h4 className="card-title">
                            Our platform helps crowdfund amazing people
                          </h4>
                          <p className="card-text">
                            Build your own crowdfunding shared appreciation
                            campaign. Tokenize and share appreciation on the
                            blockchain. Get started today.
                          </p>
                        </div>
                        <div className="col-sm-4 text-center">
                          <br />
                          <a href="/start" className="btn btn-primary btn-lg">
                            Start your fund
                            <i
                              className="fa fa-chevron-right"
                              aria-hidden="true"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Main_Layout>
    );
  }
}

function mapStateToProps(state) {
  const { user, csrf, locals, crowdsales } = state;
  return { ...user, ...csrf, ...locals, ...crowdsales };
}

export default connect(mapStateToProps)(Explore);
