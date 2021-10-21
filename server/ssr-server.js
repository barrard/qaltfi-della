colors = require("colors");
logger = require("tracer").colorConsole({
  format:
    "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
});

// import {Logger, createConsoleProcessor} from '@grabrinc/isomorphic-logger';

// const logger = new Logger;

// logger.channel(createConsoleProcessor());
require("dotenv").config();
require("./db/db.js");
const { parse } = require("url");
const express = require("express");
const next = require("next");

const middleware = require("./middleware/use.js");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const next_app = next({ dir: "./next_app", dev });
const handle = next_app.getRequestHandler();

const get_routes = require("./routes");
const routes = get_routes();
require('./services/Blockchain_Data.js')
require('./services/web3_service.js')

/* ORACLE here? */
// const oracle = require('./services/Eth_Price_Oracle/Eth_Price_Oracle.js')
// oracle()

//TODO figure out if this will be useful
// const LRUCache = require('lru-cache')
// const ssrCache = new LRUCache({
//   max: 100,
//   maxAge: dev ? 5 : 1000 * 60 * 60 // 1hour
// })

next_app
  .prepare()
  .then(() => {
    const server = express();
    logger.log("I AM SERVER".yellow);
    server.set("trust proxy", "loopback");

    middleware(server, next_app);

    /* Render dynamic campaign_id */
    server.get("/campaign-view/:campaign_id", (req, res) => {
      return next_app.render(req, res, "/campaign-view", {
        campaign_id: req.params.campaign_id
      });
    });

    server.get("*", (req, res) => {
      const parsed_url = parse(req.url, true);
      const { pathname, query = {} } = parsed_url;
      // const route = routes[pathname];
      /* pull in front end routes and check against routes */
      const route = routes[pathname];
      if (route) {
        logger.log(`hit the route here ${route.page}`);
        logger.log(`${route.page}`);
        logger.log({ query });
        return next_app.render(req, res, route.page, query);
      }

      return handle(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      logger.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(ex => {
    logger.log(ex.stack);
    process.exit(1);
  });
