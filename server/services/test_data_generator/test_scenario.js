// colors = require("colors");
// logger = require("tracer").colorConsole({
//   format:
//     "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
//   dateformat: "HH:MM:ss.L"
// })
// let { web3, wss_web3 } = require("./web3_service.js");
// const {
//   Data_Storage_abi,
// Data_Storage_address,
// Della_abi,
// Della_address,
// Della_Security_Token_abi,
// Della_Stable_Token_abi,
// Della_Stable_Token_address,
// Della_campaign_abi,
// } = require("../../../next_app/components/es5_contract_abi.js");

// const Della_inst = new web3.eth.Contract(
//   Della_abi,
//   Della_address
// );



// const Della_Stable_Token_inst = new web3.eth.Contract(
//   Della_Stable_Token_abi,
//   Della_Stable_Token_address
// );



// const Data_Storage_inst = new web3.eth.Contract(
//   Data_Storage_abi,
//   Data_Storage_address
// );

// const BN = web3.utils.BN;

// module.exports = async () => {
//   let Campaign_Deployer_inst = await Campaign_Deployer.deployed();
//   let Della_inst = await Della.deployed();
//   let eth_price_oracle_inst = await Eth_price_Oracle.deployed();
//   let Della_addr = await Della_inst.address;
//   let Della_Stable_Token_inst = await Della_Stable_Token.deployed();

//   const make_camp = async addr => await Campaign_Crowdsale.at(addr);
//   const make_toke = async addr => await Della_Security_Token.at(addr);

//   return {
//     to_string(BN, msg) {
//       // const obj={
//       //   [BN]:BN.toString()
//       // }
//       // console.log(obj)
//       console.log(`${msg} is ${BN.toString()}`);
//       return BN.toString();
//     },

//     async buy_della_stable_tokens(amount, purchaser) {
//       /* Get current eth price */
//       var eth_price_data = await eth_price_oracle_inst.get_eth_price();
//       let eth_price = eth_price_data["0"];
//       // logger.log(`eth_price ${eth_price}`);
//       // logger.log(`eth_price ${eth_price}`);
//       // logger.log(`eth_price ${eth_price}`);
//       const Della_Stable_Token_addr = await Della_Stable_Token_inst.address;

//       var value_to_buy_DTS = amount / (eth_price / 100); //should get refinded 0.001 ether
//       // logger.log({ value_to_buy_DTS });
//       var DST_purchaser = purchaser;
//       value_to_buy_DTS = web3.utils.toWei(value_to_buy_DTS.toString(), "ether");
//       // logger.log({ value_to_buy_DTS });
//       let buy_DST_receipt = await Della_Stable_Token_inst.sendTransaction({
//         from: DST_purchaser,
//         value: value_to_buy_DTS
//       });

//       return buy_DST_receipt;
//     },

//     async Tokens_for_Tokens_purchase(
//       DST_purchaser,
//       CAN_START_VALUE,
//       ACCOUNT_STARTING_CROWDSALE
//     ) {
//       // const Della_Stable_Token_addr = await Della_Stable_Token_inst.address;
//       // logger.log({value_to_buy_DTS})
//       // var DST_purchaser = DST_purchaser;
//       // value_to_buy_DTS = web3.utils.toWei(value_to_buy_DTS.toString(), "ether");
//       // logger.log({value_to_buy_DTS})
//       // let buy_DST_receipt = await Della_Stable_Token_inst.sendTransaction({
//       //   from: DST_purchaser,
//       //   value: value_to_buy_DTS
//       // });
//       const Della_Stable_Token_addr = await Della_Stable_Token_inst.address;

//       var value_to_buy_DTS = 51.02; //should get refinded 0.001 ether
//       let buy_DST_receipt = await this.buy_della_stable_tokens(
//         value_to_buy_DTS,
//         DST_purchaser
//       );


