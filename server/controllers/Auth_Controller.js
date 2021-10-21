const User = require("./User_Controller.js");
const passport = require("passport");
const sendgrid = require('../services/sendgrid.js');

const { create_user } = require("./User_Controller.js");

class Auth_Controller {
  async sign_up(req, res, next) {
    const { email, password, confirm_password } = req.body;
    logger.log({
      email,
      password,
      confirm_password
    });
    // logger.log(res)
    // logger.log(res.checkBody)
    // return res.send({ok:'ok'})

    //validator
    req.checkBody("email", "Email address is required").notEmpty();
    req.checkBody("email", "Email address is not valid").isEmail();
    req.checkBody("password", "Passwords field is require").notEmpty();
    req
      .checkBody("confirm_password", "Passwords do not match")
      .equals(password);
    //Check erros
    const errors = await req.validationErrors();

    if (errors) {
      logger.log("errors");
      logger.log(errors);
      // [ { param: 'confirm_password',
      // msg: 'Password do not match',
      // value: '1' } ]
      // errors.forEach(err => {
      //   req.session.messages.push({ danger: err.msg });
      // });

      logger.log("errors");
      res.send({errors});
    } else {
      const errors = []//seperate errors from the form validation 
      try {
        logger.log("no errors".green);
        let user = await User.findOne({
          primary_email: email
        });
        if (user) {
          logger.log("Got a user with that email already".bgRed);
            errors.push({
              msg: `The Email ${email} is already registered.`
            })
          
          // req.session.messages = [...errors];
          return res.json({errors});
        } else {
          logger.log("no user with this email yet".bgGreen);
          const new_user = new User({
            primary_email: email,
            password: password,
            auth_method: "LOCAL"
          });
          let user = await User.create_user(new_user);
          logger.log(user);


          passport.authenticate("local", (err, user, info)=>{
            logger.log({err, user, info})
            if (err) { return next(err); }
            if (!user) { 
              //TODO track failed logins by session.id 10 max?
              logger.log('sorry no user found')
              errors.push({msg:"Incorrect Username or Password"})
              return res.json({errors});
            }
            logger.log('Should be ok to log this user in?')
            req.logIn(user, function(err) {
              if (err) { return next(err); }
              //////////////TODO  Wrap this in a function somewhere ///////////////////////////
              let token = require("../server-utils.js").generate_token();
              req.session.email_token = token;
              sendgrid.verify_email(
                email,
                req.session.email_token,
                process.env.VERIFY_EMAIL_URL
              );
              //////////////TODO  Wrap this in a function somewhere ///////////////////////////
              return res.json({success: "You are now logged in", user })
            });
            
          })(req, res, next);

        }
      } catch (err) {
        logger.log("err".red);
        logger.log(err);
        errors.push({
          msg: `Sorry an error occured trying to signup ${email}`
        })
        res.json({errors});
      }
    }
    // res.send(req.body)
  } //END POST SIGNUP

  async login(req, res, next) {
    logger.log(req.csrfToken());
    logger.log("login hit");
    logger.log('Body has')
    logger.log(req.body)
    const errors = [];
    passport.authenticate("local", (err, user, info) => {
      logger.log({err, user, info})
      if (err) { return next(err); }
      if (!user) { 
        //TODO track failed logins by session.id 10 max?
        logger.log('sorry no user found')
        errors.push({msg:"Incorrect Username or Password"})
        return res.json({errors});
      }
      logger.log('Should be ok to log this user in?')
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        //may not need?
        // req.session.messages.push({ success: "You are now logged in" });
        //  res.redirect('/edit-accounts/' + req.user.username);
        logger.log('WE LOHING IN')
        return res.json({success: "You are now logged in", user })
      });
 
    })(req, res, next);
  }

  async logout(req, res){
    req.logOut();
    req.session.messages.push({ "info": "You are now logged out" })
    res.redirect('/')
  }
}

module.exports = new Auth_Controller();
