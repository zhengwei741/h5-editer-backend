import { Application } from 'egg'
import * as AutoIncrementFactory from 'mongoose-sequence'

export interface UserProps {
  username: string
  password: string
  email?: string
  nickname?: string
  picture?: string
  phoneNumber: string
  createdAt?: Date
  updatedAt?: Date
  type: 'email' | 'cellphone' | 'oauth'
}

const initUserModel = function (app: Application) {
  const { mongoose } = app
  const { model, Schema } = mongoose

  const AutoIncrement = AutoIncrementFactory(mongoose)

  const userSchema = new Schema<UserProps>({
    username: { type: String, unique: true, required: true },
    password: { type: String },
    email: { type: String },
    nickname: { type: String },
    picture: { type: String },
    phoneNumber: { type: String },
    type: { type: String }
  }, {
    collection: 'user',
    // 自动添加更新createdAt updatedAt
    timestamps: true,
    toJSON: {
      transform(_doc, _ret) {
        delete _ret.__v
        delete _ret.password
      }
    }
  })

  // inc_field 自增字段 自增id标识
  userSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'users_id_counter' })

  return model<UserProps>('User', userSchema)
}

export default initUserModel