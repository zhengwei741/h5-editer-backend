import { Context } from 'egg'

export default function (modelName: string, errorType = 'noPermission', userKey = 'user') {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    descriptor.value = async function () {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const _this = this as Context
      const { ctx } = _this
      const _id = ctx.state.user._id
      const { id } = ctx.params
      const certianRecord = await ctx.model[modelName].findOne({ id })
      if (
        !certianRecord ||
        !certianRecord[userKey] ||
        certianRecord[userKey].toString() !== _id
      ) {
        return ctx.helper.error({ ctx, errorType })
      }
      await originalMethod.apply(this, arguments)
    }
  }
}