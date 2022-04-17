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
      if (error && ctx.path === '/api/utils/upload-img') {
        if (error.code === 'Request_fileSize_limit') {
          return ctx.helper.error({ ctx, errorType: 'uploadImageTooLargeFail' })
        }
        if (error.status === 400) {
          return ctx.helper.error({ ctx, errorType: 'uploadImageFormatFail' })
        }
      }
      throw error
    }
  };
};