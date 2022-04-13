import { Controller } from 'egg'

export default class WorkController extends Controller {
  public async createWork() {
    const { ctx } = this
    try {
      await ctx.service.work.createWork(ctx.request.body)
      ctx.helper.success({ ctx, message: '创建成功' })
    } catch (e) {
      ctx.helper.error({ ctx, errorType: 'createWorkFail', error: e })
    }
  }
}
