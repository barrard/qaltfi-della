const Add_Account_Modal = ({
  browser_wallet_unlocked,
  add_account,
  handle_input,
  add_private_key,
  wallet_password
}) => (
  <div
    className="modal fade"
    id="add_account_key_modal"
    tabIndex="-1"
    role="dialog"
  >
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Add Account</h5>
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
            <label>Account Private Key</label>
            <input
              onChange={(event) =>
                handle_input({ add_private_key: event.target.value })
              }
              value={add_private_key}
              type="text"
              className="form-control"
              placeholder="Account Private Key"
            />
            <small className="form-text text-muted">
              Please keep your private key in a safe place
            </small>
          </div>
          {!browser_wallet_unlocked &&
          <div className="form-group">
            <label>Browser Wallet Password</label>
            <input
              onChange={(event) =>
                handle_input({ wallet_password: event.target.value })
              }
              value={wallet_password}
              type="password"
              className="form-control"
              placeholder="Browser Wallet Password"
            />
            <small className="form-text text-muted">
              You must unlock your browser wallet to add new accounts
            </small>
          </div>}
        </div>
        <div className="modal-footer">
          <button
            disabled={(!browser_wallet_unlocked && !wallet_password)}
            onClick={add_account}
            data-dismiss="modal"
            className="btn btn-primary"
          >
            ADD
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

export default Add_Account_Modal;
