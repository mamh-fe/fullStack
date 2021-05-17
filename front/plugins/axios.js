// 对axios 做扩展
import Vue from 'vue'
import axios from 'axios'
import { MessageBox } from 'element-ui'

const service = axios.create({
    // timeout: 5,
    baseURL: '/api'
})

export default ({store, redirect}) => {
    // 请求拦截
    // 主要做token 的管理
    service.interceptors.request.use(
        async config => {
            const token = localStorage.getItem('token')
            if(token) {
                config.headers.common['Authorization'] = "Bearer "+token  // jwt 规范要放一个Bearer + 空格 + token
            }
            return config;
        }
    )

    // 响应拦截 比如只需要返回数据中的data
    service.interceptors.response.use(
        async response => {
            let {data} = response

            if(data.code === -666) {
                // server 定义的过期
                MessageBox.confirm('登录过期', '过期', {
                    confirmButtonText: '登录',
                    showCancelButton: false,
                    tupe: 'warning'
                }).then( () => {
                    localStorage.removeItem('token')
                    // redirect
                    redirect({path: 'login'})
                })
            }

            return data;
        }

    )
}


// 这就是项目中可以使用 $http 的原因
Vue.prototype.$http = service;

export const http = service;