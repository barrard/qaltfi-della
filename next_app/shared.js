/* GLOBALS? */
const fetch= require("isomorphic-fetch");

export default  {
  requestt:async (url) =>{
    const baseUrl = req ? `${req.protocol}://${req.get("Host")}` : "";
    const resp = await fetch(baseUrl + url);
    console.log(baseUrl)
    console.log(resp)
    return resp;
  }
};
