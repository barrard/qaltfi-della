import React from "react";
import {connect} from 'react-redux'
import {toastr} from 'react-redux-toastr'
import Router from 'next/router'
// import {store}
import Login_Form from "../components/forms/Login_Form.js";
import Landing_Page_Layout from "../layouts/Landing_Page_Layout.js";
import {actionTypes} from '../redux/store'

const { SET_USER} = actionTypes; 

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      email: "",
      password: "",
      confirm_password:'',
      _csrf:props.csrf    
    };
    this.handle_login = this.handle_login.bind(this)
    this.handle_login_resp = this.handle_login_resp.bind(this)
    this.handle_input = this.handle_input.bind(this)
  }
  
  static async getInitialProps(app) {
    console.log('LOGIN PAGE GET INITIAL PROPS????')
    // console.log(app)

    return {}
  }


  
    /* Get form input */
    handle_input(input, type) {
      this.setState({ [type]: input });
      // this.props.handle_input(input, type)
  
      // console.log({ input, type });
    }
  
    /* Handle FORM POST SIGNUP */
    async handle_login(data) {
      //TODO start some spinner?
      try {
        // console.log(this.props)
        // console.log(this.state)
        const _csrf = this.props.csrf
        console.log({_csrf})
  
        const {email, password} = data
        event.preventDefault();
        let resp = await fetch('/login', {
          method:'POST',
          headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
          body:JSON.stringify({email, password, _csrf})
        })
        this.handle_login_resp(resp);
      } catch (err) {
        //TOSO display error msg
        console.log('err')
        console.log(err)
      }
  
    }

      /* Make a handler for signup resp */
  /* Should we log in or show errors */
  async handle_login_resp(resp){
    try {
      console.log('handle_login_resp')
      console.log(resp)
      let json = await resp.json()
      console.log(json)
  
      if(json.errors &&json.errors.length){
        console.log('WE GOT ERRORS')
        json.errors.map(err => {
          toastr.error('Error Message', `${err.msg}`)
        })
        this.setState({
          errors:json.errors.map(err => err)
        })
      }else if(json.success){
        // console.log(json)
        //TODO notify login
        //Push page?
        //Set timeout?  make moce transition//TODO
        toastr.success(`Welcome back ${this.state.email}`, `You are being logged in as ${this.state.email}`)
        Router.push('/account-profile')
        this.props.dispatch({
          type:SET_USER,
          user:json.user    
      })
  
  
      }
    } catch (err) {
      //try text() on resp
      console.log('err')
      console.log(err)
    }
  }
  

  render() {
    // console.log(this.props)
    return (
      <Landing_Page_Layout className="container">
        <br />
        <br />
        <div className="row mt-5 text-center">
          <div className="col-md-6 offset-md-3">
            <h1>Login</h1>
            <p className="lead mb-1">
              Start sharing appreciation
              <br />
            </p>
            <br />
          </div>
        </div>

        <div className="row mt-5 justify_center">
          <div className="col-md-6 ">
            <Login_Form 
              csrf={this.props.csrf}
              handle_input={this.handle_input}
              handle_login={this.handle_login}
            />

            <div className="row">
              <div className="offset-sm-2 col-sm-8 text-center">
                <a className="btn btn-link" href="password-reset">
                  Forgot Your Password?
                </a>
              </div>
            </div>
          </div>
        </div>
      </Landing_Page_Layout>
    );
  }
}
function mapStateToProps (state) {
  const { csrf } = state
  return {...csrf}
}
export default connect(mapStateToProps)(Login)

