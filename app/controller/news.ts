/* eslint-disable @typescript-eslint/no-var-requires */
// app/controller/news.js
const Controller = require('egg').Controller;

class NewsController extends Controller {
  async list() {
    const ctx = this.ctx;
    const page = ctx.query.page || 1;
    const newsList = await ctx.service.news.list(page);
    await ctx.render('news.nj', { list: newsList });
  }
}

module.exports = NewsController;
