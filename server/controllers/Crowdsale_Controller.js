require("dotenv").config();
var crowdsale_schema = require("../models/crowdsale_schema.js");
const User_Controller = require("./User_Controller.js");
const formidable = require("formidable");
const request = require("request");
const rp = require("request-promise");
const HOUSE_DATA_SERVER = process.env.HOUSE_DATA_SERVER;
const { web3 } = require("../services/web3_service.js");
const Update = require("../models/Update.js");
const Crowdsale = (module.exports = crowdsale_schema);
const {get_current_block_number}=require('../models/blockchain_data_model.js')
const {get_current_state_of_crowdsale_on_blockchain} = require('../services/campaign_functions.js')
module.exports.check_id = async _id => {
  // return new Promise(async function(resolve, reject) {
    try {
      if (!_id) reject("no id given");
      if (_id.startsWith("0x")) {
        logger.log(`_id startsWith 0X ${_id}`);
        let crowdsale = await Crowdsale.findOne({ deployed_address: _id.toLowerCase() });
        logger.log(crowdsale._id);
        return(crowdsale._id);
      } else {
        return(_id);
      }
    } catch (err) {
      logger.log("ERRR");
      logger.log("cant find crowdsale with address " + _id);
      logger.log(
        "This error occurs on request ether transactions..... and is ignored"
      );
      reject(err);
    }
  // });
};

module.exports.update_purchase_token_for_sale = async purchase_token_for_sale_data => {
  logger.log("purchase_token_for_sale_data".bgMagenta);
  logger.log(purchase_token_for_sale_data);
  const event_seller_index = purchase_token_for_sale_data.seller_index;
  const event_token_index = purchase_token_for_sale_data.token_index;
  const event_token_address = purchase_token_for_sale_data.token_address;
  const event_seller_address = purchase_token_for_sale_data.seller_address;
  const event_token_amount = purchase_token_for_sale_data.token_amount;
  logger.log("purchase_token_for_sale_data".bgMagenta);
  logger.log({
    event_seller_index,
    event_token_index,
    event_token_address,
    event_seller_address,
    event_token_amount
  });
  try {
    //decrement seller
    let crowdsale_update_seller_token_holder = await Crowdsale.findOneAndUpdate(
      {
        token_address: event_token_address,
        "token_holders.purchaser_address": event_seller_address
      },
      {
        $inc: {
          "token_holders.$.amount": event_token_amount * -1
        }
      }
    );
    if (!crowdsale_update_seller_token_holder)
      throw "Cant find crowdsale_update_seller_token_holder";
    // logger.log(crowdsale_update_seller_token_holder)

    Crowdsale.cancel_tokens_for_sale({
      token_address: event_token_address,
      seller_index: event_seller_index,
      token_index: event_token_index
    });

    const amount = event_token_amount;
    const purchaser = purchase_token_for_sale_data.buyer_address;
    const crowdsale_address =
      crowdsale_update_seller_token_holder.deployed_address;
    Crowdsale.add_token_owner({ amount, purchaser, crowdsale_address });
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    throw err;
  }

  //a token offer needs to be removed
};

async function remove_bid({ token_address, bidder_index, token_index }) {
  try {
    const crowdsale_remove_bid = await Crowdsale.findOneAndUpdate(
      {
        token_address: token_address
      },
      {
        $pull: {
          bids_for_tokens: {
            bidder_index: bidder_index,
            token_index,
            token_index
          }
        }
      }
    );
    if (!crowdsale_remove_bid)
      throw `Couldnt remove bid from crowdsale thats has token address ${token_address}`;
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
  }
}

async function remove_sale({ token_address, seller_index, token_index }) {
  try {
    const crowdsale_remove_sale = await Crowdsale.findOneAndUpdate(
      {
        token_address: token_address
      },
      {
        $pull: {
          tokens_for_sale: {
            seller_index: seller_index,
            token_index,
            token_index
          }
        }
      }
    );
    if (!crowdsale_remove_sale)
      throw `Couldnt remove sale from crowdsale thats has token address ${token_address}`;
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
  }
}

