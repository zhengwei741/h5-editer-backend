import { Application, } from 'egg';

export default (app: Application) => {
  const { controller, router } = app

  const jwtMiddleware = app.jwt as any

  router.prefix('/api')
  router.post('/user/create', controller.user.createUserByEmail)
  router.post('/user/loginByEmail', controller.user.loginUserByEmail)
  router.get('/user', jwtMiddleware, controller.user.showUser)
  router.post('/user/sendVerifyCode', controller.user.sendVerifyCode)
  router.post('/user/loginUserByPhone', controller.user.loginUserByPhone)
  router.get('/users/passport/gitee', controller.user.oauth)
  router.get('/users/passport/gitee/callback', controller.user.oauthByGitee)

  router.post('/works', jwtMiddleware, controller.work.createWork)
  router.post('/works/copyWork', jwtMiddleware, controller.work.copyWork)
  router.get('/works/:id', jwtMiddleware, controller.work.findWorkById)
  router.del('/works/:id', jwtMiddleware, controller.work.deleteWork)
  router.post('/works/publish/:id', jwtMiddleware, controller.work.publishWork)
  router.post('/works/publish-template/:id', jwtMiddleware, controller.work.publishTemplate)
};
