$(function () {
    // 发送请求获取文章分类
    $.ajax({
        type: 'get',
        url: BigNew.category_list,
        success: function (res) {
            var htmlStr = template('categoryList', res)
            $('#selCategory').html(htmlStr)
        }
    })

    // 2.封装了一个根据不同条件来查询数据的函数
    function getDataByParams(myPage, callback) {
        $.ajax({
            type: 'get',
            url: BigNew.article_query,
            data: {
                key: $('#key').val(),
                type: $('#selCategory').val(),
                state: $('#selStatus').val(),
                page: myPage,
                perpage: 7
            },
            success: function (res) {
                // console.log(res);
                if (res.code === 200) {
                    // 2.2渲染数据
                    var htmlStr = template('articleList', res.data)
                    $('tbody').html(htmlStr)

                    if (res.data.totalPage == 0 && myPage == 1) {
                        $('#pagination-demo').hide().next().show()
                    } else if (res.data.totalPage != 0 && callback !== null) {
                        $('#pagination-demo').show().next().hide()

                        // 实现函数的调用
                        callback(res)
                        // pagination(res)
                    } else if (res.data.totalPage != 0 && res.data.data.length == 0) {
                        currentPage -= 1
                        // 重绘控件页
                        $('#pagination-demo').twbsPagination('changeTotalPages', res.data.totalPage, currentPage)
                    }
                }

            }
        })
    }
    getDataByParams(1, pagination)
    // 3.分页功能的 封装函数
    var currentPage = 1;
    function pagination(res, visiblePages) {
        $('#pagination-demo').twbsPagination({
            totalPages: res.data.totalPage,
            visiblePages: visiblePages || 7,
            first: '首页',
            last: '最后一页',
            next: '下一页',
            prev: '上一页',
            initiateStarPageClick: false,//不要默认点击
            onPageClick: function (event, page) {
                currentPage = page;
                getDataByParams(page, null)
            }
        })
    }

    // 4.给筛选按钮注册事件，根据新条件渲染页面
    $('#btnSearch').on('click', function (e) {
        // 4.1阻止默认行为
        e.preventDefault()
        // 4.2发送请求获取数据

        getDataByParams(1, function (res) {
            $('#pagination-demo').twbsPagination('changeTotalPages', res.data.totalPage, 1)
        })
    })

    // 5.删除数据
    var articleId;
    // 5.1
    $('#myModal').on('show.bs.modal', function (e) {
        articleId = $(e.relatedTarget).data('id')
    })
    // 5.2给模态框的确定按钮注册事件
    $('#myModal .btn-sure').on('click', function () {

        // 5.3发送ajax请求
        $.ajax({
            type: 'post',
            url: BigNew.article_delete,
            data: {
                id: articleId
            },
            // 5.4请求成功隐藏模态框
            success: function (res) {
                $('#myModal').modal('hide')
                // 5.5刷新页面
                getDataByParams(currentPage, null)

            }
        })
    })
})