$(function () {
    var form = layui.form
    var laypage = layui.laypage
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    var layer = layui.layerinitTable()
    function ininTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 加载分页
                renderPage(res.total)
            }
        })
    }
    // 时间格式过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        //+1是为了实现1-12月
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }  // 定义补零的函数
    function padZero(n) { return n > 9 ? n : '0' + n }

    // 筛选下拉项 请求分类数据
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        var cata_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cata_id
        q.state = state
        // 根据参数重新渲染列表数据
        initTable()
    })
    // 分页
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',// 分页容器的 Id
            count: total,// 总数据条数
            limit: q.pagesize,// 每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            // 自定义功能项
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], limits: [2, 3, 5, 10],
            // 分页发生切换时，触发 jump 回调，obj是指当前分页的所有选项值
            jump: function (obj, first) {
                //1.拿到最新的页码值
                console.log(obj.curr);
                //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                //2.把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 3.根据最新的q获取对应的数据列表，并渲染表格
                if (!first) {
                    initTable()
                }
            }
        })
    }
    $('.tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm(
            '确认删除?',
            { icon: 3, title: '提示' },
            function (index) {
                $.ajax({
                    method: 'GET',
                    url: '/my/article/delete/' + id,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg('删除文章失败！')
                        } layer.msg('删除文章成功！')
                        if (len === 1) {
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                        }
                        initTable()
                    }
                })
                layer.close(index)
            })
    })
})