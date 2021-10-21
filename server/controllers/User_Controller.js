const bcrypt = require("bcrypt");
const formidable = require("formidable");
const {
  get_current_state_of_crowdsale_on_blockchain
} = require("../services/campaign_functions.js");
// const Socket_emitter = require('../socket_server.js').emit_event_to;
const Socket_emitter = () => {
  logger.log("Socet emitter");
};

var mongoose = require("mongoose");

var user_schema = require("../models/user_schema.js");
const twilio = require("../services/twilio.js");
const sendgrid = require("../services/sendgrid.js");

const User = user_schema;
module.exports = User;

// User.verify_email = verify_email;

// async function verify_email(req, token) {
//   try {
//   } catch (err) {
//     logger.log("err".bgRed);
//     logger.log(err);
//     if (err.errmsg && err.errmsg.startsWith("E11000"))
//       throw `The email address ${email} is registered to another account`;
//     throw err;
//   }
// }


module.exports.get_user_comment_data = async (req, res, next) => {
  try {
    logger.log(req.params)
    logger.log(req.params)
    logger.log(req.params)
    logger.log(req.params)
    logger.log(req.params)
    let{id} = req.params
    let user_comment_data = await User.findById(id, {
      firstname:1,
lastname:1,main_profile_img:1
    })
    res.json( user_comment_data )
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
  }
  
}

module.exports.add_transactionHash_to_account = async (req, res, next) => {
  try {
    const { transactionHash, default_account } = req.body;
    const { id } = req.user;
    const updated_user = await User.findByIdAndUpdate(id, {
      $push: {
        transactionHashes: transactionHash
      }
    });
    if (!updated_user) throw "Error adding transaction hash to user";
    res.send("ok");
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
  }
};
/* BAd idea on second thought.....  Just save the Transacaction HAsh */
module.exports.add_receipt_to_account = async (req, res, next) => {
  try {
    logger.log(req.body);
    const receipt = JSON.parse(req.body.receipt);
    const { id } = req.user;
    const updated_user = await User.findByIdAndUpdate(id, {
      $push: {
        transaction_receipt: receipt
      }
    });
    if (!updated_user) throw "Error adding transaction hash to user";
    res.send("ok");
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
  }
};

module.exports.IP_checker = async (req, res, next) => {
  try {
    const { ip, user } = req;
    const { id } = user;
    const saved_ip = await User.findByIdAndUpdate(id, { ip }, { new: true });
    if (!saved_ip) throw "Error saving the IP";
    res.send({ saved_ip, ip, id });
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    res.send({ err });
  }
};

module.exports.start_transaction_in_progress = async user_address => {
  try {
    // logger.log(`setting transaction in progress for ${user_address} `)
    let user = await User.get_user_by_address(user_address);
    if (!user) throw "user not found";
    user.transaction_in_progress = true;
    let saved = await user.save();
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
  }
};

