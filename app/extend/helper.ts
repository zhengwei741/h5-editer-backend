import { Context } from 'egg'
import { userErrorMessage } from '../controller/user'

interface RespType {
  ctx: Context
  message?: string
  res?: any
}

interface errorRespType {
  ctx: Context
  errorType: keyof(typeof userErrorMessage)
  error: any
}

export default {
  success({ ctx, message, res }: RespType) {
    ctx.body = {
      errno: 0,
      message: message ? message : '请求成功',
      data: res ? res : null
    }
  },
  error({ ctx, errorType, error }: errorRespType) {
    const { errno, message } = userErrorMessage[errorType]
    ctx.body = {
      errno,
      message,
      ...(error && { error })
    }
  }
}