import React from "react";
import { connect } from "react-redux";
import fetch from "isomorphic-fetch";
import { toastr } from "react-redux-toastr";

import Main_Layout from "../layouts/Main_Layout.js";
import Account_Menu from "../components/user/Account_Menu.js";
import { Profile_Img } from "../components/user/Profile_Img.js";
import { SET_FIRST_NAME, SET_PROFILE_IMGS } from "../redux/store.js";

class Account_Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      save_state: true
      // user: {},
      // user_address: {},
      // address_printout: "",
      // firstname: "",
      // lastname: "",
      // biography: "",
      // user_youtube_link: ""
    };

    this.handle_input = this.handle_input.bind(this);
    this.handle_profile_img_upload = this.handle_profile_img_upload.bind(this);
    this.set_main_img = this.set_main_img.bind(this);
  }
  componentDidMount() {
    /* Init google maps and other things */
    this.init_on_load();
  }
  /* Component, router, ctx */
  static async getInitialProps(appContext) {
    // err, req, res, pathname, query, aspPath
    //asPath, pathname, query, reduxStore
    // console.log(appContext)
    let { reduxStore } = appContext;
    console.log("ACCOUNT PROFILE");
    let state = reduxStore.getState();
    // console.log({state})

    return {};
  }

  handle_input(value, type, key) {
    console.log({ value, type, key });
    this.props.dispatch({ type, value, key });

    // this.setState({ [type]: input });
    // this.props.handle_input(input, type)

    // console.log({ input, type });
  }

  init_on_load() {
    var map_marker = {};
    if (
      this.props.user.current_address.lat &&
      this.props.user.current_address.lng
    ) {
      map_marker = {
        lat: this.props.user.current_address.lat,
        lng: this.props.user.current_address.lng
      };
    } else {
      map_marker = {
        lat: 37.7875445,
        lng: -116.44492709999997
      };
    }

    if (typeof google !== "undefined") {
      //make sure google is loaded
      var map = new google.maps.Map(
        document.getElementById("account_profile_map"),
        {
          zoom: 16,
          center: map_marker,
          disableDefaultUI: true
        }
      );
      var map1_marker = new google.maps.Marker({
        position: map_marker,
        map: map
        // icon: place.icon
        // icon: iconBase + 'icon23.png'
      });
      const input = document.getElementById("address_search");
      const autocomplete_options = {
        types: ["address"]
      };
      var autocomplete = new google.maps.places.Autocomplete(
        input,
        autocomplete_options
      );
      autocomplete.addListener("place_changed", () => {
        // console.log('account_profile_map')
        var place = autocomplete.getPlace();
        this.get_place(place, map);
      });
    }

    console.log("Account profiles");
    const all_inputs = document.querySelectorAll("input");
    const all_selects = document.querySelectorAll("select");
    const all_textarea = document.querySelectorAll("textarea");

    [...all_inputs, ...all_textarea, ...all_selects].forEach(input => {
      input.addEventListener("input", () => {
        console.log("input");
        this.state.save_state = false;
        console.log(this.state.save_state);
      });
      input.addEventListener("blur", () => {
        console.log("blur");
        if (!this.state.save_state) {
          console.log("SAVE ME");
          console.log(this.state.save_state);
          this.auto_save();
        }

        if (this.state.save_state) {
          console.log(this.state.save_state);
          console.log("DONT SAVE ME!!!");
        }
      });
    });

    // console.log(this.state.save_state);
    // console.log(all_inputs);
    // console.log(all_selects);
  }

  /* METHODS */

  handle_profile_img_upload(e) {
    var input = e.target;
    handle_img_upload(
      this.props.csrf,
      input,
      "/upload_profile_imgs",
      photo_array => {
        console.log(photo_array);
        if (photo_array.hasOwnProperty("img_processing")) {
          return console.log(`img is in process ${photo_array.img_procesing}`);
        }
        if (
          this.props.user.profile_imgs.length == 0 &&
          Array.isArray(photo_array)
        ) {
          console.log(
            `User needs a main photo, so this is it ${photo_array[0]}`
          );
          this.set_main_img(photo_array[0]);
        }

        //TODO dispatch user action to update profile_imgs
        console.log("DISPATCH THE PHOTO ARRAY!!");
        console.log(photo_array);
        this.props.dispatch(SET_PROFILE_IMGS(photo_array));
      }
    );
  }

  auto_save() {
    this.update_user_data();
    this.state.save_state = true;
  }

  get_place(place, map) {
    console.log(place);
    let lng = place.geometry.location.lng();
    let lat = place.geometry.location.lat();
    console.log({ lat, lng });
    let map_marker = {
      lat: lat,
      lng: lng
    };
    this.parse_address(place);

    map.panTo(new google.maps.LatLng(lat, lng));
    map.setZoom(15);
    // var iconBase = 'https://maps.google.com/mapfiles/kml/pal3/';

    var map1_marker = new google.maps.Marker({
      position: map_marker,
      map: map,
      icon: place.icon
      // icon: iconBase + 'icon23.png'
    });
  }

  parse_address(place) {
    console.log(place);
    // var street_number, route, locality,region,postal_code,country
    place.address_components.forEach(addr_compont => {
      let types = addr_compont.types;
      console.log(this.props.user.current_address);
      let { current_address } = this.props.user;
      console.log(current_address);
      if (types.indexOf("street_number") != -1) {
        this.props.user.current_address.street_number = addr_compont.short_name;
      }
      if (types.indexOf("route") != -1) {
        this.props.user.current_address.route = addr_compont.short_name;
      }
      if (types.indexOf("locality") != -1) {
        this.props.user.current_address.locality = addr_compont.short_name;
      }
      if (types.indexOf("administrative_area_level_1") != -1) {
        this.props.user.current_address.region = addr_compont.short_name;
      }
      if (types.indexOf("postal_code") != -1) {
        this.props.user.current_address.postal_code = addr_compont.short_name;
      }
      if (types.indexOf("country") != -1) {
        this.props.user.current_address.country = addr_compont.short_name;
      }
    });
    // this.address_printout = ``
    this.state.address_printout = `${place.formatted_address}`;
    // this.props.user.current_address = (place.address_components)
    this.props.user.current_address = {
      ...this.props.user.current_address,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      formatted_address: place.formatted_address
    };
    this.state.save_state = false;

    this.auto_save();
  }

  set_main_img(img) {
    console.log(img)
    this.props.user.main_profile_img = img;
    this.handle_input(img, "UPDATE_USER_PROFILE", "main_profile_img");
    this.state.save_state = false;

    this.auto_save();
  }

  async update_user_data() {
    let resp = await fetch("/update_user_profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        _csrf: this.props.csrf,
        firstname: this.props.user.firstname,
        lastname: this.props.user.lastname,
        main_profile_img: this.props.user.main_profile_img,
        biography: this.props.user.biography,
        current_address: this.props.user.current_address,
        user_youtube_link: this.props.user.user_youtube_link
      })
    });

    let json = await resp.json();
    if (json.updated_user) toastr.success(`Profile Saved`);

    console.log(json.updated_user);

    //   toast('Profile Saved!!!', "DONE")
    // }else{
    //   new Toast(resp.err, Toast.ERROR, 3000)
    // }
  }

  render() {
    // console.log('this.props')

    console.log("account profile render() this.props");

    return (
      <Main_Layout>
        <div className="container-fluid" id="account_profile_vue">
          <div className="row">
            <div className="col-sm-12">
              <br />
              <div className="row hidden-sm-down">
                <br />
              </div>
              <h1>Profile</h1>
              <br />
              <br />
              <Account_Menu has_wallet={this.props.user.has_wallet} />
              <br />
              <br />

              {/* <form> */}
              <fieldset>
                <div className="row">
                  <div className="col-sm-5 ">
                    <div className="form-group">
                      <label htmlFor="firstname">First Name</label>
                      <div>
                        <input
                          onChange={() =>
                            this.handle_input(
                              event.target.value,
                              "UPDATE_USER_PROFILE",
                              "firstname"
                            )
                          }
                          className="form-control"
                          type="text"
                          value={this.props.user.firstname}
                          name="firstname"
                        />
                        <p className="form-text text-muted">
                          Your name is displayed on your profile.
                        </p>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastname">Last Name</label>
                      <div>
                        <input
                          onChange={() =>
                            this.handle_input(
                              event.target.value,
                              "UPDATE_USER_PROFILE",
                              "lastname"
                            )
                          }
                          className="form-control"
                          type="text"
                          value={this.props.user.lastname}
                          name="lastname"
                        />
                        <p className="form-text text-muted">
                          Your name is displayed on your profile.
                        </p>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="main_profile_img">
                        Main Profile image
                      </label>
                      <input
                        onChange={this.handle_profile_img_upload}
                        type="file"
                        value=""
                        multiple
                      />
                      <Profile_Img user={this.props.user} />

                      <div className="progress">
                        <div className="progress-bar" role="progressbar" />
                      </div>
                    </div>
                    {this.props.user.profile_imgs.length > 0 && (
                      <div className="form-group">
                        <label htmlFor="set main profile pic">
                          Set main profile pic
                        </label>

                        <div className="flex overflow-x">
                          {/* Container to display imgs */}
                          {this.props.user.profile_imgs.map((img, key) => (
                            <div key={key}>
                              {/* Need this div wrapper for styyylees */}
                              <img
                                className="thumbnail"
                                onClick={() => this.set_main_img(img)}
                                src={`/static/user_profile_imgs/${img}`}
                                alt="user profile image"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="form-group">
                      <label htmlFor="biography">Biography</label>
                      <div>
                        <textarea
                          className="form-control"
                          name="biography"
                          rows="3"
                          onChange={() =>
                            this.handle_input(
                              event.target.value,
                              "UPDATE_USER_PROFILE",
                              "biography"
                            )
                          }
                          value={this.props.user.biography}
                        >
                          {/* {this.props.user.biography} */}
                        </textarea>
                        <p className="form-text text-muted">
                          We suggest a short bio. If it's 300 characters or less
                          it'll look great on your profile.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-5 offset-sm-1 float-md-right">
                    <div className="form-group">
                      <label htmlFor="example-url-input">
                        YouTube&nbsp;URL
                      </label>
                      <div>
                        <input
                          className="form-control"
                          type="url"
                          value={this.props.user.user_youtube_link}
                          onChange={() =>
                            this.handle_input(
                              event.target.value,
                              "UPDATE_USER_PROFILE",
                              "user_youtube_link"
                            )
                          }
                          name="user_youtube_link"
                        />
                        <p className="form-text text-muted">
                          Add a YouTube video to show more about who you are.
                        </p>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="example-url-input">
                        Your Current Address
                      </label>

                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            <i
                              style={{ fontSize: "30px" }}
                              className="fa fa-search pr-1"
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                        <input
                          value={
                            this.props.user.current_address.formatted_address
                          }
                          id="address_search"
                          type="text"
                          className="form-control"
                          placeholder="Begin typing address"
                          aria-label="Username"
                          aria-describedby="basic-addon1"
                          onChange={() =>
                            this.handle_input(
                              event.target.value,
                              "UPDATE_USER_CURRENT_ADDRESS"
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="card">
                      <div id="account_profile_map" />
                    </div>
                    <div className="card">{this.state.address_printout}</div>
                  </div>
                </div>
                <hr />
                {/* <button onclick="update_user_data()" className="btn btn-primary">Save settings</button> */}
                {/* <button type="submit" className="btn btn-link">View profile</button> */}
              </fieldset>
              {/* </form> */}
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
  const { user, csrf } = state;
  return { ...user, ...csrf };
}
export default connect(mapStateToProps)(Account_Profile);
