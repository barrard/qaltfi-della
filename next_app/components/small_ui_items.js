import React, { Fragment, Component } from "react";

import Link from "next/link";
import Moment from "react-moment";
import { toastr } from "react-redux-toastr";
import * as Utils from "web3-utils";

export const To_Eth = ({ wei }) => {
  if (!wei) return "N/A";
  try {
    let eth = parseFloat(Utils.fromWei(wei.toString(), "ether")).toLocaleString(
      "en-US"
    );
    return eth;
  } catch (err) {
    console.log(err);
    return "Err";
  }
  // return 10;
};

export const To_Number = ({ num }) => {
  if (num && typeof num == "string") num = parseFloat(num);
  if (num == 0) return 0;
  return num ? num.toLocaleString("en-US") : "N/A";
};

export const Hover_To_Copy = ({ el_id, value }) => {
  var el = document.querySelector(`#${el_id}`);

  function copy(el_id) {
    console.log(el_id);
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    try {
      // Now that we've selected the anchor text, execute the copy command
      var successful = document.execCommand("copy");
      // var msg = successful ? "successful" : "unsuccessful";
      toastr.info(`Address is saved in clipboard`);
      window.getSelection().removeAllRanges();
      el.classList.add("highlight");

      // return null, msg;
    } catch (err) {
      window.getSelection().removeAllRanges();
      coppied = false;

      toastr.error("Oops, unable to copy");
      return "err";
    }

    // Remove the selections - NOTE: Should use
    // removeRange(range) when it is supported
  }

  return (
    <Fragment>
      <p
        onMouseEnter={() => copy(el_id)}
        id={`${el_id}`}
        onMouseLeave={() => el.classList.remove("highlight")}
      >
        {value}
      </p>
      {/* <p 
        
      className="hidden-off-screen" id={`${el_id}`}>
    {value}
      </p> */}
      <style jsx>{`
        @keyframes highlightBg {
          0% {
            background: #fff;
          }
          25% {
            background: #96ef4f;
          }
          50% {
            background: #8df23c;
          }
          50% {
            background: #81f226;
          }
          to {
            background: #fff;
          }
        }

        .highlight {
          /*     box-shadow: 0 0 0 2px #FF4081; */
          -webkit-animation: highlightBg 1s linear;
          -o-animation: highlightBg 1s linear;
          animation: highlightBg 0.3s linear;
          -webkit-animation-iteration-count: 1;
          -o-animation-iteration-count: 1;
          animation-iteration-count: 1;
        }
      `}</style>
    </Fragment>
  );
};

export const Click_To_Copy = ({ el_id }) => {
  function copy(el_id) {
    console.log(el_id);
    var el = document.querySelector(`#${el_id}`);
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    try {
      // Now that we've selected the anchor text, execute the copy command
      var successful = document.execCommand("copy");
      var msg = successful ? "successful" : "unsuccessful";
      toastr.info(`Address is saved in clipboard`);
      return null, msg;
    } catch (err) {
      toastr.error("Oops, unable to copy");
      return "err";
    }

    // Remove the selections - NOTE: Should use
    // removeRange(range) when it is supported
    window.getSelection().removeAllRanges();
  }

  return (
    <button onClick={() => copy(`${el_id}`)} className="btn btn-sm">
      COPY
    </button>
  );
};

export const Short_Address = ({ address }) => {
  if (!address) return "Not Available";
  const start = address.slice(0, 6);
  const end = address.slice(-6);
  return `${start}...${end}`;
};

export const My_Story_Preview = ({ crowdsale, parsed_youtube_link }) => {
  const { crowdsale_youtube_link, written_story, risk_factors } = crowdsale;
  console.log({ parsed_youtube_link });
  return (
    <div className="card">
      {!parsed_youtube_link && (
        <>
          <img
            src="/static/img/youtube_pic.png"
            className="img-fluid hidden-xs-down"
          />
          <img
            src="/static/img/youtube_pic.png"
            className="img-fluid hidden-sm-up"
          />
        </>
      )}

      {parsed_youtube_link && (
        <>
          <iframe
            className="img-fluid hidden-xs-down"
            src={parsed_youtube_link}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          <iframe
            className="img-fluid hidden-sm-up"
            src={parsed_youtube_link}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </>
      )}

      <div
        className="card-block"
        className="pb-1"
        style={{ position: "relative" }}
      >
        <p className="desc keep-whitespace">
          <strong>Story: </strong>
          {written_story}
        </p>
        <p className="desc keep-whitespace">
          <strong>Risk Factors: </strong>
          {risk_factors}
        </p>
      </div>
    </div>
  );
};

export const Campaign_Builder_Breadcrumbs = ({ pathname }) => (
  <ul id="edit_breadcrumb" className="breadcrumb">
    <li>
      <Link prefetch href="/pre-qualify">
        <a className={`${pathname == "/pre_qualify" ? " active " : ""}`}>
          Pre-Qualify
        </a>
      </Link>
    </li>
    <li>
      <Link prefetch href="/campaign-property">
        <a className={`${pathname == "/campaign-property" ? " active " : ""}`}>
          Property
        </a>
      </Link>
    </li>
    <li>
      <Link prefetch href="/campaign-story">
        <a className={`${pathname == "/campaign-story" ? " active " : ""}`}>
          Story
        </a>
      </Link>
    </li>
    <li>
      <Link prefetch href="/campaign-contract">
        <a className={`${pathname == "/campaign-contract" ? " active " : ""}`}>
          Contract
        </a>
      </Link>
    </li>
    <li className="active">
      <Link prefetch href="/campaign-finish">
        <a className={`${pathname == "/campaign-finish" ? " active " : ""}`}>
          Finish
        </a>
      </Link>
    </li>
  </ul>
);

