const { Router } = require("express");
const User_Controller = require("../controllers/User_Controller.js");
const Crowdsale_Controller = require("../controllers/Crowdsale_Controller.js");

const {
  ensure_crowdsale_init,
  ensure_authenticated,
  ensure_crowdsale_owner,
  ensure_user_crowdsale_not_deployed
} = require("../middleware/router_middleware.js");

class Crowdsale_Router {
  constructor(next_app) {
    // this.test = Router();
    // this.hello = Router();
    this.crowdsale_router = Router();
    this.buildRoutes(next_app);
  }

  buildRoutes(next_app) {

    this.crowdsale_router.post(
      '/create_comment',
      [ensure_authenticated],
      Crowdsale_Controller.create_comment
    )

    /* get all campaigns */
    this.crowdsale_router.get(
      "/get_all_campaigns",
      Crowdsale_Controller.get_all_campaigns
    )

    /* add_new_update */
    this.crowdsale_router.post(
      "/add_new_update",
      [ensure_authenticated, ensure_crowdsale_owner],
      Crowdsale_Controller.add_new_update
    );

    /* delete_crowdsale_photo */
    this.crowdsale_router.post(
      "/delete_crowdsale_photo",
      [ensure_authenticated, ensure_crowdsale_owner],
      Crowdsale_Controller.delete_crowdsale_photo
    );

    /* save_my_story campaign data */
    this.crowdsale_router.post(
      "/save_my_story_update",
      [ensure_authenticated, ensure_crowdsale_init, ensure_crowdsale_owner],
      Crowdsale_Controller.save_my_story_update
    );

    /* Moving zillow data address places updates to the servr */
    this.crowdsale_router.post(
      "/lookup_address",
      [ensure_authenticated, ensure_crowdsale_init, ensure_crowdsale_owner],
      Crowdsale_Controller.lookup_address
    );

    /* Get House data with address from source */
    this.crowdsale_router.get(
      `/get_house_data/:address/:city_state_zip`,
      [ensure_authenticated],
      Crowdsale_Controller.get_house_data
    );

    /* Get crowdsale by ID */
    this.crowdsale_router.get(
      "/get_campaign/:campaign_id",
      Crowdsale_Controller.get_campaign
    );

    /* save_crowdsale_update */
    this.crowdsale_router.post(
      "/save_crowdsale_update",
      [
        ensure_authenticated,
        ensure_crowdsale_init,
        ensure_crowdsale_owner,
        ensure_user_crowdsale_not_deployed
      ],
      Crowdsale_Controller.save_crowdsale_update
    );

    /* upload_crowdsale_photos */
    this.crowdsale_router.post(
      "/upload_crowdsale_photos",
      [ensure_crowdsale_init, ensure_authenticated],
      Crowdsale_Controller.upload_crowdsale_photos
    );

    /* Initialize a crowdsale for the user, and creates the Crowdsale in the DB */
    this.crowdsale_router.post(
      "/init_crowdsale",
      [ensure_authenticated],
      Crowdsale_Controller.init_crowdsale
    );
  }
}

// const crowdsale_Router = new Crowdsale_Router();

module.exports = next_app => new Crowdsale_Router(next_app);