module.exports.set_user_socket_id = async (user_id, socket_id) => {
  try {
    // logger.log({ user_id, socket_id })
    let user = await User.findByIdAndUpdate(user_id);
    user.socket_id = socket_id;
    user.save();
    // logger.log('saved new socket id'.bgYellow)
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    logger.log("user must not exist?".red);
  }
};
module.exports.get_user_socket_id = async user_id => {
  try {
    // logger.log({ user_id })
    let user = await User.findById(user_id);
    if (!user) throw "User not found";
    return user.socket_id;
  } catch (err) {
    logger.log("err");
    logger.log(err);
    throw err;
  }
};
module.exports.stop_transaction_in_progress = async user_address => {
  try {
    // logger.log(user_address)
    let user = await User.get_user_by_address(user_address);
    user.transaction_in_progress = false;
    logger.log(`Stop transaction in progress for ${user.socket_id}`.blue);
    let saved = await user.save();
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    //errors when admin does stuff
  }
};
module.exports.Terms_and_agreement_signed = async event_data => {
  // logger.log(event_data)
  // logger.log(event_data.event_time)
  // logger.log(event_data.fundraiser_address)
  // logger.log(event_data.name)
  try {
    let user = await User.get_user_by_address(event_data.fundraiser_address);

    user.signed_terms_and_agreement = true;
    saved_user = await user.save();

    // logger.log('user Terms_and_agreement_signed saved')
    event_data.transaction_type = "Fundraiser Approved";
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    // reject (err);
  }
};
module.exports.Approved_fundraiser = async event_data => {
  // logger.log(event_data)
  // logger.log(event_data.event_time)
  // logger.log(event_data.fundraiser_address)
  try {
    let user = await User.get_user_by_address(event_data.fundraiser_address);
    if (!user)
      throw `User with address ${event_data.fundraiser_address} not found`;
    // logger.log(user)
    user.is_approved = true;
    event_data.transaction_type = "Fundraiser Approved";

    let saved_user = await user.save();

    logger.log("user Approved_fundraiser saved");
    const notification = {
      time: new Date().getTime(),
      title: "Approved Fundraiser!!",
      body: `You have been approved to create a campaign`,
      link_path: `/edit-finalize`,
      data: event_data
    };
    User.notify(user._id, notification);
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    // reject (err);
  }
};

module.exports.like = async ({ user_id, crowdsale_id }) => {
  try {
    let user = await User.findById(user_id);
    logger.log(user.liked_crowdsales);
    if (user.liked_crowdsales.indexOf(crowdsale_id) != -1)
      throw "User already liked this";
    user.liked_crowdsales.push(crowdsale_id);
    let saved_user = await user.save();
    return saved_user.liked_crowdsales;
  } catch (err) {
    throw err;
  }
};

module.exports.find_user_by_crowdsale_id = async crowdsale_id => {
  let user = await User.findOne({ crowdsale_id });
  // logger.log(user)
  return user.id;
};

module.exports.check_id = user_id => {
  return new Promise(async function(resolve, reject) {
    try {
      if (!user_id) reject("no user id");
      if (user_id.startsWith("0x")) {
        // logger.log(`user_id startsWith 0X ${user_id}`)
        let user = await User.findOne({
          wallet_addresses: {
            $in: user_id
          }
        });
        // logger.log(user._id)
        resolve(user._id);
      } else {
        resolve(user_id);
      }
    } catch (err) {
      logger.log("err".bgRed);
      logger.log(err);
      reject(err);
    }
  });
};

module.exports.get_campaign_owner = async (req, res, next) => {
  const { campaign_owner_id } = req.params;
  let campaign_owner = await User.findById(campaign_owner_id);
  logger.log("campaign_owner");

  res.json(campaign_owner);
};

module.exports.set_campaign_deployed = async (req, res, next) => {
  const user_id = req.user.id;
  const {
    campaign_address,
    token_address,
    wallet_address,
    transactionHash,
    blockNumber
  } = req.body;
  try {
    logger.log({
      campaign_address,
      token_address,
      wallet_address,
      transactionHash,
      blockNumber
    });
    let user = await User.findById(user_id);
    /* Sanity Check look up to make sure the wallet address matches */
    let wallet_index = user.wallet_addresses.indexOf(
      wallet_address.toLowerCase()
    );
    if (wallet_index < 0)
      return res.send({ err: "Sorry, this doesn't belong to you" });
    user.crowdsale_deployed = true;
    let updated_user = await user.save();
    const { crowdsale_id } = user;
    let blockchain_crowdsale_data = await get_current_state_of_crowdsale_on_blockchain(
      campaign_address
    );
    const Crowdsale_Controller = require("./Crowdsale_Controller.js");

    let new_crowdsale_data = await Crowdsale_Controller.add_crowdsale_created_to_db(
      {
        campaign_address,
        blockchain_crowdsale_data,
        campaign_address,
        token_address,
        crowdsale_id
      }
    );
    res.send({ updated_user, new_crowdsale_data });
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    res.send({ err });
  }
};

