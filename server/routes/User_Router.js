const { Router } = require("express");
const User_Controller = require("../controllers/User_Controller.js");
const Crowdsale_Controller = require("../controllers/Crowdsale_Controller.js");

const {
  ensure_crowdsale_init,
  ensure_user_crowdsale_not_deployed,
  ensure_authenticated
} = require("../middleware/router_middleware.js");

class User_Router {
  constructor() {
    // this.test = Router();
    // this.hello = Router();
    this.user_router = Router();
    this.buildRoutes();
  }

  buildRoutes() {
    this.user_router.get(
      '/get_user_comment_data/:id',
      User_Controller.get_user_comment_data
    )
    /* Get campaing owner data */
    this.user_router.get(
      '/get_campaign_owner/:campaign_owner_id',
      User_Controller.get_campaign_owner
    )
    /* remove_account_address */
    this.user_router.post(
      "/remove_account_address",
      [ensure_authenticated],
      User_Controller.remove_account_address
    );

    /* Keep track of which user has which account address */
    this.user_router.post(
      "/add_account_address",
      [ensure_authenticated],
      User_Controller.add_account_address
    );

    /* Set user has campaign deployed */
    this.user_router.post(
      "/set_campaign_deployed",
      [ensure_crowdsale_init, ensure_user_crowdsale_not_deployed],
      User_Controller.set_campaign_deployed
    );
  }
}

// const User_Router = new User_Router();

module.exports = next_app => new User_Router(next_app);
