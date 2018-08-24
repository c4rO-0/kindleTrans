

$(document).ready(function () { 
    $(function() {
        $( "#recordTime" ).datepicker({ dateFormat: 'yy-mm-dd' });
    });

    // 格式化输出整数
    function FormatNumberLength(num, length) {
        var r = "" + num;
        while (r.length < length) {
            r = "0" + r;
        }
        return r;
    }

    
    if($("div[id^=error-]").length == 0){ // 没有错误, 就重置表格
        //  获取今天日期
        var timeNow = new Date();

        $( "#recordTime" ).attr("value", 
        timeNow.getFullYear()+"-"+FormatNumberLength(timeNow.getMonth()+1,2)+"-"+FormatNumberLength(timeNow.getDate(),2));

        // 判断时区

        var timeZone = timeNow.toString().match(/([-\+][0-9]+)\s/)[1];
        if(timeZone == '+0200'){ // 柏林时区
            // 操作人改成BS
            $("#opName option[value=bs]").attr('selected','selected');
            // console.log($("#opName option[value=bs]"))
            // 货币改成欧元
            $("#currency option[value=EUR]").attr('selected','selected');
            // 时区选项更改
            $("#recordZone option[value=\\+0200]").attr('selected','selected');
        }

    }

});