$(function () {
    var layer = layui.layer
    getUseInfo()})
    function getUseInfo(){
    $.ajax({
        url: '/my/userinfo',
        method: 'get',
        headers: { Authorization: localStorage.getItem('token') || '' },
        sucess: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }//调用渲染用户信息函数
            renderAvatar(res.data)
        },
        
    })
}
    //渲染用户信息
    function renderAvatar(user) {
        var name = user.nickname || user.username
        $('#welcome').html('欢迎&nbsp;&nbsp;'+name)
        if (user.user_pic !== null) {
            $('.layui-nav-img').arr('src',user.user_pic).show()
            $('.text-avater').hide()
        } $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avater').html(first).show()
    }
$('#btnlogout').on('click', function () {
    layer.confirm('确认退出登录？', { icon: 3, title: '提示' }, function (index) {
        localStorage.removeItem('token')
        location.href = '/login.html'
        layer.close(index)
    })
})