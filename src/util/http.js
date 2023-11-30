import axios from 'axios'
import ElementUI from 'element-ui'
require('es6-promise').polyfill()
var http = axios.create({
    baseURL: process.env.BASICURL,
    withCredentials: true,
    timeout: process.env.NODE_ENV === 'production' ? 30000 : 100000
})

http.interceptors.request.use(
    config => {
        console.dir(localStorage.getItem('token'))
        // 判断是否存在token，如果存在的话，则每个http header都加上token
        if (sessionStorage.getItem('isv_token') != null) {
            config.headers.userToken = window.sessionStorage.getItem('isv_token');
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
)

http.interceptors.response.use(function (response) {
    if (response.data.code === 401) {
        refLogin()
        return Promise.reject()
    }
    return response
}, function (error) {
    if (error.response.status === 401) {
        refLogin()
        return Promise.reject()
    } else {
        return Promise.reject(error)
    }
})

/*
* 获取浏览器参数
* key：参数名
*/
function getQueryString(key) {
    var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substring(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
}

/**
 * 删除URL中指定search参数,会将参数值一起删除
 * @param {string} url 地址字符串
 * @param {array} aParam 要删除的参数key数组，如['name','age']
 * @return {string} 返回新URL字符串
 */
 function ridUrlParam(url,aParam){
    aParam.forEach(item => {
      const fromindex = url.indexOf(`${item}=`) //必须加=号，避免参数值中包含item字符串
      if (fromindex !== -1) {
        // 通过url特殊符号，计算出=号后面的的字符数，用于生成replace正则
        const startIndex = url.indexOf('=', fromindex)
        const endIndex = url.indexOf('&', fromindex)
        const hashIndex = url.indexOf('#', fromindex)
        
        let reg;
        if (endIndex !== -1) { // 后面还有search参数的情况
          const num = endIndex - startIndex
          reg = new RegExp(`${item}=.{${num}}`)
          url = url.replace(reg, '')
        } else if (hashIndex !== -1) { // 有hash参数的情况
          const num = hashIndex - startIndex - 1
          reg = new RegExp(`&?${item}=.{${num}}`)
          url = url.replace(reg, '')
        } else { // search参数在最后或只有一个参数的情况
          reg = new RegExp(`&?${item}=.+`)
          url = url.replace(reg, '')
        }
      }
    });
    const noSearchParam = url.indexOf('=') 
    if( noSearchParam === -1 ){
      url = url.replace(/\?/, '') // 如果已经没有参数，删除？号
    }
    return url    
}
//401后重新刷新当前登录信息
function refLogin() {
    window.sessionStorage.removeItem('isv_token')
    //如果没有登录切url参数上没有code参数则302到supOS换取认证
    let redirectUrl = ridUrlParam(location.href,['state','code'])
    console.log("地址："+redirectUrl)
    window.location.href =process.env.SUPOS_URL+"/inter-api/auth/v1/oauth2/authorize?responseType=code&state=1&redirectUri=" + encodeURIComponent(redirectUrl)
    
}


//判断是否登录没有的话跳转到登录页面
function login(callback) {
    let token = window.sessionStorage.getItem('isv_token')
    console.log('判断是否登录')
    if (!token) {
        let code = getQueryString('code') || ''
        if (code) {
            console.log('获取登录信息')
            //如果有code则调用接口换取token
            http.get('/auth/accessToken', {
                params: {
                    code
                }
            }).then((res) => {
                const { code, data, msg } = res.data
                console.log('获取到的登录信息数据', code, data, msg)

                console.log('http-----', http)
                if (code !== 0) return ElementUI.Message.error(msg)
                if (data) {
                    //请求结束获取到数据
                    window.sessionStorage.setItem('isv_token', data)
                    console.log('登录信息获取完毕', data)
                    callback()
                }
            })
        } else {
            //如果没有登录且url参数上没有code参数则302到supOS换取认证。SUPOS_URL本地调试时设置为沙箱地址，安装到supOS时设置为空
            let url = process.env.SUPOS_URL+"/inter-api/auth/v1/oauth2/authorize?responseType=code&state=1&redirectUri=" + encodeURIComponent(window.location.href)
            console.log('没有登录且url参数上没有code参数则302到supOS换取认证', url)
            window.location.href = url
           
            return
        }
    } else {
        callback()
    }

}
export {
    http,
    login
}
export default http