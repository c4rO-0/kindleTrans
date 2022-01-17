
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


        $('#resetFilter').
        on('click', function(e) {
            // 重置通配符
            e.preventDefault()
            $('#titleFilter').val('.*[第]{1,2}[0-9零○一二两三四五六七八九十百千廿卅卌壹贰叁肆伍陆柒捌玖拾佰仟万１２３４５６７８９０]{1,5}[章节節堂讲回集部分品]{1,2}.*')
        })

        $(document).on('click', '#download-all', ()=>{
            // console.log('click')
            $('a[download]').each((index, element)=>{
                // console.log("click", $(element))
                setTimeout(() => {
                    $(element).get(0).click()
                }, 300);
                
            })
        })

        let countDown = new IOWA.CountdownTimer.Core(
            new Date('2022-04-01T00:00:01'),
            document.querySelector('countdown-timer')
        );
    
        // window.countDown =countDown
        countDown.attachEvents();
        console.log('start count...')
        countDown.setUp(false);
        countDown.play(false);
})