import { Application, } from 'egg';

export default (app: Application) => {
  const { controller, router } = app

  router.prefix('/api')
  router.post('/user/create', controller.user.createUserByEmail)
  router.post('/user/loginByEmail', controller.user.loginUserByEmail)
  router.get('/user/getUserInfo', controller.user.showUser)
  router.post('/user/sendVerifyCode', controller.user.sendVerifyCode)
  router.post('/user/loginUserByPhone', controller.user.loginUserByPhone)
  router.get('/users/passport/gitee', controller.user.oauth)
  router.get('/users/passport/gitee/callback', controller.user.oauthByGitee)

  router.post('/works', controller.work.createWork)
  router.post('/works/copyWork', controller.work.copyWork)
  router.get('/works/:id', controller.work.findWorkById)
  router.del('/works/:id', controller.work.deleteWork)
  router.post('/works/publish/:id', controller.work.publishWork)
  router.post('/works/publish-template/:id', controller.work.publishTemplate)
  router.get('/works/myList', controller.work.myList)

  router.get('/templates', controller.work.templateList)

  router.post('/utils/upload-img', controller.utils.uploadImageToAliOSS)
};
