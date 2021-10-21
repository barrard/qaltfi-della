var colors = require('colors');
var logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})
const mongoose = require('mongoose');
// const Crowdsale = require('./crowdsale.js')


var Update_schema = mongoose.Schema({
  text: { type: String, require: true },
  title: { type: String, require: true },
  date: { type: Date, default: Date.now },
  crowdsale_id: { type:mongoose.Schema.Types.ObjectId, ref:"Crowdsale", require: true },
  user_id: { type:mongoose.Schema.Types.ObjectId, ref:"User", require: true },



})
const Update = mongoose.model('Update', Update_schema)


Update.add_update = add_update

module.exports =  Update


async function add_update(update, user_id, crowdsale_id){
  let {text, title} = update
  let new_update = new Update({
    text, title, user_id, crowdsale_id
  })
  logger.log('new_update'.bgYellow)
  logger.log(new_update)
  let saved_update = await new_update.save()
  return saved_update

  


}