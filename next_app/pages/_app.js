import loading_bar from '../components/loading_bar.js'


import App, {Container} from 'next/app'
import React from 'react'
import withReduxStore from '../redux/app_with_store.js'
import { Provider } from 'react-redux'
// import {actionTypes} from '../redux/store'
import ReduxToastr from 'react-redux-toastr'


// const {SET_CSRF, SET_USER} = actionTypes; 

class MyApp extends App {
    /* Component ,  router ,  _app ,  initialReduxState ,  reduxStore */
    constructor(props){
        super(props)
        // console.log('initialReduxState')
        // console.log(props.initialReduxState)
        // console.log('initialReduxState')
        // for(let k in props ){
        //     logger.log('My_App prop.k'.magenta)
        //     logger.log(k)
        // }
        // logger.log(props.Component)//The page being loaded




    }
    // static async getInitialProps (appContext) {
    //   console.log("getInitialProps _app")
    //   console.log("getInitialProps _app")


        /* Component, router, ctx */
        // for(let k in appContext){
        //     console.log('getInitialProps appContect')
        //     console.log(k)
        // }
        /* err, req, res ONLY ON SERVER */
        /* BOTH CLIENT AND SERVER pathname, query, aspPath, reduxStore */
        // for(let k in appContext.ctx){
        //     console.log('appContext.ctx')
        //     console.log(k)
        // }
        // if(appContext.ctx.req && appContext.ctx.req.user){
        //   logger.log('GOT A USER HERE')
        //   appContext.ctx.reduxStore.dispatch({
        //     type:SET_USER,
        //     user:appContext.ctx.req.user    
        // })

        // }
        // if(appContext.ctx.res){
        //   appContext.ctx.reduxStore.dispatch({
        //         type:SET_CSRF,
        //         csrf:appContext.ctx.res.locals.csrf_token_function()    
        //     })
        // }

        // if(appContext.ctx && appContext.ctx.pathname){
        //   let {app} = appContext.ctx.reduxStore.getState()
        //   let path = appContext.ctx.pathname

        //   console.log('Check for user?')
        //   if(path == '/login'){
        //     console.log(app)
        //     if(app.user){
        //       console.log('YOU ARE ALREADY LOGGED INNN!!!!!//TODOO')
        //     }
        //   }
        // }
        

        // return  appContext.ctx.reduxStore.getState() 
    // }


  render () {
    const {Component, pageProps, reduxStore} = this.props
    // console.log({Component, pageProps, reduxStore})
    // console.log('pageProps')
    // console.log(pageProps)
    // console.log('pageProps')
    return (
      <Container>
        <Provider store={reduxStore}>
          <>
          <ReduxToastr
            timeOut={4000}
            newestOnTop={false}
            preventDuplicates
            position="top-left"
            transitionIn="fadeIn"
            transitionOut="fadeOut"
            progressBar={true}
            showCloseButton={false}
            closeOnToastrClick/>
            <Component {...pageProps} />
            </>
        </Provider>
      </Container>
    )
  }
}

export default withReduxStore(MyApp)