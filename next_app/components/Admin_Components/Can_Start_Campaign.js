export const Can_Start_Campaign = ({
  address_to_allow,
  handle_state_input,
  allowed_campaign_goal,
  send_allow_campaign_data
}) => {
  return (
    <>
      <State_Input
        name="address_to_allow"
        value={address_to_allow}
        handle_state_input={handle_state_input}
      />
      <State_Input
        name="allowed_campaign_goal"
        value={allowed_campaign_goal}
        handle_state_input={handle_state_input}
      />
      <button className="btn btn-primary" onClick={send_allow_campaign_data}>
        ALLOW CAMPAIGN
      </button>
    </>
  );
};

const State_Input = ({ name, handle_state_input, value, type }) => {
  return (
    <form>
            <div className="form-group">
      <label htmlFor={name}>{name}</label>

<input
  className="form-control"
  name={name}
  type={type || "text"}
  value={value}
  onChange={(event) => handle_state_input(name, event.target.value)}
/>
      </div>
    </form>
  );
};
