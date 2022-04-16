import { Controller } from 'egg'
import { createWriteStream } from 'fs'
import { join } from 'path'
import { pipeline } from 'stream/promises'
import * as sharp from 'sharp'
import { nanoid } from 'nanoid'

export default class UploadController extends Controller {
  public async upload() {
    const { ctx, app } = this

    const stream = await ctx.getFileStream()

    const id = nanoid(6)

    const filename = `${id}_${stream.filename}`

    // 上传文件路径和文件流
    const savedPath = join(app.config.baseDir, 'uploads', filename)
    const writeStream = createWriteStream(savedPath)
    const savePromise = pipeline(stream, writeStream)

    // 缩略图文件路径和文件流
    const thumbnailSavedPath = join(app.config.baseDir, 'uploads', `${filename}_thumbnail`)
    const thumbnailWriteStream = createWriteStream(thumbnailSavedPath)
    const transformer = sharp().resize({ width: 300 })
    // 使用 pipeline
    // pipe 每个管道需要监听error
    const saveThumbnailPromise = pipeline(stream, transformer, thumbnailWriteStream)

    try {
      await Promise.all([ savePromise, saveThumbnailPromise ])
    } catch(e) {
      return ctx.helper.error({ ctx, errorType: 'uploadImageFail', error: e })
    }
    ctx.helper.success({ ctx, message: 'success' })
  }
}
