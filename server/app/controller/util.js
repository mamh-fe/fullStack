// 'use strict'
const BaseController = require('./base')
const svgCaptcha = require('svg-captcha')
const fse = require('fs-extra')
class UtilsController extends BaseController {
    async captcha() {
        const captcha = svgCaptcha.create({
            size: 4,
            fontSize: 50,
            width: 100,
            height: 40,
            noise: 3,
        })
        // 放到session 上
        console.log('===>验证码字符', captcha.text)
        this.ctx.session.captcha = captcha.text
        // 设置为图片格式
        this.ctx.response.type = 'image/svg+xml'
        this.ctx.body = captcha.data
    }

    async sendcode() {
        // controller 里边只做和逻辑相关的 service里边做业务相关的，通用的
        const { ctx } = this
        const email = ctx.query.email
        const code = Math.random().toString().slice(2, 6)
        console.log('邮箱' + email + '验证码' + code)
        ctx.session.seailcode = code

        const subject = 'mmh 验证码'
        const text = ''
        const html = `<h2>小开社区 <a href="shop.hualala.com"><span>${code}</span></h2>`

        const hasSend = await this.service.tools.sendMail(email, subject, text, html)
        if (hasSend) {
            this.message('发送成功')
        } else {
            this.message('发送失败2')
        }
    }

    async uploadFile() {
        const {ctx} = this;
        const file = ctx.request.files[0];
        const {name} = ctx.request.body;
        console.log('file 信息',name, file)

        // 将默认的文件存储路径修改成自己想要存储的地方
        await fse.move(file.filepath, this.config.UPLOAD_DIR + '/' + file.filename)

        this.success({
            url: `/public/${file.filename}`
        })
    }
}
module.exports = UtilsController
