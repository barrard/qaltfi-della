const colors = require('colors');
const logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})
const mongoose = require('mongoose');



const Verification_token_schema = mongoose.Schema({

  token: {
    type:String, require:true
  },
  email: {type:String},
  phone: {type:String},
  created: { type: Date, default: Date.now },


})

const Verification_token = module.exports = mongoose.model('verification_token', Verification_token_schema)

Verification_token.save_token = save_token
Verification_token.get_email_for_token = get_email_for_token


async function get_email_for_token(token){
  try {
    let verification_token_obj = await Verification_token.findOne({token})
    if(!verification_token_obj)throw 'No token object found'
    let now = Date.now()
    let time_since = now - verification_token_obj.created
    logger.log(time_since)
    let time_limit = (1000 * 60 * 10)//ten min in miliseconds
    if(time_since > time_limit ) throw 'This token has expired, please request a new one'
    let email = verification_token_obj.email
    return email
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    throw err
  }

}

async function save_token({token, email, phone}){
  try {
    let new_verification_token = new Verification_token({
      token, email, phone
    })
    await new_verification_token.save()
    logger.log('verification token saved')
    logger.log(new_verification_token)
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    
  }
}