//       var { campaign_address, token_address } = await this.start_crowdsale(
//         ACCOUNT_STARTING_CROWDSALE,
//         CAN_START_VALUE
//       );
//       // return
//       logger.log({ campaign_address, token_address, Della_Stable_Token_addr });
//       this.check_balanceOf(
//         token_address,
//         campaign_address,
//         "campaing starting tokens"
//       );

//       let campaign_crowdsale11 = await Campaign_Crowdsale.at(campaign_address);

//       // return
//       // let campaign_crowdsale = await Campaign_Crowdsale.at(campaign_address);
//       // logger.log(campaign_crowdsale);
//       // logger.log(campaign_crowdsale.contract.events);

//       await this.buy_tokens_with_tokens(51.02, campaign_address, DST_purchaser);
//       // logger.log(tokens_for_tokens_receipt);
//       // logger.log(tokens_for_tokens_receipt.logs);
//       // logger.log(tokens_for_tokens_receipt.receipt.rawLogs);
//       // event_parser.parse_raw_logs(tokens_for_tokens_receipt);
//       this.check_balanceOf(
//         Della_Stable_Token_addr,
//         DST_purchaser,
//         "Della_Stable_Token balance one"
//       );
//       this.check_balanceOf(
//         token_address,
//         DST_purchaser,
//         "campaign_tokens balance DST_PURCAHCER"
//       );

//       /* Subscribe to events */
//       let Tokens_received_For_Change = await campaign_crowdsale11.getPastEvents(
//         "Tokens_Received",
//         {
//           fromBlock: 0,
//           toBlock: "latest"
//         }
//       );
//       Tokens_received_For_Change.forEach(data => logger.log(data.returnValues));
//       // let Tokens_received_For_Tokens = await campaign_crowdsale.getPastEvents(
//       //   "Tokens_received_For_Tokens",
//       //   {
//       //     fromBlock: 0,
//       //     toBlock: "latest"
//       //   }
//       // );

//       // logger.log({ Tokens_received_For_Tokens });
//       // // logger.log(Tokens_received_For_Tokens[0].returnValues);
//       // let Receive_It_event = await campaign_crowdsale.getPastEvents(
//       //   "Receive_It",
//       //   {
//       //     fromBlock: 0,
//       //     toBlock: "latest"
//       //   }
//       // );

//       // logger.log({ Receive_It_event });
//       // logger.log(Receive_It_event[0].returnValues);

//       // let token_calc = await campaign_crowdsale.getPastEvents(
//       //   "Receive_It",
//       //   {
//       //     fromBlock: 0,
//       //     toBlock: "latest"
//       //   }
//       // );
//       // logger.log(Receive_It_event[0].returnValues);
//     },
//     async buy_tokens_with_tokens(amount, campaign_address, DST_purchaser) {
//       // logger.log(amount);
//       var amount = parseFloat(amount).toFixed(4);

//       // logger.log(amount.toString());
//       var tokens_to_send = web3.utils.toWei(amount.toString(), "ether");
//       // logger.log(`tokens_to_send ${tokens_to_send}`);
//       // logger.log(`tokens_to_send ${tokens_to_send}`);
//       // logger.log(`tokens_to_send ${tokens_to_send}`);
//       // logger.log(`tokens_to_send ${tokens_to_send}`);
//       let tokens_for_tokens_receipt = await Della_Stable_Token_inst.send(
//         campaign_address, //to
//         tokens_to_send, //amount
//         web3.utils.toHex("I LIKE BUY TOKENS"), //data
//         { from: DST_purchaser }
//       );
//       // logger.log({tokens_for_tokens_receipt})
//       // logger.log(tokens_for_tokens_receipt.logs)
//       // event_parser.parse_logs(tokens_for_tokens_receipt)

//       return tokens_for_tokens_receipt;
//     },
//     async testing_refunds(Della_Stable_Token_address, buyers, ACCOUNT_STARTING_CROWDSALE, CAN_START_VALUE){
//       const [one, three] = buyers

