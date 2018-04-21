
let sectDelTOCidx = new Array();
let sectDelTOCindex = new Array();



$(document).ready(function () { 
    console.log("准备");
//     $("form#formUpload").on("submit",function(event){
//         $(".progress").css("display","block");    //显示进度条
        
//         var formData = new FormData(this);
//         formData.append("upload", true);
        
// 　　　　 //如果需要为表单添加一些其他字段的数据可以调用formData.append('key','value')来实现
//         //开始用ajax上传文件
//         $.ajax({
//             xhr : function(){
//                 var xhr = new XMLHttpRequest();
//                 xhr.upload.addEventListener('progress' ,function(e){
//                     if (e.lengthComputable){
//                         var percent = Math.round(e.loaded * 100. / e.total);
//                         $(".progress-bar").attr("aria-valuenow",percent).text(percent+"%").css("width",percent+"%");
//                     }
//                 });
//                 return xhr;
//             },
//             type : 'POST',
//             url : '/TransformEbook',
//             cache : false,
//             data : formData,
//             processData : false,
//             //这条主要是指出了jQuery不要去处理发送的数据
//             contentType : false})
//             //这里是说明不要ajax去设置Content-Type请求头，原因我也不懂。。
//             .done(    //接在整个ajax请求方法后面，表示处理完成或失败时调用的函数
// function(){
//     console.log('success');
// }).fail(
// function(){ console.log( 'false' );});
//     });

    // var socket = io.connect('http://' + document.domain + ':' + location.port);
    // socket.on('connect', function() {
    //     console.log('connected');
    // });

    // socket.on('message', function(data) {
    //     console.log(data);
    // });            

    // 
    // console.log($("p#TOC").text())

    // 检测删除TOC
    $('div#TOC p').
        on('click', function() {

            if($(this).attr("del") == ""){ 
                $(this).css("background-color", "red")
                $(this).attr("del","selected")
            }else{
                // 还原回去
                $(this).css("background-color", "white")
                $(this).attr("del","")
             
            }

            
            $("#TOClistidx").empty()
            $("#TOClistindex").empty()
            $("#TOC p").each((index, element) =>{
                
                if($(element).attr("del") == "selected"){
                    
                    $("#TOClistidx").append(
                    "<li><label for=\"TOClistidx-" 
                    + index + "\">Toclistidx-" 
                    + index + "</label> <input id=\"TOClistidx-" 
                    + index + "\" name=\"TOClistidx-" 
                    + index + "\" value=" 
                    + $(element).attr("idx") +
                    " type=\"text\"></li>"
                    )
                    $("#TOClistindex").append(
                        "<li><label for=\"TOClistindex-" 
                        + index + "\">Toclistindex-" 
                        + index + "</label> <input id=\"TOClistindex-" 
                        + index + "\" name=\"TOClistindex-" 
                        + index + "\" value=" 
                        + $(element).attr("index") +
                        " type=\"text\"></li>"
                        )                    
                }              

            })            

        })

})