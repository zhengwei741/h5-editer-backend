import { Controller } from 'egg';

export default class UserController extends Controller {
  public async getUserList() {
    const ctx = this.ctx;
    const userlist = await ctx.service.user.getUserList()
    ctx.body = {
      data: userlist
    }
  }
}
