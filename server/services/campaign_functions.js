const {web3} = require('./web3_service.js');
const {Campaign_Crowdsale_abi} = require('../../next_app/components/es5_contract_abi.js')
// const {Campaign_Crowdsale_abi} = contracts_abi

function make(crowdsale_address) {
  // logger.log({web3})
  return new web3.eth.Contract(Campaign_Crowdsale_abi, crowdsale_address);
}

module.exports = {
  async get(crowdsale_address, property) {

    let Campaign_Crowdsale = make(crowdsale_address);
    // logger.log({ crowdsale_address, property })
    // logger.log({Campaign_Crowdsale, crowdsale_address})
    try {
      let resp = await Campaign_Crowdsale.methods[property]().call();
      return { [property]: resp };
    } catch (err) {
      logger.log(`err on ${property}`)
      throw err;
    }
  },

  async get_current_state_of_crowdsale_on_blockchain(crowdsale_address) {
    
    logger.log("Getting current state of crowdsale on blockchain".yellow);
    let crowdsale_data = {};
    /* last_block_updated */
    let last_block_updated = await web3.eth.getBlockNumber()
    crowdsale_data.last_block_updated=last_block_updated
    const data_array = [
      "goal",
      "TOTAL_RATE",
      "owner",
      "wallet",
      "token",
      "stable_tokens_raised",//replacing weiRasied
      "escrow_address",
      "openingTime",
      // "name",
      // "symbol",
      // "is_canceled",
      "goalReached",
      "hasClosed",
      "closingTime",
      "finalized",
      // "check_finalization_time_limit_done" // 16 total attributes, and counting
    ];
    // await Promise.all(
    await Promise.all(
      data_array.map(async property => {
        logger.log(`looping for this ${property}`.bgYellow);
        let data = await module.exports.get(crowdsale_address, property);
        logger.log(data);

        // logger.log(`WHOGOT THAT D ${data}`.bgYellow);
        switch (property) {
          case "owner":
          case "wallet":
          case "token":
          case "escrow_address":
            // logger.log(property)
            // logger.log(value[property])
            try {
              data[property] = data[property].toLowerCase();
            } catch (err) {
              logger.log("err".bgRed);
              logger.log(`data ${data} property ${property}`);
              logger.log(err);
            }
            break;

          default:
            break;
        }
        crowdsale_data = { ...crowdsale_data, ...data };
      })
    );
    /* Might aswell save this */
    // Campaign.find
    /* ABORT, too much for one function, save, somewehre else */

    return crowdsale_data;
    // );
  },


}