//       var {  
//         campaign_address,
//         token_address } = await this.start_crowdsale(ACCOUNT_STARTING_CROWDSALE, CAN_START_VALUE)
//         var static_rate_plus_tax = 510;
  
//         logger.log({campaign_address,token_address})
//   /* Buy initial stable token balance */
//         await this.buy_della_stable_tokens((50*static_rate_plus_tax), one)
//         await this.buy_della_stable_tokens((50*static_rate_plus_tax), three)
//   /* Get balance after buying enough stable otkens ot buy the tokens */
//         let balance1_ = await this.check_balanceOf(Della_Stable_Token_address, one, 'Della_Stable_Token_address, one');
//         let balance3_ = await this.check_balanceOf(Della_Stable_Token_address, three, 'Della_Stable_Token_address, three');
        
//   /* buy the desired security tokens, i.e. spend stable tokens */      
//         await this.buy_tokens_with_tokens(50*static_rate_plus_tax, campaign_address, one)
//         await this.buy_tokens_with_tokens(50*static_rate_plus_tax, campaign_address, three)
//         let expired_campaign = await make_camp(campaign_address)

//         assert(
//           await expectThrow(
//             expired_campaign.claimRefund(one, {from:one})

//             ),
//             "Refunds are not active yet"
//           )

        
//         /* Wait for time limit to expire */
//         setTimeout(async ()=>{
//           logger.log('letting campaign time expire.....')
        
//           logger.log('Campaign should be done')
//           let isOpen = await expired_campaign.isOpen()
//           logger.log(`isOpen ${isOpen}`)
//           let balance1a = await this.check_balanceOf(Della_Stable_Token_address, one, 'Della_Stable_Token_address, one');
//           let balance3a  = await this.check_balanceOf(Della_Stable_Token_address, three, 'Della_Stable_Token_address, three');
  
//           await expired_campaign.claimRefund(one, {from:one})
//           await expired_campaign.claimRefund(three, {from:three})
//           let balance1b =await this.check_balanceOf(Della_Stable_Token_address, one, 'Della_Stable_Token_address, one');
//           let balance3b =await this.check_balanceOf(Della_Stable_Token_address, three, 'Della_Stable_Token_address, three');
//           // await this.check_balanceOf(token_address, one, 'token_address, one');
//           // await this.check_balanceOf(token_address, three, 'token_address, three');
//           let campaign_balance_after_all_refunds = await this.check_balanceOf(Della_Stable_Token_address, campaign_address, 'Della_Stable_Token_address, campaign_address');
//           assert(campaign_balance_after_all_refunds == 0);//balance after all refunds
//           console.log(
//             `campaign_balance_after_all_refunds ${campaign_balance_after_all_refunds}
//             ,balance1_ ${balance1_}
//             , balance1b ${balance1b}
//             , balance3_ ${balance3_}
//             , balance3b ${balance3b}`
//           )
//           assert(balance1_.toString() == balance1b.toString());//balance after all refunds
//           assert(balance3_.toString() == balance3b.toString());//balance after all refunds
        
//               let token_for_token_pyrchase_events = await expired_campaign.getPastEvents(
//         "Tokens_received_For_Tokens",
//         {
//           fromBlock: 0,
//           toBlock: "latest"
//         }
//       );
//       token_for_token_pyrchase_events.forEach(data=>(    logger.log(data.returnValues)    ))
  
//           return
          
//         }, 2100)

//     },
//     async get_set_documents(wallet, goal, users) {
//       let {
//         campaign_address,
//         token_address
//       } = await this.make_campaign_and_complete(wallet, goal, users);
//       /* set some documents */
//       let receipt = await Della_inst.setDocument(
//         token_address,
//         web3.utils.toHex("Test Doc 1"),
//         "Some URI?",
//         web3.utils.toHex("SomeHash"),
//         { from: users[0] }
//       );
//       logger.log(receipt);
//       event_parser.parse_raw_logs(receipt);

