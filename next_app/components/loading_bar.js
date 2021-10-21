import Router from 'next/router'

import NProgress from 'nprogress'
/* NProgress bar setup */
Router.events.on('routeChangeStart', (url) => {
  console.log(`Loading: ${url}`)
  NProgress.start()
})
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())
/* NProgress bar setup */
