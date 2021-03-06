import { Service } from 'egg';
import { WorkProps, ChannelProps } from '../model/work'
import { nanoid } from 'nanoid'
import { Types } from 'mongoose'
import { IndexCondition } from '../controller/work'

const defaultIndexCondition: Required<IndexCondition> = {
  pageSize: 0,
  pageNumber: 10,
  select: '',
  populate: '',
  customSort: {},
  find: {}
}

/**
 * Work Service
 */
export default class User extends Service {
  public async createWork(payload: WorkProps) {
    return await this.ctx.model.Work.create(payload)
  }
  public async findWorkById(id: number) {
    return await this.ctx.model.Work.findOne({ id })
  }
  async createEmptyWork(payload) {
    const { ctx } = this
    const { username, _id } = ctx.state.user
    const uuid = nanoid(6)
    const newEmptyWork: Partial<WorkProps> = {
      ...payload,
      // @ts-ignore
      user: Types.ObjectId(_id),
      uuid,
      author: username
    }
    return this.ctx.model.Work.create(newEmptyWork)
  }
  async copyWork(wId: number) {
    const copiedWork = await this.findWorkById(wId)
    if (!copiedWork) {
      throw new Error("未找到复制的作品")
    }

    const { content, title, desc, coverImg } = copiedWork
    const uuid = nanoid(6)
    const { username, _id } = this.ctx.state.user
    const newWork: WorkProps = {
      user: _id,
      author: username,
      uuid,
      coverImg,
      copiedCount: 0,
      status: 1,
      title: `${title}-复制`,
      desc,
      content,
      isTemplate: false,
      channels: []
    }
    return this.ctx.model.Work.create(newWork)
  }
  async getList(condition: IndexCondition) {

    const finallyCondition = {
      ...defaultIndexCondition,
      ...condition
    }

    const {
      pageNumber,
      pageSize,
      select,
      populate,
      customSort,
      find
    } = finallyCondition

    const skip = pageSize * pageNumber

    const list = await this.ctx.model.Work
      .find(find)
      // @ts-ignore
      .populate(populate)
      .sort(customSort)
      .select(select)
      .skip(skip)
      .limit(pageSize)
      .lean()

    const count = await this.ctx.model.Work.find(find).count()
    return {
      pageNumber,
      pageSize,
      count,
      list
    }
  }
  async createChannel(name: string, workId: number) {
    const { ctx } = this

    const newChannel: ChannelProps = {
      name,
      id: nanoid(6)
    }

    return await ctx.model.Work.findOneAndUpdate({
      id: workId
    }, {
      $push: {
        channels: newChannel
      }
    })
  }

  async getChannels(workId: number) {
    const work = await this.ctx.model.Work.findOne({
      id: workId
    })
    if (work) {
      return work.channels
    }
    return []
  }

  async updateChannel(id: number, name: string) {
    return await this.ctx.model.Work.findOneAndUpdate({
      "channels.id": id
    }, {
      $set: {
        "channels.$.name": name
      }
    })
  }

  async delChannel(id: string) {
    return await this.ctx.model.Work.findOneAndUpdate({
      "channels.id": id
    }, {
      $pull: {
        channels: { id }
      }
    })
  }
}
