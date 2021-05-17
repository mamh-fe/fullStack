const { Service } = require('egg')
const nodemailer = require('nodemailer')
// 用哪个邮箱给哪个邮箱发送邮件
const userEmail = '18330292251@163.com'
// 创建一个目标transporter，
const transporter = nodemailer.createTransport({
    service: '163',
    secureConnection: true,
    auth: {
        user: userEmail,
        // pass: 'mmhxiaoma2021'
        pass: 'KSYJOTNDKCPRYXAT', // 授权码
    },
})

class ToolService extends Service {
    async sendMail(email, subject, text, html) {
        const mailOptions = {
            from: userEmail, // from 从哪来  to 发送到哪去
            cc: userEmail, // 抄送， 抄送一份给自己， 避免垃圾邮件的规避
            to: email,
            subject,
            text,
            html,
        }
        try {
            // 然后目标transporer 发送
            await transporter.sendMail(mailOptions)
            return true
        } catch (err) {
            console.log('错误email error', err)
            return false
        }
    }
}

module.exports = ToolService
