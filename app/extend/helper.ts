import { Context } from 'egg'

import {
  GlobalErrorTypes,
  globalErrorMessages
} from '../error/index'

interface RespType {
  ctx: Context
  message?: string
  res?: any
}

interface errorRespType {
  ctx: Context
  errorType: GlobalErrorTypes
  error?: any
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
    const { message, errno } = globalErrorMessages[errorType]
    ctx.body = {
      errno,
      message,
      ...(error && { error })
    }
    ctx.status = 200
  }
}