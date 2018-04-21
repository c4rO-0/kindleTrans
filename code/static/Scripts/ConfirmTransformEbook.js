
$(document).ready(function () { 
    console.log("准备");
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
           

        })

        $('#confirmTOCTransfer').
        on('click', function() {


        
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