import React from "react";

class Google_Tag_Manager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <noscript>
        {/* Google Tag Manager (noscript) */}
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-TDP9RR8"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
        {/* End Google Tag Manager (noscript) */}
      </noscript>
    );
  }
}
export default Google_Tag_Manager;
