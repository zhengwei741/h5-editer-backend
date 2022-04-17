import { IBoot, Application } from 'egg'

export default class AppBoot implements IBoot {
  app: Application
  constructor(app: Application) {
    this.app = app
    // app.sessionMap = {}
    // app.sessionStore = {
    //   async get(key) {
    //     const res = await app.sessionMap[key];
    //     if (!res) return null;
    //     return JSON.parse(res);
    //   },

    //   async set(key, value, maxAge) {
    //     // maxAge not present means session cookies
    //     // we can't exactly know the maxAge and just set an appropriate value like one day
    //     if (!maxAge) maxAge = 24 * 60 * 60 * 1000;
    //     value = JSON.stringify(value);
    //     app.sessionMap[key] = value
    //   },

    //   async destroy(key) {
    //     delete app.sessionMap[key]
    //   },
    // }
    // console.log('configWillLoad')
    // console.log(app)
  }

  configWillLoad() {
    // 此时 config 文件已经被读取并合并，但是还并未生效
    // 这是应用层修改配置的最后时机
    // console.log('configWillLoad')
    this.app.config.coreMiddleware.unshift('customizeError')
  }

  async willReady() { }

  async didReady() {
    // console.log(this.app.middleware)
  }
}