//       /* Get some socuments */
//       let toke = await make_toke(token_address);
//       let doc = await toke.getDocument(web3.utils.toHex("Test Doc 1"));
//       logger.log(doc);
//       logger.log('get_set_documents TEST complete'.green)
//     },
//     /* Helper for making campaing and testing transfers */
//     async prep_users_for_test_campaign_and_transfers(users) {
//       let all_users = users;
//       let users_who_need_auth = all_users.slice(5, 9);
//       // logger.log(users_who_need_auth)
//       /* authorize users */
//       let res = await Promise.all(
//         users_who_need_auth.map(async user => {
//           await this.authorize_user(user, true, { from: one });
//           await this.sign_agreement(user.toString(), { from: user });
//         })
//       );
//       /* verify auth */
//       await this.check_valid_users(users_who_need_auth);
//     },

//     async make_campaign_then_test_transfers(wallet, goal, users) {
//       let all_users = users;
//       /* Users 6-10 are not authorized per prefious test */
//       /* Authorize all but one user */
//       await this.prep_users_for_test_campaign_and_transfers(users);
//       users.pop(); //remove the last one on the users array, its not authorized!

//       let {
//         campaign_address,
//         token_address
//       } = await this.make_campaign_and_complete(wallet, goal, users);
//       logger.log(`make_campaign_and_complete`.green);
//       await this.check_balanceOf(token_address, Della_addr, "Della_addr");
//       logger.log(`check_balanceOf`.green);
//       users.map(user=> this.check_balanceOf(token_address, user))

//       /* Assorted transfers Send mostly covered */
//       /* Operator transfer */
//       /* Authorize 6 to opperate for 7 */
//       await this.authorize_operator(token_address, users[6], users[7]);
//       logger.log(`authorize_operator`.green);

//       /* 6 will transfer 1 token form 7 to 1 */
//       this.opperator_send(
//         token_address,
//         users[7],
//         users[1],
//         1,
//         "user[6] sending 1 token to users[1] via users[7] operator ",
//         users[6]
//       );
//       logger.log(`opperator_send`.green);

//       /* Controller transfer ERC1400 */
//       await this.controlled_transfer(
//         token_address,
//         users[1],
//         users[2],
//         3,
//         "Controlled transfer form users[1], to users[2]",
//         users[0] /* users[0] is default opporator i.e. owner of Della  */
//       );
//       logger.log(`controlled_transfer`.green);

//       await this.controlled_transfer(
//         token_address,
//         users[2],
//         users[3],
//         1,
//         "Controller tranfering failed granilarity test",
//         users[0]
//       );
//       logger.log(`controlled_transfer`.green);

//       // assert(await expectThrow(
//       //   this.controlled_transfer(
//       //     token_address, users[2], users[3], 0.1,
//       //     "Controller tranfering failed granilarity test",
//       //     users[0]
//       //   ),'Not thre right granilarity for a transfer'
//       // ))

//       /* Operator transfer to unauthorized user */
//       assert(
//         await expectThrow(
//           this.opperator_send(
//             token_address,
//             users[7],
//             all_users[9],
//             1,
//             "user[6] sending 1 token to users[1] via users[7] operator ",
//             users[6]
//           ),
//           "all_users[9] is Not authorized to recive tokens"
//         )
//       );

//       /* Failed transferes */
//       assert(
//         await expectThrow(
//           this.opperator_send(
//             token_address,
//             users[0],
//             users[1],
//             1,
//             "Hacked",
//             users[3]
//           ),
//           "users[3] is Not authorized opperator of users[0]"
//         )
//       );

