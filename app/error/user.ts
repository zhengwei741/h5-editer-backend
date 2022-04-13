export default {
  userValidataFail: {
    errno: '0101001',
    message: '创建用户失败'
  },
  createUserExist: {
    errno: '0101002',
    message: '用户已存在'
  },
  userloginError: {
    errno: '0101003',
    message: '用户不存在或者账号密码错误'
  },
  usertimeOut: {
    errno: '0101004',
    message: '登录过期'
  },
  verifyCodeStillValid: {
    errno: '0101005',
    message: '验证码还在有效期内'
  },
  sendVerifyCodeFail: {
    errno: '0101006',
    message: '发送验证码失败'
  },
  loginVeriCodeIncorrectFailInfo: {
    errno: '0101007',
    message: '验证码错误'
  },
  giteeLoginError: {
    errno: '0101008',
    message: 'gitee授权失败'
  },
  universalError: {
    errno: '0101999',
    message: '操作失败'
  },
}