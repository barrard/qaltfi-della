const mongoose = require('mongoose');


const Blockchain_Data_Schema = mongoose.Schema({
  name:{type:String, default:'eth'},
  current_eth_price:{type:String, default:"100.00"},
  current_block_number: {type:Number, default:2329},
  curent_block_time: {type:Number, default:Date.now},
  
})

const Blockchain_Data_Model = mongoose.model('blockchain_data', Blockchain_Data_Schema)
module.exports = Blockchain_Data_Model


Blockchain_Data_Model.set_current_block_number = async (current_block_number)=>{
  try {
    await Blockchain_Data_Model.findOneAndUpdate({ name: 'eth' }, {
      current_block_number,
      curent_block_time: new Date().getTime()
    }, { upsert: true })
    // logger.log(`set_current_block_number set ${current_block_number}`)


  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
  }
}

Blockchain_Data_Model.get_current_block_number = async ()=>{
  try {
    let current_block_number = await Blockchain_Data_Model.findOne({name:'eth'})  
    if(!current_block_number)throw 'couldnt ifnd current_block_number'
    return current_block_number
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
  }
  }