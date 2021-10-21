require('dotenv').config();
const body_parser = require("body-parser");
const cookie_parser = require("cookie-parser");
const csurf = require("csurf");
var cors = require('cors')

const helmet = require('helmet')
const session = require("express-session");
const mongoStore = require("connect-mongo")(session);
const passport = require('passport')
const express_validator = require('express-validator')
const Page_views_model = require('../models/page_views_model.js')


const helper = require('./helper.js')
module.exports = (app, next_app) => {
  const {router} = require('../routes/AppRouter')(next_app)
  const {crowdsale_router} = require('../routes/Crowdsale_Router.js')(next_app)
  const {user_router} = require('../routes/User_Router.js')(next_app)

  app.use(helmet());
  app.use(cors())

  app.use((req, res, next)=>{
    // logger.log('res.checkBody')
    next()
  })
  app.use(body_parser.json());
  app.use(
    body_parser.urlencoded({
      extended: false,
      limit: "50mb"
    })
  );
  
  /* DONT MOVE THIS!!!!!!  MUST STAY HERE NEXT TO BODY PARSER  FML */
      //Validation
app.use(express_validator(
  helper.express_validator_options()
));

  app.use((req, res, next)=>{
    // logger.log('res.checkBody1')
    next()
  })

  app.use(cookie_parser());
  const mongo_store = new mongoStore({ url: "mongodb://localhost/qaltfi" });
  const session_options = {
    name:'Della_Session',
    store: mongo_store,
    secret: 'process.env.SESSION_SECRET',
    saveUninitialized: true,
    resave: true,
    cookie: {
      //   secure: false,//this is also the default setting
      //   httpOnly: true,//this is on by default
      expires: new Date(253402300000000) //last loooong time
    }
  };
  if (process.env.NODE_ENV == "production"){
    logger.log('SECURE COOKIE')
    session_options.cookie.secure = true;
  }
    

  const session_middlesware = session(session_options);
  app.use(session_middlesware);
  app.use(csurf());


  app.use((req, res, next)=>{
    // logger.log('res.checkBody3')
    next()
  })




//New user messages
app.use((req, res, next) => {
  if (req.user) {
    if(req.user.transaction_in_progress) req.session.messages.push({
      warning:`Transaction in progress.....  <a className='alert-link' href='/account-wallet'>VIEW</a>`
    })
    if (!req.user.email_verifed && req.path != '/account') req.session.messages.push({
      warning: `
    Please verify your Email address - ${req.user.primary_email} <a className='alert-link' href='/account'>HERE</a>`
    })
    if (!req.user.phone_verified && req.path != '/account') req.session.messages.push({
      info: `
    Please verify your Phone Number <a className='alert-link' href='/account'>HERE</a>`})

  }
  next()
})
app.use((req, res, next)=>{
  // logger.log('res.checkBody4')
  next()
})
app.use((req, res, next) => {
  //SESSIONS
  // logger.log(req.session.id)
  // logger.log(req.sessionID)
  // logger.log(`***********************         SEEEESSSSIIIIOOONNNNNN     **************************`.bgBlue)
  // logger.log(req.session)
  // logger.log(`***********************         CCCOOOOOKKKKIIIIIEEEEEEEE     **************************`.bgBlue)
  // logger.log(DATA.get('current_eth_price'))
  // logger.log(req.cookies)

  res.locals.BLOCKCHAIN_NETWORK = process.env.BLOCKCHAIN_NETWORK
  res.locals.INFURA_KEY = process.env.INFURA_KEY
  res.locals.PRODUCTION = process.env.NODE_ENV =="production"
  res.locals.BLOCKCHAIN_ENV = process.env.BLOCKCHAIN_ENV =="production"
  res.locals.API_SERVER = process.env.API_SERVER
  
  res.locals.ETHERSCAN_URL = process.env.ETHERSCAN_URL
  res.locals.CURRENT_ETH_PRICE = 100 /* DATA.get('current_eth_price') || '0' */
  res.locals.csrf_token_function = req.csrfToken
  res.locals.user = req.user || null;
  res.locals.session_messages = req.session.messages
  res.locals.NODE_ENV = process.env.NODE_ENV
  res.locals.DOLLARS_PER_TOKEN = process.env.DOLLARS_PER_TOKEN
  res.locals.SOCKET_PROTOCOL = process.env.SOCKET_PROTOCOL
  res.locals.SOCKET_HOST = process.env.SOCKET_HOST
  res.locals.SOCKET_PORT = process.env.SOCKET_PORT
  res.locals.ETHERSCAN_URL = process.env.ETHERSCAN_URL
  res.locals.GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY
  res.locals.PHONE_TOKEN_LENGTH = process.env.PHONE_TOKEN_LENGTH
  /* SEE IF USER HAS TOKENS FOR EMAIL/PHONE VERIFICATION */
  let has_email_token = req.session.has_email_token
  let has_phone_token = req.session.has_phone_token
  if(has_email_token)res.locals.has_email_token = true
  if(has_phone_token)res.locals.has_phone_token = true
  

  req.session.messages = []
  // logger.log(req.session.messages)
  next()
});

//PAGE VIEWS 
app.use((req, res, next) => {
  if(process.env.NODE_ENV!=="development")
    Page_views_model.add_page_view(req)
  next()
})


// app.use((req, res, next)=>{
//   logger.log('res.checkBod7y')
//   next()
// })

app.use((err, req, res, next)=> {
  logger.log("csrf_token".bgWhite);
  logger.log(req.csrfToken());
  logger.log(err);
  if (err.code !== "EBADCSRFTOKEN") return next(err);

  // handle CSRF token errors here
  res.status(403);
  res.send("form tampered with");
});



  app.use((req, res, next) => {
    // logger.log(req.session);
    // logger.log(req.cookie);
    // logger.log(req.body._csrf);
    next();
  });



    //PASSPORT
    app.use(passport.initialize())
    app.use(passport.session(session_options))
  
  

  app.use(router)
  app.use('/crowdsale', crowdsale_router)
  app.use('/user', user_router)
  // app.use((req, res, next)=>{
  //   logger.log('res.checkBody9')
  //   next()
  // })



  // app.use('/test',test)
  // app.use('/hello',hello)
};