export const Formatted_Date_Time = props => {
  var date = props.date || new Date().getTime();
  return <Moment format={"MM/DD/YY hh:mm:ss a"} date={date} />;
};

export const Marketplace_Explore_Nav_Buttons = props => (
  <ul className="navbar-nav mr-auto">
    <li
      className={props.pathname == "/explore" ? "active " : " " + ` nav-item `}
    >
      <Link prefetch href="/explore">
        <a className="nav-link">Explore</a>
      </Link>
    </li>

    <li
      className={
        props.pathname == "/marketplace" ? "active " : " " + ` nav-item`
      }
    >
      <Link prefetch href="/marketplace">
        <a className="nav-link">Marketplace</a>
      </Link>
    </li>
  </ul>
);

export const Learn_More_Nav_Dropdown = props => (
  <>
    <ul className="navbar-nav">
      <li className="nav-item dropdown pr-5">
        <a
          onClick={() => $(".learn-more-dropdown-toggle").dropdown("toggle")}
          href="#"
          className="nav-link learn-more-dropdown-toggle dropdown-toggle"
          data-toggle="dropdown"
          href="#"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Lean More
        </a>

        <div className="dropdown-menu" id="learn_more_nav_dropdown">
          <Link prefetch href="/how_it_works" as="/how-it-works">
            <a
              className={`${
                props.pathname == "/how_it_works" ? "active " : " "
              }" nav-link dropdown-item"`}
            >
              How It Works
            </a>
          </Link>

          <Link prefetch href="/about">
            <a
              className={`${
                props.pathname == "/about" ? "active " : " "
              }" nav-link dropdown-item"`}
            >
              About us
            </a>
          </Link>

          <Link prefetch href="/faqs">
            <a
              className={`${
                props.pathname == "/faqs" ? "active " : " "
              }" nav-link dropdown-item"`}
            >
              FAQs
            </a>
          </Link>
        </div>
      </li>
    </ul>
    <ul className="navbar-nav">
      <li className="nav-item">
        <Link prefetch href="/login">
          <a
            className="nav-link"
            // data-toggle="modal"
            // data-target=".login-modal-lg"
          >
            <i className="fa fa-sign-in" aria-hidden="true" /> Login
          </a>
        </Link>
      </li>
      <li className="nav-item">
        <Link prefetch href="/signup">
          <a
            className="nav-link"

            // data-toggle="modal"
            // data-target=".signup-modal-lg"
          >
            <i className="fa fa-wpforms" aria-hidden="true" /> Sign up
          </a>
        </Link>
      </li>
    </ul>
  </>
);

export const Start_Campaign_Nav_Button = props => (
  <ul className="navbar-nav">
    {props.user && !props.user.crowdsale_init && (
      <li
        className={props.pathname == "/start" ? " active " : "" + ` nav-item`}
      >
        <Link prefetch href="/start">
          <a className="nav-link" href="/start">
            Start a campaign
          </a>
        </Link>
      </li>
    )}

    {/* <!-- Pre- Deploy to BlockChain --> */}
    {props.user && props.user.crowdsale_init && !props.user.crowdsale_deployed && (
      <li
        className={`
      ${props.pathname == "/campaign-property" ? " active " : " "} nav-item`}
      >
        <Link prefetch href="/campaign-property">
          <a className="nav-link">Edit Property</a>
        </Link>
      </li>
    )}

    {/* <!-- Post- Deploy to BlockChain --> */}

    {props.user && props.user.crowdsale_deployed && (
      <li
        className={`${
          props.pathname == "/edit-manage" ? " active " : " "
        } nav-item`}
      >
        <Link prefetch href="campaign-manage">
          <a className="nav-link">Manage Campaign</a>
        </Link>
      </li>
    )}
  </ul>
);

export const Logout_btn = props => (
  <li className="nav-item">
    <Link href="/logout">
      <a
        className="nav-link"
        // data-toggle="modal"
        // data-target=".login-modal-lg"
      >
        <i className="fa fa-sign-out" aria-hidden="true" /> LOGOUT
      </a>
    </Link>
  </li>
);

export const Profile_Nav_Dropdown = props => (
  <ul className="navbar-nav">
    <li className="nav-item dropdown pr-5">
      <a
        onClick={() => $(".profile-dropdown-toggle").dropdown("toggle")}
        href="#"
        className="avatar nav-link dropdown-toggle profile-dropdown-toggle"
        data-toggle="dropdown"
        href="#"
        role="button"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {props.user.main_profile_img && (
          <img
            src={`/static/user_profile_imgs/${props.user.main_profile_img}`}
            width="45"
            className="img-fluid rounded-circle"
          />
        )}

        {!props.user.main_profile_img && (
          <img
            src="/static/img/profile-placeholder.jpg"
            width="45"
            className="img-fluid rounded"
          />
        )}
      </a>
      <div className="dropdown-menu" id="user_profile_nav_dropdown">
        <Link prefetch href="/account-profile">
          <a className="nav-link dropdown-item">
            {props.user.firstname} {props.user.lastname}
          </a>
        </Link>

        <Link href="/logout">
          <a className="nav-link dropdown-item">
            <i className="fa fa-sign-out" aria-hidden="true" /> Logout
          </a>
        </Link>

        <Link prefetch href="/account-balances">
          <a className="nav-link dropdown-item">Token Balance</a>
        </Link>
        <Link prefetch href="/account-wallet">
          <a className="nav-link dropdown-item">Wallet</a>
        </Link>
      </div>
    </li>
  </ul>
);
