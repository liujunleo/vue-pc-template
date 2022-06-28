
const webpackConfig = require('./config/webpack.config.js')
const isProd = process.env.NODE_ENV === 'production'

// gzip
const CompressionWebpackPlugin = require('compression-webpack-plugin')

// Configure the proxy address, which can also be set .env
// When used with mock services, devServerProxyTarget is required. Otherwise, TypeError: Cannot read property 'upgrade' of undefined
// https://segmentfault.com/q/1010000020916388
const devServerProxyTarget = 'http://149.129.114.76:9000'

module.exports = {
  configureWebpack: config => {
    if (isProd) {
      // 配置webpack 压缩
      config.plugins.push(
        new CompressionWebpackPlugin({
          test: /\.js$|\.css$/, //  匹配文件名
          threshold: 102400, //  对超过100kb进行压缩
          deleteOriginalAssets: false // 是否删除原文件
        })
      )
    }
  },
  chainWebpack: config => {
    // 项目标题
    config.plugin('html').tap(args => {
      args[0].title = '首页'
      return args
    })
    webpackConfig(config)
  },
  productionSourceMap: false, // 生产环境不需要 source map
  publicPath: !isProd ? '/' : '',
  css: {
    extract: !!isProd, // 是否将css 提取到独立的文件,生产环境提取，开发环境不提取
    sourceMap: !isProd // 开发模式开启css sourcemap
    // loaderOptions: {
    //   less: {
    //     lessOptions: {
    //       modifyVars: {
    //         hack: 'true;@import "~@/style/_variables.less"'
    //       }
    //     }
    //   }
    // }
  },
  devServer: {
    proxy: {
      '^/mock': {
        target: process.env.VUE_APP_MOCK_BASE_URL || devServerProxyTarget,
        changeOrigin: false,
        pathRewrite: {
          '^/mock': '/mock'
        }
      },
      '^/': {
        target: devServerProxyTarget,
        changeOrigin: false,
        pathRewrite: {
          '^/': ''
        }
      }
    }
  }
}
