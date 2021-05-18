/* eslint valid-jsdoc: "off" */

// 'use strict'

const path = require('path')

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1620901552349_5848'

  config.multipart = {
    mode: 'file',
    whitelist: () => true  // 白名单
  }

  config.UPLOAD_DIR = path.resolve(__dirname, '..', 'app/public')

  // add your middleware config here
  config.middleware = []

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  return {
    ...config,
    ...userConfig,
    security: {
      csrf: { // post 请求都会有一个csrf 校验
        enable: false,
      },
    },
    mongoose: {
      client: {
        url: 'mongodb://127.0.0.1:27017/kkbhub',
        options: {},
      },
    },
    jwt: {
      secret: '@kaikeba:123abc',
    },
  }
}
