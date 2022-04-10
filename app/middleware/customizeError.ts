import { Context } from 'egg'

module.exports = () => {
  return async function customizeError(ctx: Context, next) {
    try {
      await next()
    } catch (e) {
      const error = e as any
      if (error && error.status === 401) {
        return ctx.helper.error({ ctx, errorType: 'usertimeOut' })
      }
      throw error
    }
  };
};