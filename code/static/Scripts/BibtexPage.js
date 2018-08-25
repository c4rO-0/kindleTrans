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
                SlideBibtex = SlideBibtex + "\n" + line
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

    line.trim().split('and').forEach(function(singleAuthorRaw, i) {

        // 名字分为有逗号和没逗号两种
        // 没逗号，以空格区分， 保持原有顺序, 只有最后一个词不缩写

        // 有逗号 逗号前不缩写，逗号后缩写 并拿到前面

    })
    

    return localAuthor;

}

// 页数


// convertPRB
function convertPRB(slide){

    let author ="";
    let volume = "";
    let journal = "";
    let pages ="";
    let year = "";


    slide.trim().split('\n').forEach(function(lineRaw, i) {

        if(i>0){
            let listLine = lineRaw.trim().split('=',2);
            if(listLine.length != 2){
                return null;
            }

            let itemName = listLine[0].trim().toLowerCase();
            let itemValue = delBrace(listLine[1].trim());

            // console.log(itemName, itemValue);

            switch(itemName)
            {
                case "author":
                {
                    author = itemValue;
                }
                case "volume":
                {
                    volume = itemValue;
                }
                case "journal":
                {
                    journal = itemValue;
                }
                case "pages":
                {
                    pages = itemValue;
                }        
                case "year":
                {
                    year = itemValue;
                }                           
            }

        }


    })
    
}


$(document).ready(function () { 

    $("#confirm").click(function() {
        
        // 全部
        let allBibtex = $("textarea#bibtex").val();
        // 切割
        let listSlideBibtex = splitAllBibtex(allBibtex);


        listSlideBibtex.forEach(function(slideBibtex, i) {

            console.log("=========", i, "==========");
            // console.log(slideBibtex);
            convertPRB(slideBibtex);
        })
        
    })
})