module.exports.cancle_bid_for_tokens = async event_data => {
  const {
    bidder_address,
    token_address,
    token_amount,
    bidder_index,
    token_index
  } = event_data;
  remove_bid({ token_address, bidder_index, token_index });
};
module.exports.cancel_tokens_for_sale = async event_data => {
  const {
    seller_address,
    token_address,
    token_amount,
    seller_index,
    token_index
  } = event_data;
  remove_sale({ token_address, seller_index, token_index });
};

module.exports.add_bid_for_tokens_accepted_to_database = async event_data => {
  //crowdsale add tokens to token owner for buyer, and remove seller
  const {
    buyer_address,
    seller_address,
    token_address,
    token_amount,
    seller_index,
    token_index
  } = event_data;
  const bidder_index = seller_index;
  remove_bid({ token_address, bidder_index, token_index });
  // const crowdsale_remove_bid = await Crowdsale.findOneAndUpdate({
  //   token_address: token_address
  //  }, {
  //    $pull:{bids_for_tokens:{
  //      seller_index:seller_index,
  //      token_index, token_index,
  //    }}
  //  });
};

module.exports.add_bid_for_tokens = async bid_for_tokens_data => {
  try {
    const token_address = bid_for_tokens_data.token_address;
    // const { token_address, token_amount, wei_amount, bidder_address } = tokens_for_sale_data
    let crowdsale_add_bid = await Crowdsale.findOneAndUpdate(
      {
        token_address: token_address
      },
      {
        $push: { bids_for_tokens: bid_for_tokens_data }
      }
    );
    if (!crowdsale_add_bid)
      throw `couldnt add bid to crowdsael with token address ${token_address}`;
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
  }
};

module.exports.add_tokens_for_sale = async token_for_sale_details => {
  const { token_address } = token_for_sale_details;
  logger.log(token_for_sale_details);
  try {
    let crowdsale_add_sale = await Crowdsale.findOneAndUpdate(
      {
        token_address
      },
      {
        $push: { tokens_for_sale: token_for_sale_details }
      }
    );
    if (!crowdsale_add_sale)
      throw `couldnt add sale to crowdsale with token adress ${token_address}`;
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
  }
};

module.exports.add_token_owner = async event_returnValues => {
  try {
    logger.log(event_returnValues);
    const amount = event_returnValues["amount"];
    const purchaser_address = event_returnValues["purchaser"].toLowerCase();
    const crowdsale_address = event_returnValues[
      "crowdsale_address"
    ].toLowerCase();
    // var data = { amount, purchaser_address }

    let updated_crowdsale;
    updated_crowdsale = await Crowdsale.findOneAndUpdate(
      {
        deployed_address: crowdsale_address,
        "token_holders.purchaser_address": purchaser_address
      },
      {
        $inc: { "token_holders.$.amount": amount }
      }
    );
    if (!updated_crowdsale) {
      logger.log("No crowdsale found!!".bgRed);
      logger.log("Try and just add the new token holder object".bgBlue);
      let updated_crowdsale = await Crowdsale.findOneAndUpdate(
        {
          deployed_address: crowdsale_address
        },
        {
          $push: {
            token_holders: {
              purchaser_address,
              amount
            }
          }
        }
      );
      if (!updated_crowdsale) {
        logger.log("Failed to add Token Holder data!!!".bgRed);
      } else {
        logger.log("Seconds times a charm, added new token holder obj".bgGreen);
      }
    } else {
      logger.log("Success added token holder".bgGreen);
    }
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    throw err;
  }
};
module.exports.remove_zillow_data = async user_id => {
  logger.log("remove zillow data");
  try {
    let crowdsale = await Crowdsale.findOne({ user_id: user_id });
    logger.log("got crowdsale");
    crowdsale.zillow_data = {
      zpid: "",
      zestimate: "",
      last_updated: "",
      valuation_range_high: "",
      valuation_range_low: "",
      monthly_value_change: "",
      bathrooms: "",
      bedrooms: "",
      finished_sqft: "",
      last_sold_date: "",
      last_sold_price: "",
      lot_size_sqft: "",
      tax_assessment: "",
      tax_assessment_year: "",
      home_style: "",
      year_built: ""
    };

    let saved_crowdsale = await crowdsale.save();
    logger.log("zillow data removed");
    return saved_crowdsale;
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    throw err;
  }
};

