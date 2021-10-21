const colors = require('colors');
const logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})
const mongoose = require('mongoose');
// const Update_schema = require('./update.js').Update_schema
// const Update = mongoose.model('update', Update_schema)

const Crowdsale_schema = mongoose.Schema({
  // home_type: { type: String, default: '' },
  dollar_goal: { type: Number, default: 0 },
  deployed_address: { type: String, default: '' },
  last_block_updated: { type: Number, default: 1 },
  block_deployed: { type: Number, default: 0 },
  token_balance: { type: Number, default: 0 },
  eth_price_at_finalization: { type: Number, default: 0 },
  eth_price_at_goal_reached: { type: Number, default: 0 },

  // title:{type:String,default:''},
  token_address: { type: String, default: '0x0000000000000000000000000000' },                                //2
  owner: { type: String, default: '0x0000000000000000000000000000' },                                //3
  wallet: { type: String, default: '0x0000000000000000000000000000' },                               //5
  TOTAL_RATE: { type: String, default: '100000000000000000' },                                 //6
  stable_tokens_raised: { type: String, default: '0' },                            //7
  escrow_address: { type: String, default: '0x0000000000000000000000000000' },                                //8
  symbol: { type: String, default: 'QAltFi' },                               //9
  openingTime: Number,                          //10  
  closingTime: Number,                          //11
  name: { type: String, default: 'Name: QAltFi' },                                 //12
  goalReached:{ type: Boolean, default: false },                        //13
  is_canceled: { type: Boolean, default: false },                          //14
  hasClosed: { type: Boolean, default: false },                            //15    
  finalized: { type: Boolean, default: false },                          //16
  check_finalization_time_limit_done: { type: Boolean, default: false },  //17
  transaction: { type: String, default: '' },
  contract_type: { type: String, default: 'Long term Contract' },
  photos: { type: [String], default: [] },
  main_crowdsale_img: { type: String, default: '' },
  street_number: { type: String, default: 'address line 1' },
  route: { type: String, default: 'address line 2' },
  locality: { type: String, default: 'City' },
  region: { type: String, default: 'State' },
  postal_code: { type: String, default: 'Zip' },
  country: { type: String, default: 'Country' },
  lat: { type: Number, default: 0 },
  lng: { type: Number, default: 0 },
  formatted_address: { type: String, default: '' },
  user_id: { type: String, default: '' },
  tax_id: { type: String, default: '123-456-789' },
  description: { type: String, default: 'Full Home Description' },
  downpayment: { type: Number, default: 0 },
  is_deployed: { type: Boolean, default: false },
  time_user_created: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
  shared_equity_agreement_type: { type: String, default: 'Share agreement type, or contract type' },
  parsed_youtube_link: { type: String, default: '' }, //parsed to make embed
  risk_factors: { type: String, default: 'Risk factors' },
  written_story: { type: String, default: 'I written story ethos logos' },
  user_likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", require: false }],

  comments: [ {
    text: { type: String, require: true },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref:"User", require: true },
    crowdsale_id: { type: mongoose.Schema.Types.ObjectId, ref:"Crowdsale", require: true },
    date: { type: Date, default: Date.now },
  } ] ,
  updates: [{type:mongoose.Schema.Types.ObjectId, ref:"Update", require: false }],
  events: { type: [String], default: [] },
  token_holders: [{
    purchaser_address: String,
    amount: Number
  }],
  tokens_for_sale: [{
    token_address: String,
    seller_address: String,
    token_amount: Number,
    wei_amount: String,
    seller_index: String,
    token_index: String,
    time: String,
    // timestamp: { type: Date, default: Date.now}
  }],
  bids_for_tokens: [{
    token_address: String,
    bidder_address: String,
    token_amount: Number,
    wei_amount: String,
    bidder_index: String,
    token_index: String,
    time: String,
    // timestamp: { type: Date, default: Date.now}
  }],
  zillow_data: {
    zpid: { type: String, default: '' },
    zestimate: { type: String, default: '' },
    last_updated: { type: String, default: '' },
    valuation_range_high: { type: String, default: '' },
    valuation_range_low: { type: String, default: '' },
    monthly_value_change: { type: String, default: '' },
    bathrooms: { type: String, default: '' },
    bedrooms: { type: String, default: '' },
    finished_sqft: { type: String, default: '' },
    last_sold_date: { type: String, default: '' },
    last_sold_price: { type: String, default: '' },
    lot_size_sqft: { type: String, default: '' },
    tax_assessment: { type: String, default: '' },
    tax_assessment_year: { type: String, default: '' },
    home_style: { type: String, default: 'Single Family' },
    year_built: { type: String, default: '' },
  }

})

module.exports = mongoose.model('Crowdsale', Crowdsale_schema)

