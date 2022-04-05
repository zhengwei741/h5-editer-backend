import { Application } from 'egg'

export interface UserProps {
  username: string
  password: string
  email?: string
  nickname?: string
  picture?: string
  phoneNumber: string
  createdAt?: Date
  updatedAt?: Date
}

const initUserModel = function (app: Application) {
  const { mongoose } = app
  const { model, Schema } = mongoose

  const userSchema = new Schema<UserProps>({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String },
    nickname: { type: String },
    picture: { type: String },
    phoneNumber: { type: String },
  }, {
    collection: 'user',
    // 自动添加更新createdAt updatedAt
    timestamps: true
  })

  return model<UserProps>('User', userSchema)
}

export default initUserModel