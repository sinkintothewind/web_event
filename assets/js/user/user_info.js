$(
    function () {
        var layer =layui.layer
        var form = layui.form
        form.verify({
            nickname: function (value) {
                if ( value.length> 6) {
                    return '请输入1~6位字符！'
                }
            }
        })
        function initUserInfo() {
            $.ajax({
                method: 'GET',
                url: '/my/userinfo',
                //权限相关header已在公共js中配置
                success: function (res) {
                    if (res.status !== 0) {
    return layer.msg('请求数据失败！')
}form.val('formUserInfo',res.data)
                }
    })
        }
        $('#btnReset').on('click', function (e) {
e.preventDefault();
initUserInfo()
        })
        $('.layui-form').on('submit', function (e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/userinfo',
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('发送请求失败！')
                    }window.parent.getUseInfo()
                }
            })
        })
    }
)