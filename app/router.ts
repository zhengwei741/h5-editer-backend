import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.post('/api/user/create', controller.user.createUserByEmail)
  router.get('/api/user/:id', controller.user.showUser)
};
