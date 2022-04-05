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
    const userData : Partial<UserProps> = {
      password,
      username,
      email: username
    }
    return await this.ctx.model.User.create(userData)
  }
}
