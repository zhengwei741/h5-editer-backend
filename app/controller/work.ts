import { Controller } from 'egg'
import inputValidate from '../decorator/inputValidate'

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
  @inputValidate(workCreateRules, 'workValidateFail')
  public async copyWork() {
    const { ctx } = this
    const { id } = ctx.request.body
    try {
      const res = await ctx.service.work.copyWork(parseInt(id))
      ctx.helper.success({ ctx, message: '操作成功', res })
    } catch(e) {
      ctx.helper.error({ ctx, errorType: 'universalError', error: e})
    }
  }

  public async findWorkById() {
    const { ctx } = this
    const { id } = ctx.params
    const res = await this.ctx.model.Work.findOne({ id }).lean()
    ctx.helper.success({ ctx, res })
  }

  public async deleteWork() {
    const { ctx } = this
    const { id } = ctx.request.body
    try {
      await ctx.model.Work.deleteOne({ id: parseInt(id) })
      ctx.helper.success({ ctx, message: '操作成功' })
    } catch(e) {
      ctx.helper.error({ ctx, errorType: 'universalError', error: e})
    }
  }

  public async publish(isTemplate) {
    const { ctx } = this
    const { id } = ctx.request.body
    try {
      await ctx.model.Work.findOneAndUpdate({ id }, { isTemplate })
      ctx.helper.success({ ctx, message: '操作成功' })
    } catch(e) {
      ctx.helper.error({ ctx, errorType: 'universalError', error: e})
    }
  }

  public async publishWork() {
    this.publish(true)
  }

  public async publishTemplate() {
    this.publish(false)
  }
}
