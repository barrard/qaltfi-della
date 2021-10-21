require("dotenv").config();


const Utils = {};
Utils.generate_token = generate_token;
Utils.generate_phone_token = generate_phone_token;

module.exports = Utils;

function generate_token() {
  var randomChars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUSWXYZ1234567890";
  var keysArray = randomChars.split("");
  var max = randomChars.length;
  var keyLength = 20;
  var apikey = [];
  for (let x = 0; x < keyLength; x++) {
    var char = keysArray[Math.floor(Math.random() * 62)];
    apikey.push(char);
  }
  apikey = apikey.join("");
  logger.log(apikey);
  return apikey;
}

function generate_phone_token() {
  var randomChars = "1234567890";
  var keysArray = randomChars.split("");
  var max = randomChars.length;
  var keyLength = process.env.PHONE_TOKEN_LENGTH;
  var apikey = [];
  for (let x = 0; x < keyLength; x++) {
    var char = keysArray[Math.floor(Math.random() * 10)];
    apikey.push(char);
  }
  apikey = apikey.join("");
  logger.log(apikey);
  return apikey;
}
