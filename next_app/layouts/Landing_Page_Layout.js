import Main_Head from "../components/Main_Head.js";
import { Fragment } from "react";
import Landing_Page_Nav from "../components/Landing_Page/Landing_Page_Nav.js";

import React from "react";
class Landing_Page_Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  componentDidMount() {
    window.nuxtsucks = "true";
  }

  render() {
    return (
      <div>
        <Main_Head />
                   {/* Navigation */}
            {/* Different nav for landing page */}
            <Landing_Page_Nav />

        <Fragment>
          <main>{this.props.children}</main>
        </Fragment>
      </div>
    );
  }
}

export default Landing_Page_Layout;
