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
  usertimeOut: {
    errno: '0101004',
    message: '用户过期'
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

  getToken() {
    const { ctx } = this
    const { authorization } = this.ctx.header
    if (!ctx.header || !authorization) {
      return false
    }
    if (typeof authorization === 'string') {
      const parts = authorization.split(" ")
      if (parts.length === 2) {
        const scheme = parts[0]
        const credentials = parts[1]
        if (/^Bearer$/i.test(scheme)) {
          return credentials
        }
      } else {
        return false
      }
    }
    return false
  }

  public async showUser() {
    const { ctx, app } = this

    const token = this.getToken()

    if (!token) {
      return ctx.helper.error({ ctx, errorType: 'usertimeOut' })
    }

    try {
      const userInfo = app.jwt.verify(token, app.config.jwt.secret)
      if (typeof userInfo === 'object') {
        const { username } = userInfo
        const userData = await ctx.service.user.findUserByUsername(username)
        return ctx.helper.success({ ctx, res: userData })
      }
      return ctx.helper.error({ ctx, errorType: 'usertimeOut' })
    } catch (e) {
      return ctx.helper.error({ ctx, errorType: 'usertimeOut' })
    }
  }

  public async loginUserByEmail() {
    const { ctx, app } = this
    const { email, password } = ctx.request.body

    const user = await ctx.service.user.findUserByEmail(email)
    if (!user) {
      return ctx.helper.error({ ctx, errorType: 'userloginError' })
    }

    const verifyPwd = await ctx.compare(password, user.password)
    if (!verifyPwd) {
      return ctx.helper.error({ ctx, errorType: 'userloginError' })
    }

    const token = app.jwt.sign(
      { username: user.username, id: user._id },
      app.config.jwt.secret,
      { expiresIn: app.config.jwtExpires }
    )

    ctx.helper.success({ ctx, message: '登录成功', res: token })
  }
}
