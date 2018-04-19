
$(document).ready(function () { 
    console.log("准备");
    $("form#formUpload").on("submit",function(event){
        $(".progress").css("display","block");    //显示进度条
        event.preventDefault();    //不是很懂这里是干嘛的，原文说是为了阻止表单提交
        var formData = new FormData(this);
        formData.append("upload", true);

　　　　 //如果需要为表单添加一些其他字段的数据可以调用formData.append('key','value')来实现
        //开始用ajax上传文件
        $.ajax({
            xhr : function(){
                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener('progress' ,function(e){
                    if (e.lengthComputable){
                        var percent = Math.round(e.loaded * 100. / e.total);
                        $(".progress-bar").attr("aria-valuenow",percent).text(percent+"%").css("width",percent+"%");
                    }
                });
                return xhr;
            },
            type : 'POST',
            url : '/TransformEbook',
            cache : false,
            data : formData,
            processData : false,
            //这条主要是指出了jQuery不要去处理发送的数据
            contentType : false})
            //这里是说明不要ajax去设置Content-Type请求头，原因我也不懂。。
            .done(    //接在整个ajax请求方法后面，表示处理完成或失败时调用的函数
function(){
    console.log('success');
}).fail(
function(){alert('failed');});
            

    });
})