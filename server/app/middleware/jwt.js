const jwt = require('jsonwebtoken')

// 解析token 的中间件, 也可以用egg-jwt， 自己封装更适合理解原理
module.exports = ({ app }) => {
    // 也是 koa 中间件的写法
    return async function verify(ctx, next) {

        if (!ctx.request.header.authorization) {
            ctx.body = {
                code: -666,
                message: '用户没有登录',
            }
            return
        }
        const token = ctx.request.header.authorization.replace('Bearer ', '')
        try {
            const ret = await jwt.verify(token, app.config.jwt.secret)
            ctx.state.userid = ret._id
            ctx.state.email = ret.email
            // 成功就过去 交给下一个中间件
            await next()
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                ctx.body = {
                    code: -666,
                    message: '登录过期了',
                }
            } else {
                ctx.body = {
                    code: -1,
                    message: '用户信息出错',
                }
            }
        }
    }
}
