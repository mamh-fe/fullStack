module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema

    const UserSchema = new Schema({
        _v: { type: Number, selected: false },
        email: { type: String, require: true },
        passwd: { type: String, require: true, select: false }, // select: false 默认查询不返回 ， 单独的语法可以返回
        nickname: { type: String, require: true },
        avatar: { type: String, require: false, default: '/user.png' },
    }, { timestamps: true }) // 配置这个会在数据库自动生成createTime 和updateTime 两个字段
    return mongoose.model('User', UserSchema)
}
