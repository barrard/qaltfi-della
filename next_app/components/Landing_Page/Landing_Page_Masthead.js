import React from 'react';
import Link from "next/link";

class Landing_Page_Masthead extends React.Component{
  constructor(props) {
    super(props);
    this.state={}
  }
  render(){
    return(
      <header className="masthead text-white text-center">
        <div className="overlay" />
        <div className="container">
          <div className="row">
            <div className="col-xl-9 mx-auto">
              <h1 className="text_shadow_contrast">
                We help connect great people.
              </h1>
              <h1 className="mb-5 text_shadow_contrast">
                {" "}
                Tokenize and share appreciation in residential real
                estate.
              </h1>
            </div>
            <div className="col-md-10 col-lg-8 col-xl-7 justify_center">
              {/*<div className="col-12 col-md-9 mb-2 mb-md-0">
            <input type="email" className="form-control form-control-lg" placeholder="Enter your email...">
          </div> */}
              <div className="col-12 col-md-3">
              <Link prefetch href="/signup">

                <button
                  type="submit"
                  className="btn btn-block btn-lg btn-primary"
                  data-toggle="modal"
                  data-target=".signup-modal-lg"
                >
                  Sign up!
                </button>
                </Link>

              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }
}
export default Landing_Page_Masthead