// module.exports.update_data = async (user_id, data_obj) => {
//   try {
//     // logger.log('USER.update_data'.bgMagenta)
//     let user_id = await module.exports.check_id(user_id)
//     let updated_user = await User.findByIdAndUpdate({
//       _id: user_id
//     }, data_obj)
//     return (updated_user)
//   } catch (err) {
//     logger.log('err'.bgRed)
//     logger.log(err)
//     return (err)
//   }
// }
module.exports.verify_email = async (req, res, next) => {
  try {
    logger.log(req.query.token);
    logger.log(req.session);
    let verified = req.session.email_token == req.query.token;
    logger.log(verified);
    let token = req.query.token;

    if (verified) {
      const verification_tokens = require("./../models/verification_tokens.js");
      //var makes the email available in the catch block
      var email = await verification_tokens.get_email_for_token(token);
      logger.log(email);
      if (!email) throw "No token found";

      let user = await User.findById(req.user.id);
      let user_email = user.primary_email;

      if (user_email != email) {
        logger.log("Update primary email address");
        user.primary_email = email;
        user.emails.push(email);
      }
      user.email_verifed = true;
      delete req.session.email_token;
      await user.save();
      req.session.messages.push({
        success: `Your email has been verified ${email}!`
      });
      res.redirect("/account");
      // return res.json({
      //   success: `Your email has been verified ${email}!`});
    } else {
      req.session.messages.push({
        danger: "The email verification failed, please try again"
      });
      res.json({ error: "There was an error verifying this email address" });
    }
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    req.session.messages.push({ danger: err });
    if (err.errmsg && err.errmsg.startsWith("E11000"))
      return res.json({
        error: `The email address ${email} is registered to another account`
      });

    return res.json({
      error: "There was an error verifying this email address"
    });
  }
};

module.exports.resend_email_verification = async (req, res) => {
  try {
    const email = req.body.email;
    logger.log({ email });
    req.checkBody("email", "Email address is require").notEmpty();
    req.checkBody("email", "Email address is not valid").isEmail();
    const errors = await req.validationErrors();
    if (errors) {
      logger.log(errors);
      throw errors[0].msg;
    }
    //////////////TODO  Wrap this in a function somewhere ///////////////////////////
    let token = require("../server-utils.js").generate_token();
    req.session.email_token = token;
    let sent = await sendgrid.verify_email(
      email,
      req.session.email_token,
      process.env.VERIFY_EMAIL_URL
    );
    //////////////TODO  Wrap this in a function somewhere ///////////////////////////
    logger.log(`sent : ${sent}`);
    res.send({ resp: { email } });
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    res.send({ err: { err, email } });
  }
};

module.exports.verify_phone_token = async (req, res) => {
  try {
    logger.log("verify_phone_token");
    logger.log(req.body);
    const token = req.body.token;
    const user_token = req.session.phone_token;
    if (token !== user_token) throw "Incorrect verification code.";
    delete req.session.phone_token;
    let user = await User.findById(req.user.id);
    user.phone_verified = true;
    await user.save();
    delete req.session.phone_token;

    res.send({ resp: { phone: req.user.phone_numbers[0], verified: true } });
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    res.send({ err });
  }
};

module.exports.send_phone_verification = async (req, res) => {
  try {
    //check how many times this user has done this, limit is 5?
    let phone = req.body.phone;
    const user_phone = req.user.phone_numbers[0];
    logger.log({ phone, user_phone });

    const is_number = isNaN(phone);
    if (phone.length == 11) {
      phone = phone.split("");
      phone.shift();
      phone = phone.join("");
    }
    if (phone.length != 10 || is_number) throw "Phone number is invalid";
    //wait till we have a nice phone number to send incase of error
    if (!req.session.phone_verification_attempt_count)
      req.session.phone_verification_attempt_count = 0;
    let count = req.session.phone_verification_attempt_count;
    if (count >= 5)
      throw {
        message:
          "Exeeded Phone verification attempts, please contact help@della.one"
      };

    req.session.phone_verification_attempt_count++;

    if (phone !== user_phone) {
      logger.log({ phone, user_phone });
      logger.log("New number??".bgGreen);
      let user = await User.findById(req.user.id);
      user.phone_numbers.unshift(phone);
      await user.save();
    }
    let token = require("../server-utils.js").generate_phone_token();
    logger.log(`${token}`.bgWhite);
    req.session.phone_token = token;

    await twilio.verify_phone(phone, token);

    res.send({ resp: { phone } });
  } catch (err) {
    logger.log(err);
    logger.log("err".bgRed);
    //err has message and code
    const { message, code } = err;
    res.send({ err: { message, code, phone } });
  }
};

