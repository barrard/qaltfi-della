const { Router } = require("express");
const Auth_Controller = require("../controllers/Auth_Controller.js");
const User_Controller = require("../controllers/User_Controller.js");
const Crowdsale_Controller = require("../controllers/Crowdsale_Controller.js");

const passport = require("passport");
const strats = require("../services/passport");

const {
  ensure_not_logged_in,
  ensure_authenticated, ensure_admin
} = require("./../middleware/router_middleware.js");

//PASSPORT FUNCTIONS
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User_Controller.get_user_by_id(id, function(err, user) {
    done(err, user);
  });
});

passport.use("local", strats.local_login);

// function auth_user(req, res, next) {
//   passport.authenticate("local", {
//     failureRedirect: "/login"
//   });
// }

class AppRouter {
  constructor(next_app) {
    // this.test = Router();
    // this.hello = Router();
    this.router = Router();
    this.buildRoutes(next_app);
  }

  buildRoutes(next_app) {
/* Should split these up to help organize */
/* All Route/handlers mapped to controllers */

    /* LIKE_BTN */
    this.router.post('/like', [ensure_authenticated],
    async (req, res) => {

      try {
        const {crowdsale_id} = req.body
        let user_id = req.user.id

        let updated_user_likes = await User_Controller.like({user_id, crowdsale_id})
        let updated_crowdsale_user_likes = await Crowdsale_Controller.like({user_id, crowdsale_id})
        logger.log({updated_crowdsale_user_likes, updated_user_likes})

        res.send({ resp: {updated_crowdsale_user_likes, updated_user_likes} })

      } catch (err) {
        logger.log('err'.bgRed)
        logger.log(err)
        res.send({ err })
      }

    })


    /* Add transactionHash to account */
    this.router.post("/add_transactionHash_to_account", [ensure_authenticated],
    User_Controller.add_transactionHash_to_account);

    /* Add receipt to account */
    this.router.post("/add_receipt_to_account", [ensure_authenticated],
    User_Controller.add_receipt_to_account);

    /* Signature DATA for IP */
    this.router.get('/signature_data', [ensure_authenticated], User_Controller.IP_checker)

    /* ADMIN CHECKER */
    this.router.get("/admin", [ensure_admin], (req, res, next)=>{
      /* ensure_admin will verify the request and allow or deny */
      next()
    })

    /* verify_email */
    this.router.get("/verify_email", [ensure_authenticated],
    User_Controller.verify_email);

    /* resend_email_verification */
    this.router.post("/resend_email_verification", [ensure_authenticated],
    User_Controller.resend_email_verification);

    /* verify_phone_token */
    this.router.post("/verify_phone_token", [ensure_authenticated],
      User_Controller.verify_phone_token);


    /* update_user_profile */
    this.router.post("/send_phone_verification", [ensure_authenticated],
      User_Controller.send_phone_verification);


    /* update_user_profile */
    this.router.post("/update_user_profile", [ensure_authenticated],
      User_Controller.update_user_profile);

    /* Handle usre profile img uploads */
    this.router.post("/upload_profile_imgs", [ensure_authenticated],
    User_Controller.upload_profile_imgs);

    /* GET LOGIN */

    this.router.get("/login", [ensure_not_logged_in], (req, res) => {
      return next_app.render(req, res, "/login", "");
    });

    /* Sign Up POST route */
    this.router.post("/signup", Auth_Controller.sign_up);

    /* Login POST route */
    this.router.post("/login", [ensure_not_logged_in], Auth_Controller.login);

    /* LOGOUT */
    this.router.get("/logout", [ensure_authenticated], Auth_Controller.logout);

    // this.test.get('/', (req, res) => {res.send('test')})
    // this.hello.get('/', (req, res) => {res.send('hello')})
  }
}

const appRouter = new AppRouter();

module.exports = next_app => new AppRouter(next_app);
