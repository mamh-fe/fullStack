// 'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  const jwt = app.middleware.jwt({ app })
  router.get('/', controller.home.index)

  // 验证码
  router.get('/captcha', controller.util.captcha)
  router.get('/sendcode', controller.util.sendcode)

  router.group({ name: 'user', prefix: '/user' }, router => {
    const { info, register, login, verify } = controller.user

    router.post('/register', register)
    router.post('/login', login)

      // 比如只对这个接口使用中间件, 放在中间
    router.get('/info', jwt, info)

    router.get('/verify', verify)
  })

  // /user/register
  // /user/login 会有很多类似这种的，可以使用egg-router-group 进行分组
}
