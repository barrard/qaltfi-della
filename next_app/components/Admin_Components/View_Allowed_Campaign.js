import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { withRouter } from 'next/router';
import {Della_abi, Della_address} from '../../components/contract_abi.js'


class View_Allowed_Campaign extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      address_to_view:''
    }
    
    this.send_allow_campaign_data = this.send_allow_campaign_data.bind(this)
    this.handle_state_input = this.handle_state_input.bind(this)
  }


  handle_state_input(key, value) {
    this.setState({ [key]: value });
  }

  async send_allow_campaign_data(){
    const {web3} = this.props
    const {address_to_view} = this.state
    const Della_Contract = new web3.eth.Contract(Della_abi, Della_address);
    let goal = await Della_Contract.methods.get_can_start_campaign(address_to_view).call()
    console.log(goal.toString())
  }

  render(){
    const {address_to_view} = this.state

    return (
      <>
     
        <State_Input
          name="address_to_view"
          value={address_to_view}
          handle_state_input={this.handle_state_input}
        />
        <button className="btn btn-primary" 
          onClick={this.send_allow_campaign_data} 
        >
        GET ALLOWED CAMPAIGN GOAL
        </button>  
    
      </>
    );
  };
  

}


function mapStateToProps(state) {
  const { web3 } = state;
  return { ...web3 };
}


export default connect(mapStateToProps)(withRouter(View_Allowed_Campaign));




const State_Input = ({ name, handle_state_input, value, type }) => {
  return (
    <input
      name={name}
      type={type || "text"}
      value={value}
      onChange={(event) => handle_state_input(name, event.target.value)}
    />
  );
}