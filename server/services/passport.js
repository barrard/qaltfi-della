const passport = require('passport')
const Local_Strategy = require('passport-local').Strategy
const User = require('../models/user_schema.js');


const local_options = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}

const local_login = new Local_Strategy(local_options,
   async (req, email, password, done) => {
  logger.log('looking up user ' + email)
  try {
    let user = await User.get_user_by_email(email)
    logger.log('looking up user')
    if (!user) throw 'No user found'
    if (user && user.auth_method != "LOCAL") throw 'Not local method'
    // let has_social = await User.check_social_logins(user)
    let is_match = await User.compare_password(password, user.password)
    logger.log(is_match)
    if (is_match) {
      logger.log('got a match'.bgMagenta)
      return done(null, user);
    } else {
      logger.log('not a match'.bgMagenta)
      throw 'Passwords do not match'
    }
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    req.session.messages.push({ "danger": `Invalid credentials` })
    return done(null, false)
  }
})






  const strats = {
    local_login
  }

  module.exports = strats