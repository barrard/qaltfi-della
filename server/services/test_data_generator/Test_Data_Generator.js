colors = require("colors");
logger = require("tracer").colorConsole({
  format:
    "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
});
let { web3, wss_web3 } = require("../web3_service.js");
const {
  Data_Storage_abi,
  Data_Storage_address,
  Della_abi,
  Della_address,
  Della_Security_Token_abi,
  Della_Stable_Token_abi,
  Della_Stable_Token_address,
  Campaign_Crowdsale_abi
} = require("../../../next_app/components/es5_contract_abi.js");

const Della_inst = new web3.eth.Contract(Della_abi, Della_address);

const Della_Stable_Token_inst = new web3.eth.Contract(
  Della_Stable_Token_abi,
  Della_Stable_Token_address
);

const Data_Storage_inst = new web3.eth.Contract(
  Data_Storage_abi,
  Data_Storage_address
);

/* tokens/array cache */
const all_tokens = [];

/* campaigns/array cache */
const all_campaigns = [];

const accounts = [
  "0x8acb9cfc0a1884d4cfe58d738a4479d693b87be6",
  "0x77609a839d8e2acfdf24ee763d48f495a8f062aa",
  "0x10c885bdda5b1e6d3d5632a80de40bb94f54728c",
  "0xf2092c5f252f0f42358ded377b93ce3ee6ec1ae9",
  "0x5356f9ff37fb76fada0908396af3b3bb6d5b8d8c",
  "0x2ec12c7ba0f7d8f200a06502bcca260f172f41b2",
  "0x2b54751ba22cbd20a3d632690ab68a5df2026973",
  "0x7f06e99744b835d0c9efb503741b98c88da66c04",
  "0x04c3bccfaee3d40403bd5f66337077f47371d7d0",
  "0x7fbf936b267e518947e79a9184fbff1163d2ff83"
];
const private_keys = [
  "0x38389bcec9beda5392e238004b9e9e218e3da7a66961dd5e79130410f4e55595",
  "0x9827db3a215cfe2d9315b8ba1808d6244e3185049bc7d3b01c73faa49c4902de",
  "0x30616fe57654603f19c1deaaca50db7f6e4f7cf7943b9651312e30e2d6645c74",
  "0xa45053031c0eaa866c1d16c20d41fe5eb14e04f5e43863150d57202316e7ed64",
  "0x0ce3fd542fb43ea8ae1f00b31a8b26c7c451d1e88f0dcdb132b33ef53081b7cc",
  "0x1c99f625c502e154fb028189e145167e2e878bf16a3e9babb071ad88f9881af8",
  "0x2d20745e751f6358f96329a078729633d2519fb9178114551401b45a5797d150",
  "0xbe69c9b327fb7561d4a2c41a5a8cc345194f00ac402220b9fd7176281a96f5cd",
  "0x123d086b827138eb049821d03652bde6e069bffa3b006db98e60078e2fb9b666",
  "0x7717ae5462a501a5eae547e302f789e09008420ecef6b3f5d7535d319889d096"
];
init(); //init app?
async function init() {
  /* Initialize the wallet with all private keys */
  logger.log("running set_up_accounts_wallet".green);
  await set_up_accounts_wallet();

  /* Authorize accounts set to true */
  // logger.log('running all_accounts_authorized'.green)
  // await all_accounts_authorized(accounts, true)

  /* all accounts buy lots of DTS */
  // logger.log('running all_accounts_buy_dst'.green)
  // await all_accounts_buy_dst(accounts);

  /* Sign agreement with everyone, only needed once, anymore will throw */
  // await all_accounts_sign_terms_and_agreement(accounts);

  /* Allow each with can_start */
  // await all_accounts_can_start_campaign(accounts, '100000')

  /* Create one or ten campaigns */
  //  create_campaign(accounts[0], '100000');
  // logger.log('running deploy_ten_campaigns'.green)
  await deploy_ten_campaigns(accounts, Della_inst);

  /* randomly buy tokens? */
  logger.log("running get_all_campaigns".green);
  await get_all_campaigns();

  /* set up random token buyer  */
  // logger.log('running buy_tokens_loop'.green)
  // await buy_tokens_loop(all_campaigns, accounts);
}

