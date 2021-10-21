module.exports = () => {
  return{
    '/':{page:'/landing'},
    '/about':{page:'/about'},

    '/account':{page:'/account'},
    '/account-balances':{page:'/account-balances'},
    '/account-notifications':{page:'/account-notifications'},
    '/account-profile':{page:'/account-profile'},
    '/account-wallet':{page:'/account-wallet'},

    '/admin':{page:'/admin'},
    '/campaign':{page:'/campaign'},
    '/campaign-contract':{page:'/campaign-contract'},
    '/campaign-finish':{page:'/campaign-finish'},
    '/campaign-manage':{page:'/campaign-manage'},
    '/campaign-property':{page:'/campaign-property'},
    '/campaign-story':{page:'/campaign-story'},
    '/campaign-view':{page:'/campaign-view'},//handled by server as dynamic route
    '/explore':{page:'/explore'},
    '/how-it-works':{page:'/how_it_works'},
    '/faqs':{page:'/faqs'},
    '/pre-qualify':{page:'/pre_qualify'},
    '/marketplace':{page:'/marketplace'},
    // '/faqs':{page:'/faqs'},

    '/start':{page:'/start'},
    '/signup':{page:'/signup'},

    '/ok':{page:'/ok'},
    '/test':{page:'/test'},
    '404':{page:'/404'}
  }
}