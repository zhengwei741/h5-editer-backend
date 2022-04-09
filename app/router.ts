import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app

  router.prefix('/api')
  router.post('/user/create', controller.user.createUserByEmail)
  router.post('/user/loginByEmail', controller.user.loginUserByEmail)
  router.get('/user/:id', controller.user.showUser)
};
