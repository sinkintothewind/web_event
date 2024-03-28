$(function () {
    var layer = layui.layer
    var form = layui.form
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                } var htmlStr = $('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 追加的下拉框要使用form.render()
                form.render()
                ininEditor()
            }
        })
    }

    var $image = $('#image')
    var options = {
        aspectRatio: 400/280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    $('#coverFile').on('change', function (e) {
        var files = e.target.files
        if (files.length === 0) {
            return
        } var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image.cropper('destroy')
            // 销毁旧的裁剪区域
            .attr('src', newImgURL)
            // 重新设置图片路径
            .cropper(options)
    })
    var art_state = '已发布'
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })
    // 文章表单提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 创建一个数据对象
        var fd = new FormData($(this[0]))
        // 追加状态属性
        fd.append('state', art_state)
        $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400, height: 280
        }).toBlob(function (blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 5. 将文件对象，存储到 fd 中
            fd.append('cover_img', blob)
            // 6. 发起 ajax 数据请求
            publishArticle(fd)
        })
        function publishArticle(fd) {
            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                // 注意：如果向服务器提交的是 FormData 格式的数据，
                // 必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('发布文章失败！')
                    } layer.msg('发布文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                    location.href = '/article/art_list.html'
                }
            })
        }
    })
})