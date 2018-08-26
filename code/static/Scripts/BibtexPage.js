// 按照@切割
function splitAllBibtex(allBibtex){

    let nArticle = 0;
    let listSlideBibtex = new Array();
    let SlideBibtex = "";
    allBibtex.trim().split('\n').forEach(function(lineRaw, i) {

        
        line = lineRaw.trim();
        
        if(line[0] != "%"){
                // console.log(line);
            if( line[0] == "@"){
                if(nArticle > 0){
                    listSlideBibtex.push(SlideBibtex);
                    // console.log(SlideBibtex)
                    SlideBibtex = "";
                    
                }
                nArticle = nArticle +1
            }
            if(nArticle > 0){
                

                if( line[0] == "@"){
                    SlideBibtex = SlideBibtex + line
                }else{
                    if(line.indexOf("=") > -1 ){
                        SlideBibtex = SlideBibtex + "\n" + line
                    }else{
                        SlideBibtex = SlideBibtex + line
                    }
                    
                }
                
                
            }
        }
        
    })
    if(nArticle > 0){
        listSlideBibtex.push(SlideBibtex);
        // console.log(SlideBibtex)        
    }

    return listSlideBibtex;
      

} 

// 去除开头的"和{}
function delBrace(line){

    let localLine = line;

    while(localLine.length>0 && (localLine[0] == "\"" || localLine[0] == "{") ){
        localLine = localLine.substr(1);
    }

    while(localLine.length>0 && (localLine[localLine.length-1] == "\"" || localLine[localLine.length-1] == "}" || localLine[localLine.length-1] == ",") ){
        localLine = localLine.substr(0,localLine.length-1);
    }    

    return localLine;

}

// 作者缩写
function shortAuthor(line){

    let localAuthor = line;
    let listShortName = new Array();

    line.trim().split('and').forEach(function(singleAuthorRaw, i) {

        // console.log(singleAuthorRaw)
        let shortName = '';
        // 名字分为有逗号和没逗号两种
        let listSingleName = singleAuthorRaw.trim().split(',');
        if(listSingleName.length == 1){
            // 没逗号，以空格区分， 保持原有顺序, 只有最后一个词不缩写
            listSingleName = listSingleName[0].trim().split(' ');

            listSingleName.forEach((word,i)=>{
                shortName = shortName + word[0]+'. '
            })
            shortName = shortName.substr(0,shortName.length-2) + listSingleName[listSingleName.length-1].substr(1)

            listShortName.push(shortName)

        }else if (listSingleName.length == 2) {
            // 有逗号 逗号前不缩写，逗号后缩写 并拿到前面
            listSingleName[1].trim().split(' ').forEach((word,i)=>{
                shortName = shortName + word[0]+'. '
            })
            shortName = shortName + listSingleName[0].trim()

            listShortName.push(shortName)
        }else{
            // 有两个逗号, 返回空
            return null;
        }

        // return shortName
        // console.log(listShortName)
    })
    
    if(listShortName.length > 1){
        listShortName[listShortName.length-1] = "and " + listShortName[listShortName.length-1] ;
    }

    if(listShortName.length == 2){
        return listShortName.join(" ");
    }else{
        return listShortName.join(", ");
    }
    

    // return joinShortName;

}

// 页数


// convertPRB
function convertPRB(slide){

    let author ="";
    let volume = "";
    let journal = "";
    let pages ="";
    let year = "";

    if(slide.trim().split('\n')[0].toLowerCase().indexOf("@article") > -1 ){
        slide.trim().split('\n').forEach(function(lineRaw, i) {

            if(i>0){
                let listLine = lineRaw.trim().split('=',2);
                if(listLine.length != 2){
                    return null;
                }

                let itemName = listLine[0].trim().toLowerCase();
                let itemValue = delBrace(listLine[1].trim());

                // console.log(itemName, itemValue);


                if(itemName == "author"){
                    if (shortAuthor(itemValue) == null){
                        return null;
                    }
                    author = shortAuthor(itemValue);
                }
                if(itemName == "volume"){
                    volume = itemValue;
                }
                if(itemName == "journal"){ 
                    journal = itemValue;
                }
                if(itemName == "pages"){
                    pages = (itemValue.trim().split('-'))[0].trim();
                }        
                if(itemName == "year"){

                    year = itemValue;
                }                           

            }


        })
        return author + ", " + journal + " " + "<b>"+volume+"</b>" + ", " + pages + " (" + year +")";
    }else{
        // 不支持
        return slide.trim().split('\n')[0] + "<b> Not Supported</b>" 
    }
    
    
}

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ?
          (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }

$(document).ready(function () { 

    $("#clearCite").click(function() {
        $("#refError").empty();
        $("#refList").empty();
    });

    $("#clearBibtex").click(function() {
        $("textarea#bibtex").val("")
    });

    $("#confirm").click(function() {
        
        $("#refError").empty();


        // 全部
        let allBibtex = $("textarea#bibtex").val();
        // 切割
        let listSlideBibtex = splitAllBibtex(allBibtex);


        listSlideBibtex.reverse().forEach(function(slideBibtex, i) {

            // console.log("=========", i, "==========");
            // console.log(slideBibtex);
            // console.log(convertPRB(slideBibtex))
            strSlide = convertPRB(slideBibtex);
            // 插入
            if(strSlide.indexOf("<b> Not Supported</b>") > -1 ){
                $("#refError").prepend(
                    "<p style='color:red'>" + strSlide + "</p>"
                );                
            }else{
                $("#refList").prepend(
                    "<p>" + strSlide + "</p>"
                );
            }

        })
        $("#refList").prepend(
            "<hr>",
            "<p style='color:green'>" + (new Date()).format("yyyy-MM-dd hh:mm:ss") + "</p>"
        );    
    
        
    })
})