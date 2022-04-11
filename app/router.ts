import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app

  router.prefix('/api')
  router.post('/user/create', controller.user.createUserByEmail)
  router.post('/user/loginByEmail', controller.user.loginUserByEmail)
  router.get('/user', app.jwt as any, controller.user.showUser)
  router.post('/user/sendVerifyCode', controller.user.sendVerifyCode)
  router.post('/user/loginUserByPhone', controller.user.loginUserByPhone)
  router.get('/users/passport/gitee', controller.user.oauth)
  router.get('/users/passport/gitee/callback', controller.user.oauthByGitee)
};
