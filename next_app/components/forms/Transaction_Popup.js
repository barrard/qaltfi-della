const Transaction_Popup = ({gas_estimate, gas_price, transaction_type, show_pw_input, on_gas_price_changed,
  on_gas_estimate_changed, handle_submit}) =>{

  return (
<>
    {/* <transition name="slide-fade"> */}
    {show_pw_input &&
      <div 
       
      className="card gas_price_password_popup_box shadow" 
      style={{width: '18rem'}}
    >
      <div className="card-body">
        <h5 className="card-title">{transaction_type}</h5>
        <p className="card-text">Transaction details.</p>
        <div className="form-group">
          <label for="total gas">Total Gas Estimate</label>
          <input 
            value={gas_estimate}
            onChange={()=> on_gas_estimate_changed(event.target.value)} 
            type="number" 
            className="form-control"  
            aria-describedby="total gas" 
            placeholder="Total Gas"
          />
          <small className="form-text text-muted">Left over gas is returned.</small>
        </div>
        <div className="form-group">
          <label for="Gas Price">Gas Price</label>
          <input 
            value={gas_price} 
            onChange={()=> on_gas_price_changed(event.target.value)} 
            type="number" className="form-control" aria-describedby="gas price" 
            placeholder="Gas Price"
          />
          <small className="form-text text-muted">Price per Gas Unit.</small>
        </div>
  
        <div className="alert alert-info" role="alert">
          Price check <span>{gas_estimate * gas_price}</span>
        </div>
        <div className="form-group">
          <label for="wallet password">Wallet Password</label>
          <input 
            type="password" 
            className="form-control" 
            aria-describedby="wallet password" 
            placeholder="Wallet Password"
          />
          <small className="form-text text-muted">Password set when when you created your wallet.</small>
        </div>
        <a href="#" 
          onClick={handle_submit} className="btn btn-primary">SUBMIT</a>
      </div>
    </div>}

    {/* </transition>  */}
  </>
  )
}

export default Transaction_Popup