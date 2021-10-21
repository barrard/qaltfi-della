require('dotenv').config()
// const withSass = require("@zeit/next-sass");
const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");
const webpack = require('webpack')


module.exports =
withBundleAnalyzer({
  // {
    analyzeServer: ["server", "both"].includes(true),
    analyzeBrowser: ["browser", "both"].includes(true),
    bundleAnalyzerConfig: {
      server: {
        analyzerMode: 'static',
        reportFilename: '../bundles/server.html'
      },
      browser: {
        analyzerMode: 'static',
        reportFilename: '../bundles/client.html'
      }
    },
    webpack: function(config) {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    }
    /**
     * Returns environment variables as an object
     */
    const env = Object.keys(process.env).reduce((acc, curr) => {
      acc[`process.env.${curr}`] = JSON.stringify(process.env[curr])
      return acc
    }, {})

    /** Allows you to create global constants which can be configured
    * at compile time, which in our case is our environment variables
    */
    config.plugins.push(new webpack.DefinePlugin(env))
    return config
    },
    useFileSystemPublicRoutes: false
    // srcDir: 'next_app/'
  // };
})