//       logger.log('make_campaign_then_test_transfers TEST COMPLETE'.green)
//     },
//     async make_campaign_and_complete(wallet, goal, users) {
//       /* first allow to create campaign */
//       await this.set_can_start_campaign(wallet, goal, { from: users[0] });
//       /* verify can start was succesful */
//       let can_start = await Della_inst.get_can_start_campaign(wallet);
//       logger.log(`can_start ${can_start}`)
// logger.log('set_can_start_campaign'.green)
//       let { campaign_address, token_address } = await this.start_crowdsale(
//         wallet,
//         goal
//       );
//       await this.buy_all_campaign_tokens(campaign_address, users);
//       await this.verify_goal_in_USD(campaign_address);
//       return {
//         campaign_address,
//         token_address
//       };
//     },
//     async sign_agreement(name, { from }) {
//       // logger.log({name, from})
//       var ip =
//         Math.floor(Math.random() * 255) +
//         1 +
//         "." +
//         (Math.floor(Math.random() * 255) + 0) +
//         "." +
//         (Math.floor(Math.random() * 255) + 0) +
//         "." +
//         (Math.floor(Math.random() * 255) + 0);
//       // console.log(ip)
//       let sign_agreement_receipt = await Della_inst.sign_terms_and_agreement(
//         name,
//         ip,
//         { from }
//       );
//       return sign_agreement_receipt;
//     },

//     async set_can_start_campaign(user, goal, { from }) {
//       await Della_inst.set_can_start_campaign(user, goal, { from });
//     },

//     async authorize_user(user, flag, { from }) {
//       await Della_inst.set_authorized_investor(user, flag, { from });
//     },

//     async verify_goal_in_USD(campaign_address) {
//       let camp = await make_camp(campaign_address);
//       let stable_tokens_raised = await camp.stable_tokens_raised();
//       var goal = await camp.goal();
//       let goal_reached = await camp.goalReached();
//       let is_finalized = await camp.finalized();
//       logger.log({ is_finalized });
//       let is_goal_met = stable_tokens_raised >= goal;
//       logger.log({ is_goal_met, goal_reached });
//       goal = goal.toString();
//       stable_tokens_raised = stable_tokens_raised.toString();
//       logger.log({ stable_tokens_raised, goal });
//       /* Total value raised USD? */
//       // var rate = await camp.rate()
//       var eth_price = await eth_price_oracle_inst.get_eth_price();
//       var eth_P = eth_price[0].toString();
//       logger.log({ eth_P });
//       logger.log({ eth_price });
//       let stable_tokens_bits_raised = web3.utils.fromWei(
//         new web3.utils.BN(stable_tokens_raised),
//         "ether"
//       );
//       logger.log({ stable_tokens_bits_raised });
//       let USDRaised = Math.round((eth_P * stable_tokens_bits_raised) / 100);
//       logger.log({ USDRaised });
//     },
//     async buy_all_campaign_tokens(campaign_address, users_addresses) {
//       let campaign_crowdsale = await Campaign_Crowdsale.at(campaign_address);
//       var rate = await campaign_crowdsale.TOTAL_RATE();