module.exports.upload_profile_imgs = async (req, res, next) => {
  logger.log(req.body);
  const form = new formidable.IncomingForm();
  form.multiples = true;
  form.uploadDir = __dirname + "/../../next_app/static/user_profile_imgs";
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

    User.findByIdAndUpdate(
      {
        _id: req.user.id
      },
      {
        main_profile_img: file_name,
        $push: {
          profile_imgs: file_name
        }
      },
      {
        new: true
      },
      (err, updated_user_profile) => {
        if (err) throw "error saving uploaded crowdsale photo";
        logger.log("Image uploaded");
        updated_photos_array = updated_user_profile.profile_imgs;

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
  logger.log(req.uploads);
  logger.log(req.files);
};

module.exports.update_user_profile = async (req, res, next) => {
  try {
    let _id = req.user._id;
    const data = ({
      firstname,
      lastname,
      main_profile_img,
      biography,
      current_address,
      user_youtube_link
    } = req.body);
    logger.log(data.main_profile_img)
    logger.log(_id);
    let updated_user = await User.findOneAndUpdate(
      {
        _id
      },
      data
    );
    if (!updated_user) throw "Error updating user information";
    res.send({ updated_user });
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    res.send({ err });
  }
};

/* Save token address to user who recived the token */
/* Used to keep track of who owns what token address */
/* and the balance can be obtained with web3 */
module.exports.save_token_transfer_data = async receipt_data => {
  // logger.log(receipt_data)
  let { returnValues, transactionHash, address } = receipt_data;
  let { to, from, amount } = returnValues;
  logger.log({to, from, amount, address, transactionHash})
  let users = await User.updateMany(
    {
      /* Multiple users may have the same wallet? */
      wallet_addresses: {
        $in: [to.toLowerCase()]
      }
    },
    {
      /* Add transaction has */
      $addToSet: {
        transactionHashes: transactionHash
      },
      /* add token address to lower case */
      $addToSet: {
        user_held_token_addresses: address.toLowerCase()
      }
    }
  );
  logger.log(users)
};

module.exports.add_account_address = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { address } = req.body;
    logger.log(address);
    let saved = await User.findOneAndUpdate(
      { _id },
      { $addToSet: { wallet_addresses: address.toLowerCase() } }
    );
    if (!saved) throw "error saving new wallet address";
    res.send({ ok: "ok" });
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    res.send({ err });
  }
};

module.exports.remove_account_address = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { address } = req.body;
    let saved = await User.findOneAndUpdate(
      { _id },
      { $pull: { wallet_addresses: address.toLowerCase() } }
    );
    if (!saved) throw "error saving new wallet address";
    res.send({ ok: "ok" });
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    res.send({ err });
  }
};

module.exports.get_user_by_address = async user_address => {
  try {
    let user = await User.findOne({
      wallet_addresses: {
        $in: [user_address.toLowerCase()]
      }
    });

    return user;
  } catch (err) {
    logger.log("err || !user".bgRed);
    logger.log(err);
    return err;
  }
};

