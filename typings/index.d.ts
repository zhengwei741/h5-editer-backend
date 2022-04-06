import 'egg';

declare module 'egg' {
  interface MongooseModels extends IModel {
    [key: string]: mongoose.Model<any>
  }

  interface Context {
    genHash: (plainText: string) => Promise<string>
    compare: (plainText: string, hash: string) => Promise<boolean>
  }
}