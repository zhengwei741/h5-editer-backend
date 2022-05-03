import { Controller } from 'egg';
import { createWriteStream } from 'fs';
import { join, extname } from 'path';
import { pipeline } from 'stream/promises';
import * as sharp from 'sharp';
import { nanoid } from 'nanoid';
import { unlink } from 'fs/promises';
import * as streamWormhole from 'stream-wormhole';

export default class UploadController extends Controller {
  public async uploadImageToLocalhost() {
    const { ctx, app } = this;

    const stream = await ctx.getFileStream();

    const id = nanoid(6);

    const filename = `${id}${extname(stream.filename)}`;

    // 上传文件路径和文件流
    const savedPath = join(app.config.baseDir, 'uploads', filename);
    const writeStream = createWriteStream(savedPath);
    const savePromise = pipeline(stream, writeStream);

    // 缩略图文件路径和文件流
    const thumbnailSavedPath = join(app.config.baseDir, 'uploads', `thumbnail_${filename}`);
    const thumbnailWriteStream = createWriteStream(thumbnailSavedPath);
    const transformer = sharp().resize({ width: 300 });
    // 使用 pipeline
    // pipe 每个管道需要监听error
    const saveThumbnailPromise = pipeline(stream, transformer, thumbnailWriteStream);

    try {
      await Promise.all([savePromise, saveThumbnailPromise]);
    } catch (e) {
      // 删除文件
      await unlink(savedPath);
      await unlink(thumbnailSavedPath);
      return ctx.helper.error({ ctx, errorType: 'uploadImageFail', error: e });
    }
    ctx.helper.success({ ctx, message: 'success' });
  }

  public async uploadImageToAliOSS() {
    const { ctx } = this;

    const stream = await ctx.getFileStream();

    const filename = `h5editer/${nanoid(6) + extname(stream.filename)}`;

    let path = '';
    try {
      const result = await ctx.oss.put(filename, stream);
      path = result.url;
    } catch (e) {
      await streamWormhole(stream);
      ctx.helper.error({ ctx, errorType: 'uploadImageFail', error: e });
    }
    ctx.helper.success({
      ctx,
      message: '上传成功',
      res: {
        path,
      },
    });
  }

  public async randerH5Page() {
    const { ctx } = this;
    const { id } = ctx.params;
    try {
      const pageData = await ctx.service.utils.queryRanderPageData(id);
      await ctx.render('page.nj', pageData);
    } catch (e) {
      ctx.helper.error({ ctx, errorType: 'renderPageFail', error: e });
    }
  }
}
