import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.body = await ctx.service.test.sayHi('egg');
  }
  public async test() {
    const { ctx } = this;
    ctx.body = await ctx.service.test.say('word');
    ctx.body = ctx.query;
  }
  public async getData() {
    const ctx = this.ctx;

    // 示例：请求一个 npm 模块信息
    const result = await ctx.curl('http://132.151.63.190:8002/view_zj/pc/new/hydx/query_title?cityId=999&statCycleD=20220315&statCycleM=202202', {
      // 自动解析 JSON response
      dataType: 'json',
      // 3 秒超时
      timeout: 3000,

    });

    ctx.body = {
      status: result.status,
      headers: result.headers,
      package: result.data,
    };
  }
}
