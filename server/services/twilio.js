require('dotenv').config();
const twilio_phone_number = process.env.TWILIO_PHONE_NUMBER;

const twilio_sid = process.env.TWILIO_SID
const twilio_auth_token = process.env.TWILIO_AUTH_TOKEN
var twilio = require('twilio');
var client = new twilio(twilio_sid, twilio_auth_token);

module.exports ={
  async verify_phone(to, token){
    try {
      let message_sent = await this.send_sms(to, token)
      return message_sent
    } catch (err) {
      logger.log('err'.bgRed)
      // logger.log(err)
      throw err
    }

  },

  async send_sms(to, msg){
    try {
      let message = await client.messages.create({
        body: msg,
        to: `+1${to}`,  // Text this number
        from: twilio_phone_number // From a valid Twilio number
      })
      logger.log('TWILIO!!'.bgYellow)
      logger.log(message.sid)
      return message
    } catch (err) {
      // logger.log(err)
      //parse twilio error
      throw err
      
    }
  }
}



// module.exports.send_sms('8056220413', '7H3 53Cr37 C0D3 15')

// +15005550001	This phone number is invalid.	21212
// +15005550007	This phone number is not owned by your account or is not SMS-capable.	21606
// +15005550008	This number has an SMS message queue that is full.	21611
// +15005550006	This number passes all validation.	No error
// All Others	This phone number is not owned by your account or is not SMS-capable.	21606


// +15005550001	This phone number is invalid.	21211
// +15005550002	Twilio cannot route to this number.	21612
// +15005550003	Your account doesn't have the international permissions necessary to SMS this number.	21408
// +15005550004	This number is blacklisted for your account.	21610
// +15005550009	This number is incapable of receiving SMS messages.	21614
// All Others	Any other phone number is validated normally.	Input-dependent