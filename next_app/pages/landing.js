// import {Logger, createConsoleProcessor} from '@grabrinc/isomorphic-logger';
// const logger = new Logger;
// logger.channel(createConsoleProcessor());
/* Get this logger thing figured out */
import React from "react";
import Link from "next/link";

import { connect } from "react-redux";
// import $ from "jquery";

import Landing_Page_Layout from "../layouts/Landing_Page_Layout.js";
import Landing_Page_Masthead from "../components/Landing_Page/Landing_Page_Masthead.js";
import Landing_Page_Nav from "../components/Landing_Page/Landing_Page_Nav.js";
class Landing_Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static getInitialProps({ reduxStore, isServer, pathname, query, ctx }) {
    console.log(`getInitialProps LANDING PAGE`)
    // logger.log(ctx)
    // logger.log('GET INITIAL PROPS INDEX.JS')
    // reduxStore.dispatch({ type: "FOO", payload: "foo" }); // component will be able to read from store's state when rendered
    return { custom: "custom" }; // you can pass some custom props to component from here
  }

  render() {
    return (
      <Landing_Page_Layout>
        <div className="Landing_Page_Container">

          <div className="Landing_Page_Inner_container">
 
            {/* Masthead */}
            <Landing_Page_Masthead />
            {/* Icons Grid */}
            <section className="features-icons bg-light text-center">
              <div className="container">
                <div className="row">
                  <div className="col-lg-4">
                    <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                      <div className="features-icons-icon d-flex">
                        <i className="icon-user-female m-auto text-primary" />
                      </div>
                      <h3>Homebuyer</h3>
                      <p className="lead mb-0">
                        Buy a home now, not in 30 days! Laser fast approvals,
                        funding and elimination of mortgage debt. Share
                        appreciation with the crowd.
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                      <div className="features-icons-icon d-flex">
                        <i className="icon-home m-auto text-primary" />
                      </div>
                      <h3>Homeowner</h3>
                      <p className="lead mb-0">
                        Sell all or a fraction of your home, stay where you are
                        or move on to your next home purchase.
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="features-icons-item mx-auto mb-0 mb-lg-3">
                      <div className="features-icons-icon d-flex">
                        <i className="icon-people m-auto text-primary" />
                      </div>
                      <h3>Real Estate Enthusiasts</h3>
                      <p className="lead mb-0">
                        Crowdfund and share in future appreciation. Our
                        marketplace creates liquidity in an otherwise illiquid
                        market.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* Drop in the search herr     */}
            {/* First four preview campaings */}
            {/*
    <div className="row mb-5">

 
      <div v-for="(crowdsale, count) in crowdsales" className="col-sm-6 col-lg-3 mb-4">



        <div className="card flex card_min_height relative">
          <div className="status_label" v-html="status_label(crowdsale)"></div>
          <a :href="`/campaign/${crowdsale._id}`" className="text-center">

            <div v-if="!crowdsale.main_crowdsale_img">
              <img className="img-fluid margin-top" src="/img/house-placeholder.jpg" />

            </div>
            <div v-else>
              <img className="img-fluid box_image_size" :src="`/crowdsale_photos/${crowdsale.main_crowdsale_img}`" />
            </div>
          </a>
          <div className="card-block" className="pb-1" style="position: relative; padding-bottom: 60px; min-height: 250px;">

            <h6>
              <a :href="`/campaign/${crowdsale._id}`">
                {{ crowdsale.formatted_address }}
              </a>
            </h6>
            <p className="text-muted">Created
              <strong>
                {{ moment(crowdsale.time_user_created).format('MM/DD/YY hh:mm:ss a') }}
              </strong>
              <p className="desc">
                <strong>Description</strong>
                {{ crowdsale.description.slice(0,150) }}
                <a className="trailing-text-link" :href='`/campaign/${crowdsale._id}`'>...</a>
              </p>
            </p>
            <div style="position: absolute; bottom: 10px; width: 86%; ">
              <div v-if="!crowdsale.is_deployed">
                <div className="progress">
                  <div className="progress-bar" role="progressbar" :style="`width:${(crowdsale.downpayment / crowdsale.dollar_goal * 100 )}%`"
                    :aria-valuenow="`${(crowdsale.downpayment / crowdsale.dollar_goal * 100 )}%`" aria-valuemin="0"
                    aria-valuemax="100"></div>
                </div>
                <p className="mb-1">
                  {{ (crowdsale.downpayment / crowdsale.dollar_goal * 100 ).toFixed(2)}}% Downpayment</p>
              </div>
              <div v-else>
                <div className="progress">
                  <div className="progress-bar" role="progressbar" :style="`width:${(crowdsale.weiRaised / crowdsale.goal * 100 )}%`"
                    :aria-valuenow="`${(crowdsale.weiRaised / crowdsale.goal * 100 )}%`" aria-valuemin="0"
                    aria-valuemax="100"></div>
                </div>
                <p className="mb-1">
                  {{ (crowdsale.weiRaised / crowdsale.goal * 100 ).toFixed(2)}}% Funded</p>
              </div>
    
    
    
    
    </div>



      </div>
          <div className="card-footer text-muted">
            <div className="row ">
              <div className="col-12">
              </div>
              <div className="col-12">
                <div className="row">
                  <div className="col-2 text-center">
                    {/* like button */}
            {/*
                     
                    <div v-if="user">
                      <transition name="slide-fade">
                        <span v-if=" user.liked_crowdsales.indexOf(`${crowdsale._id}`) == -1" v-on:click="like(`${crowdsale._id}`,  `${count}`)"
                          className="badge badge-pill badge-primary">
                          <i className="fa fa-thumbs-up"></i>
                        </span>
                        <span v-else className="badge badge-pill badge-info" style="margin-left: 5px;margin-top: 5px;">Liked</span>
                      </transition>

                    </div>
                  </div>
                  <div className="col-10 text-center">
                  
                    {/* <p className="mt-0 mb-0">Interested people</p> */}{" "}
            {/*
                    <strong>{{ crowdsale.user_likes.length }} Followers</strong>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      



      </div>

      <div className="col-12 justify_center">
        <a href="/explore" style="color: white; background: #0275d8;" className="btn btn-lg">View all</a>
      </div>

    </div>

*/}
            {/* Testimonials */}
            <div className="col-12 col-md-10 offset-md-1">
              <div className="row">
                <div className="col-sm-10 offset-sm-1">
                  <h3 className="display-6 text-center">How does it work?</h3>
                  <p className="text-center text-muted">
                    Tokenize and share appreciation in residential real estate.{" "}
                    <br />
                    First, you'll answer questions about your homeownership
                    status.
                    <br />
                    Next, QAltFi algorithms use that data to give you a cash
                    offer immediately, max within 24 hours.
                    <br />
                    Last, we buy your home!
                  </p>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-5  offset-1">
                  <p>
                    Homebuyer move in and share future appreciation. Home
                    seller, sell all or a fraction of your home, stay where you
                    are or move on to your next home purchase.
                  </p>
                </div>

                <div className="col-5  offset-1">
                  <p>
                    We help homebuyers, homeowners, and real estate enthusiasts
                    who are frustrated with current residential lending and real
                    estate liquidity options.
                  </p>
                </div>

                <div className="col-5  offset-1">
                  <p>
                    The Marketplace shares future appreciation by helping
                    eliminate traditional mortgage debt through tokenizing
                    fractional co-ownership. Our marketplace allows for
                    real-time token exchange and creates liquidity in an
                    otherwise illiquid market.
                  </p>
                </div>

                <div className="col-5  offset-1">
                  <p>
                    Ideal for anyone who believes in the American Dream. Fund a
                    homebuyer or homeowner and share in fractional ownership and
                    future appreciation. Create your own crowdfunding campaign,
                    share future appreciation and eliminate your monthly
                    mortgage obligation.
                    <a href="/about" className="nav-link">
                      Learn More
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <section className="testimonials text-center bg-light">
              <div className="container">
                <h2 className="mb-5">What people are saying...</h2>
                <div className="row">
                  <div className="col-lg-4">
                    <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                      <img
                        className="img-fluid rounded-circle mb-3"
                        src="/static/img/testimonials-1.jpg"
                        alt=""
                      />
                      <h5>Margaret E.</h5>
                      <p className="font-weight-light mb-0">
                        "I was tired of throwing money away at rent, I had a
                        down payment saved, I was priced out of the market.
                        Shared appreciation allowed me to purchase my home and
                        pay the same amount I was paying in rent! I own it and
                        share the growth with the crowd. Win-Win!"
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                      <img
                        className="img-fluid rounded-circle mb-3"
                        src="/static/img/testimonials-2.jpg"
                        alt=""
                      />
                      <h5>Fred S.</h5>
                      <p className="font-weight-light mb-0">
                        "I’m a shared economy worker, normal banks wouldn’t give
                        me the time of day. I now own my own home!"
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                      <img
                        className="img-fluid rounded-circle mb-3"
                        src="/static/img/testimonials-3.jpg"
                        alt=""
                      />
                      <h5>Sarah W.</h5>
                      <p className="font-weight-light mb-0">
                        "I have the ability to buy tokens in real estate all
                        over the U.S. When I started in real estate my money was
                        tied up for years at a time. I can sell tokens and buy
                        tokens in my real estate basket daily. Thanks so much
                        for creating this marketplace!"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* <div className="mt-5 pt-2 pb-2">
    <div className="container-fluid">
    <div className="row">
      <div className="col-12 col-md-10 offset-md-1">
        <div className=" ">
          <div className="card-block">
            <div className="row">
              <div className="col-sm-8">
                <h4 className="card-title">Our marketplace helps crowdfund amazing people</h4>
                <p className="card-text">Build your own crowdfunding shared appreciation campaign. Tokenize and share appreciation on the blockchain. Get started today.</p>
              </div>
              <div className="col-sm-4 text-center">
                <br />
                <a href="/start" className="btn btn-primary btn-lg">Start your fund
            <i className="fa fa-chevron-right" aria-hidden="true"></i>
          </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div> */}
            {/* Call to Action */}
            <section className="call-to-action text-white text-center">
              <div className="overlay" />
              <div className="container">
                <div className="row">
                  <div className="col-xl-9 mx-auto">
                    <h2 className="text_shadow_contrast">
                      Our marketplace helps crowdfund amazing people.
                    </h2>
                    <h2 className="text_shadow_contrast">
                      Ready to get started?
                    </h2>
                    <h2 className="mb-4 text_shadow_contrast">Sign up now!</h2>
                  </div>
                  <div className="col-md-10 col-lg-8 col-xl-7 ">
                    <div className="col-12 col-md-3">
                    <Link prefetch href="/signup">