module.exports.add_bid_for_tokens = async bid_for_tokens_data => {
  const { bidder_address } = bid_for_tokens_data;
  // const { token_address, token_amount, wei_amount, bidder_address } = tokens_for_sale_data
  try {
    let user_add_bid = await User.findOneAndUpdate(
      {
        wallet_addresses: {
          $in: [bidder_address]
        }
      },
      {
        $push: { bids_for_tokens: bid_for_tokens_data }
      }
    );
    if (!user_add_bid)
      throw `couldnt add bid for user with public address ${bidder_address}`;
    // Socket_emitter(user_add_bid.socket_id, "Bid_For_Tokens_Event", bid_for_tokens_data)
    // logger.log('user bid_for_tokens_ event updated'.yellow)
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
  }
};

module.exports.set_tokens_for_sale = async tokens_for_sale_data => {
  const { token_address, token_amount, seller_address } = tokens_for_sale_data;
  try {
    let user = await User.findOneAndUpdate(
      {
        wallet_addresses: {
          $in: [seller_address]
        },
        "tokens.token_address": token_address
      },
      {
        $inc: { "tokens.$.amount": token_amount * -1 },
        $push: { tokens_for_sale: tokens_for_sale_data }
      },
      { new: true, upsert: true }
    );
    if (!user) throw "Cant find that user!!!!!!";
    //Emit an event
    // logger.log(user)
    Socket_emitter(user.socket_id, "Set_Tokens_For_Sale", tokens_for_sale_data);
    // logger.log('user set_tokens_for_sale'.bgYellow)
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
  }
};

module.exports.notify = async (user_id, data) => {
  try {
    data.seen = false;
    // logger.log(`Notify ${user_id}`)
    let user = await User.findByIdAndUpdate(
      user_id,
      {
        $push: { notifications: data }
      },
      { new: true }
    );
    let socket_id = user.socket_id;
    let new_notification = user.notifications[user.notifications.length - 1];
    // const new_notification =
    Socket_emitter(socket_id, "notification", new_notification);
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    //will throw error is admin does stuff
  }
};

module.exports.update_purchase_token_for_sale = async purchase_token_for_sale_event_data => {
  //rmove tokens for sale form seller
  // logger.log('purchase_token_for_sale_event_data'.bgMagenta)
  // logger.log(purchase_token_for_sale_event_data)
  const {
    token_address,
    seller_address,
    buyer_address,
    token_amount,
    seller_index,
    token_index
  } = purchase_token_for_sale_event_data;

  try {
    let updated_seller = await User.findOneAndUpdate(
      {
        wallet_addresses: { $in: [seller_address] }
      },
      {
        $pull: {
          tokens_for_sale: {
            seller_index: seller_index,
            token_index: token_index
          }
        }
      }
    );
    if (!updated_seller) throw "couldnt update seller data after token sold";
    Socket_emitter(
      updated_seller.socket_id,
      "Purchase_Tokens_For_Sale_Event",
      purchase_token_for_sale_event_data
    );

    logger.log("updated_seller thier token for sale sold success".green);
    const notification = {
      time: new Date().getTime(),
      title: "Your Tokens on the Marketplace Have Sold!",
      body: `${buyer_address}, has purchased your token from ${token_address}`,
      link_path: `/account-balances`,
      data: purchase_token_for_sale_event_data
    };
    User.notify(updated_seller.id, notification);

    //add tokeen to buyer

    const purchaser = buyer_address; //just how add token wants it....as purchaser
    const amount = token_amount; // same here..  (token) amount is gooood
    const crowdsale_details = await require("./crowdsale.js").findOne(
      {
        token_address
      },
      { deployed_address: 1 }
    );
    const crowdsale_address = crowdsale_details.deployed_address;
    User.add_token_purchase({
      //this function doesnt returns anything
      amount,
      purchaser,
      crowdsale_address,
      token_address
    }); //emits its on socket event
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    throw err;
  }
};

