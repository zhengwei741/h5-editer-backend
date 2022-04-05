import 'egg';

declare module 'egg' {
  interface MongooseModels extends IModel {
    [key: string]: mongoose.Model<any>
  }
}