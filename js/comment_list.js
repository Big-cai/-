$(function () {

    getDataByParams(1, function (res) {
        pagination(res)
    })

    var currentPage = 1
    function pagination(res) {
        $('#pagination-demo').twbsPagination({
            totalPages: res.data.totalPage,
            visiblePages: 7,
            first: '首页',
            last: '尾页',
            next: '下一页',
            prev: '上一页',
            onPageClick: function (event, page) {
                currentPage = page

                getDataByParams(page, null)
            }
        })
    }

    function getDataByParams(myPage, callback) {

        $.ajax({
            type: 'get',
            url: BigNew.comment_list,
            data: {
                page: myPage,
                perpage: 7
            },
            success: function (res) {
                if (res.code == 200) {
                    var htmlStr = template('commentList', res.data)
                    $('tbody').html(htmlStr)

                    if (res.data.totalPage != 0 && callback != null) {
                        $('#pagination-demo').show().next().hide()
                        callback(res)
                    } else if (res.data.totalPage == 0 && myPage == 1) {
                        $('#pagination-demo').hide().next().show()

                    } else if (res.data.totalPage != 0 && res.data.data.length == 0) {
                        currentPage -= 1
                        $('#pagination-demo').twbsPagination('changeTotalPage', res.data.totalPage.currentPage)
                    }
                }
            }
        })
    }


    $('tbody').on('click', '.btn-reject', function () {
        var _this = this
        $.ajax({
            type: 'post',
            url: BigNew.comment_reject,
            data: {
                id: $(this).data('id')
            },
            success: function (res) {
                if (res.code == 200) {
                    $(_this).parent().prev().text(res.msg)
                }
            }
        })
    })

    // 5.删除功能
    $('tbody').on('click', '.btn-del', function () {
        $.ajax({
            type: 'post',
            url: BigNew.comment_delete,
            data: {
                id: $(this).data('id')
            },
            success: function (res) {
                if (res.code == 200) {
                    getDataByParams(currentPage, null)
                }
            }
        })
    })
    $('tbody').on('click', '.btn-pass', function () {
        var _this = this
        $.ajax({
            type: 'post',
            url: BigNew.comment_pass,
            data: {
                id: $(this).data('id')
            },
            success: function (res) {
                if (res.code == 200) {
                    $(_this).parent().prev().text(res.msg)
                }
            }
        })
    })





})