//       let token_address = await campaign_crowdsale.token_address();
//       let token = await Della_Security_Token.at(token_address);
//       var tokens_remaining = await token.balanceOf(campaign_address);
//       logger.log(`tokens_remaining ${tokens_remaining}`);
//       tokens_remaining = web3.utils.fromWei(tokens_remaining, "ether"); //bring the number down
//       let tokens_each = Math.ceil(tokens_remaining / users_addresses.length);
//       logger.log({ tokens_each });
//       let x = 0;
//       while (tokens_remaining > 0) {
//         logger.log(`looop = ${x}`);
//         let token_count =
//           tokens_remaining > tokens_each ? tokens_each : tokens_remaining;
//         logger.log({ token_count });
//         await this.buy_della_stable_tokens(
//           Math.ceil(token_count * rate),
//           users_addresses[x]
//         );
//         await this.buy_tokens_with_tokens(
//           Math.ceil(token_count * rate),
//           campaign_address,
//           users_addresses[x]
//         );
//         tokens_remaining -= tokens_each;
//         x++; //users iterator
//       }
//     },
//     async eth_balance(addr) {
//       var balance = await web3.eth.getBalance(addr);
//       balance = web3.utils.fromWei(balance, "ether");
//       logger.log(`balance is ${balance} for addr ${addr}`);
//     },
//     async buy_campaign_tokens(campaign_address, token_count, user_address) {
//       // buy_della_stable_tokens(amount, purchaser)
//       var eth_price_data = await eth_price_oracle_inst.get_eth_price(); //100
//       var eth_price = new BN(eth_price_data[0] / 100);
//       let campaign_crowdsale = await Campaign_Crowdsale.at(campaign_address);
//       let rate = await campaign_crowdsale.rate(); //51
//       /* token_count * rate = total_stable tokens needed $$ */
//       /* total_needed/eth_price = total eth? */
//       let token_address = await campaign_crowdsale.token(); //
//       rate = new BN(rate);
//       logger.log(`Rate is ${rate}`);
//       // logger.log(web3.utils.fromWei(rate, "ether")); //  35971223021582733
//       logger.log(`token_count ${token_count}`);
//       logger.log(typeof token_count);
//       let token_count_BN = new BN(token_count);
//       logger.log(`token_count ${token_count_BN}`);
//       this.check_balanceOf(token_address, campaign_address, "campaign_address");
//       let dollar_rate = rate / 1000;
//       logger.log(token_count * dollar_rate);
//       let total_dst_needed = token_count * dollar_rate;
//       logger.log(`total_dst_needed ${total_dst_needed}`);
//       // let cal_one = (token_count_BN.mul(dollar_rate))
//       logger.log(`dollar_rate ${dollar_rate}`);
//       // logger.log(`cal_one ${cal_one}`)
//       let total_eth = total_dst_needed / eth_price;
//       logger.log(`cal_two ${total_eth}`);

//       let val_for_tokens = web3.utils.toWei(total_eth.toString(), "ether");
//       logger.log(`val_for_tokens ${val_for_tokens}`);

//       logger.log(`User `.blue + `${user_address}` + ` Buying tokens`.white);
//       let buy_token_receipt = await campaign_crowdsale.sendTransaction({
//         from: user_address,
//         value: val_for_tokens //12.762750000000000000
//       });
//       return buy_token_receipt;
//     },

//     async check_balanceOf(token_address, user_address, msg) {
//       try {
//         let toke = await make_toke(token_address);
//         let bal = await toke.balanceOf(user_address);
//         logger.log(`Balance of ${msg || user_address} ${bal}`);
//         let token_bal = web3.utils.fromWei(bal, "ether");
//         logger.log(token_bal.toString());
//         return bal
//       } catch (err) {
//         logger.log("err".bgRed);
//         logger.log(err);
//       }
//     },

//     async controlled_transfer(
//       token_address,
//       _from,
//       _to,
//       amount,
//       _opperator_data,
//       opporator
//     ) {
//       let op_data = web3.utils.toHex(_opperator_data);
//       let token_amount = web3.utils.toWei(new BN(amount), "ether");

//       let receipt = await Della_inst.controlled_transfer(
//         token_address,
//         _from,
//         _to,
//         token_amount,
//         op_data,
//         { from: opporator }
//       );
//       // logger.log(receipt)
//       event_parser.parse_raw_logs(receipt);
//     },

//     async authorize_operator(token_address, opperator, _for) {
//       let toke = await make_toke(token_address);
//       await toke.authorizeOperator(opperator, { from: _for });
//     },
//     async opperator_send(token_address, from, to, amount, data, opperator) {
//       try {
//         let toke = await make_toke(token_address);
//         let token_amount = web3.utils.toWei(new BN(amount), "ether");
//         let user_data = web3.utils.toHex("");
//         let opperator_data = web3.utils.toHex(data);
//         let receipt = await toke.operatorSend(
//           from,
//           to,
//           token_amount,
//           user_data,
//           opperator_data,
//           { from: opperator }
//         );
//         event_parser.parse_logs(receipt);
//       } catch (err) {
//         logger.log("err".bgRed);
//         if (!err.reason) logger.log(err);
//         else logger.log(err.reason);
//         throw err.reason;
//       }
//     },

