
const mongoose = require('mongoose');
// const Crowdsale = require('./crowdsale.js')


const Page_views_schema = mongoose.Schema({
  ip_address: { type: String },//req.ip
  req_method:{type:String },//req.method
  req_url : {type:String },//req.originalUrl
  is_ajax : {type:Boolean },//req.xhr
  user_id: { type: mongoose.Schema.Types.ObjectId, ref:"User", require: true },//req.user
  browser:{type:String},
  version:{type:String},
  os:{type:String},
  platform:{type:String},
  source:{type:String},
  isMobile:{type:Boolean},
  isTablet:{type:Boolean},
  isiPad:{type:Boolean},
  isiPod:{type:Boolean},
  isiPhone:{type:Boolean},
  isAndroid:{type:Boolean},
  isBlackberry:{type:Boolean},
  isOpera:{type:Boolean},
  isIE:{type:Boolean},
  isEdge:{type:Boolean},
  isIECompatibilityMode:{type:Boolean},
  isSafari:{type:Boolean},
  isFirefox:{type:Boolean},
  isWebkit:{type:Boolean},
  isChrome:{type:Boolean},
  isKonqueror:{type:Boolean},
  isOmniWeb:{type:Boolean},
  isSeaMonkey:{type:Boolean},
  isFlock:{type:Boolean},
  isAmaya:{type:Boolean},
  isPhantomJS:{type:Boolean},
  isEpiphany:{type:Boolean},
  isDesktop:{type:Boolean},
  isWindows:{type:Boolean},
  isLinux:{type:Boolean},
  isLinux64:{type:Boolean},
  
  date: { type: Date, default: Date.now },


})

const Page_view = mongoose.model('Page_view', Page_views_schema)
const useragent = require('express-useragent');

Page_view.add_page_view = add_page_view

module.exports = Page_view

async function add_page_view(req) {
  let source = req.headers['user-agent']
  let ua = useragent.parse(source);
  var data = {isMobile,
    isTablet,
    isiPad,
    isiPod,
    isiPhone,
    isAndroid,
    isBlackberry,
    isOpera,
    isIE,
    isEdge,
    isIECompatibilityMode,
    isSafari,
    isFirefox,
    isWebkit,
    isChrome,
    isKonqueror,
    isOmniWeb,
    isSeaMonkey,
    isFlock,
    isAmaya,
    isPhantomJS,
    isEpiphany,
    isDesktop,
    isWindows,
    isLinux,
    isLinux64,
    browser,
    version,
    os,
    platform,
    source} = ua
    const keys = Object.keys(data)
    var true_values = {}
    keys.forEach((key)=>{
      if(data[key] != false) true_values[key]=data[key]
  })

  var user_id = null
  if(req.user)user_id = req.user.id
  try {
    let new_page_view = new Page_view({
      ip_address:req.ip,
      req_method:req.method,
      req_url:req.originalUrl,
      is_ajax:req.xhr,
      user_id:user_id,
      ...true_values
    })
    await new_page_view.save()
    return true
  } catch (err) {
    logger.log('err')
    logger.log(err)
    
  }
   
  
}