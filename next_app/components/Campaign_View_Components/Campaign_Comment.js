import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { withRouter } from "next/router";
import fetch from "isomorphic-fetch";
import moment from "moment";

class Campaign_Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      main_profile_img: "",
      firstname: "",
      lastname: ""
    };
  }
  async componentDidMount() {
    let {
      main_profile_img,
      firstname,
      lastname
    } = await fetch_author_comment_data(this.props.comment.author_id);
    this.setState({ main_profile_img, firstname, lastname });
  }
  render() {
    let { main_profile_img, firstname, lastname } = this.state;
    let { key, comment, campaign_owner_id_data } = this.props;
    let { author_id, text, date } = comment;
    return (
      <li
        key={key}
        className="comment row"
        className={
          `row  m-2 ${author_id == campaign_owner_id_data
            ? "author-comment"
            : "user-comment"}`
        }
      >
        <div className="col-sm-7 card-light flex_center">
         {text}
        </div>

        <div className="col-sm-5">
          <div className="row">
            <div className="col-sm-5">
              <a className="avatar" href="#">
                {main_profile_img != "" && (
                  <img
                    src={`/user_profile_imgs/${main_profile_img}`}
                    width="35"
                    alt="Profile Avatar"
                    title={`${firstname} ${lastname}`}
                  />
                )}
                {!main_profile_img != "" && (
                  <img
                    src="/static/img/profile-placeholder.jpg"
                    width="55"
                    alt="profile-placeholder"
                    title="profile-placeholder"
                  />
                )}
              </a>
            </div>
            <div className="col-sm-7">
              <div className="info">
                <a href="#">
                <span className="inline_block no_wrap_text">{`${firstname} ${lastname}`}</span>
                </a>

                <p className="card-text no_wrap_text">
                  {get_time_since(new Date(date).getTime())}
                </p>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

function mapStateToProps(state) {
  const { user, csrf, locals, crowdsales, two_factor_auth } = state;
  return { ...user, ...csrf, ...locals, ...crowdsales, ...two_factor_auth };
}

export default connect(mapStateToProps)(withRouter(Campaign_Comment));

async function fetch_author_comment_data(id) {
  console.log(id);

  let resp = await fetch(`/user/get_user_comment_data/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
      // "Content-Type": "application/x-www-form-urlencoded",
    }
  });
  let { main_profile_img, firstname, lastname } = await resp.json();

  return { main_profile_img, firstname, lastname };
}

function get_time_since(time) {
  console.log(time);
  const d = moment.duration(moment().diff(new moment(time)))._data;
  var timestamp = "";
  if (d.days) timestamp += `${d.days} days `;
  if (d.hours) timestamp += `${d.hours} hours `;
  if (d.minutes) timestamp += `${d.minutes} minutes `;
  // if (d.seconds) timestamp += `${d.seconds} seconds `;
  timestamp += "ago";
  return timestamp;
}
