import Document, { Head, Main, NextScript } from 'next/document'
import Google_Tag_Manager from "../components/Google_Tag_Manager.js";
// import $ from "jquery";

export default class MyDocument extends Document {
  // static async getInitialProps (ctx) {
  //   console.log("getInitialProps _document")

  //   const initialProps = await Document.getInitialProps(ctx)
  //   return { ...initialProps }
  // }

  render () {
    return (
      <html>
        <Head>
        {/* React Resux Toastr  https://github.com/diegoddox/react-redux-toastr#readme */}
        <link href="https://diegoddox.github.io/react-redux-toastr/7.1/react-redux-toastr.min.css" rel="stylesheet" type="text/css" />


        </Head>
        <body>
        <Google_Tag_Manager />

          <Main />
          <NextScript />
          <script src="/static/vendor/jquery/jquery.min.js"></script>
          {/* <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8="crossOrigin="anonymous"></script> */}
          <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossOrigin="anonymous"></script>
          <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossOrigin="anonymous"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js"></script>
          <script type="text/javascript" src="https://unpkg.com/toaster-js/umd.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js"></script>
          <script src="/static/vendor/pdfobject.min.js"></script>
          <script src="/static/js/js.js"></script>
          
        </body>
      </html>
    )
  }
}