//     async token_transfer(from, to, value, token_address, data) {
//       try {
//         let token_val = web3.utils.toWei(new BN(value), "ether");
//         let toke = await make_toke(token_address);
//         var receipt;
//         if (data) {
//           logger.log("transfer with data");
//           receipt = await toke.transferWithData(
//             to,
//             token_val,
//             web3.utils.toHex(data),
//             { from }
//           );
//         } else {
//           logger.log("simple transfer");
//           receipt = await toke.transfer(to, token_val, { from });
//         }
//         event_parser.parse_logs(receipt);
//       } catch (err) {
//         logger.log("err".bgRed);
//         if (!err.reason) logger.log(err);
//         else logger.log(err.reason);
//         throw err.reason;
//       }
//     },
//     async send_tokens(from, to, value, token_address, data) {
//       try {
//         let token_val = web3.utils.toWei(new BN(value), "ether");
//         logger.log(`try send ${token_val.toString()}`);
//         let toke = await make_toke(token_address);
//         var receipt;
//         if (data) {
//           receipt = await toke.methods["send(address,uint256,bytes)"](
//             to,
//             token_val,
//             web3.utils.toHex(data),
//             { from }
//           );
//         } else {
//           receipt = await toke.methods["send(address,uint256)"](to, token_val, {
//             from
//           });
//         }
//         event_parser.parse_logs(receipt);
//       } catch (err) {
//         logger.log("err".bgRed);
//         if (!err.reason) logger.log(err);
//         else logger.log(err.reason);
//         throw err.reason;
//       }
//     },
//     async check_valid_users(user_list) {
//       let res = await Promise.all(
//         user_list.map(async user => {
//           let terms = await Della_inst.has_signed_terms_and_agreement(user);
//           let auth = await Della_inst.is_authorized_investor(user);
//           return terms && auth;
//         })
//       );
//       logger.log(res);
//     },
//     async start_crowdsale(wallet_address, usd_goal) {
//       let crowdsale_receipt = await Della_inst.make_tokenized_campaign(
//         usd_goal, //uint goal, in USD?
//         // wallet_address, //address wallet,NO SET TO MSG.SENDER
//         2, //uint256 time_limit, in seconds
//         {
//           from: wallet_address
//         }
//       );
//       // logger.log(crowdsale_receipt.logs)
//       // event_parser.parse_raw_logs(crowdsale_receipt.receipt.rawLogs)
//       let {
//         campaign_address,
//         token_address
//       } = event_parser.parse_new_campaign_details(crowdsale_receipt.logs);

//       /* ensure a few things */
//       //TODO check for events Campagin Created?

//       //create instance of the first campaign
//       let campaign_crowdsale = await Campaign_Crowdsale.at(campaign_address);
//       let della_security_token = await Della_Security_Token.at(token_address);
//       let escrow_address = await campaign_crowdsale.escrow_address();
//       logger.log({ escrow_address });
//       let escrow_inst = await RefundEscrow.at(escrow_address);
//       let bene = await escrow_inst.beneficiary();
//       logger.log({ bene });

//       return {
//         campaign_address,
//         token_address
//       };
//     },
//     async verify_investor_signed_agreement(receipt) {
//       let logs = receipt.logs;
//       let signed_agreement_event = event_parser._get_event_data_from_logs(
//         logs,
//         "Terms_and_agreement_signed"
//       );
//       logger.log(signed_agreement_event);
//     },

//     async calc_rate(goal_usd) {
//       let test_cal = await Campaign_Deployer_inst._calculate_token_supply_and_rate(
//         goal_usd
//       );
//       logger.log(test_cal[0].toString());
//       logger.log(test_cal[1].toString());
//       logger.log(test_cal[2].toString());
//       logger.log(test_cal[3].toString());
//       logger.log(test_cal[4].toString());
//     }
//   };
// };
