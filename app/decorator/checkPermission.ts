import { Context } from 'egg'
import { defineAbilitiesForUser } from '../roles/index'
import { subject } from '@casl/ability'
import { permittedFieldsOf } from '@casl/ability/extra'
import { assign } from 'lodash/fp'
import { pick } from 'lodash'

const caslMethodMapping: Record<string, string> = {
  GET: 'read',
  POST: 'create',
  PATCH: 'update',
  DELETE: 'delete'
}

interface IOptions {
  action?: string
  key?: string // 查询的key
  value?: {
    type: 'params' | 'body' | 'query',
    valueKey: string
  }
}

export interface ModelMapping {
  mongoose: string
  casl: string
}

const defaultIOptions: IOptions = {
  key: 'id',
  value: {
    type: 'params',
    valueKey: 'id'
  }
}

const fieldsOptions = { fieldsFrom: rule => rule.fields || [] }

// { id: ctx.params.id }
// { 'channels.id' : ctx.params.id }
// { 'channels.id' : ctx.request.body.workID }

export default function (modelName: string | ModelMapping, errorType = 'noPermission', options: IOptions = {}) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function () {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const _this = this as Context
      const { ctx } = _this

      if (!ctx.state || !ctx.state.user) {
        return ctx.helper.error({ ctx, errorType })
      }
      // 构建 caslModelName 和 mongooseModelName
      const caslModelName = typeof modelName === 'string' ? modelName : modelName.casl
      const mongooseModelName = typeof modelName === 'string' ? modelName : modelName.mongoose

      const { value, key } = assign(defaultIOptions, options)
      const { type, valueKey } = value
      const source = (type === 'params') ? ctx.params : (type === 'query') ? ctx.query : ctx.request.body
      // 构建query
      const query = {
        [key]: source[valueKey],
      }

      let hasPermission = false
      const action = options.action ? options.action : caslMethodMapping[ctx.request.method]
      // 创建规则
      const abilitie = defineAbilitiesForUser(ctx.state.user)
      // 查看规则是否需要条件
      const rule = abilitie.relevantRuleFor(action, caslModelName)
      if (rule && rule.conditions) {
        const certianRecord = await ctx.model[mongooseModelName].findOne(query).lean()
        hasPermission = abilitie.can(action, subject(caslModelName, certianRecord))
      } else {
        hasPermission = abilitie.can(action, caslModelName)
      }

      if (!hasPermission) {
        return ctx.helper.error({ ctx, errorType })
      }

      const fields = permittedFieldsOf(abilitie, action, caslModelName, fieldsOptions)
      if (fields.length) {
        // 过滤body不合法的值
        // 或者返回没有权限
        const body = ctx.request.body
        ctx.request.body = pick(body, fields)
      }

      // eslint-disable-next-line prefer-rest-params
      await originalMethod.apply(this, arguments);
    };
  };
}
