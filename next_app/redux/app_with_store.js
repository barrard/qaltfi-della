// import dotenv from 'dotenv';
import React from "react";
import Router from "next/router";
// import { actionTypes } from "../redux/store";
import { initializeStore, SET_USER, SET_CSRF, SET_LOCALS, SET_USER_CROWDSALE } from "./store";
import fetch from "isomorphic-fetch";
// dotenv.config();
const isServer = typeof window === "undefined";
const __NEXT_REDUX_STORE__ = "__NEXT_REDUX_STORE__";

function getOrCreateStore(initialState) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return initializeStore(initialState);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = initializeStore(initialState);
  }
  return window[__NEXT_REDUX_STORE__];
}

export default App => {
  return class AppWithRedux extends React.Component {
    static async getInitialProps(appContext) {
      function log(msg) {
        const isServer = appContext.ctx.req ? true : false;
        if(isServer) return logger.log(msg)
        else return console.log(msg)

        
      }
      // log("getInitialProps app_with_store");

      /* Component, router, ctx */
      // for (let k in appContext) {
      // log('getInitialProps appContect'.green)
      // log(k)
      // }
      /* err, req, res, pathname, query, aspPath */
      // for(let k in appContext.ctx){
      // log('appContext.ctx'.yellow)
      // log(k)
      // }
      // Get or Create the store with `undefined` as initialState
      // This allows you to set a custom default initialState
      const reduxStore = getOrCreateStore();

      // Provide the store to getInitialProps of pages
      appContext.ctx.reduxStore = reduxStore;

      /* On the server we have acces to the req, res, and we can see if user exists */
      if (appContext.ctx.req) {
        log(appContext.router.pathname);
        log('Guarns for sharns on the server')
        // log(appContext.ctx.res)
        /* Set the CSRF everytime, from the server */
        reduxStore.dispatch(
          SET_CSRF(appContext.ctx.res.locals.csrf_token_function())
        );
        /* Better yet, set all locals here */
        let locals = appContext.ctx.res.locals;
        log({ locals });
        reduxStore.dispatch(SET_LOCALS(locals));
        logger.log('fuck this')

        if (appContext.ctx.req.user) {
          // log("appContext.ctx.req.user");
          var user = appContext.ctx.req.user;
          // log(user);
          // log(appContext.ctx.req.session);
          /* For account-profile page */
          let has_email_token = appContext.ctx.req.session.email_token;
          let has_phone_token = appContext.ctx.req.session.phone_token;
          user.has_email_token = has_email_token ? true : false;
          user.has_phone_token = has_phone_token ? true : false;

          reduxStore.dispatch(SET_USER(user));
        }
      }
      /* This could run on server or client, we should always have access to pathane, and redux */
      if (
        appContext.ctx &&
        appContext.ctx.pathname &&
        appContext.ctx.reduxStore
      ) {
        let { pathname, res, reduxStore } = appContext.ctx;
        let state = reduxStore.getState();
        // log({state})
        // log(state.user)
        var { user } = state;
        if(user.user)  var { user } = user;

        // log(user.user)
        // log({user})
        // log({primary_email})
        // log("Check for user?");
        // log({ pathname });

        //TODO make thiss a function, and just pass in app,  path?
        if (user && Object.keys(user).length) {
          //if we have a logged in user, lets send them to the user-account
          // log("WE GOT A USER HERE");
          // log(user.user)
          // log("user");
          /* If a user is logged in, lets not confiuse them with un-necessary pages */
          if (
            pathname == "/login" ||
            pathname == "/signup" ||
            pathname == "/landing"
          ) {
            //routes to avoid when active user
            // log("YOU ARE ALREADY LOGGED INNN!!!!!//TODOO");
            if (res) {
              /* If were on the server side */
              res.writeHead(302, {
                Location: "/account-profile"
              });
              res.end();
            } else {
              /* If were on the client side */
              Router.push("/account-profile");
            }
          } else {
            /* got a user, on the correct page */
            /* Maybe also check for the user_crowdsale */
            let { crowdsale_id } = user;
            const {user_crowdsale} = state.crowdsales
            if (crowdsale_id && !Object.keys(user_crowdsale).length) {
              log("GET IT~~~~");
              log("GET IT~~~~");
              log("GET IT~~~~");
              log("GET IT~~~~");
              log("GET IT~~~~");
              log("GET IT~~~~");
              log(state.locals)
              const API_SERVER = process.env.API_SERVER
              // log(`${API_SERVER}/crowdsale/get_campaign/${crowdsale_id}`)
              log({API_SERVER})
              let crowdsale = await fetch(`
              ${API_SERVER}/crowdsale/get_campaign/${crowdsale_id}
              `)
              let user_crowdsale = await crowdsale.json()

              // log(user_crowdsale)
              /* SET_CROWDSALE in store!!! */
              reduxStore.dispatch(SET_USER_CROWDSALE(user_crowdsale));

         
            } else {
              /* user doesnt have a corwdsale to include in initial store */
            }
          }
        } else {
          log("NO USER HERE");
          // //paths a non-user can ONLY go?
          if (
            pathname != "/login" &&
            pathname != "/signup" &&
            pathname != "/landing" &&
            pathname != "/explore" &&
            pathname != "/about" &&
            pathname != "/faqs" &&
            pathname != "/how_it_works"
          ) {
            log({ pathname });
            if (res) {
              res.writeHead(302, {
                Location: "/login"
              });
              res.end();
            } else {
              Router.push("/login");
            }
            // return {}
          }
        }


      }
      // if(appContext.ctx.res)logger.log(reduxStore.getState())
      // else log(reduxStore.getState())

      let appProps = {};
      if (typeof App.getInitialProps === "function") {
        appProps = await App.getInitialProps(appContext);
      }

      return {
        ...appProps,
        initialReduxState: reduxStore.getState()
      };
    }

    componentDidMount(){
      console.log('APP WITH STORR DID MOUINT')
    }

    constructor(props) {
      super(props);
      this.reduxStore = getOrCreateStore(props.initialReduxState);
    }

    render() {
      return <App {...this.props} reduxStore={this.reduxStore} />;
    }
  };
};
