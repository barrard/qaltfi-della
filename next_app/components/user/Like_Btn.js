import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { withRouter } from "next/router";
import $ from "jquery";
import {add_liked_crowdsale_to_user} from '../../redux/store.js'

class Like_Btn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // campaign_id :props.campaign_data._id
    };
    this.like = this.like.bind(this);
  }

  like() {
    const crowdsale_id = this.props.campaign_id;
    const _csrf = this.props.csrf;
    //add follower after updating the DB
    $.post(
      "/like",
      {
        crowdsale_id,
        _csrf
      },
      resp => {
        console.log(resp);
        if (resp.err) {
          toastr.warning(resp.err);
        }
        if (resp.resp) {
          //updated_crowdsale_user_likes, updated_user_likes
          /* user reducer */
          this.props.dispatch(
            add_liked_crowdsale_to_user(crowdsale_id)
          )    
 
          
        }
        // console.log(this.props.user)
      }
    );
  }
  render() {
    // console.log(this.props);

    return (
      <>
        {this.props.user && (
          <>
            {this.props.user.liked_crowdsales.indexOf(this.props.campaign_id) ==
              -1 && (
              <span
                onClick={() => this.like(this.props.campaign_id)}
                style={{ display: "table" }}
                className="badge badge-pill badge-primary clickable"
              >
                <i className="fa fa-thumbs-up" />
              </span>
            )}
            {this.props.user.liked_crowdsales.indexOf(
              this.props.campaign_id
            ) !== -1 && (
              <span
                className="badge badge-pill badge-info"
                style={{ marginLeft: "5px", marginTop: "5px" }}
              >
                Liked
              </span>
            )}
          </>
        )}
      </>
    );
  }
}

function mapStateToProps(state) {
  const { user, csrf } = state;
  return { ...user, ...csrf };
}

export default connect(mapStateToProps)(withRouter(Like_Btn));