module.exports.cancle_bid_for_tokens = async event_data => {
  const {
    bidder_address,
    token_address,
    token_amount,
    bidder_index,
    token_index
  } = event_data;
  try {
    let user_remove_BFT = await User.remove_bid_for_tokens(event_data);
    if (!user_remove_BFT) throw "error canceling bid for token";
    else
      Socket_emitter(
        user_remove_BFT.socket_id,
        "Cancel_Bid_For_Tokens_Event",
        event_data
      );
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
  }
};
module.exports.remove_bid_for_tokens = async event_data => {
  try {
    console.log({ event_data });
    const { bidder_address, bidder_index, token_index } = event_data;
    // logger.log({ event_data })
    let user_remove_BFT = await User.findOneAndUpdate(
      {
        wallet_addresses: {
          $in: [bidder_address]
        },
        "bids_for_tokens.bidder_index": bidder_index,
        "bids_for_tokens.token_index": token_index
      },
      {
        $pull: {
          bids_for_tokens: {
            bidder_index: bidder_index,
            token_index: token_index
          }
        }
      }
    );
    if (!user_remove_BFT)
      throw `Couldnt remove bid from user address ${bidder_address}`;
    return user_remove_BFT;
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
  }
};

module.exports.remove_tokens_for_sale = async ({ event_data, user_id }) => {
  try {
    const {
      seller_address,

      seller_index,
      token_index
    } = event_data;
    let user_remove_TFS = await User.findOneAndUpdate(
      {
        _id: user_id
      },
      {
        $pull: {
          tokens_for_sale: {
            seller_index: seller_index,
            token_index: token_index
          }
        }
      },
      { new: true }
    );
    if (!user_remove_TFS) throw "Error trying to pull TFS document from array";
    return user_remove_TFS;
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
  }
};
module.exports.cancel_tokens_for_sale = async event_data => {
  const {
    seller_address,
    token_address,
    token_amount,
    seller_index,
    token_index,
    wei_amount,
    time
  } = event_data;
  try {
    // logger.log({ event_data })
    let user_tokens_inc = await User.findOneAndUpdate(
      {
        wallet_addresses: {
          $in: [seller_address]
        },
        "tokens.token_address": token_address
      },
      {
        $inc: { "tokens.$.amount": token_amount }
      }
    );
    if (!user_tokens_inc)
      throw "no user found to $inc amount for cancel tokens for sale";
    const user_id = user_tokens_inc._id;
    let user_remove_TFS = await User.remove_tokens_for_sale({
      event_data,
      user_id
    });

    if (!user_remove_TFS) throw "Error trying to pull TFS document from array";

    Socket_emitter(
      user_remove_TFS.socket_id,
      "Cancel_Tokens_For_Sale_Event",
      event_data
    );
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    // throw err
  }
};

module.exports.add_bid_for_tokens_accepted_to_database = async event_data => {
  const {
    buyer_address,
    seller_address,
    token_address,
    token_amount,
    seller_index,
    token_index
  } = event_data;
  //user who sold tokens, remove the tokens for sale object?
  try {
    //remove the bid from the buyer, and add the token as a burche
    const bidder_address = buyer_address;
    const bidder_index = seller_index;
    let user_remove_BFT = await User.remove_bid_for_tokens({
      bidder_address,
      bidder_index,
      token_index
    });

    //amount, purchaser, crowdsale_address, token_address
    const amount = token_amount;
    const purchaser = bidder_address;
    const crowdsale_address = await require("./crowdsale.js").findOne(
      {
        token_address
      },
      { deployed_address: 1 }
    );

    //after removing the accepted bid, aslo add the token
    await User.add_token_purchase({
      amount,
      token_address,
      purchaser,
      crowdsale_address
    });
    Socket_emitter(
      user_remove_BFT.socket_id,
      "Bid_For_tokens_Accepted_Event",
      event_data
    );

    //also reduce the sellers tokens
    let updated_seller = await findByIdAndUpdate(
      {
        wallet_addresses: {
          $in: [seller_address]
        },
        "tokens.token_address": token_address
      },
      {
        $inc: {
          "tokens.amount": amount * -1
        }
      }
    );
    Socket_emitter(
      updated_seller.socket_id,
      "Accepted_Bid_For_tokens_Event",
      event_data
    );
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    throw err;
  }
};

