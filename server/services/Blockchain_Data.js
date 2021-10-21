colors = require("colors");
logger = require("tracer").colorConsole({
  format:
    "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
});
/* For testing */
// require("../db/db.js");

const {save_token_transfer_data} = require('../controllers/User_Controller.js')
let { web3, wss_web3 } = require("./web3_service.js");
const {
  Della_abi,
  Della_address,
  Data_Storage_abi,
  Data_Storage_address,
  Della_Security_Token_abi
} = require("../../next_app/components/es5_contract_abi.js");

const WS_Della = new wss_web3.eth.Contract(Della_abi, Della_address);

const Data_Storage = new web3.eth.Contract(
  Data_Storage_abi,
  Data_Storage_address
);

/* tokens/array cache */
const all_tokens = [];

/* campaigns/array cache */
const all_campaigns = [];

/* Listen for new campaigns to add to list of tokens/campaigns */
start_Campaign_Deployed_listener();

/* starts listening on to all token transfer events */
start_transfer_event_listener();

/* manual testing this function */
// get_all_tokens()//part of start_transfer_event_listener function

function add_address_to_array(reciept_data){
  let {returnValues} = reciept_data
  const {token_address, campaign_address} = returnValues
  all_campaigns.push(campaign_address)
  all_tokens.push(token_address)

}

async function start_Campaign_Deployed_listener() {
  listen_for_event(Della_abi, Della_address, "Campaign_Deployed", {
    onData:add_address_to_array//local function
  });
}

async function start_transfer_event_listener() {
  /* gets all token address into all_tokens array */
  await get_all_tokens();
  logger.log("get_all_tokens is done");
  all_tokens.map(token_address => {
    listen_for_event(Della_Security_Token_abi, token_address, "Transfer", {
      onData: save_token_transfer_data
    });
  });
}

/* websock for listen to events */
function listen_for_event(contract_abi, contract_address, event, handlers) {
  // if(handlers) {
  var { onData /* , onChanged, onError */ } = handlers;
  // }
  let contract_inst = new wss_web3.eth.Contract(contract_abi, contract_address);

  contract_inst.events[event]({
    fromBlock: "latest"
  })
    .on("data", event_data => onData(event_data))
    .on("changed", event_changed =>
      /* onChanged || */ logger.log({ event_changed })
    )
    .on("error", error => /* onError || */ logger.log({ error }));
}

async function get_all_tokens() {
  /* GET ALL CROWDSALES? */
  /* 1. get total crowdsales */
  await new Promise(async (resolve, reject) => {
    let campaign_count = await get_campaign_count();
    for (let count = 0; count < campaign_count; count++) {
      await get_token(count);
      if (all_tokens.length == campaign_count) resolve();
    }
  });

  logger.log(all_tokens.length);


}

async function get_all_campaigns() {
  /* GET ALL CROWDSALES? */
  /* 1. get total crowdsales */
  await new Promise(async (resolve, reject) => {
    let campaign_count = await get_campaign_count();
    for (let count = 0; count < campaign_count; count++) {
      await get_campaign(count);//get campaign and store in local array
      if (all_campaigns.length == campaign_count) resolve();
    }
  });

  logger.log(`all_campaigns.length ${all_campaigns.length}`);
}

async function get_campaign(index) {
  let campaign_address = await Data_Storage.methods.get_campaign(index).call();
  logger.log({ campaign_address });
  /* save in cache/DB local variable.... */
  all_campaigns[index] = campaign_address;
}

async function get_token(index) {
  let token_address = await Data_Storage.methods.get_token(index).call();
  logger.log({ token_address });
  /* save in cache/DB local variable.... */
  all_tokens[index] = token_address;
}

async function get_campaign_count() {
  try {
    let campaign_count = await Data_Storage.methods
      .get_tokenized_campaign_count()
      .call();
    logger.log({ campaign_count });
    return campaign_count;
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
  }
}

  /* Testing get all events for... */
  // get_all_events(
  //   Della_Security_Token_abi,
  //   all_tokens[2],
  //   "Transfer",
  //   // {},
  //   {to:('0x7fbF936B267E518947e79a9184FbFF1163D2ff83')},
  //   0,
  //   'latest',
  //   (err, transfer_events) => {
  //     logger.log({ err });
  //     logger.log(transfer_events)
  //     logger.log(`transfer_events length = ${transfer_events.length}`);
  //     // transfer_event_parser(transfer_events)
  //   }
  // );

function get_all_events(
  contract_abi,
  contract_address,
  event, filter,
  fromBlock,
  toBlock,
  cb
) {
  let contract_inst = new web3.eth.Contract(contract_abi, contract_address);
  var fromBlock = fromBlock || 0;
  var toBlock = toBlock || "latest";
  contract_inst.getPastEvents(
    event,
    {
      filter,
      fromBlock,
      toBlock
    },
    cb
  );
}
