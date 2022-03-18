import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);

  router.get('/test', controller.home.test);

  router.get('/getData', controller.home.getData);

  router.get('/news', controller.news.list);

};
