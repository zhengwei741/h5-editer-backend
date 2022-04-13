import { Context } from 'egg'
import { GlobalErrorTypes } from '../error'

export default function (rules: any, errorType: GlobalErrorTypes) {
  return function(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    descriptor.value = async function() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const _this = this as Context
      const { ctx, app } = _this
      const errors = await app.validator.validate(rules, ctx.request.body)
      if (errors) {
        return ctx.helper.error({ ctx, errorType, error: errors })
      }
      await originalMethod.apply(this, arguments)
    }
  }
}