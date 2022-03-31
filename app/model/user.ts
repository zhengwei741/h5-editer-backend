import { Application } from 'egg'

interface User {
  name: string
  age: number
}

const initUserModel = function (app: Application) {
  const { mongoose } = app
  const { model, Schema } = mongoose

  const userSchema = new Schema<User>({
    name: { type: String },
    age: { type: Number },
  }, { collection: 'user' })

  return model<User>('User', userSchema)
}

export default initUserModel