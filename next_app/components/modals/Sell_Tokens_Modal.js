import React from 'react';
import { connect } from 'react-redux';


class Contracts extends React.Component{
  constructor(props) {
    super(props);
    this.state={}
  }
  render(){
    return(


      <div className="modal fade sell-tokens-lg" id="sell_tokens_modal"
      tabindex="-1" data-backdrop="static" 
      role="dialog" aria-labelledby="myLargeModalLabel"
      aria-hidden="true">
      <div className="modal-dialog modal-sm">
        <div className="modal-content" style="background: transparent; border: none;">
  
          <div className="modal-body">
  
            <div className="row">
  
              <div className="col-sm-12">
                <div className="row">
                  <div className="col-sm-12  pull-right">
                    <h4 style="color: #fff; font-weight: 100;">Sell Tokens</h4>
                    <a href="#" data-dismiss="modal" style="position: absolute; top: 0; right: 0;">
                      <i className="icon-close icons" aria-hidden="true" style="color: #fff; font-size: 26px"></i>
                    </a>
                    <div className="card mt-3" style="background: #fff; padding: 10px">
                      <h6 style="color: #000;font-weight: 100;">Offer Tokens For Sale</h6>
                      {/* IF ERROR MESSAGE */}
                      {this.state.error_message &&
                      <div>
                        {error_message}
                        check the 
                        <a href={`/campaign/${crowdsale_address}`}>
                          campaign page
                        </a>
                        for updates, and information regarding its current state
                        <button 
                          onClick={()=>this.error_message= null} 
                          className="btn btn-primary btn-block clickable" 
                          data-dismiss="modal">
                          Not Tradable Yet
                        </button>
  
  
                      </div>}
                      
                      {/* IF NO ERROR MESSAGE */}
                      {!this.state.error_message &&
                      <div>
                        <p>Please choose how many tokens you would like to sell.</p>
  
  
                      <br />
                        
  
                        <div className="form-group">
                          <label htmlFor="number of tokens">How many tokens would you like to sell.</label>
                          <div className="controls">
                            <input 
                              onChange={()=>this.setState({number_token_offer_for_sale:event.target.value})}
                              value={this.state.number_token_offer_for_sale}
                              name="number of tokens you want to sell" 
                              type="number" 
                              placeholder="# tokens to sell" 
                              className="form-control form-control-lg">
                            <p className="help-block">You have {this.state.available_tokens} tokens availale.</p>
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="total price">Total Price</label>
                          <div className="controls">
                              <input 
                                value={this.state.total_price_for_tokens}
                                name="total price for tokens" 
                                type="number" 
                                placeholder="Total Price" 
                                className="form-control form-control-lg">
                              <p className="help-block">Total Ether for {this.state.number_token_offer_for_sale} tokens</p>
                              <p className="help-block">
                                Per token cost: 
                                {(this.state.total_price_for_tokens / this.state.number_token_offer_for_sale)}</p>
                            </div>
                        </div>
  
                        <br />
                        <br />
                        <div className="form-group row">
                          <div className="offset-sm-1 col-sm-10 text-center">
                            <button  onClick="offer_tokens_for_sale" className="btn btn-primary btn-block clickable" data-dismiss="modal">Offer Tokens For Sale</button>
                          </div>
                        </div>
      
                        </div>} 
  
                    </div>
                  </div>
                </div>
              </div>
  
            </div>
          </div>
        </div>
      </div>
    </div>
  



    )
  }
}


function mapStateToProps(state) {
  const { user, csrf, locals } = state;
  return { ...user, ...csrf, ...locals };
}


export default connect(mapStateToProps)(Contracts);