module.exports.add_token_purchase = async event_returnValues => {
  logger.log(event_returnValues);
  try {
    const {
      amount,
      purchaser,
      crowdsale_address,
      token_address
    } = event_returnValues;
    logger.log({
      amount,
      purchaser,
      crowdsale_address,
      token_address
    });
    var user_updated_token_purchase = await User.findOneAndUpdate(
      {
        wallet_addresses: {
          $in: [purchaser]
        },
        "tokens.token_address": token_address
      },
      {
        $inc: { "tokens.$.amount": amount }
      }
    );
    if (!user_updated_token_purchase) {
      // logger.log('no user?'.blue)
      // logger.log('Ok we try and add the new token obj to the array'.yellow)
      user_updated_token_purchase = await User.findOneAndUpdate(
        {
          wallet_addresses: {
            $in: [purchaser]
          }
        },
        {
          $push: {
            tokens: {
              token_address,
              crowdsale_address,
              amount
            }
          }
        }
      );
      if (!user_updated_token_purchase) {
        logger.log("Still no user?! this is bad".bgRed);
      } else {
        Socket_emitter(
          user_updated_token_purchase.socket_id,
          "Purchase_Tokens_Event",
          event_returnValues
        );
        // logger.log('Tokens added to user'.bgBlue)
      }
    } else {
      Socket_emitter(
        user_updated_token_purchase.socket_id,
        "Purchase_Tokens_Event",
        event_returnValues
      );

      // logger.log('Tokens added to user'.bgBlue)
    }
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    throw err;
  }
};

// module.exports.add_notification = (event, event_data) => {
// logger.log(`Add notification for ${event}`.bgMagenta)
// logger.log({ event, event_data})

// 23:38:28.94 <log> Approved_fundraiser (in receipt.js:74)
// 23:38:28.94 <log> { event: 'Approved_fundraiser',
//   transactionHash: '0x2d0e13cf184eae68d3a70b88ba915739a54528eeb4a126b8ce0cdfc50c5952b2',
//   returnValues:
//    Result {
//      event_time: '1533202702',
//      fundraiser_address: '0x711bb15e0764455f8add4de962031937f9bc1d3f' } } (in receipt.js:80)

//   16:13:52.14 <log> Add notification for finalized (in user.js:424)
// 16:13:52.14 <log> { event: 'finalized',
//   event_data:
//    Result {
//      crowdsale_address: '0xbeb5b29b99c1f00a4145d537c8b751866bb76bc9' } }

// 16:33:40.11 <log> Add notification for new bid for token (in user.js:427)
// 16:33:40.11 <log> { event: 'new bid for token',
//   event_data:
//    Result {
//      token_address: '0xebb7eee47d28c1f4a356d5b2e8de295bdbbf0f8d',
//      bidder_address: '0xf311e3f69d205db87773e0c8d95cceec579700e7',
//      token_amount: '2',
//      wei_amount: '330000000000000000',
//      bidder_index: '1',
//      token_index: '1',
//      time: '1532658816' } } (in user.js:428)

// 16:37:28.39 <log> Add notification for bid for tokens accepted (in user.js:428)
// 16:37:28.39 <log> { event: 'bid for tokens accepted',
//   event_data:
//    Result {
//      token_address: '0xebb7eee47d28c1f4a356d5b2e8de295bdbbf0f8d',
//      seller_address: '0xf4cfebc357ae6b0918d6c6cb753f94171b4e6a6e',
//      buyer_address: '0xf311e3f69d205db87773e0c8d95cceec579700e7',
//      token_amount: '10',
//      wei_amount: '1000000000000000000',
//      seller_index: '0',
//      token_index: '0',
//      time: '1532659041' } } (in user.js:429)

// 6:42:58.14 <log> Add notification for cancel bid for tokens (in user.js:428)
// 16:42:58.14 <log> { event: 'cancel bid for tokens',
//   event_data:
//    Result {
//      token_address: '0x056d77dbcd9ae16b815c620c986e3a844f68dee4',
//      bidder_address: '0x66e47abdf54b2396bc44247036eaa18a6c3c97b5',
//      token_amount: '4',
//      wei_amount: '1000000000000000000',
//      bidder_index: '2',
//      token_index: '5',
//      time: '1532659371' } } (in user.js:429)

