const Main_Footer = (props)=>{
  return(
    // <!-- Footer -->
    <footer className="footer bg-light">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 h-100 text-center text-lg-left my-auto">
            <ul className="list-inline mb-2">
              <li className="list-inline-item">
                <a href="about">About</a>
              </li>
              <li className="list-inline-item">&sdot;</li>
              <li className="list-inline-item">
                <a href="mailto:hello@qaltfi.com?Subject=Hello">Contact</a>
              </li>
              <li className="list-inline-item">&sdot;</li>
              <li className="list-inline-item">
                <a href="https://app.termly.io/document/privacy-policy/dbdd2432-b751-48e4-acae-269a16ccc786">Terms of
                  Use</a>
              </li>
              <li className="list-inline-item">&sdot;</li>
              <li className="list-inline-item">
                <a href="https://app.termly.io/document/privacy-policy/dbdd2432-b751-48e4-acae-269a16ccc786">Privacy
                  Policy</a>
              </li>
            </ul>
            <p className="text-muted small mb-4 mb-lg-0">&copy; QAltFi Inc. 2018. All Rights Reserved.</p>
          </div>
          <div className="col-lg-6 h-100 text-center text-lg-right my-auto">
            <ul className="list-inline mb-0">
              <li className="list-inline-item mr-3">
                <a href="https://www.facebook.com/qaltfi/">
                  <i className="fa fa-facebook fa-2x fa-fw"></i>
                </a>
              </li>
              <li className="list-inline-item mr-3">
                <a href="https://twitter.com/qaltfi">
                  <i className="fa fa-twitter fa-2x fa-fw"></i>
                  </a>
              </li>
              <li className="list-inline-item">
                <a href="https://www.instagram.com/qaltfi/">
                  <i className="fa fa-instagram fa-2x fa-fw"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Main_Footer