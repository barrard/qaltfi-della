import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { withRouter } from "next/router";

class Transaction_View_Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div
        className="modal fade transactions-modal-lg"
        tabIndex="-1"
        data-backdrop="static"
        role="dialog"
        aria-labelledby="myLargeModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div
            className="modal-content"
            style={{ background: "transparent", border: "none" }}
          >
            <div className="modal-body">
              <div className="row">
                <div className="col-sm-12">
                  <div className="row">
                    <div className="col-md-11 col-sm-12">
                      <h4 style={{ color: "#fff", fontWeight: "100" }}>
                        All Transactions
                      </h4>
                      <a
                        href="#"
                        data-dismiss="modal"
                        style={{ position: "absolute", top: 0, right: 0 }}
                      >
                        <i
                          className="icon-close icons"
                          aria-hidden="true"
                          style={{ color: "#fff", fontSize: "26px" }}
                        />
                      </a>
                      <div
                        className="card mt-3"
                        style={{ background: "#fff", padding: "10px" }}
                      >
                        <div className="col-sm-12">
                          {!this.props.web3.transactions.length < 1 && (
                            <div>You don't have any transactions</div>
                          )}
                          {this.props.web3.transactions.length > 0 && (
                            <div>
                              <div className="row">
                                <div className="col-sm-6 flex_center">
                                  <p>
                                    You have {this.props.web3.transactions.length}{" "}
                                    transactions
                                  </p>
                                </div>
                                <div className="col-sm-6 flex_center">
                                  <p className="float_right">
                                    Current time -{" "}
                                    <strong>
                                      <Formatted_Date_Time />
                                    </strong>
                                  </p>
                                </div>
                              </div>
                              <div className="row alert">
                                <div className="col-sm-1 flex_center">
                                  <strong>Count</strong>
                                </div>
                                <div className="col-sm-4 flex_center">
                                  <strong>Type</strong>
                                </div>
                                <div className="col-sm-2 flex_center">
                                  <strong>Value</strong>
                                </div>
                                <div className="col-sm-2 flex_center">
                                  <strong>To</strong>
                                </div>
                              </div>
                              {this.props.web3.transactions.map((tx_data, index) => (
                                <div
                                  className={
                                    index % 2 == 0
                                      ? "even"
                                      : "odd" + " alert alert-dark "
                                  }
                                >
                                  <p
                                    className="hidden-off-screen"
                                    id={`to_transaction_` + index}
                                  >
                                    {tx_data.to}
                                  </p>
                                  <div className="row relative">
                                    <small className="absolute neg_top right">
                                      {this.format_date(tx_data.timestamp)}
                                    </small>
                                    <div className="col-sm-1 flex_center">
                                      <p>
                                        #
                                        {this.props.web3.transactions.length - index}
                                      </p>
                                      {!tx_data.on_receipt && (
                                        <p>Pending....</p>
                                      )}
                                    </div>
                                    <div className="col-sm-4 flex_center">
                                      {tx_data.transaction_type}
                                    </div>
                                    <div className="col-sm-2 flex_center">
                                      {toEth(tx_data.value)} Eth
                                    </div>
                                    <div
                                      className="col-sm-2 clickable"
                                      onClick={copy("to_transaction_" + index)}
                                      title={tx_data.to}
                                    >
                                      {short_address(tx_data.to)}
                                    </div>
                                    {/* <!-- <div className='col-sm-10'>
                      <span v-htmlFor="event in tx_data.events" v-bind:className="['badge', 'm-1', 'bg-cornflowerblue', 'btn-like ']">{{event}}</span>

              </div> --> */}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { web3 } = state;
  return { web3 };
}

export default connect(mapStateToProps)(withRouter(Transaction_View_Modal));
