import { Formatted_Date_Time } from "../../components/small_ui_items.js";
const User_Terms_And_Agreement_Modal = ({
  user_agreement_scroll_pos,
  user_signature,
  handle_state_input,
  has_not_read_user_agreement,
  agree_to_terms
}) => (
  <div className="modal fade" id="terms_and_agreement">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">User Terms and Agreement</h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div
          id="contract_pdf"
          onScroll={() => user_agreement_scroll_pos(event)}
          className="modal-body scroll md_fixed_height bottom_inset_box_shadow"
        />
        <div className="p-2">
          <div className="row pb-2">
            <div className="col-sm-6 center-text">
              <input
                id="user_signature"
                value={user_signature}
                onChange={(event) =>
                  handle_state_input(
                    'user_signature', event.target.value
                  )
                }
                disabled={has_not_read_user_agreement}
                type="text"
              />
            </div>
            <div className="col-sm-6">
              <button
                disabled={has_not_read_user_agreement}
                onClick={agree_to_terms}
                type="button"
                className="full-width btn btn-primary"
              >
                Agree
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <p className="signature center-text">{user_signature}</p>
              <p className="center-text">
                <Formatted_Date_Time />
              </p>
            </div>
            <div className="col-sm-6">
              <button
                type="button"
                className="btn btn-secondary float_right"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default User_Terms_And_Agreement_Modal;