module.exports.get_zillow_data = async formatted_address => {
  var split_address = formatted_address.split(",");
  var address = encodeURIComponent(split_address[0]);
  var city = split_address[1];
  var state_zip = split_address[2];
  var city_state_zip = encodeURIComponent([city, state_zip].join(" "));

  logger.log({ address, city_state_zip });
  const API_SERVER = process.env.API_SERVER;
  // console.log(`address=${address}&citystatezip=${city_state_zip}`)
  // let resp = rp(`${API_SERVER}/crowdsale/get_house_data/${address}/${city_state_zip}`)
  let resp = await module.exports.get_house_data({ address, city_state_zip });
  // if(resp.error)throw error
  return resp;
};

module.exports.lookup_address = async (req, res, next) => {
  const place = JSON.parse(req.body.place);
  logger.log(place);
  // var street_number, route, locality,region,postal_code,country
  //google had the address built up in this form, so this is me parsing it
  /* Moved from client, get the campaign from DB< and update */
  const crowdsale_id = req.user.crowdsale_id;
  logger.log({ crowdsale_id });
  let user_crowdsale = await Crowdsale.findById(crowdsale_id);
  logger.log(user_crowdsale);
  place.address_components.forEach(addr_compont => {
    let types = addr_compont.types;
    if (types.indexOf("street_number") != -1) {
      /* street number */
      user_crowdsale.street_number = addr_compont.short_name;
    }
    if (types.indexOf("route") != -1) {
      /* route */
      user_crowdsale.route = addr_compont.short_name;
    }
    /* locality */
    if (types.indexOf("locality") != -1) {
      user_crowdsale.locality = addr_compont.short_name;
    }
    if (types.indexOf("administrative_area_level_1") != -1) {
      user_crowdsale.region = addr_compont.short_name;
    }
    if (types.indexOf("postal_code") != -1) {
      user_crowdsale.postal_code = addr_compont.short_name;
    }
    if (types.indexOf("country") != -1) {
      user_crowdsale.country = addr_compont.short_name;
    }
  });
  //then i discovered formatted address
  user_crowdsale.formatted_address = place.formatted_address;
  user_crowdsale.lat = place.geometry.location.lat;
  user_crowdsale.lng = place.geometry.location.lng;

  logger.log("SAAAAAVVVVEEEEE");
  await user_crowdsale.save();
  let resp = await module.exports.get_zillow_data(place.formatted_address);

  logger.log("resp from get zilow");
  logger.log(resp);
  // this.save_state = false;
  // this.auto_save();
  if (resp.error || !resp.house_data) {
    logger.log("err no zillow still save");
    let removed_zillow_data = await Crowdsale.remove_zillow_data(req.user.id);
    res.json({ error: "No data found for this address", removed_zillow_data });
  } else if (resp.house_data) {
    let updated_crowdsale = await module.exports.add_zillow_data(
      req.user._id,
      resp.house_data
    );
    res.json({ updated_crowdsale });
  }
};

module.exports.get_house_data = async ({ address, city_state_zip }) => {
  try {
    logger.log({
      address,
      city_state_zip
    });

    url = `${HOUSE_DATA_SERVER}/zillow/${address}/${city_state_zip}`;
    logger.log(url);

    let house_data = await rp.get(url);
    logger.log(house_data);

    if (!house_data) throw "no body";
    logger.log("Zillow data returned");
    logger.log(JSON.parse(house_data));

    // let updated_crowdsale = await Crowdsale.add_zillow_data(req.user.id, body);
    // // , (err, ) => {
    // if (!updated_crowdsale) throw err;
    return { house_data };

    // res_send(res, {...updated_crowdsale, zillow:body})
    // res_send(res, { resp:'zillow data saved' })
    // res_send(res, {
    //   resp: body
    // })
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    return {
      error: "No house data found"
    };
  }
};

