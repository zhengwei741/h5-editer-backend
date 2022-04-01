import { Controller } from 'egg';

export const userErrorMessage = {
  createUserValidataFail: {
    errno: '0101001',
    message: '创建用户认证失败'
  },
  createUserExist: {
    errno: '0101002',
    message: '用户已存在'
  },
}

export default class UserController extends Controller {
  public async getUserList() {
    const ctx = this.ctx;
    const userlist = await ctx.service.user.getUserList()
    ctx.body = {
      data: userlist
    }
  }
}
