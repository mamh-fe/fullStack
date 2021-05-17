const BaseController = require('./base')
const md5 = require('md5')
const jwt = require('jsonwebtoken')
// 继承 中间规范层
// 随机定义盐
const HashSalt = ':kaikeba@good!2123'
const createRule = {
    email: { type: 'email' },
    nickname: { type: 'string' },
    passwd: { type: 'string' },
    captcha: { type: 'string' },
}

class UserController extends BaseController {

    async login() {
        const { ctx, app } = this
        const { email, passwd, captcha, emailcode } = ctx.request.body
        if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
            this.error('验证码错误')
        }
        if (emailcode !== ctx.session.emailcode) {
            this.error('邮箱验证错误')
        }
        const user = await ctx.model.User.findOne({
            email,
            passwd: md5(passwd + HashSalt),
        })

        if (!user) {
            return this.error('用户名密码错误')
        }

        // 成功  用户的信息加密成token 返回
        const token = jwt.sign({ // 签名， 放想加密的东西
            _id: user._id,
            email,
        }, app.config.jwt.secret, { // 解密字符串， 很多地方都用， 放到配置里边
            expiresIn: '1h', // 过期时间
        })

        this.success({ token, email, nickname: user.nickname })

    }

    async register() {
        const { ctx } = this
        try {
            // 校验传递的参数
            ctx.validate(createRule)
        } catch (e) {
            return this.error('参数校验出错', -1, e.errors)
        }

        const { email, passwd, captcha, nickname } = ctx.request.body
        if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
            return this.error('验证码错误')
        }
        // 验证码正确校验邮箱是否重复

        if (await this.CheckEmail(email)) {
            this.error('邮箱重复')
        } else {
            const ret = await ctx.model.User.create({
                email,
                nickname,
                passwd: md5(passwd + HashSalt), // MD5 加密， 除此之外再加一个盐， 别人更不好破解， 盐只有后端有
            })

            if (ret._id) {
                this.message('注册成功')
            }
        }
    }

    async CheckEmail(email) {
        // 在数据库实例模型 model 上边查询是否存在email
        const user = await this.ctx.model.User.findOne({ email })
        return user
    }
    async verify() {
        // 检验用户名是否存在
    }

    async info() {
        const { ctx } = this
        // 这个地方可以解析header , 但是应该很多接口都需要写成了中间件
        // 你还不知道是哪个邮件， 应该习惯token 里边去取
        // 有的接口需要从token 取数据 有的不需要
        const { email } = ctx.state
        const user = await this.CheckEmail(email)
        this.success(user)
    }

}

module.exports = UserController
