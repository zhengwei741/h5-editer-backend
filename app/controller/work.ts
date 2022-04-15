import { Controller } from 'egg'
import inputValidate from '../decorator/inputValidate'
import checkPermission from '../decorator/checkPermission'

const workCreateRules = {
  title: 'string',
}

export default class WorkController extends Controller {
  @inputValidate(workCreateRules, 'workValidateFail')
  public async createWork() {
    const { ctx } = this
    try {
      await ctx.service.work.createEmptyWork(ctx.request.body)
      ctx.helper.success({ ctx, message: '创建成功' })
    } catch (e) {
      ctx.helper.error({ ctx, errorType: 'workValidateFail', error: e })
    }
  }
  public async copyWork() {
    const { ctx } = this
    const { id } = ctx.request.body
    try {
      const res = await ctx.service.work.copyWork(parseInt(id))
      ctx.helper.success({ ctx, message: '操作成功', res })
    } catch (e) {
      ctx.helper.error({ ctx, errorType: 'universalError', error: e })
    }
  }

  public async findWorkById() {
    const { ctx } = this
    const { id } = ctx.params
    const res = await this.ctx.model.Work.findOne({ id }).lean()
    ctx.helper.success({ ctx, res })
  }

  @checkPermission('Work')
  public async deleteWork() {
    const { ctx } = this
    const { id } = ctx.params

    try {
      await ctx.model.Work.deleteOne({ id })
      ctx.helper.success({ ctx, message: '操作成功' })
    } catch (e) {
      ctx.helper.error({ ctx, errorType: 'universalError', error: e })
    }
  }

  public async publish(isTemplate) {
    const { ctx } = this
    const { id } = ctx.request.body
    try {
      await ctx.model.Work.findOneAndUpdate({ id }, { isTemplate })
      ctx.helper.success({ ctx, message: '操作成功' })
    } catch (e) {
      ctx.helper.error({ ctx, errorType: 'universalError', error: e })
    }
  }

  public async publishWork() {
    this.publish(true)
  }

  public async publishTemplate() {
    this.publish(false)
  }

  public async myList() {
    const { ctx } = this
    const userId = ctx.state.user._id
    const { pageSize, pageNumber } = ctx.query
    const findCondition = {
      user: userId
    }
    const condition: IndexCondition = {
      populate: {
        path: 'user',
        select: 'username nickname picture'
      },
      select: 'id author copiedCount coverImg desc title user isHot createdAt',
      find: findCondition,
      ...(pageNumber && { pageNumber: parseInt(pageNumber) }),
      ...(pageSize && { pageSize: parseInt(pageSize) })
    }
    const mylist = await ctx.service.work.getList(condition)
    ctx.helper.success({ ctx, res: mylist })
  }

  public async templateList() {
    const { ctx } = this
    const { pageSize, pageNumber } = ctx.query
    const findCondition = { isPublic: true, isTemplate: true }
    const condition: IndexCondition = {
      populate: {
        path: 'user',
        select: 'username nickname picture'
      },
      select: 'id author copiedCount coverImg desc title user isHot createdAt',
      find: findCondition,
      ...(pageNumber && { pageNumber: parseInt(pageNumber) }),
      ...(pageSize && { pageSize: parseInt(pageSize) })
    }
    const templateList = await ctx.service.work.getList(condition)
    ctx.helper.success({ ctx, res: templateList })
  }
}

export interface IndexCondition {
  pageSize?: number
  pageNumber?: number
  select?: string | string[]
  populate?: { path?: string, select?: string } | string
  customSort?: Record<string, any>
  find: Record<string, any>
}
