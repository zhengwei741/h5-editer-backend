import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.post('/api/user/create', controller.user.createUserByEmail)
  router.post('/api/user/loginByEmail', controller.user.loginUserByEmail)
  router.get('/api/user/:id', controller.user.showUser)
};