// 16:44:28.29 <log> Add notification for new token for sale (in user.js:428)
// 16:44:28.29 <log> { event: 'new token for sale',
//   event_data:
//    Result {
//      token_address: '0xec7b3ea246413aa863bbf4f4f9c339119bcdd7ba',
//      seller_address: '0x66e47abdf54b2396bc44247036eaa18a6c3c97b5',
//      token_amount: '1',
//      wei_amount: '1000000000000000000',
//      seller_index: '2',
//      token_index: '2',
//      time: '1532659461' } } (in user.js:429)

// 16:52:19.52 <log> Add notification for token purchase (in user.js:428)
// 16:52:19.52 <log> { event: 'token purchase',
//   event_data:
//    { amount: '1',
//      purchaser: '0xf4cfebc357ae6b0918d6c6cb753f94171b4e6a6e',
//      crowdsale_address: '0xec7b3ea246413aa863bbf4f4f9c339119bcdd7ba',
//      token_address: '0xec7b3ea246413aa863bbf4f4f9c339119bcdd7ba' } } (in user.js:429)

// 20:24:25.74 <log> Add notification for cancel tokens for sale (in user.js:428)
// 20:24:25.74 <log> { event: 'cancel tokens for sale',
//   event_data:
//    Result {
//      token_address: '0xec7b3ea246413aa863bbf4f4f9c339119bcdd7ba',
//      seller_address: '0x66e47abdf54b2396bc44247036eaa18a6c3c97b5',
//      token_amount: '1',
//      wei_amount: '150000000000000000',
//      seller_index: '4',
//      token_index: '4',
//      time: '1532672661' } } (in user.js:429)

// 20:46:07.02 <log> Add notification for crowdsale started (in user.js:428)
// 20:46:07.02 <log> { event: 'crowdsale started',
//   event_data:
//    Result {
//      event_time: '1532673921',
//      fundraiser_address: '0x6bd5c3a677646100a5a7aa4fb478453cb5cb964f',
//      crowdsale_address: '0x682d059028676e7086c8651acb0722570d1fa747',
//      token_address: '0xaf09dffcd7b8ad36b593a52353d2cd96a9f3edfe' } } (in user.js:429)

// 20:47:38.01 <log> Add notification for token purchase (in user.js:428)
// 20:47:38.01 <log> { event: 'token purchase',
//   event_data:
//    Result {
//      purchaser: '0x6bd5c3a677646100a5a7aa4fb478453cb5cb964f',
//      beneficiary: '0x6bd5c3a677646100a5a7aa4fb478453cb5cb964f',
//      crowdsale_address: '0x682d059028676e7086c8651acb0722570d1fa747',
//      token_address: '0xaf09dffcd7b8ad36b593a52353d2cd96a9f3edfe',
//      event_time: '1532674056',
//      value: '2157776600000000000',
//      amount: '20',
//      refund_amount: '0' } } (in user.js:429)
// }

module.exports.get_user_by_id = (id, cb) => {
  User.findById(id, cb);
};
module.exports.get_user_by_email = async email => {
  try {
    const query = {
      primary_email: email
    };
    let user = await User.findOne(query);
    return user;
  } catch (err) {
    throw err;
  }
};

module.exports.compare_password = async (password, hash) => {
  try {
    let is_match = await bcrypt.compare(password, hash);
    return is_match;
  } catch (err) {
    throw err;
  }
};

module.exports.create_user = new_user => {
  // logger.log('CREATE USER!!')
  return new Promise(async function(resolve, reject) {
    try {
      // logger.log('CREATE USER!!')

      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(new_user.password, salt);
      new_user.password = hash;
      let user = await new_user.save();
      resolve(user);
    } catch (err) {
      reject(err);
    }
  });
};
