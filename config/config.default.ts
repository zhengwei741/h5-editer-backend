import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
const path = require('path')

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1647350632506_4512';

  // add your egg config in here
  config.middleware = ['notfoundHandler', 'customizeError'];

  config.view = {
    root: [
      path.join(appInfo.baseDir, 'app/view'),
    ].join(','),
    mapping: {
      '.nj': 'nunjucks',
    },
    defaultExtension: '.nj'
  };

  // mongoose
  config.mongoose = {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/h5editer',
  };

  config.bcrypt = {
    saltRounds: 10
  }

  config.jwt = {
    secret: process.env.JWT_SECRET
  }

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: process.env.REDIS_PWD || '',
      db: 0
    }
  }

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    jwtExpires: '1h'
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
