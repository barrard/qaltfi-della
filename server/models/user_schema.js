const mongoose = require('mongoose')

const user_schema = mongoose.Schema({
  auth_method:String,//LOCAL, FACEBOOK, GOOGLE, etc...
  // auth0: {
  //   id: String,
  //   token: String,
  //   email: String,
  //   name: String
  // },
  facebook: {
    id: String,
    token: String,
    facebook_account_confirm:Boolean,
    // email: String,
    // name: String
  },
  // linkedin: {
  //   id: String,
  //   token: String,
  //   email: String,
  //   name: String
  // },
  google: {
    id: String,
    token: String,
    google_account_confirm:Boolean,

    // email: String,
    // name: String
  },
  // twitter: {
  //   id: String,
  //   token: String,
  //   email: String,
  //   name: String
  // },
  created: {
    type: Date,
    default: Date.now
  },
  primary_email:{
    type: String,
    unique: true,
    default:''
  },
  emails: {
    type: [String],
    // unique: true,
    default:[]
  },
  email_verifed:{
    type:Boolean, default:false
  },
  primary_phone:{
    type: String,
    default:''
    // unique: true,
  },
  phone_numbers:{
    type:[String],default:[]
  },
  phone_verified:{
    type:Boolean, default:false
  },
  firstname: {
    type: String,
    default: 'firstname'
  },
  lastname: {
    type: String,
    default: 'lastname'
  },
  display_name:{
    type:String,
    default:'Full Name'
  },
  main_profile_img: {
    type: String,
    default: ''
  },
  profile_imgs: {
    type: [String],
    default: []
  },
  password: {
    type: String,
    default: ''
  },
  is_approved: {
    type: Boolean,
    default: false
  },
  signed_terms_and_agreement: {
    type: Boolean,
    default: false
  },

  current_address: {
    street_number: {
      type: String,
      default: 'address line 1'
    },
    route: {
      type: String,
      default: 'address line 2'
    },
    locality: {
      type: String,
      default: 'City'
    },
    region: {
      type: String,
      default: 'State'
    },
    postal_code: {
      type: String,
      default: 'Zip'
    },
    country: {
      type: String,
      default: 'Country'
    },
    lat: {
      type: Number,
      default: 0
    },
    lng: {
      type: Number,
      default: 0
    },
    formatted_address: {
      type: String,
      default: ''
    }
  },
  has_wallet: {
    type: Boolean,
    default: false
  },
  crowdsale_init: {
    type: Boolean,
    default: false
  },
  crowdsale_deployed: {
    type: Boolean,
    default: false
  },
  liked_crowdsales: [{ type: mongoose.Schema.Types.ObjectId, ref: "Crowdsale", require: false }],
  crowdsale_id: {
    type: String,
    default: ''
  },
  wallet_addresses: {
    type: [String],
    default: []
  },
  user_youtube_link: {
    type: String,
    default: ''
  },
  social_media: {
    facebook: {
      type: String,
      default: ''
    },
    twitter: {
      type: String,
      default: ''
    },
    instagram: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    },
  },
  website: {
    type: String,
    default: ''
  },
  income: {
    type: String,
    default: ''
  },
  assets: {
    type: String,
    default: ''
  },
  education: {
    type: String,
    default: ''
  },
  credit_score: {
    type: String,
    default: ''
  },
  background_check: {
    type: String,
    default: ''
  },
  biography: {
    type: String,
    default: 'Bio about this person'
  },
  // family: { type: String, default: '' },
  // hobbies: { type: String, default: '' },
  signed_contract_legal_agreement: {
    type: Boolean,
    default: false
  },
  ip:{
    type:String,
    default:'0.0.0.0'

  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment", require: false }],

  transactionHashes: {
    type: [String],
    default: []
  },
  transaction_receipt: {
    type: [{}],
    default: []
  },
  socket_id:{
    type:String
  },
  transaction_in_progress:{
    type:Boolean,
    default:false
  },
  user_held_token_addresses: [
     String,
  ],
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
  tokens_for_sale: [{
    seller_index: String,
    token_index: String,
    time: String,
    token_address: String,
    crowdsale_address: String,
    wei_amount: String,
    // transactionHash:{type:[String], default:[]},
    token_amount: Number
  }],
  notifications: [{
    data:{},
    time: {
      type: Date,
      default: Date.now
    },
    title: {
      type: String,
      default: ''
    },
    body: {
      type: String,
      default: ''
    },
    link_path: {
      type: String,
      default: ''
    },
    seen: {
      type: Boolean,
      default: false
    }

  }]

})

// user_schema.methods.generateHash = function (password) {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
// }

// user_schema.methods.validPassword = async (password) => {
//   try {
//     let is_match = await bcrypt.compare(password, this.password)
//     return is_match;
//   } catch (err) {
//     logger.log('err'.bgRed)
//     logger.log(err)
//     throw err
//   }
// }

module.exports = mongoose.model('User', user_schema)