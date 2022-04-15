import { Controller } from 'egg'
import { createReadStream, createWriteStream } from 'fs'
import { resolve } from 'path'

export default class UploadController extends Controller {
  public async upload() {
    const { ctx } = this

    const { filepath, filename } = ctx.request.files[0]
    // readFile(filepath, (error, data) => {
    //   if (error) {
    //     return ctx.helper.success({ ctx, message: '上传失败' })
    //   }
    //   const p = resolve(__dirname, '../../', 'uploads', filename)
    //   writeFile(p, data, (error) => {
    //     if (error) {
    //       return ctx.helper.success({ ctx, message: '写文件失败' })
    //     }
    //     ctx.helper.success({ ctx, message: '上传成功' })
    //   })
    // })
    const source = createReadStream(filepath)
    const p = resolve(__dirname, '../../', 'uploads', filename)
    const target = createWriteStream(p)

    try {
      // pump(source, target)
      source.pipe(target)
    } finally {
      await ctx.cleanupRequestFiles()
    }
  }
}

// async function pump(source: ReadStream, target: WriteStream) {
//   const getReadDate = async function () {
//     return new Promise((resolve) => {
//       let data = ''
//       source.on('data', function (chunk) {
//         data += chunk
//       })
//       source.on('end', function () {
//         resolve(data)
//       })
//     })
//   }
//   const data = await getReadDate()

//   return new Promise<void>((resolve) => {
//     target.write(data)
//     target.end()
//     target.on('finish', function () {
//       resolve()
//     })
//   })
// }
