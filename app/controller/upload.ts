import { Controller } from 'egg';

export default class UploadController extends Controller {
  public async upload() {
    const { ctx } = this

    const file = ctx.request.files

    console.log(file, '---------------')
  }
}
