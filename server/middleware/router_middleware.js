const User = require('../controllers/User_Controller.js')

function handle_error(err, res, msg){
  res.send({err:msg})
}
module.exports = {
   ensure_crowdsale_owner(req, res, next) {
    const crowdsale_id = req.user.crowdsale_id
    User.findById({
      _id: req.user.id
    }, (err, user) => {
      if (err) throw ('err looking up user by id to ensure crowdsale owner'.bgWhite)
      if (user.crowdsale_id === crowdsale_id) {
        logger.log('ensure_crowdsale_owner'.bgYellow)
        return next()
      } else {
        res.json({error:'You can\'t update information for a campaign that isnt yours'})
      }
  
    })
  },
  
   ensure_user_has_wallet(req, res, next) {
    User.findById({
      _id: req.user.id
    }, (err, user) => {
      if (err || !user) { //need to check is user exists before checking if wallet also exists
        handle_error(err, res, 'Error finding user')
      } else {
        if (!user.has_wallet) {
          handle_error(err, res, 'You need to create a wallet first')
  
        } else {
          next()
  
        }
      }
    })
  
  },
  
   ensure_user_not_has_wallet(req, res, next) {
    User.findById({
      _id: req.user.id
    }, (err, user) => {
      if (err || !user) { //need to check is user exists before checking if wallet also exists
        handle_error(err, res, 'Error finding user')
      } else {
        if (user.has_wallet) {
          handle_error(err, res, 'You already have a wallet')
  
        } else {
          next()
  
        }
      }
    })
  
  },
  
   ensure_user_crowdsale_not_deployed(req, res, next) {
    User.findById({
      _id: req.user.id
    }, (err, user) => {
      if (err) {
        handle_error(err, res, 'Sorry an error occured....')
      } else {
        if (!user.crowdsale_deployed) {
          next()
        } else {
          handle_error(err, res, 'Looks like you have already started your campaign')
  
        }
      }
  
    })
  },
  
   ensure_user_crowdsale_deployed(req, res, next) {
    User.findById({
      _id: req.user.id
    }, (err, user) => {
      if (err) {
        handle_error(err, res, 'Sorry an error occured....')
      } else {
        if (user.crowdsale_deployed) {
          next()
        } else {
          handle_error(err, res, 'Looks like you havn\'t deployed yet', 'edit-finalize')
  
        }
      }
  
    })
  },
  
   ensure_admin(req, res, next) {
  
    logger.log(req.cookies.admin)
    const admin = req.cookies.admin
    const pw = req.cookies.pw
    logger.log(admin)
    logger.log(pw)
    if (admin == 'true') {
      if (pw == 'pass') {
        return next()
      } else {
        res.send({
          resp: 'Nice try!'
        })
      }
    } else res.send({
      resp: 'Admin = false, Sorry'
    })
  
    // logger.log(req.ip)
  },
  
   ensure_not_logged_in(req, res, next){
     logger.log('IS THIS USER ALREADY LOCGED IN??')
     logger.log(!req.isAuthenticated ? true : false)
    if(!req.isAuthenticated) return res.redirect('/account-profile')
    next()
  },
  
  
   ensure_authenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    logger.log('non-authenticated user being redirected'.bgWhite)
    res.redirect('/login')
  
  },
  
   ensure_crowdsale_not_init(req, res, next) {
    logger.log('crowdsale not started yet'.bgWhite)
    if (!req.user.crowdsale_init) {
      return next();
    }
  
    req.session.messages.push({'info':"only one crowdsale at a time"})
    res.redirect('/edit-property')
  
  },
  
   beta_only_is_cofounder(req, res, next) {
    const email = req.user.primary_email;
    switch (email) {
      case 'barrard@gmail.com':
      case 'david@qaltfi.com':
      case 'doomwn@gmail.com':
      case 'travisjryan@gmail.com':
      case 'travis@qaltfi.com':
      case 'will@qaltfi.com':
        next()
        break;
      default:
      res.redirect('/')
        break;
    }
    
  },
  
   ensure_crowdsale_init(req, res, next) {
    if (req.user.crowdsale_init) {
      return next();
    }
  
    res.redirect('/start')
  
  }
}