import React from "react";
import { connect } from "react-redux";
import {toastr} from 'react-redux-toastr'
import Router from 'next/router'
import {SET_USER} from '../redux/store';
import Signup_form from "../components/forms/Signup_Form.js";
import Landing_Page_Layout from "../layouts/Landing_Page_Layout.js";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      email: "",
      password: "",
      confirm_password:'',
      csrf:props.csrf
    };
    this.handle_signup = this.handle_signup.bind(this)
    this.handle_signup_resp = this.handle_signup_resp.bind(this)
    this.handle_input = this.handle_input.bind(this)
    
  }
  static async getInitialProps({req}) {

    if(req){
      console.log('req')

    }else{
      console.log('NO REQ OBJECT INSIDE GET INITIAL PROPS SIGNUP COMPNENT')
    }

    return {}
  }

  /* Get form input */
  handle_input(input, type) {
    this.setState({ [type]: input });
    // this.props.handle_input(input, type)

    // console.log({ input, type });
  }

  /* Handle FORM POST SIGNUP */
  async handle_signup(data) {
    //TODO start some spinner?
    try {
      // console.log(this.props)
      // console.log(this.state)
      const _csrf = this.props.csrf

      const {email, password, confirm_password} = data
      event.preventDefault();
      let resp = await fetch('/signup', {
        method:'POST',
        headers: {
          "Content-Type": "application/json",
          // "Content-Type": "application/x-www-form-urlencoded",
      },
        body:JSON.stringify({email, password, confirm_password, _csrf})
      })
      this.handle_signup_resp(resp);
    } catch (err) {
      //TOSO display error msg
      console.log('err')
      console.log(err)
    }

  }

  /* Make a handler for signup resp */
  /* Should we log in or show errors */
  async handle_signup_resp(resp){
    let json = await resp.json()
    if(json.errors &&json.errors.length){
      console.log('WE GOT ERRORS')
      json.errors.map(err => {
        toastr.error('Error Message', `${err.msg}`)
      })
      // this.setState({
      //   errors:json.errors.map(err => err)
      // })
    }else if(json.success && json.user){
      //TODO notify login
      //Push page?
      this.props.dispatch(SET_USER(json.user));

      toastr.success('New User', `You are being logged in as ${this.state.email}`)
      Router.push('/account-profile')

    }
  }


  render() {
    return (
      <Landing_Page_Layout className="container">

        <div className="">
          <br />

          <div className="row mt-5 text-center">
            <div className="col-md-6 offset-md-3">
              <br />
              <h1>Signup</h1>
              <p className="lead mb-1">
                Begin your real estate investment strategy
                <br />
                Share with friends!
              </p>

            </div>
          </div>

          <div className="row mt-5 text-center">
            <div className="col-md-10  offset-md-1">
              <Signup_form
                handle_input={this.handle_input}
                handle_signup={this.handle_signup}
                csrf={this.props.csrf} 
              />

              <div className="row mt-5">
                <div className="offset-sm-2 col-sm-8">
                  <h3 className="action">
                    Try us - <b className="embolden">it's free</b>.
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Landing_Page_Layout>
    );
  }
}
function mapStateToProps(state) {
  const { csrf } = state;
  return  {...csrf} ;
}
export default connect(mapStateToProps)(Signup);
