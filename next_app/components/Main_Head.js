import Head from "next/head";
import {connect} from 'react-redux'


import React from 'react';
class Main_Head extends React.Component{
  constructor(props) {
    super(props);
    this.state={}
  }

  componentDidMount(){
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    gtag('config', 'UA-126660736-1');


    {/*  Google Tag Manager */}
   (function (w, d, s, l, i) {
    w[l] = w[l] || []; w[l].push({
      'gtm.start':
        new Date().getTime(), event: 'gtm.js'
    }); var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
        'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', 'GTM-TDP9RR8');


     {/*  start Mixpanel */}
     (function (e, a) {
      if (!a.__SV) {
        var b = window; try { var c, l, i, j = b.location, g = j.hash; c = function (a, b) { return (l = a.match(RegExp(b + "=([^&]*)"))) ? l[1] : null }; g && c(g, "state") && (i = JSON.parse(decodeURIComponent(c(g, "state"))), "mpeditor" === i.action && (b.sessionStorage.setItem("_mpcehash", g), history.replaceState(i.desiredHash || "", e.title, j.pathname + j.search))) } catch (m) { } var k, h; window.mixpanel = a; a._i = []; a.init = function (b, c, f) {
          function e(b, a) {
            var c = a.split("."); 2 == c.length && (b = b[c[0]], a = c[1]); b[a] = function () {
              b.push([a].concat(Array.prototype.slice.call(arguments,
                0)))
            }
          } var d = a; "undefined" !== typeof f ? d = a[f] = [] : f = "mixpanel"; d.people = d.people || []; d.toString = function (b) { var a = "mixpanel"; "mixpanel" !== f && (a += "." + f); b || (a += " (stub)"); return a }; d.people.toString = function () { return d.toString(1) + ".people (stub)" }; k = "disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
          for (h = 0; h < k.length; h++)e(d, k[h]); a._i.push([b, c, f])
        }; a.__SV = 1.2; b = e.createElement("script"); b.type = "text/javascript"; b.async = !0; b.src = "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL ? MIXPANEL_CUSTOM_LIB_URL : "file:" === e.location.protocol && "//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//) ? "https://cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js" : "//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js"; c = e.getElementsByTagName("script")[0]; c.parentNode.insertBefore(b, c)
      }
    })(document, window.mixpanel || []);
    mixpanel.init("b885a4f4291c0c43ecc83d0d0b29c12c");
  {/*  end Mixpanel */}
  
  }
  render(){
    const {GOOGLE_MAPS_API_KEY} = this.props.locals
    return(
      <Head>
        {/* GOOGLE MAPS */}
     <script type="text/javascript" src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`}></script>

      {/*  Global site tag (gtag.js) - Google Analytics */}
   <script async src="https://www.googletagmanager.com/gtag/js?id=UA-126660736-1"></script>


    
   {/*  End Google Tag Manager */}
   <link rel="icon" href="/static/img/favicon.png" type="image/x-icon" />
   <meta charSet="utf-8" />
   <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
   <meta name="description" content="" />
   <meta name="author" content="" />
 
   <title>Della</title>
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css" />

   <link rel="stylesheet" href="https://unpkg.com/toaster-js/default.css" />

   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
     crossOrigin="anonymous" />
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.css" />
   <link href="/static/vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />

   <link rel='stylesheet' type='text/css' href='/static/css/nprogress.css' />

   <link rel="stylesheet" href="/static/css/main.css"/>

   {/*  Custom styles for this template */}
   {/* <link href="/static/css/landing-page.min.css" rel="stylesheet" /> */}
   <link rel="stylesheet" href="/static/css/app.css" />
 

 
 
   </Head>
    )
  }
}
function mapStateToProps (state) {
  const { locals } = state
  return {...locals}
}
export default connect(mapStateToProps)(Main_Head)


