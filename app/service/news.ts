// app/service/news.js
const Service = require('egg').Service;

class NewsService extends Service {
  async list() {

    // const serverUrl = 'https://hacker-news.firebaseio.com'

    // const { data: idList } = await this.ctx.curl(
    //   `${serverUrl}/v0/topstories.json`,
    //   {
    //     data: {
    //       orderBy: '"$key"',
    //       startAt: `"${5 * (page - 1)}"`,
    //       endAt: `"${5 * page - 1}"`,
    //     },
    //     dataType: 'json',
    //   },
    // );

    // // parallel GET detail
    // const newsList = await Promise.all(
    //   Object.keys(idList).map((key) => {
    //     const url = `${serverUrl}/item/${idList[key]}.json`;
    //     return this.ctx.curl(url, { dataType: 'json' });
    //   }),
    // );

    console.log(this.config.robot)

    return [
      {
        title: 'title',
        url: 'url',
        time: Date.now()
      }
    ]
  }
}

module.exports = NewsService;