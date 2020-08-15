(function () {
    var utils = {
        convertToObj: function (str) {
            var arr = str.split('&') // 以'&'进行切割
            var obj = {}
            for (var i = 0; i < arr.length; i++) {
                var temp = arr[i].split('=') // temp = ['id','20']
                obj[temp[0]] = temp[1]  // {id:20} 将数组的第1项做为对象的属性 将第2项做为对象
            }
            return obj
        }
    }
    window.utils = utils // 向外暴露当前对象，要不然外面使用不了

}())