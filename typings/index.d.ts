import 'egg';
import * as OSS from 'ali-oss'
import { Options } from 'ali-oss'

declare module 'egg' {
  interface MongooseModels extends IModel {
    [key: string]: mongoose.Model<any>
  }

  interface Context {
    genHash: (plainText: string) => Promise<string>
    compare: (plainText: string, hash: string) => Promise<boolean>
    oss: OSS
  }

  interface EggAppConfig {
    oss: {
      client?: Options
    }
  }

  interface Application {
    sessionMap: {
      [key: string]: any
    },
    sessionStore: any
  }
}