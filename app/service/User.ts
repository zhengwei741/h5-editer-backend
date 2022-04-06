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
}
