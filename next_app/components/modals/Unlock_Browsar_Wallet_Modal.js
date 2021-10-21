const Unlock_Browsar_Wallet_Modal = ({ unlock_wallet, handle_dispatch_input, wallet_password }) => (
  <div
    className="modal fade"
    id="unlock_wallet_modal"
    tabIndex="-1"
    role="dialog"
  >
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Unlock Browser Account</h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Browser Account Password</label>
            <input
              onChange={(event) =>
                handle_dispatch_input("UPDATE_WALLET_PASSWORD", 'wallet_password',  event.target.value )
              }
              value={wallet_password}
              type="text"
              className="form-control"
              placeholder="Account Private Key"
            />
            <small className="form-text text-muted">
              Please keep your password safe.
            </small>
          </div>
        </div>
        <div className="modal-footer">
          <button
            onClick={unlock_wallet}
            data-dismiss="modal"
            className="btn btn-primary"
          >
            UNLOCK
          </button>
          <button
            onClick={() => {}}
            className="btn btn-warning"
            data-dismiss="modal"
          >
            CANCLE
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default Unlock_Browsar_Wallet_Modal;
