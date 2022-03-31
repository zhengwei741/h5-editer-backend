import { Service } from 'egg';

/**
 * User Service
 */
export default class User extends Service {
  /**
   * sayHi to you
   * @param name - your name
   */
  public async getUserList() {
    console.log(this.ctx.model, 'this.ctx.model')
    return await this.ctx.model.User.find({})
  }
}
