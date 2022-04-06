import { Controller } from 'egg'

export const userErrorMessage = {
  userValidataFail: {
    errno: '0101001',
    message: '创建用户失败'
  },
  createUserExist: {
    errno: '0101002',
    message: '用户已存在'
  },
  userloginError: {
    errno: '0101003',
    message: '用户不存在或者账号密码错误'
  },
}

export const userCareateRules = {
  username: 'email',
  password: { type: 'password', min: 8 }
}

export default class UserController extends Controller {
  public async createUserByEmail() {
    const { ctx, app } = this

    const body = ctx.request.body
    const errors = await app.validator.validate(userCareateRules, body)
    ctx.logger.warn(errors)
    if (errors) {
      return ctx.helper.error({ ctx, errorType: 'userValidataFail', error: errors })
    }

    // 校验重复
    const user = await ctx.service.user.findUserByUsername(body.username)
    if (user) {
      return ctx.helper.error({ ctx, errorType: 'createUserExist' })
    }

    // post request.body
    // ctx.body 用于返回
    const userData = await ctx.service.user.createUserByEmail(body)
    return ctx.helper.success({ ctx, res: userData })
  }

  public async showUser() {
    const ctx = this.ctx
    const userData = await ctx.service.user.findUserById(ctx.params.id)
    return ctx.helper.success({ ctx, res: userData })
  }

  public async loginUserByEmail() {
    const { ctx } = this
    const { email, password } = ctx.request.body

    const user = await ctx.service.user.findUserByEmail(email)
    if (!user) {
      return ctx.helper.error({ ctx, errorType: 'userloginError' })
    }

    const verifyPwd = await ctx.compare(password, user.password)
    if (!verifyPwd) {
      return ctx.helper.error({ ctx, errorType: 'userloginError' })
    }
    ctx.helper.success({ ctx, message: '登录成功', res: user.toJSON() })
  }
}
