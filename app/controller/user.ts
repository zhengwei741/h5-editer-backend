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
    message: '登录过期'
  },
  verifyCodeStillValid: {
    errno: '0101005',
    message: '验证码还在有效期内'
  },
  sendVerifyCodeFail: {
    errno: '0101006',
    message: '发送验证码失败'
  },
  loginVeriCodeIncorrectFailInfo: {
    errno: '0101007',
    message: '验证码错误'
  },
  universalError: {
    errno: '0101999',
    message: '操作失败'
  },
}

export const userCareateRules = {
  username: 'email',
  password: { type: 'password', min: 8 }
}

export const sendVerifyCodeRules = {
  phoneNumber: { type: 'string', format: /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/, message: '手机号码格式错误' },
  veriCode: { type: 'string', format: /^\d{4}$/, message: '验证码格式错误' }
}

export default class UserController extends Controller {
  public async createUserByEmail() {
    const { ctx, app } = this

    const body = ctx.request.body
    const errors = await app.validator.validate(userCareateRules, body)
    if (errors) {
      ctx.logger.warn(errors)
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
    const { ctx } = this
    const userData = await ctx.service.user.findUserById(ctx.params.id)
    return ctx.helper.success({ ctx, res: userData })
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

  public async loginUserByPhone() {
    const { ctx, app } = this
    // 校验手机号和验证码
    const errors = await app.validator.validate(sendVerifyCodeRules, ctx.request.body)
    if (errors) {
      ctx.logger.warn(errors)
      return ctx.helper.error({ ctx, errorType: 'universalError', error: errors })
    }
    const { phoneNumber, veriCode } = ctx.request.body
    const preVeriCode = await app.redis.get(`verifyCode-${phoneNumber}`)
    if (veriCode !== preVeriCode) {
      return ctx.helper.error({ ctx, errorType: 'loginVeriCodeIncorrectFailInfo' })
    }
    const token = await ctx.service.user.loginUserByPhone(phoneNumber)
    ctx.helper.success({ ctx, res: token })
  }

  public async sendVerifyCode() {
    const { ctx, app } = this
    const { phoneNumber } = ctx.request.body
    // 验证码是否在有效期内
    const preVeriCode = await app.redis.get(`verifyCode-${phoneNumber}`)
    if (preVeriCode ) {
      return ctx.helper.error({ ctx, errorType: 'verifyCodeStillValid' })
    }
    // 生成4位验证码
    const verifyCode = (Math.floor(((Math.random() * 9000) + 1000))).toString()
    // 存入redis
    await app.redis.set(`verifyCode-${phoneNumber}`, verifyCode, 'ex', 60)

    // TODO
    // 对接阿里云短信服务

    ctx.helper.success({ ctx, message: '验证码发送成功', res: app.config.env === 'local' ? { verifyCode } : null })
  }
}