module.exports.add_zillow_data = async (user_id, _data) => {
  logger.log(JSON.parse(_data));
  let data = JSON.parse(_data);
  logger.log(data.house_data.zestimate);
  let house_data = {};
  if (data.house_data.zestimate) {
    const zest = data.house_data.zestimate[0];
    // const zest = data.house_data.zestimate[0]

    const value_change = isNaN(parseInt(zest.valueChange[0]["_"]))
      ? "N/A"
      : parseInt(zest.valueChange[0]["_"]).toLocaleString();
    const range_high = isNaN(parseInt(zest.valuationRange[0].high[0]["_"]))
      ? "N/A"
      : parseInt(zest.valuationRange[0].high[0]["_"]).toLocaleString();
    const range_low = isNaN(parseInt(zest.valuationRange[0].low[0]["_"]))
      ? "N/A"
      : parseInt(zest.valuationRange[0].low[0]["_"]).toLocaleString();
    const zestimate = isNaN(parseInt(zest.amount[0]["_"]))
      ? "N/A"
      : parseInt(zest.amount[0]["_"]).toLocaleString();

    house_data = {
      ...house_data,
      zestimate: zestimate,
      last_updated: zest["last-updated"][0],
      zpid: data.house_data.zpid[0],
      valuation_range_high: range_high,
      valuation_range_low: range_low,
      monthly_value_change: value_change
    };
  }
  if (data.house_data.lastSoldDate) {
    house_data = {
      ...house_data,
      last_sold_date: data.house_data.lastSoldDate[0]
    };
  }
  if (data.house_data.lastSoldPrice) {
    house_data = {
      ...house_data,
      last_sold_price: parseInt(
        data.house_data.lastSoldPrice[0]["_"]
      ).toLocaleString()
    };
  }
  if (data.house_data.taxAssessment) {
    house_data = {
      ...house_data,
      tax_assessment_year: data.house_data.taxAssessmentYear[0],
      tax_assessment: parseInt(
        data.house_data.taxAssessment[0]
      ).toLocaleString()
    };
  }

  if (data.house_data.yearBuilt) {
    house_data = {
      ...house_data,
      year_built: data.house_data.yearBuilt[0]
    };
  }
  if (data.house_data.bathrooms) {
    house_data = {
      ...house_data,
      bathrooms: data.house_data.bathrooms[0]
    };
  }
  if (data.house_data.useCode) {
    switch (data.house_data.useCode[0]) {
      case "SingleFamily":
        data.house_data.useCode[0] = "Single Family";
        break;
      case "MultiFamily2To4":
        data.house_data.useCode[0] = "Multi-family 2-4";
        break;
      case "MultiFamily5Plus":
        data.house_data.useCode[0] = "Multi-family 5+";
        break;
      case "Timeshare":
        data.house_data.useCode[0] = "Timeshare";
        break;
      case "VacantResidentialLand":
        data.house_data.useCode[0] = "Vacant Residential Land";
        break;
      default:
        break;
    }
    house_data = {
      ...house_data,
      home_style: data.house_data.useCode[0]
    };
  }
  if (data.house_data.lotSizeSqFt) {
    house_data = {
      ...house_data,
      lot_size_sqft: parseInt(data.house_data.lotSizeSqFt[0]).toLocaleString()
    };
  }
  if (data.house_data.finishedSqFt) {
    house_data = {
      ...house_data,
      finished_sqft: parseInt(data.house_data.finishedSqFt[0]).toLocaleString()
    };
  }
  if (data.house_data.bedrooms) {
    house_data = {
      ...house_data,
      bedrooms: data.house_data.bedrooms[0]
    };
  }

  logger.log(house_data);
  try {
    let updated_crowdsale = await Crowdsale.findOneAndUpdate(
      { user_id: user_id },
      {
        zillow_data: { ...house_data }
      },
      { new: true }
    );
    if (!updated_crowdsale) throw "Error saving Crowdsale";
    return updated_crowdsale;
  } catch (err) {
    throw { err, err_msg: "updated_crowdsale" };
  }
};

