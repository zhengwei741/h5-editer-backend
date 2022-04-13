import { Service } from 'egg';
import { WorkProps } from '../model/work'
import { nanoid } from 'nanoid'
import { Types } from 'mongoose'

/**
 * Work Service
 */
export default class User extends Service {
  public async createWork(payload: WorkProps) {
    return await this.ctx.model.Work.create(payload)
  }
  async createEmptyWork2(payload) {
    const { ctx } = this
    const { username, _id } = ctx.state.user
    const uuid = nanoid(6)
    const newEmptyWork: Partial<WorkProps> = {
      ...payload,
      user: Types.ObjectId(_id),
      uuid,
      author: username
    }
    return this.ctx.model.Work.create(newEmptyWork)
  }
}