async function all_accounts_buy_dst(accounts) {
  await Promise.all(
    accounts.map(async (address, index) => {
      await run_transaction({
        to: Della_Stable_Token_address,
        from: address,
        fn: Della_Stable_Token_inst.methods.buy_DST(address, address),
        value: "1000000000000000000"
      });
    })
  );

  /* verify balances */
  let balance = await Della_Stable_Token_inst.methods
    .balanceOf(accounts[1])
    .call();
  logger.log({ balance });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


async function buy_tokens_loop(all_campaigns, all_accounts) {

  let count = 0;
  var timer = setInterval(async () => {
    let index = getRandomInt(10)
    logger.log({index})
    let account = all_accounts[index]
    logger.log({account})
    let resp = await buy_token(
      all_campaigns[count],
      account
    );
    logger.log({ resp });
    count++;
    logger.log({ count });
    if (count == all_campaigns.length) clearInterval(timer);
  }, 2000);

  // let Della_campaign_inst = new web3.eth.Contract(
  //   Campaign_Crowdsale_abi,
  //   all_campaigns[1]
  // );
  // let della_security_token_address = await Della_campaign_inst.methods
  //   .token()
  //   .call();
  // logger.log({ della_security_token_address });
  // let della_security_token_inst = new web3.eth.Contract(
  //   Della_Security_Token_abi,
  //   della_security_token_address
  // );
  // let security_token_balance = await della_security_token_inst.methods
  //   .balanceOf(accounts[1])
  //   .call();
  // logger.log({ security_token_balance });
}

async function buy_token(campaign_address, from_address) {
  let resp = await send_dst_tokens({
    to: campaign_address,
    amount: 600,
    from: from_address
  });
  logger.log(resp);
  return resp;
}

async function send_dst_tokens({ to, amount, from }) {
  const total_dst_tokens_to_send = web3.utils.toWei(amount.toString(), "ether");
  logger.log({ total_dst_tokens_to_send });

  let resp = await run_transaction({
    from: from,
    to: Della_Stable_Token_address,
    fn: Della_Stable_Token_inst.methods.send(
      to,
      total_dst_tokens_to_send,
      web3.utils.utf8ToHex("Purchasing Campaign Security Token")
    ),
    value: "0"
  });
  logger.log(resp);
  return resp;
}

async function get_all_campaigns() {
  /* GET ALL CROWDSALES? */
  /* 1. get total crowdsales */
  await new Promise(async (resolve, reject) => {
    let campaign_count = await get_campaign_count();
    for (let count = 0; count < campaign_count; count++) {
      await get_campaign(count);
      if (all_campaigns.length == campaign_count) resolve();
    }
  });

  logger.log(all_campaigns.length);
}

async function get_campaign(index) {
  let campaign_address = await Data_Storage_inst.methods
    .get_campaign(index)
    .call();
  logger.log({ campaign_address });
  /* save in cache/DB local variable.... */
  all_campaigns.push(campaign_address);
}

async function sign_terms_and_agreement({ user_signature, IP, address }) {
  const resp = await run_transaction({
    to: Della_address,
    from: address,
    fn: Della_inst.methods.sign_terms_and_agreement(user_signature, IP),
    value: "0"
  });
  return true;
}

async function create_campaign(address, goal) {
  try {
    const one_day = 1 * 60 * 60 * 24;
    await run_transaction({
      from: address,
      to: Della_address,
      value: "0",
      fn: Della_inst.methods.make_tokenized_campaign(goal, one_day)
    });
    return true;
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    return false;
  }
}

async function all_accounts_can_start_campaign(accounts, amount) {
  try {
    var count = 0;
    const timer = setInterval(async () => {
      await send_allow_campaign_data(accounts[count], amount);
      count++;
      if (count == accounts.length) clearInterval(timer);
    }, 100);

    return true;
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    return false;
  }
}

async function all_accounts_authorized(accounts, flag) {
  await new Promise((resolve, reject) => {
    try {
      var count = 0;
      const timer = setInterval(async () => {
        await set_authorized_investor(accounts[count], flag);
        count++;
        if (count == accounts.length) {
          clearInterval(timer);
          resolve();
        }
      }, 100);

      return true;
    } catch (err) {
      logger.log("err".bgRed);
      logger.log(err);
      return false;
    }
  });
}

async function set_authorized_investor(address_to_allow, flag) {
  await run_transaction({
    to: Della_address,
    from: accounts[0],
    value: "0",
    fn: Della_inst.methods.set_authorized_investor(address_to_allow, flag)
  });
  return true;
}

async function send_allow_campaign_data(
  address_to_allow,
  allowed_campaign_goal
) {
  await run_transaction({
    to: Della_address,
    from: accounts[0],
    value: "0",
    fn: Della_inst.methods.set_can_start_campaign(
      address_to_allow,
      allowed_campaign_goal
    )
  });
  return true;
}

async function deploy_ten_campaigns(accounts, Della_inst) {
  var count = 0;
  const timer = setInterval(() => {
    create_campaign(accounts[count], "100000");
    count++;
    if (count == accounts.length) {
      clearInterval(timer);
      return true;
    }
  }, 100);
}

function set_up_accounts_wallet() {
  private_keys.forEach(private_key =>
    web3.eth.accounts.wallet.add(private_key)
  );
  logger.log("done adding private keys");
}

async function run_transaction({
  from,
  fn, //fn to call with web3
  to, //who the transactio is going too
  value //amount of wei sending with transaction
}) {
  const tx_data = {
    from,
    to,
    value,
    data: fn ? fn.encodeABI() : ""
  };

  try {
    const gas = await web3.eth.estimateGas(tx_data);
    logger.log({ gas });
    tx_data.gas = Math.ceil(gas + gas * 0.05); //adding 5% to gas becauase deploy campaign needs it smh
    // tx_data.gas = gas;
    const chainId = await web3.eth.net.getId();
    tx_data.gasPrice = await web3.eth.getGasPrice();
    tx_data.nonce = await web3.eth.getTransactionCount(from);
    tx_data.chainId = chainId;

    // logger.log(tx_data);
    const transaction_obj = { ...tx_data };

    let transactionHash;
    fn.send(transaction_obj)
      .on("transactionHash", async transactionHash => {
        transactionHash = transactionHash;
        logger.log(transactionHash);
      })
      .on("receipt", async receipt => {
        logger.log("onRecept event");
        logger.log(receipt.gasUsed);
      })
      .on("error", error => {
        logger.log(`Error on ${from}`);
        logger.log(error);
        logger.log(error.message);
      });
    return true;
  } catch (error) {
    logger.log(`Failed with address ${from}`);
    logger.log(error);
    return false;
  }
}

async function all_accounts_sign_terms_and_agreement(accounts) {
  let res = await Promise.all(
    accounts.forEach(async account => {
      try {
        await sign_terms_and_agreement({
          user_signature: `${account}`,
          IP: "123.123.123",
          address: account
        });
      } catch (err) {
        logger.log("err".bgRed);
        logger.log(err);
      }
    })
  );
  return res;
}

async function get_campaign_count() {
  try {
    let campaign_count = await Data_Storage_inst.methods
      .get_tokenized_campaign_count()
      .call();
    logger.log({ campaign_count });
    return campaign_count;
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
  }
}

/* 

Available Accounts
==================
(0) 0x8acb9cfc0a1884d4cfe58d738a4479d693b87be6 (~100 ETH)
(1) 0x77609a839d8e2acfdf24ee763d48f495a8f062aa (~100 ETH)
(2) 0x10c885bdda5b1e6d3d5632a80de40bb94f54728c (~100 ETH)
(3) 0xf2092c5f252f0f42358ded377b93ce3ee6ec1ae9 (~100 ETH)
(4) 0x5356f9ff37fb76fada0908396af3b3bb6d5b8d8c (~100 ETH)
(5) 0x2ec12c7ba0f7d8f200a06502bcca260f172f41b2 (~100 ETH)
(6) 0x2b54751ba22cbd20a3d632690ab68a5df2026973 (~100 ETH)
(7) 0x7f06e99744b835d0c9efb503741b98c88da66c04 (~100 ETH)
(8) 0x04c3bccfaee3d40403bd5f66337077f47371d7d0 (~100 ETH)
(9) 0x7fbf936b267e518947e79a9184fbff1163d2ff83 (~100 ETH)

Private Keys
==================
(0) 0x38389bcec9beda5392e238004b9e9e218e3da7a66961dd5e79130410f4e55595
(1) 0x9827db3a215cfe2d9315b8ba1808d6244e3185049bc7d3b01c73faa49c4902de
(2) 0x30616fe57654603f19c1deaaca50db7f6e4f7cf7943b9651312e30e2d6645c74
(3) 0xa45053031c0eaa866c1d16c20d41fe5eb14e04f5e43863150d57202316e7ed64
(4) 0x0ce3fd542fb43ea8ae1f00b31a8b26c7c451d1e88f0dcdb132b33ef53081b7cc
(5) 0x1c99f625c502e154fb028189e145167e2e878bf16a3e9babb071ad88f9881af8
(6) 0x2d20745e751f6358f96329a078729633d2519fb9178114551401b45a5797d150
(7) 0xbe69c9b327fb7561d4a2c41a5a8cc345194f00ac402220b9fd7176281a96f5cd
(8) 0x123d086b827138eb049821d03652bde6e069bffa3b006db98e60078e2fb9b666
(9) 0x7717ae5462a501a5eae547e302f789e09008420ecef6b3f5d7535d319889d096

HD Wallet
==================
Mnemonic:      build camera raw ritual process silly curtain order puzzle search weekend use
Base HD Path:  m/44'/60'/0'/0/{account_index}


*/