module.exports.like = async ({ user_id, crowdsale_id }) => {
  try {
    logger.log(crowdsale_id);
    let crowdsale = await Crowdsale.findById(crowdsale_id);
    if (crowdsale.user_likes.indexOf(user_id) != -1)
      throw "User already liked this";
    let crowdsale_liked = await Crowdsale.findOneAndUpdate(
      {
        _id: crowdsale_id
      },
      {
        $push: { user_likes: user_id }
      },
      { new: true }
    );

    return crowdsale_liked.user_likes;
  } catch (err) {
    throw err;
  }
};

module.exports.get_all_tradeable_crowdsales = cb => {
  Crowdsale.find(
    { goal_reached: true, isFinalized: true, is_canceled: false },
    {
      token_address: 1,
      deployed_address: 1,
      eth_price_at_finalization: 1,
      eth_price_at_goal_reached: 1,
      goal: 1,
      dollar_goal: 1,
      lat: 1,
      lng: 1,
      formatted_address: 1,
      photos: 1,
      user_likes: 1,
      zillow_data: 1,
      tokens_for_sale: 1,
      rate: 1,
      bids_for_tokens: 1
    },
    (err, tradeable_crowdsales) => {
      // logger.log(cb)
      // logger.log(tradeable_crowdsales)
      cb(err, tradeable_crowdsales);
    }
  );
};

module.exports.get_all_campaigns = async(req, res, next)=>{
  try {
    let all_campaigns = await Crowdsale.find({})
    if(!all_campaigns) throw("Coulnd't get all campaigns")
    res.json(all_campaigns)
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
  }  
}

module.exports.create_comment = async (req, res, next)=>{
    // logger.log(req.body)
    try {
      let {text, author_id, crowdsale_id} = req.body
  
      let new_comment = await Crowdsale.findByIdAndUpdate(crowdsale_id, {
        $push:{
          comments:{text, author_id, crowdsale_id}
        }
      })
      if(!new_comment)throw'error saving new comment'
  
      // logger.log(new_comment)
      res.send({ok:'ok'})
    } catch (err) {
      logger.log('err'.bgRed)
      logger.log(err)
      res.send({err}) 
    }
    
}

module.exports.add_new_update = async (req, res, next) => {
  const { text, title } = req.body;
  const {id, crowdsale_id} = req.user
  try {
    let update_created = await Update.add_update(
      {
        title,
        text
      },
      id, crowdsale_id
    );
    let crowdsale = await Crowdsale.findById({_id:crowdsale_id})
    crowdsale.updates.push(update_created._id)
    crowdsale.save()

    res.send({
      resp: update_created
    });
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    res.send({ err });
  }
};

module.exports.delete_crowdsale_photo = async (req, res, next) => {
  try {
    const photo = req.body.photo;
    logger.log(`delete this photo ${photo}`);
    const crowdsale_id = req.user.crowdsale_id;
    let { photos } = await Crowdsale.findByIdAndUpdate(
      { _id: crowdsale_id },
      { $pull: { photos: photo } },
      { new: true }
    );
    if (!photos) throw "Error deleting photo";
    res.send(photos);
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    res.send({ err });
  }
};

/* NOT SURE THIS IS NEEDED 3-4-19 4 year coding :P */
// module.exports.update_is_deployed = async ({
//   crowdsale_id,
//   crowdsale_address,
//   token_address
// }) => {
//   try {
//     let crowdsale = await Crowdsale.findByIdAndUpdate(crowdsale_id);
//     crowdsale.deployed_address = crowdsale_address;
//     crowdsale.is_deployed = true;
//     crowdsale.token_address = token_address;
//     await crowdsale.save();
//     return;
//   } catch (err) {
//     logger.log("err".bgRed);
//     logger.log(err);
//   }
// };

module.exports.update_data = async (crowdsale_data, crowdsale_address) => {
  logger.log({ crowdsale_address });
  logger.log(crowdsale_data);
  try {
    let crowdsale_saved = await Crowdsale.findOneAndUpdate(
      { deployed_address: crowdsale_address },
      crowdsale_data,
      { new: true }
    );

    logger.log("crowdsale_saved");
    // logger.log(crowdsale_saved)
    return crowdsale_saved;
  } catch (err) {
    throw err;
  }
};