<button
  type="submit"
  className="btn btn-block btn-lg btn-primary"
  data-toggle="modal"
  data-target=".signup-modal-lg"
>
  Sign up!
</button>
</Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* Footer */}
            <footer className="footer bg-light">
              <div className="container">
                <div className="row">
                  <div className="col-lg-6 h-100 text-center text-lg-left my-auto">
                    <ul className="list-inline mb-2">
                      <li className="list-inline-item">
                        <a href="about">About</a>
                      </li>
                      <li className="list-inline-item">&sdot;</li>
                      <li className="list-inline-item">
                        <a href="mailto:hello@qaltfi.com?Subject=Hello">
                          Contact
                        </a>
                      </li>
                      <li className="list-inline-item">&sdot;</li>
                      <li className="list-inline-item">
                        <a href="https://app.termly.io/document/privacy-policy/dbdd2432-b751-48e4-acae-269a16ccc786">
                          Terms of Use
                        </a>
                      </li>
                      <li className="list-inline-item">&sdot;</li>
                      <li className="list-inline-item">
                        <a href="https://app.termly.io/document/privacy-policy/dbdd2432-b751-48e4-acae-269a16ccc786">
                          Privacy Policy
                        </a>
                      </li>
                    </ul>
                    <p className="text-muted small mb-4 mb-lg-0">
                      &copy; QAltFi Inc. 2018. All Rights Reserved.
                    </p>
                  </div>
                  <div className="col-lg-6 h-100 text-center text-lg-right my-auto">
                    <ul className="list-inline mb-0">
                      <li className="list-inline-item mr-3">
                        <a href="https://www.facebook.com/qaltfi/">
                          <i className="fa fa-facebook fa-2x fa-fw" />
                        </a>
                      </li>
                      <li className="list-inline-item mr-3">
                        <a href="https://twitter.com/qaltfi">
                          <i className="fa fa-twitter fa-2x fa-fw" />
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a href="https://www.instagram.com/qaltfi/">
                          <i className="fa fa-instagram fa-2x fa-fw" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </footer>
            {/* <% include partials/login_modal.ejs%>
    <% include partials/register_modal.ejs%> */}
          </div>
          {/* Bootstrap core JavaScript */}
          <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js" />
          {/* <script src="/static/vendor/jquery/jquery.min.js" /> */}
          <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" />

          <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" />

          <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js" />
          {/* <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script> */}
          {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.4.1/js/swiper.min.js"></script> */}
          {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.2.4/vue.min.js" /> */}

          {/* 
      <script>

    const user = <%- JSON.stringify(user) %>
  const crowdsales = <%- JSON.stringify(crowdsales) %>
  const _csrf = <%- JSON.stringify(csrf_token_function()) %>
      mixpanel.track("Landing page hit");


    console.log(crowdsales)
    console.log('HOME VUE')
    console.log(user)

    var landing_vue = new Vue({
      el: '#landing_vue',
      data: {
        crowdsales: crowdsales,
        user: user,
        email: ''
        // likes:crowdsale.likes || 0,

      },
      methods: {
        has_closed(end) {
          if (!end) return false
          return Date.now() > end ? true : false
        },
        status_label(crowdsale) {
          var status_label = ''
          if (!crowdsale.is_deployed) {
            status_label += `<span className="badge badge-pill badge-warning">Not Deployed</span>`
          } else {
            if (crowdsale.goal_reached) {
              status_label += `<span className="badge badge-pill badge-success">Goal Reached</span>`
              if (crowdsale.isFinalized) {
                status_label += `<span className="badge badge-pill badge-secondary">Finalized</span>`
              } else {
                status_label += `<span className="badge badge-pill badge-danger">Not Finalized</span>`
              }
            } else {
              status_label += `<span className="badge badge-pill badge-warning">Goal Not Reached</span>`
            }
            if (crowdsale.is_deployed && !crowdsale.hasClosed && !this.has_closed(crowdsale.closingTime)) {
              status_label += `<span className="badge badge-pill badge-success">Active</span>`

            } else {
              status_label += `<span className="badge badge-pill badge-info">Ended</span>`
            }
            if (crowdsale.is_canceled) {
              status_label += `<span className="badge badge-pill badge-danger">Canceled</span>`
            }
          }
          return status_label

        },
        like(crowdsale_id, index) {
          // $(event.target).fadeOut(100)
          $.post('/like', {
            crowdsale_id: crowdsale_id, _csrf: _csrf
          }, (resp) => {
            // $(event.target).fadeIn(100)

            if (resp.resp) {
              this.user.liked_crowdsales = resp.resp.updated_user_likes
              this.crowdsales[index].user_likes = resp.resp.updated_crowdsale_user_likes
            } else if (resp.err) {
              toast("Error", "ERROR")
            }
          })
        },
        created: function () {
          console.log('Mounted')
        }
      }
    })
  </script>
 */}
        </div>
      </Landing_Page_Layout>
    );
  }
}
export default connect(state => state)(Landing_Page);
