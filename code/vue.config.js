module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/styles/_variables.scss";
        `
      }
    }
  },
  configureWebpack:{
    performance: {
      hints: false
    },
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
      }
    }
},
  publicPath: process.env.NODE_ENV === 'production'
  ? '/sonagi/'
  : '/'
}