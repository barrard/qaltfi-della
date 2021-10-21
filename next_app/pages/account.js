import React from "react";
import { connect } from "react-redux";
import Cleave from "cleave.js";
import {toastr} from 'react-redux-toastr'
import NumberFormat from 'react-number-format';
import $ from "jquery";


import Main_Layout from "../layouts/Main_Layout.js";
import Account_Menu from "../components/user/Account_Menu.js";

// new Cleave('#phone_input', {
//   phone: true,
//   phoneRegionCode: 'us'
// });

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // user: user,
      is_invalid: "is_invalid",
      is_valid: "is_valid",
      form_control: "form-control",
      list_of_tasks: [],
      phone_token_value: "",
      // sending_phone_verification: false,

    };
    this.edit_email = this.edit_email.bind(this)
    this.Handle_phone_token_input = this.Handle_phone_token_input.bind(this)
    this.edit_phone_number = this.edit_phone_number.bind(this)
    this.handle_NumberFormat =this.handle_NumberFormat.bind(this)
    this.send_verify_text_to_phone = this.send_verify_text_to_phone.bind(this)
    this.resend_email_verification = this.resend_email_verification.bind(this)
  }

  // const PHONE_TOKEN_LENGTH= <%= PHONE_TOKEN_LENGTH %>//is on locals
  // const has_phone_token= <%= has_phone_token %>//TODO
  // const has_email_token= <%= has_email_token %>//TODO get initial props

  componentDidMount() {

    // if (!this.props.user.email_verifed)
    //   this.state.list_of_tasks.push("Verify your Email address");
    // if (!this.props.user.phone_verified)
    //   this.state.list_of_tasks.push("Verify your Phone Number");
  }

  edit_email() {
    //TODO dispatch event? save to DB?
    this.handle_input(false, "UPDATE_USER_PROFILE", 'email_verifed')
    this.handle_input(false, "UPDATE_USER_PROFILE", 'has_email_token')

  }
  edit_phone_number() {
    //TODO does this need to be DB saved?
    this.handle_input(false, "UPDATE_USER_PROFILE", 'phone_verified')
    this.handle_input(false, "UPDATE_USER_PROFILE", 'has_phone_token')
    this.handle_input(false, "UPDATE_USER_PROFILE", 'sending_phone_verification')
    let token_length = event.target.value.length;
    if (token_length == this.props.locals.PHONE_TOKEN_LENGTH) {
      console.log("Go time");
      //sending Verify Token
      this.handle_input(true, "UPDATE_USER_PROFILE", 'sending_phone_verification')
      $.post(
        "/verify_phone_token",
        {
          token: event.target.value,
          _csrf:this.props.csrf
        },
        resp => {
          if (resp.resp) {
            toastr.success(`Profile Saved`, "You phone number is verified")
            this.handle_input(true, "UPDATE_USER_PROFILE", 'phone_verified')
            this.handle_input(false, "UPDATE_USER_PROFILE", 'has_phone_token')
          } else if (resp.err) {
            this.handle_input(false, "UPDATE_USER_PROFILE", 'sending_phone_verification')

            toastr.error(`Verification failed`, "Phone verification code incorrect.")
          }
        }
      );
    }
  }

  resend_email_verification(event) {
    const target = event.target
    disable_ui(target);
    toastr.info(`Sending...`, `Resending verification email to ${this.props.user.primary_email}.`)
    this.handle_input(true, "UPDATE_USER_PROFILE", 'has_email_token')

    $.post(
      "/resend_email_verification",
      {
        _csrf:this.props.csrf,
        email: this.props.user.primary_email
      },
      resp => {
        enable_ui(target);
        if (resp.resp) {
          this.handle_input('', "UPDATE_USER_PROFILE", 'phone_verification_code_input')
          this.handle_input(true, "UPDATE_USER_PROFILE", 'has_email_token')

          let email = resp.resp.email;
          toastr.success(
            `Done sending email verification, please check your inbox at ${email}`
          );
        } else if (resp.err) {
          let email = resp.err.email;
          toastr.error(`Error sending email verification to ${email}`);
          toastr.info(`${resp.err.err}`);
          this.handle_input(false, "UPDATE_USER_PROFILE", 'has_email_token')
        }
      }
    );
  }

  send_verify_text_to_phone() {
    try {
      //should be same as this.props.user.primary_phone
      let phone = this.props.user.primary_phone
      const is_number = isNaN(phone);
      console.log(is_number);
      if (phone.length == 11) {
        phone = phone.split("");
        phone.shift();
        phone = phone.join("");
      }
      if (phone.length != 10 || is_number) throw "Phone number is invalid";
      $.post(
        "/send_phone_verification",
        {
          _csrf:this.props.csrf, phone
        },
        resp => {
          console.log(resp);
          if (resp.resp) {
            let phone = resp.resp.phone;
            toastr.success(
              `Done sending phone verification,
             please check your phone for a text message sent to ${print_phone_number(
               phone
             )}`
            );
            this.has_phone_token = true;
          } else if (resp.err) {
            let { phone, message } = resp.err;
            toastr.error(
              `${message} - Provided number ${print_phone_number(phone)}`
            );
          }
        }
      );
    } catch (err) {
      console.log("err");
      console.log(err);
      toastr.error(`${err}`);
    }
  }

  handle_input(value, type, key) {
    console.log({value, type, key})
    this.props.dispatch({type, value, key});

    // this.setState({ [type]: input });
    // this.props.handle_input(input, type)

    // console.log({ input, type });
  }

  Handle_phone_token_input(event){
    /* dispatch to store */
    this.handle_input(event.target.value, "UPDATE_USER_PROFILE", 'phone_token_value')
    this.token_length(event)
  }

  handle_NumberFormat({value}){
    this.handle_input(value, "UPDATE_USER_PROFILE", 'primary_phone')
  }

  render() {
    return (
      <Main_Layout>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <br />
            <div className='row hidden-sm-down'>
                <br />
              </div>
            <h1>Account</h1>
            <br />
            <br />
            <Account_Menu has_wallet={this.props.user.has_wallet} />
            <br />
            <br />

            <form>
              <fieldset>
                <div className="row">
                  <div className="col-sm-6 col-lg-5 ">
                    <div className="form-group row">
                      <label htmlFor="email" className="col-3 col-md-2 col-form-label">
                        Email
                      </label>
                      <div className="col-9 col-md-10">
                        <input
                          disabled={
                            this.props.user.email_verifed ||
                            this.props.user.has_email_token
                          }
                          className={
                            this.props.user.email_verifed
                              ? "is_valid"
                              : "is_invalid" + ` form_control`
                          }
                          type="email"
                          value={this.props.user.primary_email}
                          onChange={()=> this.handle_input(event.target.value, "UPDATE_USER_PROFILE", 'primary_email')}
                        />

                        {/* <transition name="slide-fade"> */}

                        {(this.props.user.email_verifed ||
                          this.props.user.has_email_token) && (
                          <button
                            onClick={this.edit_email}
                            className="btn btn-sm btn-primary"
                            type="button"
                          >
                            EDIT
                          </button>
                        )}
                        {/* </transition> */}
{/* STATE PLEASE VERIFY EMAIL*/}
                        {/* <transition name="fade"> */}
                        {!this.props.user.email_verifed &&
                        <span >
                          <p className="form-text text-muted">
                            Please verify email.
                          </p>
                          <p className="form-text text-muted">
                            Didn't recieve a verification email?
                            <button
                              onClick={this.resend_email_verification}
                              type="button"
                              className="btn btn-sm btn-outline-warning"
                            >
                              RESEND
                              {/* <!-- <span className="form-text text-muted">RESEND</span> --> */}
                            </button>
                          </p>
                        </span>}
{/* STATE EMAIL IS VERIFIED */}
                        {this.props.user.email_verifed &&
                        <span>
                          <p className="form-text text-muted">
                            {" "}
                            Email address is verified
                          </p>
                        </span>}
                        {/* </transition> */}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label htmlFor="phone" className="col-3 col-md-2 col-form-label">
                        Phone Number
                      </label>
                      <div className="col-9 col-md-10">
                        {/* <!-- CANT V-MODEL HERE BECASUE USING THE PHONE NUMBER LIBRARY USE 'phone_input CLASS' --> */}
                        <NumberFormat 
                          type="tel"
                          format="+1 (###) ###-####" 
                          mask="_"
                          onValueChange={this.handle_NumberFormat}
                          value={this.props.user.primary_phone || 
                                 this.props.user.phone_numbers[0] ||  ''}
                          disabled={
                            this.props.user.phone_verified ||
                            this.props.user.has_phone_token
                          }
                          className={
                            this.props.user.phone_verified
                              ? "is_valid"
                              : "is_invalid" + " form_control"
                          }
                          
                          />

                        {/* <transition name="slide-fade"> */}
                        {(this.props.user.phone_verified || this.props.user.has_phone_token) &&
                        <button
                          
                          key="edit_email"
                          onClick={this.edit_phone_number}
                          className="btn btn-sm btn-primary"
                          type="button"
                        >
                          EDIT
                        </button>}
                        
                        {/* </transition> */}

                        {/* <!-- IF NOT VERIFIED --> */}
                        {/* <transition name="slide-fade"> */}
                        {!this.props.user.phone_verified &&
                        <span
                          
                          key="phone_not_verified"
                        >
                          <p className="form-text text-muted">
                            Please verify your phone number.
                          </p>
                          {/* </transition> */}

                          {/* <transition name="slide-fade"> */}

                          {(!this.props.user.has_phone_token && !this.props.user.phone_verified) &&
                          <div
                            
                            key="no_phone_token"
                          >
                            <button
                              onClick={this.send_verify_text_to_phone}
                              className="btn btn-sm btn-outline-warning"
                              type="button"
                            >
                              VERIFY
                            </button>
                          </div>}
                          {/* </transition> */}

                          {/* <transition name="slide-fade"> */}

                          {this.props.user.has_phone_token && 
                            <div key="has_phone_token">
                              <input
                                disabled={this.props.user.sending_phone_verification}
                                type="number"
                                id="phone_verification_code_input"
                                value={this.props.user.phone_token_value}
                                onChange={this.Handle_phone_token_input}
                              />

                              <p className="form-text text-muted">
                                Didn't recieve a verification text?
                                <button
                                  onClick={this.send_verify_text_to_phone}
                                  type="button"
                                  className="btn btn-sm btn-outline-warning"
                                >
                                  RESEND
                                  {/* <!-- <span className="form-text text-muted">RESEND</span> --> */}
                                </button>
                              </p>
                            </div>
                          }

                          {/* </transition> */}
                        </span>}


                        {/* <transition name="fade"> */}
                        {/* <!-- IF VERIFIED --> */}
                        {this.props.user.phone_verified && (
                          <span key="phone_verified">
                            <p className="form-text text-muted">
                              {" "}
                              Phone is verified
                            </p>
                          </span>
                        )}
                        {/* </transition> */}
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-5 justify_center" />
                </div>
                <hr />
              </fieldset>
            </form>
          </div>
          <div className="col-sm-6 ">
            <h3>Login History</h3>
            <p>
              This feature provides information about your account usage and
              other related changes. If you see any suspicious activity, change
              your password immediately.
            </p>
            <p>No security events found.</p>
          </div>
        </div>
      </div>
      </Main_Layout>

    );
  }
}

function mapStateToProps(state) {
  const { user, csrf, locals } = state;
  return { ...user, ...csrf, ...locals };
}
export default connect(mapStateToProps)(Account);

