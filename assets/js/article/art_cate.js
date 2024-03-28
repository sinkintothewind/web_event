$(function () {
    var layer = layui.layer
    var form = layui.form
    initArtCatelist()
    function initArtCatelist() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('请求数据失败！')
                } layer.msg('请求数据成功！')
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 为添加类别绑定点击事件
    $('#btnAddCate').on('click', function () {
        var indexAdd = null
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })
    // 为form表单绑定提交事件,因为是追加的元素，要使用委托的方法
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('请求数据失败！')
                } layer.msg('请求数据成功！')
                layer.close(indexAdd)
                initArtCatelist()
            }
        })
    })
    // 通过代理为修改按钮绑定点击事件，是tbody中添加的元素
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function (e) {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        // 将修改表单中原先的数据获取过来
        id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('请求数据失败！')
                } form.val('form-edit', res.data)
            }
        })
    })
    // 通过代理的形式为修改文章分类绑定提交事件，是body上添加的弹窗
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新数据失败！')
                } layer.msg('更新数据成功！')
                layer.close(indexEdit)
                initArtCatelist()
            }
        })
    })
    // 通过代理的形式绑定删除按钮点击事件,是tbod中添加的元素
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    } layer.msg('删除分类成功！')
                    // 关闭弹出层
                    layer.close(index)
                    // 刷新列表数据
                    initArtCateList()
                }
            })
        })
    })
})