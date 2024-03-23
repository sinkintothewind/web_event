$(function () {
    var layer=layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
    // 纵横比(1代表正方形，也可以写16/9或4/3等等)
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }    // 1.3 创建裁剪区域
    $image.cropper(options)
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })
    $('#file').on('change', function (e) {
        var filelist = e.target.files
        if (filelist.length === 0) {
           return layer.masg('请选择图片！')
        }
        var file = e.target.files[0]
        var imgURL = URL.createObjectURL(file)
        $image.cropper('destroy')
        // 销毁旧的裁剪区域
            .attr('src', imgURL)
            // 重新设置图片路径
            .cropper(options)
        // 重新初始化裁剪区域  })
    })
    $('#btnUpload') .on('click', function () {
        var dataURL = $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100, height: 100
        })
            .toDataURL('image/png')
        // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 4.2 调用接口，把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            // 在API文档的ajax请求配置中，请求体中必须包含avatar参数，代表新头像，指向上面的dataURL
            data: { avatar: dataURL },
            success: function (res) {
                if (res.status !== 0) { return layer.msg('更换头像失败！') } layer.msg('更换头像成功！')
                // 调用父页面里的getUserInfo()函数，就会在index页面中重新获取用户信息，重新渲染父页面里的头像
                window.parent.getUserInfo()
            }
        })
    })
})