module.exports.save_goal_reached_eth_price = async (
  crowdsale_id,
  eth_price
) => {
  try {
    let saved_crowdsale = await Crowdsale.findByIdAndUpdate(
      { _id: crowdsale_id },
      {
        eth_price_at_goal_reached: eth_price
      }
    );
    logger.log("saved_crowdsale");
  } catch (err) {
    throw err;
  }
};
module.exports.save_finalization_eth_price = async (
  crowdsale_id,
  eth_price
) => {
  try {
    let saved_crowdsale = await Crowdsale.findByIdAndUpdate(
      { _id: crowdsale_id },
      {
        eth_price_at_finalization: eth_price,
        isFinalized: true
      }
    );
    logger.log("saved_crowdsale");
  } catch (err) {
    throw err;
  }
};

module.exports.get_homepage_crowdsales = cb => {
  Crowdsale.find(
    {},
    {
      main_crowdsale_img: 1,
      zillow_data: 1,
      goal: 1,
      weiRaised: 1,
      downpayment: 1,
      dollar_goal: 1,
      description: 1,
      time_user_created: 1,
      address_line1: 1,
      user_likes: 1,
      formatted_address: 1,

      isFinalized: 1,
      is_canceled: 1,
      is_deployed: 1,
      goal_reached: 1,
      hasClosed: 1,
      closingTime: 1,
      openingTime: 1
    }
  )
    .limit(4)
    .exec((err, four_crowdsales) => {
      if (err) {
        logger.log("err".bgRed);
        return logger.log(err);
      } else {
        cb(null, four_crowdsales);
      }
    });
};

module.exports.add_crowdsale_created_to_db = async ({
  blockchain_crowdsale_data,
  campaign_address,
  token_address,
  crowdsale_id,
  retry_attempt
}) => {
  var retry_attempt = retry_attempt || 1;
  const current_block_number = await web3.eth.getBlockNumber();
  logger.log({ current_block_number });

  const crowdsale_data = {
    deployed_address: campaign_address.toLowerCase(),
    token_address: token_address.toLowerCase(),
    // owner: fundraiser_address.toLowerCase(),
    // wallet: wallet_address.toLowerCase(),
    last_block_updated: current_block_number.toString(),
    is_deployed: true,
    last_block_updated:current_block_number,
    block_deployed: current_block_number,
    ...blockchain_crowdsale_data
  };

  try {
    let crowdsale = await Crowdsale.findOneAndUpdate(
      { _id: crowdsale_id },
      crowdsale_data,
      { new: true }
    );

    return crowdsale;
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    if (retry_attempt <= 2) {
      module.exports.add_crowdsale_created_to_db(
        blockchain_crowdsale_data,
        campaign_address,
        token_address,
        crowdsale_id,
        ++retry_attempt
      );
      retry_attempt++;
    }
  }
};

