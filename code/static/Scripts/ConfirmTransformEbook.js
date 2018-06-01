
$(document).ready(function () { 
    console.log("准备");
    // 检测删除TOC
    $('div#TOC p').
        on('click', function() {

            if($(this).attr("del") == ""){ 
                $(this).css("background-color", "darkgray")
                $(this).attr("del","selected")
            }else{
                // 还原回去
                $(this).css("background-color", "white")
                $(this).attr("del","")
             
            }
           

        })

        $('#confirmTOCTransfer').
        on('click', function() {
            // 点击确定

            $("#message").text("转化为mobi需要一点时间. 短篇小说大概一分钟, 网络长篇小说大概五分钟. 转化完成会自动跳转到下载页面.")

            // 去掉确定按钮
            $("#confirmTOCTransfer").css("display","none")

            $("#TOClistindex").empty()
            $("#TOC p").each((index, element) =>{
                
                if($(element).attr("del") == "selected"){

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
            $('#formTran').submit()
        })


})