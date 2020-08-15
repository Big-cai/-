$(function () {
    // 1. 发服务器发送语法 ，获取文章分类 ，渲染到页面
    $.ajax({
        type: 'get',
        url: BigNew.category_list,
        success: function (res) {
            // console.log(res);
            if (res.code == 200) {
                var htmlStr = template('categoryList', res)
                $('#selCategory').html(htmlStr)
            }
        }
    })

    // 2. 实现图片预览功能
    // 2.1 给文件按钮注册change
    $('#inputCover').on('change', function () {
        // 2.2 获取到要上传的图片文件
        var file = this.files[0] // files是一个文件列表 
        // 2.3 根据图片生成一个url
        var url = URL.createObjectURL(file)
        // 2.4 给对应的img标签添加此属性值 
        $('.article_cover').attr('src', url)
    })


    // 3. 调用方法实现日期插件的显示
    jeDate("#testico", {
        format: "YYYY-MM-DD",
        isTime: false,
        isToday: true, // 是否显示本月或今天
        zIndex: 29999,
        minDate: "2014-09-19 00:00:00"
    })

    // 4. 启用富文本编辑器
    var E = window.wangEditor
    var editor = new E('#editor')
    // 或者 var editor = new E( document.getElementById('editor') )
    editor.create()


    // 5. 优化代码 将修改按钮和存为草稿按钮 合一起写，内部要进行判断 
    // 5.1 给按钮注册事件
    $('#form').on('click', '.btn', function (e) {
        // console.log(123);
        // 5.2 阻止默认行为
        e.preventDefault()
        // 5.3 准备要发送的数据 是formData格式的
        var form = $('#form')[0]
        var data = new FormData(form)

        // 5.4 添加文章状态及富文本编辑中的内容
        data.append('content', editor.txt.html())
        // 5.5 判断到底是哪个按钮进行的单击
        // console.log(e.target);
        if ($(e.target).hasClass('btn-release')) { // 修改按钮
            data.append('state', '已发布')
        } else {
            // 存为草稿按钮
            data.append('state', '草稿')
        }
        // 5.6 发送ajax请求
        $.ajax({
            type: 'post',
            url: BigNew.article_publish,
            data: data,
            contentType: false, // 不要使用默认的编码格式
            processData: false, // 不要转换成拼接的字符串形式，因为本身是二进制的数据
            success: function (res) {
                if (res.code == 200) {
                    parent.$('.menu .level02>li:eq(0)').click()
                    window.location.href = './article_list.html'
                }

            }
        })
    })

})