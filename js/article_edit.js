$(function () {
    // 启用日期插件
    jeDate('#testico', {
        format: 'YYYY-MM-DD',
        isTime: false,
        zIndex: 20999,
        minDate: '2014-09-19 00:00:00'
    })
    //   启用富文本编辑器
    var E = window.wangEditor
    var editor = new E('#editor')
    editor.create()





    var str = location.search.slice(1)
    var id = utils.convertToObj(str).id
    console.log(id);
    $.ajax({
        type: 'get',
        url: BigNew.article_search,
        data: {
            id: id
        },
        success: function (res) {
            console.log(res);
            if (res.code == 200) {
                $('#form input[name=id]').val(res.data.id)
                $('#form input[name=title]').val(res.data.title)
                $('#form .article_cover').attr('src', res.data.cover)
                // $('#form select[name="categoryId"]').val(res.data.categoryId)
                $('#form input[name=date]').val(res.data.date)
                // $('#form textarea[name=content]').val(res.data.content)
                editor.txt.html(res.data.content)
                var categoryId = res.data.categoryId

                $.ajax({
                    type: 'get',
                    url: BigNew.category_list,
                    success: function (res) {
                        if (res.code == 200) {
                            res.categoryId = categoryId
                            var htmlStr = template('categoryList', res)
                            $('.category').html(htmlStr)
                        }
                    }
                })
            }
        }
    })

    // 5.实现图片预览功能
    $('#inputCover').on('change', function () {
        var file = this.files[0];
        var url = URL.createObjectURL(file)

        $('.article_cover').attr('src', url)
    })

    // 6.文章更新 修改按钮注册事件
    $('#form').on('click', '.btn', function (e) {
        e.preventDefault()
        var form = $('#form')[0]
        var data = new FormData(form)

        data.append('content', editor.txt.html())
        if ($(e.target).hasClass('btn-edit')) {
            data.append('state', '已发布')
        } else {
            data.append('state', '草稿')
        }
        // 发送请求
        $.ajax({
            type: 'post',
            url: BigNew.article_edit,
            data: data,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.code == 200) {
                    window.history.back()
                }
            }
        })
    })
})