$(function () {
    // 登录/注册表单点击切换事件
    $('#link_reg').on('click', function () {
        $('.reg-box').show()
        $('.login-box').hide()
    })
    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })
// 表单验证规则
    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) { return '两次密码不一致！' }
        },
        name: /^[a-z0-9_-]{3,16}$/,
email:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
    })
    // 登陆表单提交发起ajax请求
    $('#login-form').on('submit', function (e) {
        e.prebentDefault()
        var data = {
            uesrname: $('#login-form[name=username]').val(),
            password:$('#reg-form[name=password]').val()
        }
        $.ajax({
            url: '/api/login',
            method: 'post',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
    return layer.msg('登陆失败！')
}layer.msg('登陆成功！')
            }
        })
        localStorage.setItem('token',res.token)
    })
    //注册表单提交
    $('#reg-form').on('submit', function (e) {
e.preventDefault();
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                layer.msg('注册成功！')
                $('#link_login').click()
    }layer.msg('注册失败！')
}

)
    })
})