module.exports.upload_crowdsale_photos = (req, res, next) => {
  logger.log(req.body);
  const form = new formidable.IncomingForm();
  form.multiples = true;
  form.uploadDir = __dirname + "/../../next_app/static/crowdsale_photos";
  let updated_photos_array;

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on("file", function(field, file) {
    logger.log("field - " + field + " : file - " + JSON.stringify(file));
    let ext = file.name;
    const index = ext.lastIndexOf(".");
    ext = ext.slice(index);
    logger.log("whats the upload file?");
    logger.log(file.path);
    var file_name = file.path.split("/");
    file_name = file_name[file_name.length - 1];

    Crowdsale.findByIdAndUpdate(
      {
        _id: req.user.crowdsale_id
      },
      {
        $push: {
          photos: file_name
        }
      },
      {
        new: true
      },
      (err, saved_crowdsale_photo) => {
        if (err) throw "error saving uploaded crowdsale photo";
        logger.log("saved_crowdsale_photo");
        updated_photos_array = saved_crowdsale_photo.photos;
      }
    );

    // resizeThisImage(file.path + ext)//TODO add Jimp
  });
  // log any errors that occur
  form.on("error", function(err) {
    logger.log("An error has occured: \n" + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on("end", function() {
    logger.log("end");
    setTimeout(() => {
      res.send(updated_photos_array);
    }, 1000);
  });

  // parse the incoming request containing the form data
  form.parse(req);
  // logger.log(form)
  logger.log(req.file);
  logger.log(req.files);

  //
};

async function  check_crowdsale_data_age(crowdsale){
  try {
        /* Check current BlockID */
        const {current_block_number} = await get_current_block_number()
        if(current_block_number == crowdsale.last_block_updated) return false;
        return true
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
  }
}

module.exports.get_campaign = async (req, res, next) => {
  // logger.log("TESETERTESER");
  let { campaign_id } = req.params;
  logger.log(campaign_id);
  /* check if its HEX or not..... */
  let ID = await module.exports.check_id(campaign_id)
  logger.log(ID)
  var crowdsale = await Crowdsale.findById(ID);

  if(crowdsale && crowdsale.is_deployed){
    /* Check age of data */
    if(! await check_crowdsale_data_age(crowdsale)) return   res.json(crowdsale);

    let bc_campaign_data = await get_current_state_of_crowdsale_on_blockchain(crowdsale.deployed_address)
    logger.log(`IS DEPLOYED GET THE DATA!!`)
    crowdsale = await Crowdsale.findByIdAndUpdate(ID, {
      ...bc_campaign_data
    }, 
    {new:true})
  }
  res.json(crowdsale);
};

module.exports.save_crowdsale_update = async (req, res, next) => {
  // logger.log(req.body)
  logger.log("save_crowdsale_update");
  delete req.body._csrf;
  /* Define specifiv things here, address, downpayment, etc */
  const {dollar_goal, downpayment, tax_id, description, main_crowdsale_img} = req.body;
  // logger.log(req.user.crowdsale_id)
  let saved_crowdsale = await Crowdsale.findByIdAndUpdate(
    {
      _id: req.user.crowdsale_id
    },
    {
      dollar_goal, downpayment, tax_id, description, main_crowdsale_img
    },
    {
      new: true
    }
  );

  if (!saved_crowdsale)
    return res.json({ error: "err updating crowdsale data" });
  return res.json({ resp: saved_crowdsale });
};

module.exports.init_crowdsale = async (req, res, next) => {
  logger.log(req.body);
  const { dollar_goal, downpayment } = req.body;
  const user_id = req.user.id;
  // req.checkBody('home_style', 'Home type is require').notEmpty()
  req.checkBody("dollar_goal", "Amount of money needed is require").notEmpty();
  req.checkBody("downpayment", "Down payment amount is require").notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    logger.log("errors");
    res.send({
      err: errors
    });
  } else {
    const new_crowdsale = new Crowdsale({
      user_id,
      dollar_goal,
      downpayment
    });
    try {
      let user_crowdsale = await new_crowdsale.save();
      // logger.log(user_crowdsale)
      // logger.log('whats happening????????????????/*  */')
      let updated_user = await User_Controller.findByIdAndUpdate(
        {
          _id: req.user._id
        },
        {
          crowdsale_init: true,
          crowdsale_id: user_crowdsale.id
          // wallet_addresses: body,//body has aray of public address?
        },
        { new: true }
      );
      // req.session.messages.push({'success':"Crowdsale Initiated"})
      res.send({
        user_crowdsale,
        updated_user
      });
    } catch (err) {
      logger.log("err".bgRed);
      logger.log(err);
      res.send({ err });
    }
  }
};

module.exports.save_my_story_update = async (req, res, next) => {
  try {
    // logger.log(req.body)
    logger.log("save_my_story_update");
    // delete req.body._csrf
    const { parsed_youtube_link, risk_factors, written_story } = req.body;
    // logger.log(req.user.crowdsale_id)
    let saved_crowdsale = await Crowdsale.findByIdAndUpdate(
      {
        _id: req.user.crowdsale_id
      },
      { parsed_youtube_link, risk_factors, written_story },
      {
        new: true
      }
    );
    if (!saved_crowdsale) throw "Error saving Campaign update";
    res.send({ resp: saved_crowdsale });
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);

    logger.log(err);
    res.send({ err: "err updating crowdsale data" });
  }
};
