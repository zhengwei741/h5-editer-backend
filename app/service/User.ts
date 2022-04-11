import { Service } from 'egg';
import { UserProps } from '../model/user'

/**
 * User Service
 */
export default class User extends Service {
  public async findUserById(id: string) {
    return await this.ctx.model.User.findById(id)
  }
  public async findUserByUsername(username: string) {
    return await this.ctx.model.User.findOne({ username })
  }
  public async findUserByPhoneNumber(phoneNumber: string) {
    return await this.ctx.model.User.findOne({ phoneNumber })
  }
  public async createUserByEmail(payload: UserProps) {
    const { username, password } = payload
    const pwd = await this.ctx.genHash(password)
    const userData: Partial<UserProps> = {
      password: pwd,
      username,
      email: username
    }
    return await this.ctx.model.User.create(userData)
  }
  public async findUserByEmail(email: string) {
    return this.ctx.model.User.findOne({ email })
  }
  public async loginUserByPhone(phoneNumber: string) {
    const { app } = this

    let user = await this.findUserByPhoneNumber(phoneNumber)

    if (!user) {
      const userData: Partial<UserProps> = {
        username: phoneNumber,
        phoneNumber,
        nickname: `${phoneNumber.slice(-4)}`,
        type: 'cellphone'
      }
      user = await this.ctx.model.User.create(userData)
    }

    return app.jwt.sign(
      { username: user.username, id: user._id },
      app.config.jwt.secret,
      { expiresIn: app.config.jwtExpires }
    )
  }
  async getAccessToken (code: string) {
    const { ctx, app } = this
    const { data } = await ctx.curl(
      `https://gitee.com/oauth/token?grant_type=authorization_code`,
      {
        type: 'POST',
        contentType: 'json',
        dataType: 'json',
        data: {
          code,
          client_id: app.config.giteeOauthConfig.clientID,
          redirect_uri: app.config.giteeOauthConfig.redirectURL,
          client_secret: app.config.giteeOauthConfig.clientSecret
        }
      }
    )
    return data.access_token
  }
  async getGiteeUserData (accesstoken: string) {
    const { ctx } = this
    const { data } = await ctx.curl(
      `https://gitee.com/api/v5/user`,
      {
        type: 'GET',
        dataType: 'json',
        data: {
          access_token: accesstoken
        }
      }
    )
    return data
  }
  public async loginUserByGitee(code: string) {
    const accesstoken = await this.getAccessToken(code)
    // 获取Gitee信息
    const { id, avatar_url, email } = await this.getGiteeUserData(accesstoken)
    const { app } = this
    // 校验是否已经注册
    const existUser = await this.findUserByUsername(`Gitee${id}`)
    if (existUser) {
      const token = app.jwt.sign(
        { username: existUser.username, id: existUser._id },
        app.config.jwt.secret,
        { expiresIn: app.config.jwtExpires }
      )
      return token
    }

    const userData: Partial<UserProps> = {
      username: `Gitee${id}`,
      email,
      type: 'oauth',
      provider: 'gitee',
      picture: avatar_url
    }

    const nweUser = await this.ctx.model.User.create(userData)

    return app.jwt.sign(
      { username: nweUser.username, id: nweUser._id },
      app.config.jwt.secret,
      { expiresIn: app.config.jwtExpires }
    )
  }
}
