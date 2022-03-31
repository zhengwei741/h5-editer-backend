import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
const path = require('path')

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1647350632506_4512';

  // add your egg config in here
  config.middleware = ['notfoundHandler'];

  config.view = {
    root: [
      path.join(appInfo.baseDir, 'app/view'),
    ].join(','),
    mapping: {
      '.nj': 'nunjucks',
    },
    defaultExtension: '.nj'
  };

  config.robot = {
    ua: ['/aaa']
  }

  // mongoose
  config.mongoose = {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/admin',
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
