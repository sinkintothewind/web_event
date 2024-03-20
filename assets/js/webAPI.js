//拼接请求地址
$.ajaxPrefilter(function (options) {
options.url = 'http://www.liulongbin.top:30'+options.url
})
//为有权限的接口设置headers
if (options.url.indexof('/my/') !== -1) {``
    options.headers={Authorization: localStorage.getItem('token') || ''}
}
options.complete=function (res) {
    if (res.responseJSON.status === 1 && res.responseJSON.messge === '身份认证失败！') {
        localStorage.removeItem('token')
        localStorage.href='/login.html'
}
}