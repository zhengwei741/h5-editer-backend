import { Controller } from 'egg';

export const userCareateRules = {
  username: 'email',
  password: { type: 'password', min: 8 },
};

export const sendVerifyCodeRules = {
  phoneNumber: { type: 'string', format: /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/, message: '手机号码格式错误' },
  veriCode: { type: 'string', format: /^\d{4}$/, message: '验证码格式错误' },
};

export default class UserController extends Controller {
  private getTokenByUser(user) {
    const { app } = this

    return app.jwt.sign(
      { username: user.username, _id: user._id, role: user.role },
      app.config.jwt.secret,
      { expiresIn: app.config.jwtExpires }
    )
  }

  public async createUserByEmail() {
    const { ctx, app } = this;

    const body = ctx.request.body;
    const errors = await app.validator.validate(userCareateRules, body);
    if (errors) {
      ctx.logger.warn(errors);
      return ctx.helper.error({ ctx, errorType: 'userValidataFail', error: errors });
    }

    // 校验重复
    const user = await ctx.service.user.findUserByUsername(body.username);
    if (user) {
      return ctx.helper.error({ ctx, errorType: 'createUserExist' });
    }

    // post request.body
    // ctx.body 用于返回
    const userData = await ctx.service.user.createUserByEmail(body);
    return ctx.helper.success({ ctx, res: userData });
  }

  public async showUser() {
    const { ctx } = this;
    const user = await ctx.service.user.findUserByUsername(ctx.state.user.username as string);
    return ctx.helper.success({ ctx, res: user });
  }

  public async loginUserByEmail() {
    const { ctx } = this;
    const { email, password } = ctx.request.body;

    const user = await ctx.service.user.findUserByEmail(email);
    if (!user) {
      return ctx.helper.error({ ctx, errorType: 'userloginError' });
    }

    const verifyPwd = await ctx.compare(password, user.password);
    if (!verifyPwd) {
      return ctx.helper.error({ ctx, errorType: 'userloginError' });
    }

    ctx.helper.success({ ctx, message: '登录成功', res: this.getTokenByUser(user) });
  }

  public async loginUserByPhone() {
    const { ctx, app } = this;
    // 校验手机号和验证码
    const errors = await app.validator.validate(sendVerifyCodeRules, ctx.request.body);
    if (errors) {
      ctx.logger.warn(errors);
      return ctx.helper.error({ ctx, errorType: 'universalError', error: errors });
    }
    const { phoneNumber, veriCode } = ctx.request.body;
    const preVeriCode = await app.redis.get(`verifyCode-${phoneNumber}`);
    if (veriCode !== preVeriCode) {
      return ctx.helper.error({ ctx, errorType: 'loginVeriCodeIncorrectFailInfo' });
    }
    const user = await ctx.service.user.loginUserByPhone(phoneNumber);

    ctx.helper.success({ ctx, res: this.getTokenByUser(user) });
  }

  public async sendVerifyCode() {
    const { ctx, app } = this;
    const { phoneNumber } = ctx.request.body;
    // 验证码是否在有效期内
    const preVeriCode = await app.redis.get(`verifyCode-${phoneNumber}`);
    if (preVeriCode) {
      return ctx.helper.error({ ctx, errorType: 'verifyCodeStillValid', error: { preVeriCode } });
    }
    // 生成4位验证码
    const verifyCode = (Math.floor(((Math.random() * 9000) + 1000))).toString();
    // 存入redis
    await app.redis.set(`verifyCode-${phoneNumber}`, verifyCode, 'ex', 600);

    // TODO
    // 对接阿里云短信服务

    ctx.helper.success({ ctx, message: '验证码发送成功', res: app.config.env === 'local' ? { verifyCode } : null });
  }

  public async oauth() {
    const { ctx, app } = this;
    ctx.redirect(`https://gitee.com/oauth/authorize?client_id=${app.config.giteeOauthConfig.clientID}&redirect_uri=${app.config.giteeOauthConfig.redirectURL}&response_type=code`);
  }

  public async oauthByGitee() {
    const { ctx } = this;
    const code = ctx.query.code;
    try {
      const user = await ctx.service.user.loginUserByGitee(code);
      await ctx.render('success.nj', { token: this.getTokenByUser(user) });
    } catch (e) {
      ctx.helper.error({ ctx, errorType: 'giteeLoginError' });
    }
  }
}
