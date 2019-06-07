// 按照@切割
function splitAllBibtex(allBibtex) {

    let nArticle = 0;
    let listSlideBibtex = new Array();
    let SlideBibtex = "";
    allBibtex.trim().split('\n').forEach(function (lineRaw, i) {


        line = lineRaw.trim();

        if (line[0] != "%") {
            // console.log(line);
            if (line[0] == "@") {
                if (nArticle > 0) {
                    listSlideBibtex.push(SlideBibtex);
                    // console.log(SlideBibtex)
                    SlideBibtex = "";

                }
                nArticle = nArticle + 1
            }
            if (nArticle > 0) {


                if (line[0] == "@") {
                    SlideBibtex = SlideBibtex + line
                } else {
                    if (line.indexOf("=") > -1) {
                        SlideBibtex = SlideBibtex + "\n" + line
                    } else {
                        SlideBibtex = SlideBibtex + line
                    }

                }


            }
        }

    })
    if (nArticle > 0) {
        listSlideBibtex.push(SlideBibtex);
        // console.log(SlideBibtex)        
    }

    return listSlideBibtex;


}

function journalAbbreviation(journal) {

    if (journal.split(" ").length == 1) {
        return journal
    }


    let similarity = 0.8
    let reName = journal
    let fuzzy = FuzzySet();
    fuzzy.add(journal)



    for (let FullName in AbbList) {


        let abbName = AbbList[FullName]

        let scoreGet = fuzzy.get(FullName)
        let score = 0

        if (scoreGet != null) {
            score = scoreGet[0][0]
            if (score > similarity) {
                console.log(FullName, similarity, score)
                similarity = score
                reName = abbName
            }
        }

        scoreGet = fuzzy.get(abbName)
        if (scoreGet != null) {
            score = scoreGet[0][0]
            if (score > similarity) {
                console.log(FullName, similarity, score)
                similarity = score
                reName = abbName
            }
        }

    }

    return reName;
}

// 去除开头的"和{}
function delBrace(line) {

    let localLine = line;

    while (localLine.length > 0 && (localLine[0] == "\"" || localLine[0] == "{")) {
        localLine = localLine.substr(1);
    }

    while (localLine.length > 0 && (localLine[localLine.length - 1] == "\"" || localLine[localLine.length - 1] == "}" || localLine[localLine.length - 1] == ",")) {
        localLine = localLine.substr(0, localLine.length - 1);
    }

    return localLine;

}

// 作者缩写
function shortAuthorAPS(line) {

    let localAuthor = line;
    let listShortName = new Array();

    line.trim().split(' and ').forEach(function (singleAuthorRaw, i) {

        console.log(singleAuthorRaw)
        let shortName = '';
        // 名字分为有逗号和没逗号两种
        let listSingleName = singleAuthorRaw.trim().split(',');
        if (listSingleName.length == 1) {
            // 没逗号，以空格区分， 保持原有顺序, 只有最后一个词不缩写
            listSingleName = listSingleName[0].trim().split(' ');

            listSingleName.forEach((word, i) => {

                if (word.indexOf("-") > -1) {
                    shortName = shortName + word[0] + '.-' + word[word.indexOf("-") + 1] + '. '
                } else {
                    shortName = shortName + word[0] + '. '
                }

            })
            shortName = shortName.substr(0, shortName.length - 2) + listSingleName[listSingleName.length - 1].substr(1)

            listShortName.push(shortName)

        } else if (listSingleName.length == 2) {
            // 有逗号 逗号前不缩写，逗号后缩写 并拿到前面
            listSingleName[1].trim().split(' ').forEach((word, i) => {
                if (word.indexOf("-") > -1) {
                    shortName = shortName + word[0] + '.-' + word[word.indexOf("-") + 1] + '. '
                } else {
                    shortName = shortName + word[0] + '. '
                }
            })
            shortName = shortName + listSingleName[0].trim()

            listShortName.push(shortName)
        } else {
            // 有两个逗号, 返回空
            return null;
        }

        // return shortName
        console.log(listShortName)
    })

    if (listShortName.length > 1) {
        listShortName[listShortName.length - 1] = "and " + listShortName[listShortName.length - 1];
    }

    if (listShortName.length == 2) {
        return listShortName.join(" ");
    } else {
        return listShortName.join(", ");
    }


    // return joinShortName;

}

function shortAuthorNature(line) {

    let localAuthor = line;
    let listShortName = new Array();

    line.trim().split(' and ').forEach(function (singleAuthorRaw, i) {

        console.log(singleAuthorRaw)
        let shortName = '';
        // 名字分为有逗号和没逗号两种
        let listSingleName = singleAuthorRaw.trim().split(',');
        if (listSingleName.length == 1) {
            // 没逗号，以空格区分
            listSingleName = listSingleName[0].trim().split(' ');

            listSingleName.forEach((word, i) => {

                if (i < listSingleName.length - 1) {
                    if (word.indexOf("-") > -1) {
                        shortName = shortName + word[0] + '.-' + word[word.indexOf("-") + 1] + '. '
                    } else {
                        shortName = shortName + word[0] + '. '
                    }
                } else {
                    shortName = word + ', ' + shortName
                }


            })
            // shortName = shortName.substr(0,shortName.length-2) + listSingleName[listSingleName.length-1].substr(1)

            listShortName.push(shortName.trim() + ', ')

        } else if (listSingleName.length == 2) {
            // 有逗号 
            shortName = shortName + listSingleName[0].trim() + ', ';
            listSingleName[1].trim().split(' ').forEach((word, i) => {

                if (word.indexOf("-") > -1) {
                    shortName = shortName + word[0] + '.-' + word[word.indexOf("-") + 1] + '. '
                } else {
                    shortName = shortName + word[0] + '. '
                }


            })
            // shortName = shortName + listSingleName[0].trim()

            listShortName.push(shortName.trim() + ', ')
        } else {
            // 有两个逗号, 返回空
            return null;
        }

        // return shortName
        console.log(listShortName)
    })

    if (listShortName.length > 1) {
        listShortName[listShortName.length - 1] = "& " + listShortName[listShortName.length - 1].substr(0, listShortName[listShortName.length - 1].length - 2);
        listShortName[listShortName.length - 2] = listShortName[listShortName.length - 2].substr(0, listShortName[listShortName.length - 2].length - 2) + " ";
    }

    if (listShortName.length == 2) {
        return listShortName.join("").trim();
    } else {
        return listShortName.join("").trim();
    }


    // return joinShortName;
    // return joinShortName;

}


// 作者缩写
function shortAuthorFullName(line) {

    let localAuthor = line;
    let listShortName = new Array();

    line.trim().split(' and ').forEach(function (singleAuthorRaw, i) {

        console.log(singleAuthorRaw)
        let shortName = '';
        // 名字分为有逗号和没逗号两种
        let listSingleName = singleAuthorRaw.trim().split(',');
        if (listSingleName.length == 1) {
            // 没逗号，以空格区分， 保持原有顺序, 只有最后一个词不缩写
            listSingleName = listSingleName[0].trim().split(' ');

            listSingleName.forEach((word, i) => {

                if (word.indexOf("-") > -1) {
                    shortName = shortName + word + ' '
                } else {
                    shortName = shortName + word + ' '
                }

            })
            shortName = shortName.substr(0, shortName.length - 2) + listSingleName[listSingleName.length - 1].substr(1)

            listShortName.push(shortName)

        } else if (listSingleName.length == 2) {
            // 有逗号 逗号前不缩写，逗号后缩写 并拿到前面
            listSingleName[1].trim().split(' ').forEach((word, i) => {
                if (word.indexOf("-") > -1) {
                    shortName = shortName + word + ' '
                } else {
                    shortName = shortName + word + ' '
                }
            })
            shortName = shortName + listSingleName[0].trim()

            listShortName.push(shortName)
        } else {
            // 有两个逗号, 返回空
            return null;
        }

        // return shortName
        console.log(listShortName)
    })

    if (listShortName.length > 1) {
        listShortName[listShortName.length - 1] = "and " + listShortName[listShortName.length - 1];
    }

    if (listShortName.length == 2) {
        return listShortName.join(" ");
    } else {
        return listShortName.join(", ");
    }


    // return joinShortName;

}

// convertPRB
function convertPRB(slide) {

    let author = "";
    let volume = "";
    let journal = "";
    let pages = "";
    let year = "";

    if (slide.trim().split('\n')[0].toLowerCase().indexOf("@article") > -1) {
        slide.trim().split('\n').forEach(function (lineRaw, i) {

            if (i > 0) {
                let listLine = lineRaw.trim().split('=', 2);
                if (listLine.length != 2) {
                    return null;
                }

                let itemName = listLine[0].trim().toLowerCase();
                let itemValue = delBrace(listLine[1].trim());

                // console.log(itemName, itemValue);


                if (itemName == "author") {
                    if (shortAuthorAPS(itemValue) == null) {
                        return null;
                    }
                    author = shortAuthorAPS(itemValue);
                }
                if (itemName == "volume") {
                    volume = itemValue;
                }
                if (itemName == "journal") {
                    journal = journalAbbreviation(itemValue.trim().replace(/\s+/g, ' '));
                }
                if (itemName == "pages") {
                    pages = (itemValue.trim().split('-'))[0].trim();
                }
                if (itemName == "year") {

                    year = itemValue;
                }

            }


        })
        return author + ", " + journal + " " + "<b>" + volume + "</b>" + ", " + pages + " (" + year + ").";
    } else {
        // 不支持
        return slide.trim().split('\n')[0] + "<b> Not Supported</b>"
    }


}

// convertPRB
function convertNature(slide) {

    //     The format requires (for articles being cited):

    //     Last-name-first authors, with abbreviated first names: Dylan, B. & Doe, J.
    //     Full title, only first word capitalized, no italic, ending with a full stop: This is a title.
    //     Name of the journal in italics: Nature
    //     Volume number (and comma) in bold: 323,
    //     Followed by page and (in curved brakets) year.

    // So it would end up like this
    // Dylan, B. & Doe, J. This is a title. Nature 323, 89-92 (1999)

    let author = "";
    let volume = "";
    let journal = "";
    let pages = "";
    let year = "";
    let title = "";

    if (slide.trim().split('\n')[0].toLowerCase().indexOf("@article") > -1) {
        slide.trim().split('\n').forEach(function (lineRaw, i) {

            if (i > 0) {
                let listLine = lineRaw.trim().split('=', 2);
                if (listLine.length != 2) {
                    return null;
                }

                let itemName = listLine[0].trim().toLowerCase();
                let itemValue = delBrace(listLine[1].trim());

                // console.log(itemName, itemValue);


                if (itemName == "author") {
                    if (shortAuthorNature(itemValue) == null) {
                        return null;
                    }
                    author = shortAuthorNature(itemValue);
                }
                if (itemName == "volume") {
                    volume = itemValue;
                }
                if (itemName == "journal") {
                    journal = journalAbbreviation(itemValue.trim().replace(/\s+/g, ' '));
                }
                if (itemName == "pages") {

                    (itemValue.trim().split('-')).forEach((element, i) => {
                        console.log(element.trim(), i)
                        if (element.trim() != '') {
                            if (i == 0) {
                                pages = element.trim();
                            } else {
                                pages = pages + '-' + element.trim();
                            }

                        }
                    });


                }
                if (itemName == "year") {

                    year = itemValue;
                }
                if (itemName == "title") {

                    title = itemValue;
                }


            }


        })
        return author + " " + title + ". <i>" + journal + "</i> " + "<b>" + volume + "</b>" + ", " + pages + " (" + year + ").";
    } else {
        // 不支持
        return slide.trim().split('\n')[0] + "<b> Not Supported</b>"
    }


}


/**
 * 
 * @param {*} arrayItem  Customized Item
 * @param {*} slide 
 */
function convertCustomization(arrayItem, slide) {


    let dicRead = {}


    if (slide.trim().split('\n')[0].toLowerCase().indexOf("@article") > -1) {
        slide.trim().split('\n').forEach(function (lineRaw, i) {

            if (i > 0) {
                let listLine = lineRaw.trim().split('=', 2);
                if (listLine.length != 2) {
                    return null;
                }

                let itemName = listLine[0].trim().toLowerCase();
                let itemValue = delBrace(listLine[1].trim());

                // console.log(itemName, itemValue);


                if (itemName == "author") {
                    dicRead.authorRuff = itemValue;
                }
                if (itemName == "volume") {
                    dicRead.volume = itemValue.trim();
                }
                if (itemName == "journal") {
                    dicRead.journal = journalAbbreviation(itemValue.trim().replace(/\s+/g, ' '));
                }
                if (itemName == "pages") {
                    dicRead.pagesRuff = itemValue.trim();
                }
                if (itemName == "year") {

                    dicRead.year = itemValue.trim();
                }
                if (itemName == "issue") {

                    dicRead.issue = itemValue.trim();
                }
                if (itemName == "number") {

                    dicRead.number = itemValue.trim();
                }
                if (itemName == "title") {

                    dicRead.title = itemValue.trim();
                }
            }


        })
        let citeStr = ''

        arrayItem.forEach(element => {
            if (element.value.indexOf("author") != -1) {
                if (element.value == 'author:np') {
                    citeStr = citeStr + shortAuthorNature(dicRead.authorRuff) + element.connecter
                } else if (element.value == 'author:aps') {
                    citeStr = citeStr + shortAuthorAPS(dicRead.authorRuff) + element.connecter
                } else if (element.value == 'author:fn') {
                    citeStr = citeStr + shortAuthorFullName(dicRead.authorRuff) + element.connecter
                }
            } else if (element.value.indexOf("volume") != -1) {
                citeStr = citeStr + dicRead.volume + element.connecter
            } else if (element.value.indexOf("journal") != -1) {
                citeStr = citeStr + dicRead.journal + element.connecter
            } else if (element.value.indexOf("pages") != -1) {
                if (element.value == 'pages:start') {
                    citeStr = citeStr + (dicRead.pagesRuff.trim().split('-'))[0].trim() + element.connecter
                } else if (element.value == 'pages:full') {
                    citeStr = citeStr + dicRead.pagesRuff + element.connecter
                }
            } else if (element.value.indexOf("year") != -1) {
                citeStr = citeStr + dicRead.year + element.connecter
            } else if (element.value.indexOf("issue") != -1) {
                if (dicRead.issue) {
                    citeStr = citeStr + dicRead.issue + element.connecter
                } else if (dicRead.number) {
                    citeStr = citeStr + dicRead.issue + element.connecter
                } else {
                    citeStr = citeStr + ' ' + element.connecter
                }
            } else if (element.value.indexOf("title") != -1) {
                citeStr = citeStr + dicRead.title + element.connecter
            }
        })


        return citeStr;
    } else {
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

    // 先清理
    $("#refError").empty();
    $("#refList").empty();
    $("textarea#bibtex").val("");
    // 添加例子
    $("textarea#bibtex").val(
        "\
%==============================\n\
% Example : Add Bibtex here, click comfirm.\n\
%==============================\n\
@article {Anderson393,\n\
    author = {Anderson, P. W.},\n\
    title = {More Is Different},\n\
    volume = {177},\n\
    number = {4047},\n\
    pages = {393--396},\n\
    year = {1972},\n\
    doi = {10.1126/science.177.4047.393},\n\
    publisher = {American Association for the Advancement of Science},\n\
    issn = {0036-8075},\n\
    URL = {http://science.sciencemag.org/content/177/4047/393},\n\
    eprint = {http://science.sciencemag.org/content/177/4047/393.full.pdf},\n\
    journal = {Science}\n\
}\
        "
    );


    // 检查cookie
    if (typeof (Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        let BibTexHistory = localStorage.getItem("BibtexHistory");
        if (BibTexHistory == undefined || BibTexHistory == '') {
            // console.log("click")
            setTimeout(() => {
                $("#confirm").trigger("click");
            }, 10);

        } else {
            // console.log(BibTexHistory.length)
            $("#refList").prepend(BibTexHistory)
        }
    } else {
        // Sorry! No Web Storage support..
        console.log("Web Storage support")
    }




    $("#clearCite").click(function () {
        $("#refError").empty();
        $("#refList").empty();
        if (typeof (Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            localStorage.setItem('BibtexHistory', '');
        } else {
            // Sorry! No Web Storage support..
            console.log("Web Storage support")
        }
    });

    $("#clearBibtex").click(function () {
        $("textarea#bibtex").val("");
    });

    $("#confirm").click(function () {

        $("#refError").empty();
        let format = $("#format").val();


        // 全部
        let allBibtex = $("textarea#bibtex").val();
        // 切割
        let listSlideBibtex = splitAllBibtex(allBibtex);


        let insertStr = ''
        listSlideBibtex.reverse().forEach(function (slideBibtex, i) {

            console.log("=========", i, "==========");
            // console.log(slideBibtex);
            // console.log(convertPRB(slideBibtex))
            if (format == "APS") {
                strSlide = convertPRB(slideBibtex);
            }
            if (format == "Nature Physics") {
                strSlide = convertNature(slideBibtex);
            }
            if (format == "customization") {
                // 读取
                let arrayItem = new Array()
                $('#comItem .list-group-item').each((index, element) => {
                    console.log('value : ', $(element).find('div').attr('value'), 'connecter : ', $(element).find('input').val())
                    arrayItem.push({ 'value': $(element).find('div').attr('value'), 'connecter': $(element).find('input').val() })
                })
                strSlide = convertCustomization(arrayItem, slideBibtex);
            }

            // 插入
            if (strSlide.indexOf("<b> Not Supported</b>") > -1) {
                // $("#refError").prepend(
                //     "<p style='color:red'>" + strSlide + "</p>"
                // );
                insertStr = insertStr + "<p style='color:red' name='error'>" + strSlide + "</p>"
            } else {

                // $("#refList").prepend(
                //     "<p name='cite'>" +strSlide+  "</p>"
                // );
                insertStr = insertStr + "<p name='cite-slide'>" + strSlide + "</p>"
            }

        })
        insertStr = "<div name='cite-all'>" + insertStr + "</div>"
        insertStr = insertStr + "<div name='rawCite' style='display: none;'>" + allBibtex + "</div>"


        let strbuttonCopy = "<button id='cp2Clipboard' type='button' class='btn-xs btn-outline-secondary' title='copy to clipboard'><i class='fa fa-clipboard'></i></button>"
        let strbuttonBack = "<button id='rollBack' type='button' class='btn-xs btn-outline-secondary'  title='rall back the BibTex content'><i class='fas fa-backward'></i></button>"

        // $("#refList").prepend(
        //     "<hr>",
        //     "<p name='time'> <span style='color:green'>" + (new Date()).format("yyyy-MM-dd hh:mm:ss") + "</span> | " + format + " | "+ strbutton + "</p>"
        // );

        insertStr = "<p name='time'> <span style='color:green'>"
            + (new Date()).format("yyyy-MM-dd hh:mm:ss")
            + "</span> | "
            + "<span name='format'> " + format + "</span>"
            + " | " + strbuttonCopy
            + " | " + strbuttonBack
            + "</p>" + insertStr


        insertStr = "<span name='chunk'><hr><div>" + insertStr + "</div></span>"
        $("#refList").prepend(
            insertStr
        );


        // 保存在cookie
        // Cookies.set('BibtexHistory', $("#refList").html());
        // console.log($("#refList").html().length)
        // console.log("-----------------")
        // console.log($("#refList").html())
        if (typeof (Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            // let $("#refList") = 

            // console.log($("#refList").children("span[name='chunk']:lt(4)"))
            let container = ""
            $("#refList").children("span[name='chunk']:lt(50)").toArray().forEach((val) => {

                // console.log($(val).prop('outerHTML'))
                container = container + $(val).prop('outerHTML')
            })
            // console.log(container)
            localStorage.setItem('BibtexHistory', container);
        } else {
            // Sorry! No Web Storage support..
            console.log("Web Storage support")
        }
    })

    // 复制
    $(document).on("click", "#cp2Clipboard", function () {
        // console.log("copy")

        let objdiv = $(this).closest("div").find("div[name='cite-all']")
        // console.log(objdiv)


        function listener(e) {

            let str = ""
            $(objdiv).find("p[name='cite-slide']").toArray().forEach((cvalue, index) => {
                str = str + $(cvalue).text() + "\n"
            })
            str = str.substr(0, str.length - 1)

            // 带格式复制
            e.clipboardData.setData("text/html", $(objdiv).html());
            // 不带格式复制
            e.clipboardData.setData("text/plain", str);
            e.preventDefault();
        }
        document.addEventListener("copy", listener);
        document.execCommand("copy");
        document.removeEventListener("copy", listener);

    })

    // 重新加载历史
    $(document).on("click", "#rollBack", function () {


        let objdiv = $(this).closest("div")

        // 粘贴内容
        $("textarea#bibtex").val($(objdiv).find("div[name='rawCite']").text())

        // 改变格式
        let format = $(objdiv).find("span[name='format']").text().trim()
        $("#format").val(format)


        $("#frameTextarear").addClass("border border-primary")
        setTimeout(() => {
            $("#frameTextarear").removeClass("border border-primary")
        }, 1000);

    })

    // customization
    $('#format').on('change', () => {
        let format = $("#format").val();
        if (format == 'customization') {
            $('#customization-form').show()
        } else {
            $('#customization-form').hide()
        }
        console.log("form changed : ", format)

    })

    Sortable.create(comCandidate, {
        animation: 100,
        group: 'list-1',
        draggable: '.list-group-item',
        handle: '.list-group-item',
        sort: true,
        filter: '.sortable-disabled',
        chosenClass: 'active'
    });

    Sortable.create(comItem, {
        animation: 100,
        group: 'list-1',
        draggable: '.list-group-item',
        handle: '.list-group-item',
        sort: true,
        filter: '.sortable-disabled',
        chosenClass: 'active'
    });

    $("#folding").on("click", () => {
        //   console.log('click ... ')
        if ($('#customization-list').is(':visible')) {
            $('#customization-list').hide()
        } else {
            $('#customization-list').show()
        }

        if ($('#customization-button [name="cite-all"]').is(':visible')) {
            $('#customization-button [name="cite-all"]').hide()
        } else {
            $('#customization-button [name="cite-all"]').show()
        }
    })

    $("#preview").on("click", () => {
        //   console.log('click ... ')
        // 读取
        let arrayItem = new Array()
        $('#comItem .list-group-item').each((index, element) => {
            console.log('value : ', $(element).find('div').attr('value'), 'connecter : ', $(element).find('input').val())
            arrayItem.push({ 'value': $(element).find('div').attr('value'), 'connecter': $(element).find('input').val() })
        })

        // 全部
        let allBibtex = $("textarea#bibtex").val();
        // 切割
        let listSlideBibtex = splitAllBibtex(allBibtex);

        let strSlide = convertCustomization(arrayItem, listSlideBibtex[0]);

        let insertStr = ''
        // 插入
        if (strSlide.indexOf("<b> Not Supported</b>") > -1) {
            // $("#refError").prepend(
            //     "<p style='color:red'>" + strSlide + "</p>"
            // );
            insertStr = insertStr + "<p style='color:red' name='error'>" + strSlide + "</p>"
        } else {

            // $("#refList").prepend(
            //     "<p name='cite'>" +strSlide+  "</p>"
            // );
            insertStr = insertStr + "<p name='cite-slide'>" + strSlide + "</p>"
        }
        $("#customization-button > [name='cite-all']").empty()
        $("#customization-button > [name='cite-all']").append(insertStr)


    })

})



// 缩写
// let AbbList = {
//     "Accounts of Chemical Research": "Acc. Chem. Res.",
//     "ACI Materials Journal": "ACI Mater. J.",
//     "ACS Symposium Series": "ACS Symp. Ser.",
//     "Acta Biochimica Polonica": "Acta Biochim. Pol."
// }
let AbbList = {
    "Accounts of Chemical Research": "Acc. Chem. Res.",
    "ACI Materials Journal": "ACI Mater. J.",
    "ACS Symposium Series": "ACS Symp. Ser.",
    "Acta Biochimica Polonica": "Acta Biochim. Pol.",
    "Acta Chemica Scandinavica": "Acta Chem. Scand.",
    "Acta Chimica Hungarica": "Acta Chim. Hung.",
    "Acta Chimica Slovenica": "Acta Chim. Slov.",
    "Acta Crystallographica, Section A: Foundations of Crystallography": "Acta Crystallogr., Sect. A: Found. Crystallogr.",
    "Acta Crystallographica, Section B: Structural Science": "Acta Crystallogr., Sect. B: Struct. Sci.",
    "Acta Crystallographica, Section C: Crystal Structure Communications": "Acta Crystallogr., Sect. C: Cryst. Struct. Commun.",
    "Acta Crystallographica, Section D: Biological Crystallography": "Acta Crystallogr., Sect. D: Biol. Crystallogr.",
    "Acta Crystallographica, Section E: Structure Reports Online": "Acta Crystallogr., Sect. E: Struct. Rep. Online",
    "Acta Endocrinologica": "Acta Endocrinol.",
    "Acta Hydrochimica et Hydrobiologica": "Acta Hydrochim. Hydrobiol.",
    "Acta Materialia": "Acta Mater.",
    "Acta Metallurgica et Materialia": "Acta Metall. Mater.",
    "Acta Pharmaceutica (Zagreb, Croatia)": "Acta Pharm. (Zagreb, Croatia)",
    "Acta Pharmacologica Sinica": "Acta Pharmacol. Sin.",
    "Acta Physica Polonica, A": "Acta Phys. Pol., A",
    "Acta Physica Polonica, B": "Acta Phys. Pol., B",
    "Acta Physiologica Scandinavica": "Acta Physiol. Scand.",
    "Acta Polymerica": "Acta Polym.",
    "Adsorption": "Adsorption",
    "Adsorption Science & Technology": "Adsorpt. Sci. Technol.",
    "Advanced Drug Delivery Reviews": "Adv. Drug Delivery Rev.",
    "Advanced Functional Materials": "Adv. Funct. Mater.",
    "Advanced Materials (Weinheim, Germany)": "Adv. Mater. (Weinheim, Ger.)",
    "Advanced Synthesis & Catalysis": "Adv. Synth. Catal.",
    "Advances in Atomic, Molecular, and Optical Physics": "Adv. At., Mol., Opt. Phys.",
    "Advances in Behavioral Biology": "Adv. Behav. Biol.",
    "Advances in Carbohydrate Chemistry and Biochemistry": "Adv. Carbohydr. Chem. Biochem.",
    "Advances in Catalysis": "Adv. Catal.",
    "Advances in Chemical Physics": "Adv. Chem. Phys.",
    "Advances in Chromatography (New York)": "Adv. Chromatogr. (N.Y.)",
    "Advances in Colloid and Interface Science": "Adv. Colloid Interface Sci.",
    "Advances in Cryogenic Engineering": "Adv. Cryog. Eng.",
    "Advances in Electrochemical Science and Engineering": "Adv. Electrochem. Sci. Eng.",
    "Advances in Enzymology and Related Areas of Molecular Biology": "Adv. Enzymol. Relat. Areas Mol. Biol.",
    "Advances in Experimental Medicine and Biology": "Adv. Exp. Med. Biol.",
    "Advances in Heterocyclic Chemistry": "Adv. Heterocycl. Chem.",
    "Advances in Hydrogen Energy": "Adv. Hydrogen Energy",
    "Advances in Inorganic Chemistry": "Adv. Inorg. Chem.",
    "Advances in Instrumentation and Control": "Adv. Instrum. Control",
    "Advances in Lipid Research": "Adv. Lipid Res.",
    "Advances in Molten Salt Chemistry": "Adv. Molten Salt Chem.",
    "Advances in Organometallic Chemistry": "Adv. Organomet. Chem.",
    "Advances in Photochemistry": "Adv. Photochem.",
    "Advances in Physical Organic Chemistry": "Adv. Phys. Org. Chem.",
    "Advances in Polymer Science": "Adv. Polym. Sci.",
    "Advances in Polymer Technology": "Adv. Polym. Technol.",
    "Advances in Powder Metallurgy": "Adv. Powder Metall.",
    "Advances in Prostaglandin, Thromboxane, and Leukotriene Research": "Adv. Prostaglandin, Thromboxane, Leukotriene Res.",
    "Advances in Protein Chemistry": "Adv. Protein Chem.",
    "Advances in Quantum Chemistry": "Adv. Quantum Chem.",
    "Advances in Space Research": "Adv. Space Res.",
    "Advances in X-Ray Analysis": "Adv. X-Ray Anal.",
    "Aerosol Science and Technology": "Aerosol Sci. Technol.",
    "Afinidad": "Afinidad",
    "Agents and Actions": "Agents Actions",
    "Agents and Actions Supplements": "Agents Actions Suppl.",
    "Aging Cell": "Aging Cell",
    "Agrokemia es Talajtan": "Agrokem. Talajtan",
    "Agrokhimiya": "Agrokhimiya",
    "AIChE Journal": "AIChE J.",
    "AIChE Symposium Series": "AIChE Symp. Ser.",
    "AIP Conference Proceedings": "AIP Conf. Proc.",
    "Alcohol (New York)": "Alcohol (N.Y.)",
    "Alcohol and Alcoholism": "Alcohol Alcohol.",
    "Aluminium (Duesseldorf)": "Aluminium (Duesseldorf)",
    "Aluminum Transactions": "Alum. Trans.",
    "Ambix": "Ambix",
    "American Ceramic Society Bulletin": "Am. Ceram. Soc. Bull.",
    "American Concrete Institute, SP": "Am. Concr. Inst., SP",
    "American Industrial Hygiene Association Journal": "Am. Ind. Hyg. Assoc. J.",
    "American Journal of Clinical Nutrition": "Am. J. Clin. Nutr.",
    "American Journal of Human Genetics": "Am. J. Hum. Genet.",
    "American Journal of Hypertension": "Am. J. Hypertens.",
    "American Journal of Obstetrics and Gynecology": "Am. J. Obstet. Gynecol.",
    "American Journal of Pathology": "Am. J. Pathol.",
    "American Journal of Physiology": "Am. J. Physiol.",
    "American Journal of Respiratory Cell and Molecular Biology": "Am. J. Respir. Cell Mol. Biol.",
    "American Journal of Science": "Am. J. Sci.",
    "American Journal of Veterinary Research": "Am. J. Vet. Res.",
    "American Mineralogist": "Am. Mineral.",
    "American Review of Respiratory Disease": "Am. Rev. Respir. Dis.",
    "Amino Acids": "Amino Acids",
    "Anais da Academia Brasileira de Ciencias": "An. Acad. Bras. Cienc.",
    "Anales de Bromatologia": "An. Bromatol",
    "Anales de Quimica": "An. Quim.",
    "Analusis": "Analusis",
    "Analyst (Cambridge, United Kingdom)": "Analyst (Cambridge, U. K.)",
    "Analytica Chimica Acta": "Anal. Chim. Acta",
    "Analytical and Bioanalytical Chemistry": "Anal. Bioanal. Chem.",
    "Analytical Biochemistry": "Anal. Biochem.",
    "Analytical Chemistry": "Anal. Chem.",
    "Analytical Chemistry Symposia Series": "Anal. Chem. Symp. Ser.",
    "Analytical Letters": "Anal. Lett.",
    "Analytical Proceedings": "Anal. Proc. (London)",
    "Analytical Sciences": "Anal. Sci.",
    "Anesthesiology": "Anesthesiology",
    "Angewandte Chemie": "Angew. Chem.",
    "Angewandte Chemie, International Edition": "Angew. Chem., Int. Ed.",
    "Angewandte Chemie, International Edition in English": "Angew. Chem., Int. Ed. Engl.",
    "Angewandte Makromolekulare Chemie": "Angew. Makromol. Chem.",
    "Animal Science and Technology": "Anim. Sci. Technol.",
    "Animal Welfare": "Anim. Welfare",
    "Animal Welfare Information Center Bulletin": "Anim. Welfare Inf. Cent. Bull.",
    "Annales de Chimie (Paris, France)": "Ann. Chim. (Paris, Fr.)",
    "Annales Pharmaceutiques Francaises": "Ann. Pharm. Fr.",
    "Annali di Chimica (Rome, Italy)": "Ann. Chim. (Rome, Italy)",
    "Annals of Internal Medicine": "Ann. Intern. Med.",
    "Annals of Nuclear Energy": "Ann. Nucl. Energy",
    "Annals of Nutrition & Metabolism": "Ann. Nutr. Metab.",
    "Annals of Physics (San Diego, CA, United States)": "Ann. Phys. (San Diego, CA, U. S.)",
    "Annals of the New York Academy of Sciences": "Ann. N. Y. Acad. Sci.",
    "Annual Reports in Medicinal Chemistry": "Annu. Rep. Med. Chem.",
    "Annual Reports on NMR Spectroscopy": "Annu. Rep. NMR Spectrosc.",
    "Annual Reports on the Progress of Chemistry, Section A: Inorganic Chemistry": "Annu. Rep. Prog. Chem., Sect. A: Inorg. Chem.",
    "Annual Reports on the Progress of Chemistry, Section B: Organic Chemistry": "Annu. Rep. Prog. Chem., Sect. B: Org. Chem.",
    "Annual Reports on the Progress of Chemistry, Section C: Physical Chemistry": "Annu. Rep. Prog. Chem., Sect. C: Phys. Chem.",
    "Annual Review of Biochemistry": "Annu. Rev. Biochem.",
    "Annual Review of Biomedical Engineering": "Annu. Rev. Biomed. Eng.",
    "Annual Review of Biophysics and Biomolecular Structure": "Annu. Rev. Biophys. Biomol. Struct.",
    "Annual Review of Cell and Developmental Biology": "Annu. Rev. Cell Dev. Biol.",
    "Annual Review of Earth and Planetary Sciences": "Annu. Rev. Earth Planet. Sci.",
    "Annual Review of Entomology": "Annu. Rev. Entomol.",
    "Annual Review of Genetics": "Annu. Rev. Genet.",
    "Annual Review of Genomics and Human Genetics": "Annu. Rev. Genomics Hum. Genet.",
    "Annual Review of Immunology": "Annu. Rev. Immunol.",
    "Annual Review of Materials Research": "Annu. Rev. Mater. Res.",
    "Annual Review of Medicine": "Annu. Rev. Med.",
    "Annual Review of Microbiology": "Annu. Rev. Microbiol.",
    "Annual Review of Neuroscience": "Annu. Rev. Neurosci.",
    "Annual Review of Nuclear and Particle Science": "Annu. Rev. Nucl. Part. Sci.",
    "Annual Review of Nutrition": "Annu. Rev. Nutr.",
    "Annual Review of Pharmacology and Toxicology": "Annu. Rev. Pharmacol. Toxicol.",
    "Annual Review of Physical Chemistry": "Annu. Rev. Phys. Chem.",
    "Annual Review of Physiology": "Annu. Rev. Physiol.",
    "Annual Review of Phytopathology": "Annu. Rev. Phytopathol.",
    "Annual Review of Plant Biology": "Annu. Rev. Plant Biol.",
    "Anti-Cancer Drugs": "Anti-Cancer Drugs",
    "Antibiotiki i Khimioterapiya": "Antibiot. Khimioter.",
    "Anticancer Research": "Anticancer Res.",
    "Antimicrobial Agents and Chemotherapy": "Antimicrob. Agents Chemother.",
    "Antioxidants & Redox Signaling": "Antioxid. Redox Signaling",
    "Antiviral Chemistry & Chemotherapy": "Antiviral Chem. Chemother.",
    "Antiviral Research": "Antiviral Res.",
    "Applied and Environmental Microbiology": "Appl. Environ. Microbiol.",
    "Applied Biochemistry and Microbiology (Translation of Prikladnaya Biokhimiya i Mikrobiologiya)": "Appl. Biochem. Microbiol.",
    "Applied Catalysis, A: General": "Appl. Catal., A",
    "Applied Catalysis, B: Environmental": "Appl. Catal., B",
    "Applied Clay Science": "Appl. Clay Sci.",
    "Applied Geochemistry": "Appl. Geochem.",
    "Applied Microbiology and Biotechnology": "Appl. Microbiol. Biotechnol.",
    "Applied Occupational and Environmental Hygiene": "Appl. Occup. Environ. Hyg.",
    "Applied Optics": "Appl. Opt.",
    "Applied Organometallic Chemistry": "Appl. Organomet. Chem.",
    "Applied Physics A: Materials Science & Processing": "Appl. Phys. A: Mater. Sci. Process.",
    "Applied Physics A: Solids and Surfaces": "Appl. Phys. A",
    "Applied Physics B: Lasers and Optics": "Appl. Phys. B: Lasers Opt.",
    "Applied Physics B: Photophysics and Laser Chemistry": "Appl. Phys. B",
    "Applied Physics Letters": "Appl. Phys. Lett.",
    "Applied Radiation and Isotopes": "Appl. Radiat. Isot.",
    "Applied Spectroscopy": "Appl. Spectrosc.",
    "Applied Surface Science": "Appl. Surf. Sci.",
    "Aquaculture": "Aquaculture",
    "Aquatic Toxicology": "Aquat. Toxicol.",
    "Archaea": "Archaea",
    "Archiv der Pharmazie (Weinheim, Germany)": "Arch. Pharm. (Weinheim, Ger.)",
    "Archives of Biochemistry and Biophysics": "Arch. Biochem. Biophys.",
    "Archives of Environmental Contamination and Toxicology": "Arch. Environ. Contam. Toxicol.",
    "Archives of Insect Biochemistry and Physiology": "Arch. Insect Biochem. Physiol.",
    "Archives of Microbiology": "Arch. Microbiol.",
    "Archives of Oral Biology": "Arch. Oral Biol.",
    "Archives of Pharmacal Research": "Arch. Pharmacal Res.",
    "Archives of Physiology and Biochemistry": "Arch. Physiol. Biochem.",
    "Archives of Toxicology": "Arch. Toxicol.",
    "Archives of Virology": "Arch. Virol.",
    "Archivum Combustionis": "Arch. Combust.",
    "Armyanskii Khimicheskii Zhurnal": "Arm. Khim. Zh.",
    "Arteriosclerosis and Thrombosis": "Arterioscler. Thromb.",
    "Arteriosclerosis, Thrombosis, and Vascular Biology": "Arterioscler., Thromb., Vasc. Biol.",
    "Arzneimittel Forschung": "Arzneim. Forsch.",
    "Arzneimittel-Forschung": "Arzneim.-Forsch.",
    "Asian Journal of Chemistry": "Asian J. Chem.",
    "Aspects of Homogeneous Catalysis": "Aspects Homogeneous Catal.",
    "Assay and Drug Development Technologies": "Assay Drug Dev. Technol.",
    "ASTM Special Technical Publication": "ASTM Spec. Tech. Publ.",
    "Astrofizika": "Astrofizika",
    "Astronomical Journal": "Astron. J.",
    "Astronomicheskii Zhurnal": "Astron. Zh.",
    "Astronomy & Astrophysics, Supplement Series": "Astron. Astrophys., Suppl. Ser.",
    "Astronomy and Astrophysics": "Astron. Astrophys.",
    "Astrophysical Journal": "Astrophys. J.",
    "Astrophysics and Space Science": "Astrophys. Space Sci.",
    "Astrophysics and Space Science Library": "Astrophys. Space Sci. Libr.",
    "Atherosclerosis (Amsterdam, Netherlands)": "Atherosclerosis (Amsterdam, Neth.)",
    "Atherosclerosis (Shannon, Ireland)": "Atherosclerosis (Shannon, Irel.)",
    "ATLA, Alternatives to Laboratory Animals": "ATLA, Altern. Lab. Anim.",
    "Atmospheric Chemistry and Physics": "Atmos. Chem. Phys.",
    "Atmospheric Environment": "Atmos. Environ.",
    "Atmospheric Environment, Part A: General Topics": "Atmos. Environ., Part A",
    "Atomic Energy (New York) (Translation of Atomnaya Energiya)": "At. Energy (N.Y.)",
    "Atomic Spectroscopy": "At. Spectrosc.",
    "Atomnaya Energiya": "At. Energ.",
    "Australian Journal of Chemistry": "Aust. J. Chem.",
    "Australian Journal of Physics": "Aust. J. Phys.",
    "Autonomic & Autacoid Pharmacology": "Auton. Autacoid Pharmacol.",
    "Avtomaticheskaya Svarka": "Avtom. Svarka",
    "Azerbaidzhanskii Khimicheskii Zhurnal": "Azerb. Khim. Zh.",
    "Bandaoti Xuebao": "Bandaoti Xuebao",
    "Basic & Clinical Pharmacology & Toxicology": "Basic Clin. Pharmacol. Toxicol.",
    "Basic Life Sciences": "Basic Life Sci.",
    "Berichte der Bunsen-Gesellschaft fuer Physikalische Chemie": "Ber. Bunsen-Ges. Phys. Chem.",
    "Bio/Technology": "Bio/Technology",
    "Biocatalysis and Biotransformation": "Biocatal. Biotransform.",
    "Biochemical and Biophysical Research Communications": "Biochem. Biophys. Res. Commun.",
    "Biochemical Education": "Biochem. Educ.",
    "Biochemical Genetics": "Biochem. Genet.",
    "Biochemical Journal": "Biochem. J.",
    "Biochemical Pharmacology": "Biochem. Pharmacol.",
    "Biochemical Society Transactions": "Biochem. Soc. Trans.",
    "Biochemical Systematics and Ecology": "Biochem. Syst. Ecol.",
    "Biochemistry": "Biochemistry",
    "Biochemistry (Moscow, Russian Federation)(Translation of Biokhimiya (Moscow, Russian Federation))": "Biochemistry (Moscow, Russ. Fed.)",
    "Biochemistry and Cell Biology": "Biochem. Cell Biol.",
    "Biochemistry International": "Biochem. Int.",
    "Biochimica et Biophysica Acta": "Biochim. Biophys. Acta",
    "Biochimie": "Biochimie",
    "Bioconjugate Chemistry": "Bioconjugate Chem.",
    "Bioelectrochemistry": "Bioelectrochemistry",
    "BioEssays": "BioEssays",
    "BioFactors": "BioFactors",
    "Biofizika": "Biofizika",
    "Biogenic Amines": "Biog. Amines",
    "Bioinformatics": "Bioinformatics",
    "Bioinorganic Chemistry and Applications": "Bioinorg. Chem. Appl.",
    "Biokhimiya (Moscow)": "Biokhimiya (Moscow)",
    "Biological & Pharmaceutical Bulletin": "Biol. Pharm. Bull.",
    "Biological Chemistry": "Biol. Chem.",
    "Biological Chemistry Hoppe-Seyler": "Bio. Chem. Hoppe-Seyler",
    "Biological Mass Spectrometry": "Biol. Mass Spectrom.",
    "Biological Reviews": "Biol. Rev.",
    "Biological Trace Element Research": "Biol. Trace Elem. Res.",
    "Biologicheskie Membrany": "Biol. Membr.",
    "Biologicheskie Nauki (Moscow)": "Biol. Nauki (Moscow)",
    "Biology of Reproduction": "Biol. Reprod.",
    "Biomacromolecules": "Biomacromolecules",
    "Biomarkers": "Biomarkers",
    "Biomaterials": "Biomaterials",
    "Biomedica Biochimica Acta": "Biomed. Biochim. Acta",
    "Biomedical Chromatography": "Biomed. Chromatogr.",
    "Biomedical Research": "Biomed. Res.",
    "Biomedical Research on Trace Elements": "Biomed. Res. Trace Elem.",
    "Biomeditsinskaya Khimiya": "Biomed. Khim.",
    "BioMetals": "BioMetals",
    "Biomolecular Engineering": "Biomol. Eng.",
    "Bioorganic & Medicinal Chemistry": "Bioorg. Med. Chem.",
    "Bioorganic & Medicinal Chemistry Letters": "Bioorg. Med. Chem. Lett.",
    "Bioorganic Chemistry": "Bioorg. Chem.",
    "Bioorganicheskaya Khimiya": "Bioorg. Khim.",
    "Biopharmaceutics & Drug Disposition": "Biopharm. Drug Dispos.",
    "Biophysical Chemistry": "Biophys. Chem.",
    "Biophysical Journal": "Biophys. J.",
    "Biopolymers": "Biopolymers",
    "Bioprocess and Biosystems Engineering": "Bioprocess Biosyst. Eng.",
    "Bioresource Technology": "Bioresour. Technol.",
    "Bioscience Reports": "Biosci. Rep.",
    "Bioscience, Biotechnology, and Biochemistry": "Biosci., Biotechnol., Biochem.",
    "Biosensors & Bioelectronics": "Biosens. Bioelectron.",
    "BioTechniques": "BioTechniques",
    "Biotechnology and Applied Biochemistry": "Biotechnol. Appl. Biochem.",
    "Biotechnology and Bioengineering": "Biotechnol. Bioeng.",
    "Biotechnology and Bioprocess Engineering": "Biotechnol. Bioprocess Eng.",
    "Biotechnology Letters": "Biotechnol. Lett.",
    "Biotechnology Progress": "Biotechnol. Prog.",
    "Biotechnology Techniques": "Biotechnol. Tech.",
    "Biotekhnologiya": "Biotekhnologiya",
    "Birth Defects Research, Part A: Clinical and Molecular Teratology": "Birth Defects Res., Part A",
    "Birth Defects Research, Part B: Developmental and Reproductive Toxicology": "Birth Defects Res., Part B",
    "Birth Defects Research, Part C: Embryo Today--Reviews": "Birth Defects Res., Part C",
    "Bitamin": "Bitamin",
    "Blood": "Blood",
    "Boletin de la Sociedad Quimica del Peru": "Bol. Soc. Quim. Peru",
    "Bollettino - Societa Italiana di Biologia Sperimentale": "Boll.-Soc. Ital. Biol. Sper.",
    "Bopuxue Zazhi": "Bopuxue Zazhi",
    "Brain Research": "Brain Res.",
    "Brain Research Bulletin": "Brain Res. Bull.",
    "British Ceramic Transactions": "Br. Ceram. Trans.",
    "British Corrosion Journal": "Br. Corros. J.",
    "British Journal of Cancer": "Br. J. Cancer",
    "British Journal of Clinical Pharmacology": "Br. J. Clin. Pharmacol.",
    "British Journal of Industrial Medicine": "Br. J. Ind. Med.",
    "British Journal of Nutrition": "Br. J. Nutr.",
    "British Journal of Pharmacology": "Br. J. Pharmacol.",
    "Bulgarian Chemical Communications": "Bulg. Chem. Commun.",
    "Bulletin de la Societe Chimique de France": "Bull. Soc. Chim. Fr.",
    "Bulletin des Societes Chimiques Belges": "Bull. Soc. Chim. Belg.",
    "Bulletin of Electrochemistry": "Bull. Electrochem.",
    "Bulletin of Environmental Contamination and Toxicology": "Bull. Environ. Contam. Toxicol.",
    "Bulletin of Materials Science": "Bull. Mater. Sci.",
    "Bulletin of the Chemical Society of Japan": "Bull. Chem. Soc. Jpn.",
    "Bulletin of the Korean Chemical Society": "Bull. Korean Chem. Soc.",
    "Bulletin of the Polish Academy of Sciences, Chemistry": "Bull. Pol. Acad. Sci., Chem.",
    "Bunseki Kagaku": "Bunseki Kagaku",
    "Byulleten Eksperimental\'noi Biologii i Meditsiny": "Byull. Eksp. Biol. Med.",
    "Cailiao Baohu": "Cailiao Baohu",
    "Cailiao Rechuli Xuebao": "Cailiao Rechuli Xuebao",
    "Calcified Tissue International": "Calcif. Tissue Int.",
    "Calorimetrie et Analyse Thermique": "Calorim. Anal. Therm.",
    "CALPHAD: Computer Coupling of Phase Diagrams and Thermochemistry": "CALPHAD: Comput. Coupling Phase Diagrams Thermochem.",
    "Canadian Chemical News": "Can. Chem. News",
    "Canadian Journal of Analytical Sciences and Spectroscopy": "Can. J. Anal. Sci. Spectrosc.",
    "Canadian Journal of Botany": "Can. J. Bot.",
    "Canadian Journal of Chemical Engineering": "Can. J. Chem. Eng.",
    "Canadian Journal of Chemistry": "Can. J. Chem.",
    "Canadian Journal of Earth Sciences": "Can. J. Earth Sci.",
    "Canadian Journal of Microbiology": "Can. J. Microbiol.",
    "Canadian Journal of Physics": "Can. J. Phys.",
    "Canadian Journal of Physiology and Pharmacology": "Can. J. Physiol. Pharmacol.",
    "Canadian Metallurgical Quarterly": "Can. Metall. Q.",
    "Canadian Mineralogist": "Can. Mineral.",
    "Cancer Cell": "Cancer Cell",
    "Cancer Gene Therapy": "Cancer Gene Ther.",
    "Cancer Letters (Amsterdam, Netherlands)": "Cancer Lett. (Amsterdam, Neth.)",
    "Cancer Letters (Shannon, Ireland)": "Cancer Lett. (Shannon, Irel.)",
    "Cancer Research": "Cancer Res.",
    "Cancer Science": "Cancer Sci.",
    "Carbohydrate Polymers": "Carbohydr. Polym.",
    "Carbohydrate Research": "Carbohydr. Res.",
    "Carbon": "Carbon",
    "Carcinogenesis": "Carcinogenesis",
    "Carcinogenesis (London)": "Carcinogenesis (London)",
    "Cardiovascular Research": "Cardiovasc. Res.",
    "Catalysis Communications": "Catal. Commun.",
    "Catalysis Letters": "Catal. Lett.",
    "Catalysis Reviews - Science and Engineering": "Catal. Rev. - Sci. Eng.",
    "Catalysis Today": "Catal. Today",
    "Cell (Cambridge, MA, United States)": "Cell (Cambridge, MA, U. S.)",
    "Cell and Tissue Research": "Cell Tissue Res.",
    "Cell Biochemistry and Biophysics": "Cell Biochem. Biophys.",
    "Cell Biochemistry and Function": "Cell Biochem. Funct.",
    "Cell Biology International Reports": "Cell Biol. Int. Rep.",
    "Cell Calcium": "Cell Calcium",
    "Cell Cycle": "Cell Cycle",
    "Cell Growth & Differentiation": "Cell Growth Differ.",
    "Cellular and Molecular Biology": "Cell. Mol. Biol.",
    "Cellular and Molecular Biology (Paris, France, Online)": "Cell. Mol. Biol. (Paris, Fr., Online)",
    "Cellular and Molecular Biology (Paris, France, Print)": "Cell. Mol. Biol. (Paris, Fr., Print)",
    "Cellular and Molecular Life Sciences": "Cell. Mol. Life Sci.",
    "Cellular Immunology": "Cell. Immunol.",
    "Cellular Microbiology": "Cell. Microbiol.",
    "Cellular Physiology and Biochemistry": "Cell. Physiol. Biochem.",
    "Cellular Polymers": "Cell. Polym.",
    "Cellulose Chemistry and Technology": "Cellul. Chem. Technol.",
    "Cement & Concrete Composites": "Cem. Concr. Compos.",
    "Cement and Concrete Research": "Cem. Concr. Res.",
    "Ceramic Engineering and Science Proceedings": "Ceram. Eng. Sci. Proc.",
    "Ceramic Transactions": "Ceram. Trans.",
    "Ceramics International": "Ceram. Int.",
    "Ceramics-Silikaty": "Ceram.-Silik.",
    "Cereal Chemistry": "Cereal Chem.",
    "Ceska a Slovenska Farmacie": "Ceska Slov. Farm.",
    "Ceskoslovenska Farmacie": "Cesk. Farm.",
    "ChemBioChem": "ChemBioChem",
    "Chemia Analityczna (Warsaw)": "Chem. Anal. (Warsaw)",
    "Chemical & Engineering News": "Chem. Eng. News",
    "Chemical & Pharmaceutical Bulletin": "Chem. Pharm. Bull.",
    "Chemical and Biochemical Engineering Quarterly": "Chem. Biochem. Eng. Q.",
    "Chemical and Pharmaceutical Bulletin": "Chem. Pharm. Bull.",
    "Chemical and Physical Processes in Combustion": "Chem. Phys. Processes Combust.",
    "Chemical Communications (Cambridge, United Kingdom)": "Chem. Commun. (Cambridge, U. K.)",
    "Chemical Engineer (Rugby, England)": "Chem. Eng. (Rugby, Engl.)",
    "Chemical Engineering & Technology": "Chem. Eng. Technol.",
    "Chemical Engineering (New York)": "Chem. Eng. (N.Y.)",
    "Chemical Engineering and Processing": "Chem. Eng. Process.",
    "Chemical Engineering Communications": "Chem. Eng. Commun.",
    "Chemical Engineering Journal (Amsterdam, Netherlands)": "Chem. Eng. J. (Amsterdam, Neth.)",
    "Chemical Engineering Journal (Lausanne)": "Chem. Eng. J. (Lausanne)",
    "Chemical Engineering Progress": "Chem. Eng. Prog.",
    "Chemical Engineering Research and Design": "Chem. Eng. Res. Des.",
    "Chemical Engineering Science": "Chem. Eng. Sci.",
    "Chemical Geology": "Chem. Geol.",
    "Chemical Papers": "Chem. Pap.",
    "Chemical Physics": "Chem. Phys.",
    "Chemical Physics Letters": "Chem. Phys. Lett.",
    "Chemical Record": "Chem. Rec.",
    "Chemical Research in Chinese Universities": "Chem. Res. Chin. Univ.",
    "Chemical Research in Toxicology": "Chem. Res. Toxicol.",
    "Chemical Reviews (Washington, DC)": "Chem. Rev. (Washington, DC)",
    "Chemical Society Reviews": "Chem. Soc. Rev.",
    "Chemical Speciation and Bioavailability": "Chem. Speciation Bioavailability",
    "Chemical Vapor Deposition": "Chem. Vap. Deposition",
    "Chemical Week": "Chem. Week",
    "Chemicke Listy": "Chem. Listy",
    "Chemicky Prumysl": "Chem. Prum.",
    "Chemico-Biological Interactions": "Chem.-Biol. Interact.",
    "Chemie der Erde": "Chem. Erde",
    "Chemie Ingenieur Technik": "Chem. Ing. Tech.",
    "Chemie-Ingenieur-Technik": "Chem.-Ing.-Tech.",
    "Chemija": "Chemija",
    "Chemika Chronika": "Chem. Chron.",
    "Chemische Berichte": "Chem. Ber.",
    "Chemische Industrie (Duesseldorf)": "Chem. Ind. (Duesseldorf)",
    "Chemische Technik (Leipzig)": "Chem. Tech. (Leipzig)",
    "Chemistry & Biology": "Chem. Biol.",
    "Chemistry & Industry (London)": "Chem. Ind. (London)",
    "Chemistry and Physics of Carbon": "Chem. Phys. Carbon",
    "Chemistry and Physics of Lipids": "Chem. Phys. Lipids",
    "Chemistry and Technology of Fuels and Oils (Translation of Khimiya i Tekhnologiya Topliv i Masel)": "Chem. Technol. Fuels Oils",
    "Chemistry Express": "Chem. Express",
    "Chemistry in Britain": "Chem. Br.",
    "Chemistry in New Zealand": "Chem. N.Z.",
    "Chemistry Letters": "Chem. Lett.",
    "Chemistry of Heterocyclic Compounds New York (Translation of Khimiya Geterotsiklicheskikh Soedinenii)": "Chem. Heterocycl. Compd.(N.Y.)",
    "Chemistry of Materials": "Chem. Mater.",
    "Chemistry of Natural Compounds (Translation of Khimiya Prirodnykh Soedinenii)": "Chem. Nat. Compd.",
    "Chemistry--A European Journal": "Chem.--Eur. J.",
    "Chemometrics and Intelligent Laboratory Systems": "Chemom. Intell. Lab. Syst.",
    "Chemosphere": "Chemosphere",
    "Chemotherapy (Basel, Switzerland)": "Chemotherapy (Basel, Switz.)",
    "Chemotherapy (Tokyo)": "Chemotherapy (Tokyo)",
    "ChemPhysChem": "ChemPhysChem",
    "ChemSA": "ChemSA",
    "Chemtracts": "Chemtracts",
    "Chemtracts: Inorganic Chemistry": "Chemtracts: Inorg. Chem.",
    "Chemtracts: Macromolecular Chemistry": "Chemtracts: Macromol. Chem.",
    "Chemtracts: Organic Chemistry": "Chemtracts: Org. Chem.",
    "Chimia": "Chimia",
    "Chimica Acta Turcica": "Chim. Acta Turc.",
    "Chimica e l\'Industria (Milan, Italy)": "Chim. Ind. (Milan, Italy)",
    "Chimie Actualites": "Chim. Actual.",
    "Chinese Chemical Letters": "Chin. Chem. Lett.",
    "Chinese Journal of Chemical Engineering": "Chin. J. Chem. Eng.",
    "Chinese Journal of Chemistry": "Chin. J. Chem.",
    "Chinese Journal of Geochemistry": "Chin. J. Geochem.",
    "Chinese Journal of Metal Science & Technology": "Chin. J. Met. Sci. Technol.",
    "Chinese Journal of Polymer Science": "Chin. J. Polym. Sci.",
    "Chinese Physics Letters": "Chin. Phys. Lett.",
    "Chinese Science Bulletin": "Chin. Sci. Bull.",
    "Chirality": "Chirality",
    "Chromatographia": "Chromatographia",
    "Chromosome Research": "Chromosome Res.",
    "Circulation": "Circulation",
    "Circulation Research": "Circ. Res.",
    "Classical and Quantum Gravity": "Classical Quantum Gravity",
    "Clay Minerals": "Clay Miner.",
    "Clays and Clay Minerals": "Clays Clay Miner.",
    "Clinica Chimica Acta": "Clin. Chim. Acta",
    "Clinical and Experimental Immunology": "Clin. Exp. Immunol.",
    "Clinical and Experimental Pharmacology and Physiology": "Clin. Exp. Pharmacol. Physiol.",
    "Clinical Biochemistry": "Clin. Biochem.",
    "Clinical Chemistry (Washington, DC)": "Clin. Chem. (Washington, DC)",
    "Clinical Chemistry and Laboratory Medicine": "Clin. Chem. Lab. Med.",
    "Clinical Immunology (San Diego, CA, United States)": "Clin. Immunol. (San Diego, CA, U. S.)",
    "Clinical Immunology and Immunopathology": "Clin. Immunol. Immunopathol.",
    "Clinical Pharmacology and Therapeutics (St. Louis)": "Clin. Pharmacol. Ther. (St. Louis)",
    "Clinical Science": "Clin. Sci.",
    "Cloning and Stem Cells": "Cloning Stem Cells",
    "Coal Preparation (Philadelphia, PA, United States)": "Coal Prep. (Philadelphia, PA, U. S.)",
    "Cold Spring Harbor Symposia on Quantitative Biology": "Cold Spring Harbor Symp. Quant. Biol.",
    "Collection of Czechoslovak Chemical Communications": "Collect. Czech. Chem. Commun.",
    "Colloid and Polymer Science": "Colloid Polym. Sci.",
    "Colloid Journal (Translation of Kolloidnyi Zhurnal)": "Colloid J.",
    "Colloids and Surfaces": "Colloids Surf.",
    "Colloids and Surfaces, A: Physicochemical and Engineering Aspects": "Colloids Surf., A",
    "Colloids and Surfaces, B: Biointerfaces": "Colloids Surf., B",
    "Colloque INSERM": "Colloq. INSERM",
    "Coloration Technology": "Color. Technol.",
    "Combinatorial Chemistry and High Throughput Screening": "Comb. Chem. High Throughput Screening",
    "Combustion and Flame": "Combust. Flame",
    "Combustion Science and Technology": "Combust. Sci. Technol.",
    "Comments on Inorganic Chemistry": "Comments Inorg. Chem.",
    "Communications in Soil Science and Plant Analysis": "Commun. Soil Sci. Plant Anal.",
    "Comparative and Functional Genomics": "Comp. Funct. Genomics",
    "Comparative Biochemistry and Physiology, A: Comparative Physiology": "Comp. Biochem. Physiol., A: Comp. Physiol.",
    "Comparative Biochemistry and Physiology, B: Comparative Biochemistry": "Comp. Biochem. Physiol., B: Comp. Biochem.",
    "Comparative Biochemistry and Physiology, C: Comparative Pharmacology and Toxicology": "Comp. Biochem. Physiol., C: Comp. Pharmacol. Toxicol.",
    "Comparative Biochemistry and Physiology, Part A: Molecular & Integrative Physiology": "Comp. Biochem. Physiol., Part A: Mol. Integr. Physiol.",
    "Comparative Biochemistry and Physiology, Part B: Biochemistry & Molecular Biology": "Comp. Biochem. Physiol., Part B: Biochem. Mol. Biol.",
    "Comparative Biochemistry and Physiology, Part C: Toxicology & Pharmacology": "Comp. Biochem. Physiol., Part C: Toxicol. Pharmacol.",
    "Comparative Medicine": "Comp. Med.",
    "Comptes Rendus Chimie": "C. R. Chim.",
    "Comptes Rendus de l\'Academie des Sciences, Serie II: Mecanique, Physique, Chimie, Sciences de la Terre et de l\'Univers": "C. R. l\'Academie. Sci., Ser. II Univers",
    "Comptes Rendus de l\'Academie des Sciences, Serie III: Sciences de la Vie": "C. R. l\'Academie. Sci., Ser. III",
    "Comptes Rendus Physique": "C. R. Phys.",
    "Computational Biology and Chemistry": "Comput. Biol. Chem.",
    "Computer Physics Communications": "Comput. Phys. Commun.",
    "Computers & Chemical Engineering": "Comput. Chem. Eng.",
    "Computers & Chemistry": "Comput. Chem.",
    "Comunicaciones presentadas a las Jornadas del Comite Espanol de la Detergencia": "Comun. Jorn. Com. Esp. Deterg.",
    "Conference Record of the IEEE Photovoltaic Specialists Conference": "Conf. Rec. IEEE Photovoltaic Spec. Conf.",
    "Contemporary Topics in Laboratory Animal Science": "Contemp. Top. Lab. Anim. Sci.",
    "Contributions to Mineralogy and Petrology": "Contrib. Mineral. Petrol.",
    "Coordination Chemistry Reviews": "Coord. Chem. Rev.",
    "Corrosion (Houston, TX, United States)": "Corrosion (Houston, TX, U. S.)",
    "Corrosion Engineering, Science and Technology": "Corros. Eng., Sci. Technol.",
    "Corrosion Reviews": "Corros. Rev.",
    "Corrosion Science": "Corros. Sci.",
    "Critical Reviews in Analytical Chemistry": "Crit. Rev. Anal. Chem.",
    "Critical Reviews in Biochemistry and Molecular Biology": "Crit. Rev. Biochem. Mol. Biol.",
    "Critical Reviews in Solid State and Materials Sciences": "Crit. Rev. Solid State Mater. Sci.",
    "Croatica Chemica Acta": "Croat. Chem. Acta",
    "Cryogenics": "Cryogenics",
    "Crystal Engineering": "Cryst. Eng.",
    "Crystal Growth & Design": "Cryst. Growth Des.",
    "Crystal Research and Technology": "Cryst. Res. Technol.",
    "Crystallography Reports (Translation of Kristallografiya)": "Crystallogr. Rep.",
    "Cuihua Xuebao": "Cuihua Xuebao",
    "Current Biology": "Curr. Biol.",
    "Current Cancer Drug Targets": "Curr. Cancer Drug Targets",
    "Current Drug Delivery": "Curr. Drug Delivery",
    "Current Drug Metabolism": "Curr. Drug Metab.",
    "Current Drug Targets": "Curr. Drug Targets",
    "Current Drug Targets: Cardiovascular & Haematological Disorders": "Curr. Drug Targets: Cardiovasc. & Haematol. Disord.",
    "Current Drug Targets: CNS & Neurological Disorders": "Curr. Drug Targets: CNS Neurol. Disord.",
    "Current Drug Targets: Immune, Endocrine and Metabolic Disorders": "Curr. Drug Targets: Immune, Endocr. Metab. Disord.",
    "Current Drug Targets: Infectious Disorders": "Curr. Drug Targets: Infect. Disord.",
    "Current Drug Targets: Inflammation & Allergy": "Curr. Drug Targets: Inflammation Allergy",
    "Current Gene Therapy": "Curr. Gene Ther.",
    "Current Genetics": "Curr. Genet.",
    "Current Genomics": "Curr. Genomics",
    "Current HIV Research": "Curr. HIV Res.",
    "Current Medicinal Chemistry": "Curr. Med. Chem.",
    "Current Medicinal Chemistry: Anti-Cancer Agents": "Curr. Med. Chem.: Anti-Cancer Agents",
    "Current Medicinal Chemistry: Anti-Infective Agents": "Curr. Med. Chem.: Anti-Infect. Agents",
    "Current Medicinal Chemistry: Anti-Inflammatory & Anti-Allergy Agents": "Curr. Med. Chem.: Anti-Inflammatory Anti-Allergy Agents",
    "Current Medicinal Chemistry: Cardiovascular & Hematological Agents": "Curr. Med. Chem.: Cardiovasc. Hematol. Agents",
    "Current Medicinal Chemistry: Central Nervous System Agents": "Curr. Med. Chem.: Cent. Nerv. Syst. Agents",
    "Current Medicinal Chemistry: Immunology, Endocrine & Metabolic Agents": "Curr. Med. Chem.: Immunol., Endocr. Metab. Agents",
    "Current Microbiology": "Curr. Microbiol.",
    "Current Molecular Medicine": "Curr. Mol. Med.",
    "Current Neuropharmacology": "Curr. Neuropharmacol.",
    "Current Opinion in Biotechnology": "Curr. Opin. Biotechnol.",
    "Current Opinion in Cell Biology": "Curr. Opin. Cell Biol.",
    "Current Opinion in Chemical Biology": "Curr. Opin. Chem. Biol.",
    "Current Opinion in Colloid & Interface Science": "Curr. Opin. Colloid Interface Sci.",
    "Current Opinion in Drug Discovery & Development": "Curr. Opin. Drug Discovery Dev.",
    "Current Opinion in Genetics & Development": "Curr. Opin. Genet. Dev.",
    "Current Opinion in Immunology": "Curr. Opin. Immunol.",
    "Current Opinion in Lipidology": "Curr. Opin. Lipidol.",
    "Current Opinion in Neurobiology": "Curr. Opin. Neurobiol.",
    "Current Opinion in Pharmacology": "Curr. Opin. Pharmacol.",
    "Current Opinion in Structural Biology": "Curr. Opin. Struct. Biol.",
    "Current Organic Chemistry": "Curr. Org. Chem.",
    "Current Organic Synthesis": "Curr. Org. Synth.",
    "Current Pharmaceutical Biotechnology": "Curr. Pharm. Biotechnol.",
    "Current Pharmaceutical Design": "Curr. Pharm. Des.",
    "Current Pharmacogenomics": "Curr. Pharmacogenomics",
    "Current Protein and Peptide Science": "Curr. Protein Pept. Sci.",
    "Current Proteomics": "Curr. Proteomics",
    "Current Science": "Curr. Sci.",
    "Current Separations": "Curr. Sep.",
    "Current Topics in Cellular Regulation": "Curr. Top. Cell. Regul.",
    "Current Topics in Medicinal Chemistry (Sharjah, United Arab Emirates)": "Curr. Top. Med. Chem. (Sharjah, United Arab Emirates)",
    "Current Vascular Pharmacology": "Curr. Vasc. Pharmacol.",
    "Cytokine & Growth Factor Reviews": "Cytokine Growth Factor Rev.",
    "Cytokine (Philadelphia)": "Cytokine (Philadelphia)",
    "Cytokine+": "Cytokine+",
    "Czechoslovak Journal of Physics": "Czech J. Phys.",
    "Dalton Transactions": "Dalton Trans.",
    "Dangerous Properties of Industrial Materials Report": "Dangerous Prop. Ind. Mater. Rep.",
    "Daxue Huaxue": "Daxue Huaxue",
    "DECHEMA Biotechnology Conferences": "DECHEMA Biotechnol. Conf.",
    "Denki Kagaku oyobi Kogyo Butsuri Kagaku": "Denki Kagaku oyobi Kogyo Butsuri Kagaku",
    "Desalination": "Desalination",
    "Designed Monomers and Polymers": "Des. Monomers Polym.",
    "Deutsche Lebensmittel-Rundschau": "Dtsch. Lebensm.-Rundsch.",
    "Development (Cambridge, United Kingdom)": "Development (Cambridge, U. K.)",
    "Developmental Biology": "Dev. Biol.",
    "Developmental Biology (San Diego, CA, United States)": "Dev. Biol. (San Diego, CA, U. S.)",
    "Developmental Brain Research": "Dev. Brain Res.",
    "Developmental Cell": "Dev. Cell",
    "Developmental Neuroscience (Basel, Switzerland)": "Dev. Neurosci. (Basel, Switz.)",
    "Developments in Biologicals (Basel, Switzerland)": "Dev. Biol. (Basel, Switz.)",
    "Developments in Food Science": "Dev. Food Sci.",
    "Developments in Industrial Microbiology": "Dev. Ind. Microbiol.",
    "Developments in Plant and Soil Sciences": "Dev. Plant Soil Sci.",
    "Diabetes": "Diabetes",
    "Diabetologia": "Diabetologia",
    "Diamond and Related Materials": "Diamond Relat. Mater.",
    "Dianhuaxue": "Dianhuaxue",
    "Diffusion and Defect Data--Solid State Data, Pt. A: Defect and Diffusion Forum": "Diffus. Defect Data, Pt. A",
    "Diffusion and Defect Data--Solid State Data, Pt. B: Solid State Phenomena": "Diffus. Defect Data, Pt. B",
    "Digestive Diseases and Sciences": "Dig. Dis. Sci.",
    "Diqiu Huaxue": "Diqiu Huaxue",
    "DNA and Cell Biology": "DNA Cell Biol.",
    "DNA Repair": "DNA Repair",
    "DNA Research": "DNA Res.",
    "DNA Sequence": "DNA Sequence",
    "Dokladi na Bulgarskata Akademiya na Naukite": "Dokl. Bulg. Akad. Nauk",
    "Doklady - Akademiya Nauk Azerbaidzhana": "Dokl. Akad. Nauk Az. SSR",
    "Doklady Akademii Nauk": "Dokl. Akad. Nauk SSSR",
    "Doklady Akademii Nauk Belarusi": "Dokl. Akad. Nauk BSSR",
    "Doklady Akademii Nauk Tadzhikskoi SSR": "Dokl. Akad. Nauk Tadzh. SSR",
    "Doklady Akademii Nauk Ukrainy": "Dokl. Akad. Nauk Ukr. SSR",
    "Doklady Akademii Nauk UzSSR": "Dokl. Akad. Nauk UzSSR",
    "Doklady Biochemistry and Biophysics": "Dokl. Biochem. Biophys.",
    "Doklady Chemistry (Translation of the chemistry section of Doklady Akademii Nauk)": "Dokl. Chem.",
    "Doklady Earth Sciences": "Dokl. Earth Sci.",
    "Doklady Physical Chemistry (Translation of the physical chemistry section of Doklady Akademii Nauk)": "Dokl. Phys. Chem.",
    "Doklady Physics (Translation of the physics section of Doklady Akademii Nauk)": "Dokl. Phys.",
    "Dopovidi Natsional\'noi Akademii Nauk Ukraini": "Dopov. Nats. Akad. Nauk Ukr.",
    "Drug and Chemical Toxicology (1977)": "Drug Chem. Toxicol.",
    "Drug Delivery": "Drug Delivery",
    "Drug Design and Discovery": "Drug Des. Discovery",
    "Drug Development and Industrial Pharmacy": "Drug Dev. Ind. Pharm.",
    "Drug Development Research": "Drug Dev. Res.",
    "Drug Metabolism and Disposition": "Drug Metab. Dispos.",
    "Drug Metabolism and Drug Interactions": "Drug Metab. Drug Interact.",
    "Drug Metabolism and Pharmacokinetics": "Drug Metab. Pharmacokinet.",
    "Drugs under Experimental and Clinical Research": "Drugs Exp. Clin. Res.",
    "DVS Berichte": "DVS Ber.",
    "Dyes and Pigments": "Dyes Pigm.",
    "Earth and Planetary Science Letters": "Earth Planet. Sci. Lett.",
    "Economic Geology": "Econ. Geol.",
    "Economic Geology and the Bulletin of the Society of Economic Geologists": "Econ. Geol.",
    "Ecotoxicology and Environmental Safety": "Ecotoxicol. Environ. Saf.",
    "Education in Chemistry": "Educ. Chem.",
    "Egyptian Journal of Chemistry": "Egypt. J. Chem.",
    "Ekotekhnologii i Resursosberezhenie": "Ekotekhnol. Resursosberezhenie",
    "Eksperimental\'naya i Klinicheskaya Farmakologiya": "Eksp. Klin. Farmakol.",
    "Electroanalysis": "Electroanalysis",
    "Electroanalysis (New York)": "Electroanalysis",
    "Electroanalytical Chemistry": "Electroanal. Chem.",
    "Electrochemical and Solid-State Letters": "Electrochem. Solid-State Lett.",
    "Electrochemical Society Interface": "Electrochem. Soc. Interface",
    "Electrochemistry (Tokyo)": "Electrochemistry (Tokyo)",
    "Electrochemistry Communications": "Electrochem. Commun.",
    "Electrochimica Acta": "Electrochim. Acta",
    "Electronics Letters": "Electron. Lett.",
    "Electrophoresis": "Electrophoresis",
    "Electrophoresis (Weinheim, Federal Republic of Germany)": "Electrophoresis (Weinheim, Fed. Repub. Ger.)",
    "Elektrokhimiya": "Elektrokhimiya",
    "EMBO Journal": "EMBO J.",
    "EMBO Reports": "EMBO Rep.",
    "Endeavour": "Endeavour",
    "Endocrine": "Endocrine",
    "Endocrinology": "Endocrinology",
    "Endocrinology (Baltimore)": "Endocrinology (Baltimore)",
    "Energy & Fuels": "Energy Fuels",
    "Engineering in Life Sciences": "Eng. Life Sci.",
    "Ensho": "Ensho",
    "Environment Protection Engineering": "Environ. Prot. Eng.",
    "Environmental and Molecular Mutagenesis": "Environ. Mol. Mutagen.",
    "Environmental Engineering Science": "Environ. Eng. Sci.",
    "Environmental Geochemistry and Health": "Environ. Geochem. Health",
    "Environmental Health Perspectives": "Environ. Health Perspect.",
    "Environmental Pollution": "Environ. Pollut.",
    "Environmental Pollution (Amsterdam, Netherlands)": "Environ. Pollut. (Amsterdam, Neth.)",
    "Environmental Progress": "Environ. Prog.",
    "Environmental Research": "Environ. Res.",
    "Environmental Science and Technology": "Environ. Sci. Technol.",
    "Environmental Technology": "Environ. Technol.",
    "Environmental Toxicology": "Environ. Toxicol.",
    "Environmental Toxicology and Chemistry": "Environ. Toxicol. Chem.",
    "Environmental Toxicology and Pharmacology": "Environ. Toxicol. Pharmacol.",
    "Enzyme and Microbial Technology": "Enzyme Microb. Technol.",
    "Erdoel & Kohle, Erdgas, Petrochemie": "Erdoel Kohle, Erdgas, Petrochem.",
    "Erdoel, Erdgas, Kohle": "Erdoel, Erdgas, Kohle",
    "ESIS Publication": "ESIS Publ.",
    "Essays in Biochemistry": "Essays Biochem.",
    "Ettore Majorana International Science Series: Physical Sciences": "Ettore Majorana Int. Sci. Ser.: Phys. Sci.",
    "Eukaryotic Cell": "Eukaryotic Cell",
    "European Cytokine Network": "Eur. Cytokine Network",
    "European Food Research and Technology": "Eur. Food Res. Technol.",
    "European Journal of Biochemistry": "Eur. J. Biochem.",
    "European Journal of Cell Biology": "Eur. J. Cell Biol.",
    "European Journal of Clinical Chemistry and Clinical Biochemistry": "Eur. J. Clin. Chem. Clin. Biochem.",
    "European Journal of Clinical Pharmacology": "Eur. J. Clin. Pharmacol.",
    "European Journal of Drug Metabolism and Pharmacokinetics": "Eur. J. Drug Metab. Pharmacokinet.",
    "European Journal of Endocrinology": "Eur. J. Endocrinol.",
    "European Journal of Immunology": "Eur. J. Immunol.",
    "European Journal of Inorganic Chemistry": "Eur. J. Inorg. Chem.",
    "European Journal of Lipid Science and Technology": "Eur. J. Lipid Sci. Technol.",
    "European Journal of Mass Spectrometry": "Eur. J. Mass Spectrom.",
    "European Journal of Medicinal Chemistry": "Eur. J. Med. Chem.",
    "European Journal of Mineralogy": "Eur. J. Mineral.",
    "European Journal of Organic Chemistry": "Eur. J. Org. Chem.",
    "European Journal of Pharmaceutical Sciences": "Eur. J. Pharm. Sci.",
    "European Journal of Pharmacology": "Eur. J. Pharmacol.",
    "European Journal of Pharmacology, Molecular Pharmacology Section": "Eur. J. Pharmacol., Mol. Pharmacol. Sect.",
    "European Journal of Solid State and Inorganic Chemistry": "Eur. J. Solid State Inorg. Chem.",
    "European Neuropsychopharmacology": "Eur. Neuropsychopharmacol.",
    "European Physical Journal A: Hadrons and Nuclei": "Eur. Phys. J. A",
    "European Physical Journal B: Condensed Matter Physics": "Eur. Phys. J. B",
    "European Physical Journal C: Particles and Fields": "Eur. Phys. J. C",
    "European Physical Journal D: Atomic, Molecular and Optical Physics": "Eur. Phys. J. D",
    "European Physical Journal E: Soft Matter": "Eur. Phys. J. E",
    "European Polymer Journal": "Eur. Polym. J.",
    "Europhysics Letters": "Europhys. Lett.",
    "Experientia": "Experientia",
    "Experimental and Clinical Endocrinology & Diabetes": "Exp. Clin. Endocrinol. Diabetes",
    "Experimental and Molecular Medicine": "Exp. Mol. Med.",
    "Experimental and Molecular Pathology": "Exp. Mol. Pathol.",
    "Experimental Animals": "Exp. Anim.",
    "Experimental Biology and Medicine (Maywood, NJ, United States)": "Exp. Biol. Med. (Maywood, NJ, U. S.)",
    "Experimental Brain Research": "Exp. Brain Res.",
    "Experimental Cell Research": "Exp. Cell Res.",
    "Experimental Eye Research": "Exp. Eye Res.",
    "Experimental Neurology": "Exp. Neurol.",
    "Expert Opinion on Investigational Drugs": "Expert Opin. Invest. Drugs",
    "Expert Opinion on Therapeutic Patents": "Expert Opin. Ther. Pat.",
    "Falk Symposium": "Falk Symp.",
    "Faraday Discussions": "Faraday Discuss.",
    "Farmaco": "Farmaco",
    "Farmatsiya (Moscow)": "Farmatsiya (Moscow)",
    "FASEB Journal": "FASEB J.",
    "FEBS Letters": "FEBS Lett.",
    "Federal Register": "Fed. Regist.",
    "FEMS Immunology and Medical Microbiology": "FEMS Immunol. Med. Microbiol.",
    "FEMS Microbiology Ecology": "FEMS Microbiol. Ecol.",
    "FEMS Microbiology Letters": "FEMS Microbiol. Lett.",
    "FEMS Microbiology Reviews": "FEMS Microbiol. Rev.",
    "FEMS Symposium": "FEMS Symp.",
    "FEMS Yeast Research": "FEMS Yeast Res.",
    "Fenxi Ceshi Tongbao": "Fenxi Ceshi Tongbao",
    "Fenxi Huaxue": "Fenxi Huaxue",
    "Fenxi Shiyanshi": "Fenxi Shiyanshi",
    "Fenzi Cuihua": "Fenzi Cuihua",
    "Ferroelectrics": "Ferroelectrics",
    "Ferroelectrics, Letters Section": "Ferroelectr., Lett. Sect.",
    "Few-Body Systems, Supplementum": "Few-Body Syst., Suppl.",
    "Fibre Chemistry (Translation of Khimicheskie Volokna)": "Fibre Chem.",
    "Fidia Research Foundation Symposium Series": "Fidia Res. Found. Symp. Ser.",
    "Fire and Materials": "Fire Mater.",
    "Fish Physiology and Biochemistry": "Fish Physiol. Biochem.",
    "Fisheries Science": "Fish. Sci.",
    "Fitoterapia": "Fitoterapia",
    "Fizika Goreniya i Vzryva": "Fiz. Goreniya Vzryva",
    "Fizika i Khimiya Obrabotki Materialov": "Fiz. Khim. Obrab. Mater.",
    "Fizika i Khimiya Stekla": "Fiz. Khim. Stekla",
    "Fizika i Tekhnika Poluprovodnikov (S. -Peterburg)": "Fiz. Tekh. Poluprovodn. (Leningrad)",
    "Fizika Metallov i Metallovedenie": "Fiz. Met. Metalloved.",
    "Fizika Nizkikh Temperatur (Kiev)": "Fiz. Nizk. Temp. (Kiev)",
    "Fizika Plazmy (Moscow)": "Fiz. Plazmy (Moscow)",
    "Fizika Tverdogo Tela (S. -Peterburg)": "Fiz. Tverd. Tela (Leningrad)",
    "Fiziko-Khimicheskaya Mekhanika Materialov": "Fiz.-Khim. Mekh. Mater.",
    "Fiziologicheskii Zhurnal imeni I. M. Sechenova": "Fizziol. Zh. SSSR im I. M. Sechenova",
    "Fiziologichno Aktivni Rechovini": "Fiziol. Akt. Rechovini",
    "Fiziologiya i Biokhimiya Kul\'turnykh Rastenii": "Fiziol. Biokhim. Kul\'t. Rast.",
    "Fiziologiya Rastenii (Moscow)": "Fiziol. Rast. (Moscow)",
    "Fluid Phase Equilibria": "Fluid Phase Equilib.",
    "Folia Microbiologica (Prague, Czech Republic)": "Folia Microbiol. (Prague, Czech Repub.)",
    "Food Additives & Contaminants": "Food Addit. Contam.",
    "Food and Chemical Toxicology": "Food Chem. Toxicol.",
    "Food Chemistry": "Food Chem.",
    "Food Hydrocolloids": "Food Hydrocolloids",
    "Free Radical Biology & Medicine": "Free Radical Biol. Med.",
    "Free Radical Research": "Free Radical Res.",
    "Free Radical Research Communications": "Free Radical Res. Commun.",
    "Fresenius Environmental Bulletin": "Fresenius Environ. Bull.",
    "Fresenius\' Journal of Analytical Chemistry": "Fresenius. J. Anal. Chem.",
    "Fuel": "Fuel",
    "Fuel Cells (Weinheim, Germany)": "Fuel Cells (Weinheim, Ger.)",
    "Fuel Processing Technology": "Fuel Process. Technol.",
    "Fullerenes, Nanotubes, and Carbon Nanostructures": "Fullerenes, Nanotubes, Carbon Nanostruct.",
    "Functional & Integrative Genomics": "Funct. Integr. Genomics",
    "Fundamental & Clinical Pharmacology": "Fundam. Clin. Pharmacol.",
    "Fundamental and Applied Toxicology": "Fundam. Appl. Toxicol.",
    "Funtai oyobi Funmatsu Yakin": "Funtai oyobi Funmatsu Yakin",
    "Fushe Fanghu": "Fushe Fanghu",
    "Fusion Engineering and Design": "Fusion Eng. Des.",
    "Fusion Science and Technology": "Fusion Sci. Technol.",
    "Fusion Technology": "Fusion Technol.",
    "Galvanotechnik": "Galvanotechnik",
    "Gangtie": "Gangtie",
    "Ganguang Kexue Yu Guang Huaxue": "Ganguang Kexue Yu Guang Huaxue",
    "Gaodeng Xuexiao Huaxue Xuebao": "Gaodeng Xuexiao Huaxue Xuebao",
    "Gaofenzi Cailiao Kexue Yu Gongcheng": "Gaofenzi Cailiao Kexue Yu Gongcheng",
    "Gaofenzi Xuebao": "Gaofenzi Xuebao",
    "Gaoneng Wuli Yu Hewuli": "Gaoneng Wuli Yu Hewuli",
    "Gaoxiao Huaxue Gongcheng Xuebao": "Gaoxiao Huaxue Gongcheng Xuebao",
    "Gastroenterology": "Gastroenterology",
    "Gazzetta Chimica Italiana": "Gazz. Chim. Ital.",
    "GBF Monographs": "GBF Monogr.",
    "Gene": "Gene",
    "Gene Expression Patterns": "Gene Expression Patterns",
    "Gene Therapy": "Gene Ther.",
    "Gene Therapy and Regulation": "Gene Ther. Regul.",
    "General and Comparative Endocrinology": "Gen. Comp. Endocrinol.",
    "General Pharmacology": "Gen. Pharmacol.",
    "General Physiology and Biophysics": "Gen. Physiol. Biophys.",
    "Genes & Development": "Genes Dev.",
    "Genes to Cells": "Genes Cells",
    "Genetics": "Genetics",
    "Genetika (Moscow)": "Genetika (Moscow)",
    "Genome Letters": "Genome Lett.",
    "Genome Research": "Genome Res.",
    "Genomics": "Genomics",
    "Genshikaku Kenkyu": "Genshikaku Kenkyu",
    "Geochemical Journal": "Geochem. J.",
    "Geochimica et Cosmochimica Acta": "Geochim. Cosmochim. Acta",
    "Geokhimiya": "Geokhimiya",
    "Geologiya i Geofizika": "Geol. Geofiz.",
    "Geomagnetizm i Aeronomiya": "Geomagn. Aeron.",
    "Geophysical Research Letters": "Geophys. Res. Lett.",
    "Gewaesserschutz, Wasser, Abwasser": "Gewaesserschutz, Wasser, Abwasser",
    "Gidrokhimicheskie Materialy": "Gidrokhim. Mat.",
    "Gigiena i Sanitariya": "Gig. Sanit.",
    "Gigiena Truda i Professional\'nye Zabolevaniya": "Gig. Tr. Prof. Zabol.",
    "Glass Physics and Chemistry (Translation of Fizika i Khimiya Stekla)": "Glass Phys. Chem.",
    "Glass Science and Technology (Offenbach, Germany)": "Glass Sci. Technol. (Offenbach, Ger.)",
    "Glass Technology": "Glass Technol.",
    "Global Biogeochemical Cycles": "Global Biogeochem. Cycles",
    "Glycobiology": "Glycobiology",
    "Glycoconjugate Journal": "Glycoconjugate J.",
    "Godishnik na Visshiya Khimiko-Tekhnologicheski Institut, Sofiya": "God. Vissh. Khim.-Tekhnol. Inst., Sofia",
    "Gongneng Gaofenzi Xuebao": "Gongneng Gaofenzi Xuebao",
    "Grasas y Aceites (Seville)": "Grasas Aceites (Seville)",
    "Ground Water": "Ground Water",
    "Growth Factors": "Growth Factors",
    "Guangpuxue Yu Guangpu Fenxi": "Guangpuxue Yu Guangpu Fenxi",
    "Guangxue Xuebao": "Guangxue Xuebao",
    "Guijinshu": "Guijinshu",
    "Guisuanyan Xuebao": "Guisuanyan Xuebao",
    "Guocheng Gongcheng Xuebao": "Guocheng Gongcheng Xuebao",
    "Han\'guk Saenghwa Hakhoechi": "Han\'guk Saenghwa Hakhoechi",
    "Han\'guk T\'oyang Piryo Hakhoechi": "Han\'guk T\'oyang Piryo Hakhoechi",
    "Health Physics": "Health Phys.",
    "Heat Transfer Engineering": "Heat Transfer Eng.",
    "Hecheng Xiangjiao Gongye": "Hecheng Xiangjiao Gongye",
    "Hejishu": "Hejishu",
    "Helvetica Chimica Acta": "Helv. Chim. Acta",
    "Hemoglobin": "Hemoglobin",
    "Heteroatom Chemistry": "Heteroat. Chem.",
    "Heterocycles": "Heterocycles",
    "Heterocyclic Communications": "Heterocycl. Commun.",
    "High Energy Chemistry (Translation of Khimiya Vysokikh Energii)": "High Energy Chem.",
    "High Performance Polymers": "High Perform. Polym.",
    "High Temperature (Translation of Teplofizika Vysokikh Temperatur)": "High Temp.",
    "High Temperature Materials and Processes (London)": "High Temp. Mater. Processes (London)",
    "High Temperatures - High Pressures": "High Temp. - High Pressures",
    "Histochemical Journal": "Histochem. J.",
    "Histochemistry": "Histochemistry",
    "Histochemistry and Cell Biology": "Histochem. Cell Biol.",
    "Holzforschung": "Holzforschung",
    "Hormone and Metabolic Research": "Horm. Metab. Res.",
    "Hormone Research": "Horm. Res.",
    "HortScience": "HortScience",
    "Horumon to Rinsho": "Horumon to Rinsho",
    "HTD (American Society of Mechanical Engineers)": "HTD (Am. Soc. Mech. Eng.)",
    "Huadong Huagong Xueyuan Xuebao": "Huadong Huagong Xueyuan Xuebao",
    "Huadong Ligong Daxue Xuebao": "Huadong Ligong Daxue Xuebao",
    "Huagong Xuebao (Chinese Edition)": "Huagong Xuebao (Chin. Ed.)",
    "Huanjing Huaxue": "Huanjing Huaxue",
    "Huanjing Kexue": "Huanjing Kexue",
    "Huanjing Kexue Xuebao": "Huanjing Kexue Xuebao",
    "Huaxue": "Huaxue",
    "Huaxue Fanying Gongcheng Yu Gongyi": "Huaxue Fanying Gongcheng Yu Gongyi",
    "Huaxue Shiji": "Huaxue Shiji",
    "Huaxue Shijie": "Huaxue Shijie",
    "Huaxue Tongbao": "Huaxue Tongbao",
    "Huaxue Wuli Xuebao": "Huaxue Wuli Xuebao",
    "Huaxue Xuebao": "Huaxue Xuebao",
    "Human Gene Therapy": "Hum. Gene Ther.",
    "Human Genetics": "Hum. Genet.",
    "Human Molecular Genetics": "Hum. Mol. Genet.",
    "Human Reproduction": "Hum. Reprod.",
    "Hungarian Journal of Industrial Chemistry": "Hung. J. Ind. Chem.",
    "Hutnicke Listy": "Hutn. Listy",
    "Hwahak Konghak": "Hwahak Konghak",
    "Hwahak Kwa Kongop Ui Chinbo": "Hwahak Kwa Kongop Ui Chinbo",
    "Hydrobiologia": "Hydrobiologia",
    "Hydrometallurgy": "Hydrometallurgy",
    "Hyomen Gijutsu": "Hyomen Gijutsu",
    "Hyperfine Interactions": "Hyperfine Interact.",
    "Hypertension": "Hypertension",
    "Hypertension (Dallas)": "Hypertension (Dallas)",
    "IARC Scientific Publications": "IARC Sci. Publ.",
    "Icarus": "Icarus",
    "ICSU Short Reports": "ICSU Short Rep.",
    "IEEE Electron Device Letters": "IEEE Electron Device Lett.",
    "IEEE Journal of Quantum Electronics": "IEEE J. Quantum Electron.",
    "IEEE Journal of Selected Topics in Quantum Electronics": "IEEE J. Sel. Top. Quantum Electron.",
    "IEEE Transactions on Electrical Insulation": "IEEE Trans. Electr. Insul.",
    "IEEE Transactions on Electron Devices": "IEEE Trans. Electron Devices",
    "IEEE Transactions on Industry Applications": "IEEE Trans. Ind. Appl.",
    "IEEE Transactions on Magnetics": "IEEE Trans. Magn.",
    "IEEE Transactions on Nuclear Science": "IEEE Trans. Nucl. Sci.",
    "Igaku no Ayumi": "Igaku no Ayumi",
    "ILAR Journal": "ILAR J.",
    "Immunity": "Immunity",
    "Immunogenetics": "Immunogenetics",
    "Immunology": "Immunology",
    "Immunology Letters": "Immunol. Lett.",
    "Immunology Today": "Immunol. Today",
    "Indian Chemical Engineer": "Indian Chem. Eng.",
    "Indian Drugs": "Indian Drugs",
    "Indian Journal of Agricultural Chemistry": "Indian J. Agric. Chem.",
    "Indian Journal of Biochemistry & Biophysics": "Indian J. Biochem. Biophys.",
    "Indian Journal of Chemical Technology": "Indian J. Chem. Technol.",
    "Indian Journal of Chemistry, Section A: Inorganic, Bio-inorganic, Physical, Theoretical & Analytical Chemistry": "Indian J. Chem., Sect. A: Inorg., Bio-inorg., Phys., Theor. Anal. Chem.",
    "Indian Journal of Chemistry, Section B: Organic Chemistry Including Medicinal Chemistry": "Indian J. Chem., Sect. B: Org. Chem. Incl. Med. Chem.",
    "Indian Journal of Environmental Health": "Indian J. Environ. Health",
    "Indian Journal of Environmental Protection": "Indian J. Environ. Prot.",
    "Indian Journal of Experimental Biology": "Indian J. Exp. Biol.",
    "Indian Journal of Fibre & Textile Research": "Indian J. Fibre Text. Res.",
    "Indian Journal of Heterocyclic Chemistry": "Indian J. Heterocycl. Chem.",
    "Indian Journal of Physics, A": "Indian J. Phys., A",
    "Indian Journal of Physics, B": "Indian J. Phys., B",
    "Indian Journal of Pure and Applied Physics": "Indian J. Pure Appl. Phys.",
    "Indian Journal of Technology": "Indian J. Technol.",
    "Industrial & Engineering Chemistry Research": "Ind. Eng. Chem. Res.",
    "Infection and Immunity": "Infect. Immun.",
    "Inflammation Research": "Inflammation Res.",
    "Infrared Physics": "Infrared Phys.",
    "Ingenieria Quimica (Madrid)": "Ing. Quim. (Madrid)",
    "Inhalation Toxicology": "Inhalation Toxicol.",
    "Inorganic Chemistry": "Inorg. Chem.",
    "Inorganic Chemistry Communications": "Inorg. Chem. Commun.",
    "Inorganic Materials (Translation of Neorganicheskie Materialy)": "Inorg. Mater.",
    "Inorganic Reaction Mechanisms (Philadelphia, PA, United States)": "Inorg. React. Mech. (Philadelphia, PA, U. S.)",
    "Inorganic Syntheses": "Inorg. Synth.",
    "Inorganica Chimica Acta": "Inorg. Chim. Acta",
    "Insect Biochemistry and Molecular Biology": "Insect Biochem. Mol. Biol.",
    "Insect Molecular Biology": "Insect Mol. Biol.",
    "Institute of Physics Conference Series": "Inst. Phys. Conf. Ser.",
    "Institution of Chemical Engineers Symposium Series": "Inst. Chem. Eng. Symp. Ser.",
    "Intermetallics": "Intermetallics",
    "International Annual Conference of ICT": "Int. Annu. Conf. ICT",
    "International Archives of Allergy and Immunology": "Int. Arch. Allergy Appl. Immunol.",
    "International Congress Series - Excerpta Medica": "Int. Congr. Ser. - Excerpta Med.",
    "International Corrosion Conference Series": "Int. Corros. Conf. Ser.",
    "International DATA Series, Selected Data on Mixtures, Series A: Thermodynamic Properties of Non-Reacting Binary Systems of Organic Substances": "Int. DATA Ser., Sel. Data Mixtures, Ser. A",
    "International Immunology": "Int. Immunol.",
    "International Immunopharmacology": "Int. Immunopharmacol.",
    "International Journal for Vitamin and Nutrition Research": "Int. J. Vitam. Nutr. Res.",
    "International Journal of Adhesion and Adhesives": "Int. J. Adhes. Adhes.",
    "International Journal of Antimicrobial Agents": "Int. J. Antimicrob. Agents",
    "International Journal of Applied Ceramic Technology": "Int. J. Appl. Ceram. Technol.",
    "International Journal of Biochemistry": "Int. J. Biochem.",
    "International Journal of Biochemistry & Cell Biology": "Int. J. Biochem. Cell Biol.",
    "International Journal of Biological Macromolecules": "Int. J. Biol. Macromol.",
    "International Journal of Cancer": "Int. J. Cancer",
    "International Journal of Chemical Kinetics": "Int. J. Chem. Kinet.",
    "International Journal of Chemistry": "Int. J. Chem.",
    "International Journal of Coal Geology": "Int. J. Coal Geol.",
    "International Journal of Environment and Pollution": "Int. J. Environ. Pollut.",
    "International Journal of Environmental Analytical Chemistry": "Int. J. Environ. Anal. Chem.",
    "International Journal of Food Science and Technology": "Int. J. Food Sci. Technol.",
    "International Journal of Heat and Mass Transfer": "Int. J. Heat Mass Transfer",
    "International Journal of Hydrogen Energy": "Int. J. Hydrogen Energy",
    "International Journal of Immunopharmacology": "Int. J. Immunopharmacol.",
    "International Journal of Infrared and Millimeter Waves": "Int. J. Infrared Millimeter Waves",
    "International Journal of Mass Spectrometry": "Int. J. Mass Spectrom.",
    "International Journal of Mass Spectrometry and Ion Processes": "Int. J. Mass Spectrom. Ion Processes",
    "International Journal of Mineral Processing": "Int. J. Miner. Process.",
    "International Journal of Multiphase Flow": "Int. J. Multiphase Flow",
    "International Journal of Non-Equilibrium Processing": "Int. J. Non-Equilib. Process.",
    "International Journal of Peptide and Protein Research": "Int. J. Pept. Protein Res.",
    "International Journal of Pharmaceutics": "Int. J. Pharm.",
    "International Journal of PIXE": "Int. J. PIXE",
    "International Journal of Polymer Analysis and Characterization": "Int. J. Polym. Anal. Charact.",
    "International Journal of Polymeric Materials": "Int. J. Polym. Mater.",
    "International Journal of Powder Metallurgy (Princeton, New Jersey)": "Int. J. Powder Metall. (Princeton, N. J.)",
    "International Journal of Quantum Chemistry": "Int. J. Quantum Chem.",
    "International Journal of Radiation Biology": "Int. J. Radiat. Biol.",
    "International Journal of Radiation Oncology, Biology, Physics": "Int. J. Radiat. Oncol., Biol., Phys.",
    "International Journal of Refractory Metals & Hard Materials": "Int. J. Refract. Met. Hard Mater.",
    "International Journal of Thermophysics": "Int. J. Thermophys.",
    "International Materials Reviews": "Int. Mater. Rev.",
    "International Polymer Processing": "Int. Polym. Process.",
    "International Reviews in Physical Chemistry": "Int. Rev. Phys. Chem.",
    "International SAMPE Symposium and Exhibition": "Int. SAMPE Symp. Exhib.",
    "Investigational New Drugs": "Invest. New Drugs",
    "Inzhenerno-Fizicheskii Zhurnal": "Inzh.-Fiz. Zh.",
    "Ion Exchange and Solvent Extraction": "Ion Exch. Solvent Extr.",
    "Ionics": "Ionics",
    "Ironmaking and Steelmaking": "Ironmaking Steelmaking",
    "ISIJ International": "ISIJ Int.",
    "Isotopenpraxis": "Isotopenpraxis",
    "Isotopes in Environmental and Health Studies": "Isot. Environ. Health Stud.",
    "Israel Journal of Chemistry": "Isr. J. Chem.",
    "Italian Journal of Biochemistry": "Ital. J. Biochem.",
    "IUBMB Life": "IUBMB Life",
    "Iyakuhin Kenkyu": "Iyakuhin Kenkyu",
    "Izmeritel\'naya Tekhnika": "Izmer. Tekh.",
    "Izvestiya Akademii Nauk Gruzii, Seriya Khimicheskaya": "Izv. Akad. Nauk Gruz. SSR, Ser. Khim.",
    "Izvestiya Akademii Nauk Respubliki Kazakhstan, Seriya Khimicheskaya": "Izv. Akad. Nauk Kaz. SSR, Ser. Khim.",
    "Izvestiya Akademii Nauk, Seriya Fizicheskaya": "Izv. Akad. Nauk, Ser. Fiz.",
    "Izvestiya Akademii Nauk, Seriya Geologicheskaya": "Izv. Akad. Nauk SSSR, Ser. Geol.",
    "Izvestiya Natsional\'noi Akademii Nauk Respubliki Kazakhstan, Seriya Khimicheskaya": "Izv. Nats. Akad. Nauk Resp. Kaz., Ser. Khim.",
    "Izvestiya Vysshikh Uchebnykh Zavedenii, Chernaya Metallurgiya": "Izv. Vyssh. Uchebn. Zaved., Chern. Metall.",
    "Izvestiya Vysshikh Uchebnykh Zavedenii, Fizika": "Izv. Vyssh. Uchebn. Zaved., Fiz.",
    "Izvestiya Vysshikh Uchebnykh Zavedenii, Khimiya i Khimicheskaya Tekhnologiya": "Izv. Vyssh. Uchebn. Zaved., Khim. Khim. Tekhnol.",
    "Izvestiya Vysshikh Uchebnykh Zavedenii, Tsvetnaya Metallurgiya": "Izv. Vyssh. Uchebn. Zaved., Tsvetn. Metall.",
    "JAMA, the Journal of the American Medical Association": "JAMA, J. Am. Med. Assoc.",
    "Japanese Journal of Antibiotics": "Jpn. J. Antibiot.",
    "Japanese Journal of Applied Physics, Part 1: Regular Papers, Short Notes & Review Papers": "Jpn. J. Appl. Phys., Part 1",
    "Japanese Journal of Applied Physics, Part 2: Letters": "Jpn. J. Appl. Phys., Part 2",
    "Japanese Journal of Applied Physics, Part I: Regular Papers and Short Notes": "Jpn. J. Appl. Phys., Part 1",
    "Japanese Journal of Applied Physics, Part II: Letters": "Jpn. J. Appl. Phys., Part 2",
    "Japanese Journal of Cancer Research": "Jpn. J. Cancer Res.",
    "Japanese Journal of Pharmacology": "Jpn. J. Pharmacol.",
    "JBIC, Journal of Biological Inorganic Chemistry": "JBIC, J. Biol. Inorg. Chem.",
    "JCT Research": "JCT Res.",
    "JETP Letters (Translation of Pis\'ma v Zhurnal Eksperimental\'noi i Teoreticheskoi Fiziki)": "JETP Lett.",
    "Jiegou Huaxue": "Jiegou Huaxue",
    "Jinshu Rechuli": "Jinshu Rechuli",
    "Jinshu Xuebao": "Jinshu Xuebao",
    "Jisuanji Yu Yingyong Huaxue": "Jisuanji Yu Yingyong Huaxue",
    "Journal - American Water Works Association": "J. - Am. Water Works Assoc.",
    "Journal de Chimie Physique et de Physico-Chimie Biologique": "J. Chim. Phys. Phys.-Chim. Biol.",
    "Journal de Pharmacie de Belgique": "J. Pharm. Belg.",
    "Journal de Physique II: Atomic, Molecular and Cluster Physics, Chemical Physics, Mechanics and Hydrodynamics": "J. Phys. II",
    "Journal de Physique III: Applied Physics, Materials Science, Fluids, Plasma and Instrumentation": "J. Phys. III",
    "Journal de Physique IV": "J. Phys. IV",
    "Journal fuer Praktische Chemie/Chemiker-Zeitung": "J. Prakt. Chem.",
    "Journal of Adhesion": "J. Adhes.",
    "Journal of Adhesion Science and Technology": "J. Adhes. Sci. Technol.",
    "Journal of Aerosol Science": "J. Aerosol Sci.",
    "Journal of Agricultural and Food Chemistry": "J. Agric. Food Chem.",
    "Journal of Alloys and Compounds": "J. Alloys Compd.",
    "Journal of Analytical and Applied Pyrolysis": "J. Anal. Appl. Pyrolysis",
    "Journal of Analytical Atomic Spectrometry": "J. Anal. At. Spectrom.",
    "Journal of Analytical Chemistry (Translation of Zhurnal Analiticheskoi Khimii)": "J. Anal. Chem.",
    "Journal of Analytical Toxicology": "J. Anal. Toxicol.",
    "Journal of Animal Science": "J. Anim. Sci.",
    "Journal of Animal Science (Savoy, IL, United States)": "J. Anim. Sci. (Savoy, IL, U. S.)",
    "Journal of Antibiotics": "J. Antibiot.",
    "Journal of Antimicrobial Chemotherapy": "J. Antimicrob. Chemother.",
    "Journal of AOAC International": "J. AOAC Int.",
    "Journal of Appled Electrochemistry": "J. Appl. Electrochem.",
    "Journal of Applied Animal Welfare Science": "J. Appl. Anim. Welfare Sci.",
    "Journal of Applied Crystallography": "J. Appl. Crystallogr.",
    "Journal of Applied Electrochemistry": "J. Appl. Electrochem.",
    "Journal of Applied Physics": "J. Appl. Phys.",
    "Journal of Applied Physiology": "J. Appl. Physiol.",
    "Journal of Applied Polymer Science": "J. Appl. Polym. Sci.",
    "Journal of Applied Polymer Science: Applied Polymer Symposium": "J. Appl. Polym. Sci.: Appl. Polym. Symp.",
    "Journal of Applied Spectroscopy (Translation of Zhurnal Prikladnoi Spektroskopii)": "J. Appl. Spectrosc.",
    "Journal of Applied Toxicology": "J. Appl. Toxicol.",
    "Journal of Atmospheric Chemistry": "J. Atmos. Chem.",
    "Journal of Automated Methods & Management in Chemistry": "J. Autom. Methods Manage. Chem.",
    "Journal of Bacteriology": "J. Bacteriol.",
    "Journal of Basic Microbiology": "J. Basic Microbiol.",
    "Journal of Biochemical and Biophysical Methods": "J. Biochem. Biophys. Methods",
    "Journal of Biochemical and Molecular Toxicology": "J. Biochem. Mol. Toxicol.",
    "Journal of Biochemistry (Tokyo)": "J. Biochem. (Tokyo)",
    "Journal of Biochemistry and Molecular Biology": "J. Biochem. Mol. Biol.",
    "Journal of Bioenergetics and Biomembranes": "J. Bioenerg. Biomembr.",
    "Journal of Biological Chemistry": "J. Biol. Chem.",
    "Journal of Biomaterials Science, Polymer Edition": "J. Biomater. Sci., Polym. Ed.",
    "Journal of Biomedical Materials Research, Part A": "J. Biomed. Mater. Res., Part A",
    "Journal of Biomedical Materials Research, Part B: Applied Biomaterials": "J. Biomed. Mater. Res., Part B",
    "Journal of Biomolecular NMR": "J. Biomol. NMR",
    "Journal of Biomolecular Structure & Dynamics": "J. Biomol. Struct. Dyn.",
    "Journal of Bioscience and Bioengineering": "J. Biosci. Bioeng.",
    "Journal of Biosciences": "J. Biosci.",
    "Journal of Biotechnology": "J. Biotechnol.",
    "Journal of Bone and Mineral Research": "J. Bone Miner. Res.",
    "Journal of Capillary Electrophoresis and Microchip Technology": "J. Capillary Electrophor. Microchip Technol.",
    "Journal of Carbohydrate Chemistry": "J. Carbohydr. Chem.",
    "Journal of Cardiovascular Pharmacology": "J. Cardiovasc. Pharmacol.",
    "Journal of Catalysis": "J. Catal.",
    "Journal of Cell Biology": "J. Cell Biol.",
    "Journal of Cell Science": "J. Cell Sci.",
    "Journal of Cellular Biochemistry": "J. Cell. Biochem.",
    "Journal of Cellular Physiology": "J. Cell. Physiol.",
    "Journal of Chemical and Engineering Data": "J. Chem. Eng. Data",
    "Journal of Chemical Crystallography": "J. Chem. Crystallogr.",
    "Journal of Chemical Ecology": "J. Chem. Ecol.",
    "Journal of Chemical Education": "J. Chem. Educ.",
    "Journal of Chemical Engineering of Japan": "J. Chem. Eng. Jpn.",
    "Journal of Chemical Information and Computer Sciences": "J. Chem. Inf. Comput. Sci.",
    "Journal of Chemical Physics": "J. Chem. Phys.",
    "Journal of Chemical Research, Synopses": "J. Chem. Res., Synop.",
    "Journal of Chemical Technology and Biotechnology": "J. Chem. Technol. Biotechnol.",
    "Journal of Chemical Thermodynamics": "J. Chem. Thermodyn.",
    "Journal of Chemometrics": "J. Chemom.",
    "Journal of Chromatographic Science": "J. Chromatogr. Sci.",
    "Journal of Chromatography": "J. Chromatogr.",
    "Journal of Chromatography, A": "J. Chromatogr., A",
    "Journal of Chromatography, B: Analytical Technologies in the Biomedical and Life Sciences": "J. Chromatogr., B: Anal. Technol. Biomed. Life Sci.",
    "Journal of Clinical Endocrinology and Metabolism": "J. Clin. Endocrinol. Metab.",
    "Journal of Clinical Investigation": "J. Clin. Invest.",
    "Journal of Clinical Microbiology": "J. Clin. Microbiol.",
    "Journal of Cluster Science": "J. Cluster Sci.",
    "Journal of Colloid and Interface Science": "J. Colloid Interface Sci.",
    "Journal of Combinatorial Chemistry": "J. Comb. Chem.",
    "Journal of Comparative Neurology": "J. Comp. Neurol.",
    "Journal of Computational Biology": "J. Comput. Biol.",
    "Journal of Computational Chemistry": "J. Comput. Chem.",
    "Journal of Computational Physics": "J. Comput. Phys.",
    "Journal of Computer Chemistry, Japan": "J. Comput. Chem., Jpn.",
    "Journal of Computer-Aided Molecular Design": "J. Comput.-Aided Mol. Des.",
    "Journal of Contaminant Hydrology": "J. Contam. Hydrol.",
    "Journal of Controlled Release": "J. Controlled Release",
    "Journal of Coordination Chemistry": "J. Coord. Chem.",
    "Journal of Crystal Growth": "J. Cryst. Growth",
    "Journal of Crystallographic and Spectroscopic Research": "J. Crystallogr. Spectrosc. Res.",
    "Journal of Dairy Research": "J. Dairy Res.",
    "Journal of Dairy Science": "J. Dairy Sci.",
    "Journal of Dental Research": "J. Dent. Res.",
    "Journal of Dispersion Science and Technology": "J. Dispersion Sci. Technol.",
    "Journal of Drug Targeting": "J. Drug Targeting",
    "Journal of Economic Entomology": "J. Econ. Entomol.",
    "Journal of Electroanalytical Chemistry": "J. Electroanal. Chem.",
    "Journal of Electron Spectroscopy and related Phenomena": "J. Electron Spectrosc. Relat. Phenom.",
    "Journal of Electronic Materials": "J. Electron. Mater.",
    "Journal of Endocrinology": "J. Endocrinol.",
    "Journal of Energetic Materials": "J. Energ. Mater.",
    "Journal of Environmental Engineering (Reston, VA, United States)": "J. Environ. Eng. (Reston, VA, U. S.)",
    "Journal of Environmental Monitoring": "J. Environ. Monit.",
    "Journal of Environmental Quality": "J. Environ. Qual.",
    "Journal of Environmental Radioactivity": "J. Environ. Radioact.",
    "Journal of Environmental Science and Health, Part A: Environmental Science and Engineering": "J. Environ. Sci. Health, Part A",
    "Journal of Environmental Science and Health, Part A: Toxic/Hazardous Substances & Environmental Engineering": "J. Environ. Sci. Health, Part A: Toxic/Hazard. Subst. Environ. Eng.",
    "Journal of Environmental Science and Health, Part B: Pesticides, Food Contaminants, and Agricultural Wastes": "J. Environ. Sci. Health, Part B",
    "Journal of Enzyme Inhibition and Medicinal Chemistry": "J. Enzyme Inhib. Med. Chem.",
    "Journal of Experimental and Theoretical Physics (Translation of Zhurnal Eksperimental\'noi i Teoreticheskoi Fiziki)": "J. Exp. Theor. Phys.",
    "Journal of Experimental Animal Science": "J. Exp. Anim. Sci.",
    "Journal of Experimental Biology": "J. Exp. Biol.",
    "Journal of Experimental Botany": "J. Exp. Bot.",
    "Journal of Experimental Medicine": "J. Exp. Med.",
    "Journal of Experimental Zoology": "J. Exp. Zool.",
    "Journal of Fermentation and Bioengineering": "J. Ferment. Bioeng.",
    "Journal of Fluid Mechanics": "J. Fluid Mech.",
    "Journal of Fluorine Chemistry": "J. Fluorine Chem.",
    "Journal of Food Protection": "J. Food Prot.",
    "Journal of Food Science": "J. Food Sci.",
    "Journal of Fusion Energy": "J. Fusion Energy",
    "Journal of General and Applied Microbiology": "J. Gen. Appl. Microbiol.",
    "Journal of General Microbiology": "J. Gen. Microbiol.",
    "Journal of General Virology": "J. Gen. Virol.",
    "Journal of Geochemical Exploration": "J. Geochem. Explor.",
    "Journal of Geophysical Research, [Atmospheres]": "J. Geophys. Res., [Atmos.]",
    "Journal of Hazardous Materials": "J. Hazard. Mater.",
    "Journal of Heat Transfer": "J. Heat Transfer",
    "Journal of Heterocyclic Chemistry": "J. Heterocycl. Chem.",
    "Journal of High Resolution Chromatography": "J. High Resolut. Chromatogr.",
    "Journal of Histochemistry and Cytochemistry": "J. Histochem. Cytochem.",
    "Journal of Hypertension": "J. Hypertens.",
    "Journal of Imaging Science and Technology": "J. Imaging Sci. Technol.",
    "Journal of Immunoassay & Immunochemistry": "J. Immunoassay Immunochem.",
    "Journal of Immunological Methods": "J. Immunol. Methods",
    "Journal of Immunology": "J. Immunol.",
    "Journal of Inclusion Phenomena and Macrocyclic Chemistry": "J. Inclusion Phenom. Macrocyclic Chem.",
    "Journal of Inclusion Phenomena and Molecular Recognition in Chemistry": "J. Inclusion Phenom.",
    "Journal of Industrial and Engineering Chemistry (Seoul, Republic of Korea)": "J. Ind. Eng. Chem. (Seoul, Repub. Korea)",
    "Journal of Industrial Microbiology & Biotechnology": "J. Ind. Microbiol. Biotechnol.",
    "Journal of Infectious Diseases": "J. Infect. Dis.",
    "Journal of Inorganic and Organometallic Polymers": "J. Inorg. Organomet. Polym.",
    "Journal of Inorganic Biochemistry": "J. Inorg. Biochem.",
    "Journal of Insect Physiology": "J. Insect Physiol.",
    "Journal of Interferon and Cytokine Research": "J. Interferon Cytokine Res.",
    "Journal of Interferon Research": "J. Interferon Res.",
    "Journal of Investigative Dermatology": "J. Invest. Dermatol.",
    "Journal of Labelled Compounds & Radiopharmaceuticals": "J. Labelled Compd. Radiopharm.",
    "Journal of Laboratory and Clinical Medicine": "J. Lab. Clin. Med.",
    "Journal of Leukocyte Biology": "J. Leukocyte Biol.",
    "Journal of Lightwave Technology": "J. Lightwave Technol.",
    "Journal of Lipid Research": "J. Lipid Res.",
    "Journal of Liquid Chromatography": "J. Liq. Chromatogr.",
    "Journal of Liquid Chromatography & Related Technologies": "J. Liq. Chromatogr. Relat. Technol.",
    "Journal of Low Temperature Physics": "J. Low Temp. Phys.",
    "Journal of Luminescence": "J. Lumin.",
    "Journal of Macromolecular Science, Physics": "J. Macromol. Sci., Phys.",
    "Journal of Macromolecular Science, Polymer Reviews": "J. Macromol. Sci., Polym. Rev.",
    "Journal of Macromolecular Science, Pure and Applied Chemistry": "J. Macromol. Sci., Pure Appl. Chem.",
    "Journal of Magnetic Resonance": "J. Magn. Reson.",
    "Journal of Magnetism and Magnetic Materials": "J. Magn. Magn. Mater.",
    "Journal of Mass Spectrometry": "J. Mass Spectrom.",
    "Journal of Materials Chemistry": "J. Mater. Chem.",
    "Journal of Materials Engineering and Performance": "J. Mater. Eng. Perform.",
    "Journal of Materials Research": "J. Mater. Res.",
    "Journal of Materials Science": "J. Mater. Sci.",
    "Journal of Materials Science Letters": "J. Mater. Sci. Lett.",
    "Journal of Materials Science: Materials in Electronics": "J. Mater. Sci.: Mater. Electron.",
    "Journal of Materials Science: Materials in Medicine": "J. Mater. Sci.: Mater. Med.",
    "Journal of Mathematical Chemistry": "J. Math. Chem.",
    "Journal of Medical Microbiology": "J. Med. Microbiol.",
    "Journal of Medicinal Chemistry": "J. Med. Chem.",
    "Journal of Membrane Biology": "J. Membr. Biol.",
    "Journal of Membrane Science": "J. Membr. Sci.",
    "Journal of Microencapsulation": "J. Microencapsulation",
    "Journal of Modern Optics": "J. Mod. Opt.",
    "Journal of Molecular and Cellular Cardiology": "J. Mol. Cell. Cardiol.",
    "Journal of Molecular Biology": "J. Mol. Biol.",
    "Journal of Molecular Catalysis": "J. Mol. Catal.",
    "Journal of Molecular Catalysis A: Chemical": "J. Mol. Catal. A: Chem.",
    "Journal of Molecular Catalysis B: Enzymatic": "J. Mol. Catal. B: Enzym.",
    "Journal of Molecular Endocrinology": "J. Mol. Endocrinol.",
    "Journal of Molecular Evolution": "J. Mol. Evol.",
    "Journal of Molecular Graphics & Modelling": "J. Mol. Graphics Modell.",
    "Journal of Molecular Liquids": "J. Mol. Liq.",
    "Journal of Molecular Microbiology and Biotechnology": "J. Mol. Microbiol. Biotechnol.",
    "Journal of Molecular Neuroscience": "J. Mol. Neurosci.",
    "Journal of Molecular Recognition": "J. Mol. Recognit.",
    "Journal of Molecular Spectroscopy": "J. Mol. Spectrosc.",
    "Journal of Molecular Structure": "J. Mol. Struct.",
    "Journal of Nanoscience and Nanotechnology": "J. Nanosci. Nanotechnol.",
    "Journal of Natural Gas Chemistry": "J. Nat. Gas Chem.",
    "Journal of Natural Products": "J. Nat. Prod.",
    "Journal of Near Infrared Spectroscopy": "J. Near Infrared Spectrosc.",
    "Journal of Neural Transmission: General Section": "J. Neural Transm.: Gen. Sect.",
    "Journal of Neurochemistry": "J. Neurochem.",
    "Journal of Neuroendocrinology": "J. Neuroendocrinol.",
    "Journal of Neuroimmunology": "J. Neuroimmunol.",
    "Journal of Neurophysiology": "J. Neurophysiol.",
    "Journal of Neuroscience": "J. Neurosci.",
    "Journal of Neuroscience Research": "J. Neurosci. Res.",
    "Journal of Non-Crystalline Solids": "J. Non-Cryst. Solids",
    "Journal of Non-Newtonian Fluid Mechanics": "J. Non-Newtonian Fluid Mech.",
    "Journal of Nuclear Materials": "J. Nucl. Mater.",
    "Journal of Nuclear Science and Technology": "J. Nucl. Sci. Technol.",
    "Journal of Nuclear Science and Technology (Tokyo)": "J. Nucl. Sci. Technol. (Tokyo)",
    "Journal of Nutrition": "J. Nutr.",
    "Journal of Nutritional Biochemistry": "J. Nutr. Biochem.",
    "Journal of Nutritional Science and Vitaminology": "J. Nutr. Sci. Vitaminol.",
    "Journal of Ocular Pharmacology and Therapeutics": "J. Ocul. Pharmacol. Ther.",
    "Journal of Oleo Science": "J. Oleo Sci.",
    "Journal of Organic Chemistry": "J. Org. Chem.",
    "Journal of Organometallic Chemistry": "J. Organomet. Chem.",
    "Journal of Peptide Research": "J. Pept. Res.",
    "Journal of Peptide Science": "J. Pept. Sci.",
    "Journal of Petroleum Science & Engineering": "J. Pet. Sci. Eng.",
    "Journal of Petrology": "J. Petrol.",
    "Journal of Pharmaceutical and Biomedical Analysis": "J. Pharm. Biomed. Anal.",
    "Journal of Pharmaceutical Sciences": "J. Pharm. Sci.",
    "Journal of Pharmacobio-Dynamics": "J. Pharmacobio-Dyn.",
    "Journal of Pharmacokinetics and Biopharmaceutics": "J. Pharmacokinet. Biopharm.",
    "Journal of Pharmacological and Toxicological Methods": "J. Pharmacol. Toxicol. Methods",
    "Journal of Pharmacological Sciences (Tokyo)": "J. Pharmacol. Sci. (Tokyo)",
    "Journal of Pharmacology and Experimental Therapeutics": "J. Pharmacol. Exp. Ther.",
    "Journal of Pharmacy and Pharmacology": "J. Pharm. Pharmacol.",
    "Journal of Phase Equilibria": "J. Phase Equilib.",
    "Journal of Photochemistry and Photobiology, A: Chemistry": "J. Photochem. Photobiol., A",
    "Journal of Photochemistry and Photobiology, B: Biology": "J. Photochem. Photobiol., B",
    "Journal of Photochemistry and Photobiology, C: Photochemistry Reviews": "J. Photochem. Photobiol., C",
    "Journal of Photopolymer Science and Technology": "J. Photopolym. Sci. Technol.",
    "Journal of Physical and Chemical Reference Data": "J. Phys. Chem. Ref. Data",
    "Journal of Physical Chemistry": "J. Phys. Chem.",
    "Journal of Physical Chemistry A": "J. Phys. Chem. A",
    "Journal of Physical Chemistry B": "J. Phys. Chem. B",
    "Journal of Physical Organic Chemistry": "J. Phys. Org. Chem.",
    "Journal of Physics A: Mathematical and General": "J. Phys. A: Math. Gen.",
    "Journal of Physics and Chemistry of Solids": "J. Phys. Chem. Solids",
    "Journal of Physics B: Atomic, Molecular and Optical Physics": "J. Phys. B: At., Mol. Opt. Phys.",
    "Journal of Physics D: Applied Physics": "J. Phys. D: Appl. Phys.",
    "Journal of Physics G: Nuclear and Particle Physics": "J. Phys. G: Nucl. Part. Phys.",
    "Journal of Physics: Condensed Matter": "J. Phys.: Condens. Matter",
    "Journal of Physiology (London)": "J. Physiol. (London)",
    "Journal of Physiology (Oxford)": "J. Physiol. (Oxford)",
    "Journal of Pineal Research": "J. Pineal Res.",
    "Journal of Planar Chromatography--Modern TLC": "J. Planar Chromatogr.--Mod. TLC",
    "Journal of Plant Growth Regulation": "J. Plant Growth Regul.",
    "Journal of Plant Nutrition": "J. Plant Nutr.",
    "Journal of Plant Nutrition and Soil Science": "J. Plant Nutr. Soil Sci.",
    "Journal of Plant Physiology": "J. Plant Physiol.",
    "Journal of Polymer Materials": "J. Polym. Mater.",
    "Journal of Polymer Research": "J. Polym. Res.",
    "Journal of Polymer Science, Part A: Polymer Chemistry": "J. Polym. Sci., Part A: Polym. Chem.",
    "Journal of Polymer Science, Part B: Polymer Physics": "J. Polym. Sci., Part B: Polym. Phys.",
    "Journal of Polymers and the Environment": "J. Polym. Environ.",
    "Journal of Porphyrins and Phthalocyanines": "J. Porphyrins Phthalocyanines",
    "Journal of Power Sources": "J. Power Sources",
    "Journal of Process Control": "J. Process Control",
    "Journal of Propulsion and Power": "J. Propul. Power",
    "Journal of Protein Chemistry": "J. Protein Chem.",
    "Journal of Proteome Research": "J. Proteome Res.",
    "Journal of Pulp and Paper Science": "J. Pulp Pap. Sci.",
    "Journal of Quantitative Spectroscopy & Radiative Transfer": "J. Quant. Spectrosc. Radiat. Transfer",
    "Journal of Radioanalytical and Nuclear Chemistry": "J. Radioanal. Nucl. Chem.",
    "Journal of Raman Spectroscopy": "J. Raman Spectrosc.",
    "Journal of Receptors and Signal Transduction": "J. Recept. Signal Transduction",
    "Journal of Reinforced Plastics and Composites": "J. Reinf. Plast. Compos.",
    "Journal of Reproduction and Fertility": "J. Reprod. Fertil.",
    "Journal of Rheology (New York)": "J. Rheol.(N.Y.)",
    "Journal of Scientific & Industrial Research": "J. Sci. Ind. Res.",
    "Journal of Separation Science": "J. Sep. Sci.",
    "Journal of Sol-Gel Science and Technology": "J. Sol-Gel Sci. Technol.",
    "Journal of Solid State Chemistry": "J. Solid State Chem.",
    "Journal of Solid State Electrochemistry": "J. Solid State Electrochem.",
    "Journal of Solution Chemistry": "J. Solution Chem.",
    "Journal of Steroid Biochemistry and Molecular Biology": "J. Steroid Biochem. Mol. Biol.",
    "Journal of Structural and Functional Genomics": "J. Struct. Funct. Genomics",
    "Journal of Structural Chemistry (Translation of Zhurnal Strukturnoi Khimii)": "J. Struct. Chem.",
    "Journal of Superconductivity": "J. Supercond.",
    "Journal of Supercritical Fluids": "J. Supercrit. Fluids",
    "Journal of Supramolecular Chemistry": "J. Supramol. Chem.",
    "Journal of Surfactants and Detergents": "J. Surfactants Deterg.",
    "Journal of Surgical Research": "J. Surg. Res.",
    "Journal of the Air & Waste Management Association": "J. Air Waste Manage. Assoc.",
    "Journal of the American Ceramic Society": "J. Am. Ceram. Soc.",
    "Journal of the American Chemical Society": "J. Am. Chem. Soc.",
    "Journal of the American Leather Chemists Association": "J. Am. Leather Chem. Assoc.",
    "Journal of the American Oil Chemists\' Society": "J. Am. Oil Chem. Soc.",
    "Journal of the American Society for Mass Spectrometry": "J. Am. Soc. Mass Spectrom.",
    "Journal of the American Society of Brewing Chemists": "J. Am. Soc. Brew. Chem.",
    "Journal of the Argentine Chemical Society": "J. Argent. Chem. Soc.",
    "Journal of the Association of Public Analysts": "J. Assoc. Public Anal.",
    "Journal of the Brazilian Chemical Society": "J. Braz. Chem. Soc.",
    "Journal of the Ceramic Society of Japan": "J. Ceram. Soc. Jpn.",
    "Journal of the Chemical Society of Pakistan": "J. Chem. Soc. Pak.",
    "Journal of the Chemical Society, Chemical Communications": "J. Chem. Soc., Chem. Commun.",
    "Journal of the Chemical Society, Dalton Transactions: Inorganic Chemistry": "J. Chem. Soc., Dalton Trans.",
    "Journal of the Chemical Society, Faraday Transactions": "J. Chem. Soc., Faraday Trans.",
    "Journal of the Chemical Society, Perkin Transactions 1: Organic and Bio-Organic Chemistry": "J. Chem. Soc., Perkin Trans. 1",
    "Journal of the Chemical Society, Perkin Transactions 2: Physical Organic Chemistry": "J. Chem. Soc., Perkin Trans. 2",
    "Journal of the Chilean Chemical Society": "J. Chil. Chem. Soc.",
    "Journal of the Chinese Chemical Society (Taipei, Taiwan)": "J. Chin. Chem. Soc. (Taipei, Taiwan)",
    "Journal of the Chinese Institute of Chemical Engineers": "J. Chin. Inst. Chem. Eng.",
    "Journal of the Electrochemical Society": "J. Electrochem. Soc.",
    "Journal of the Electrochemical Society of India": "J. Electrochem. Soc. India",
    "Journal of the European Ceramic Society": "J. Eur. Ceram. Soc.",
    "Journal of the Indian Chemical Society": "J. Indian Chem. Soc.",
    "Journal of the Indian Institute of Science": "J. Indian Inst. Sci.",
    "Journal of the Indian Society of Soil Science": "J. Indian Soc. Soil Sci.",
    "Journal of the Institute of Brewing": "J. Inst. Brew.",
    "Journal of the Institute of Energy": "J. Inst. Energy",
    "Journal of the Institution of Chemists (India)": "J. Inst. Chem. (India)",
    "Journal of the Japan Petroleum Institute": "J. Jpn. Pet. Inst.",
    "Journal of the Korean Ceramic Society": "J. Korean Ceram. Soc.",
    "Journal of the Korean Chemical Society": "J. Korean Chem. Soc.",
    "Journal of the National Cancer Institute (1988)": "J. Natl. Cancer Inst.",
    "Journal of the Optical Society of America A: Optics and Image Science": "J. Opt. Soc. Am. A",
    "Journal of the Optical Society of America B: Optical Physics": "J. Opt. Soc. Am. B",
    "Journal of the Physical Society of Japan": "J. Phys. Soc. Jpn.",
    "Journal of the Science of Food and Agriculture": "J. Sci. Food Agric.",
    "Journal of the Serbian Chemical Society": "J. Serb. Chem. Soc.",
    "Journal of the Society of Dyers and Colourists": "J. Soc. Dyers Colour.",
    "Journal of the Society of Inorganic Materials, Japan": "J. Soc. Inorg. Mater., Jpn.",
    "Journal of the Society of Leather Technologists and Chemists": "J. Soc. Leather Technol. Chem.",
    "Journal of Theoretical Biology": "J. Theor. Biol.",
    "Journal of Thermal Analysis": "J. Therm. Anal.",
    "Journal of Thermal Analysis and Calorimetry": "J. Therm. Anal. Calorim.",
    "Journal of Thermophysics and Heat Transfer": "J. Thermophys. Heat Transfer",
    "Journal of Toxicology and Environmental Health": "J. Toxicol. Environ. Health",
    "Journal of Toxicology and Environmental Health, Part A": "J. Toxicol. Environ. Health, Part A",
    "Journal of Toxicology and Environmental Health, Part B: Critical Reviews": "J. Toxicol. Environ. Health, Part B",
    "Journal of Trace and Microprobe Techniques": "J. Trace Microprobe Tech.",
    "Journal of Vacuum Science & Technology, A: Vacuum, Surfaces, and Films": "J. Vac. Sci. Technol., A",
    "Journal of Vacuum Science & Technology, B: Microelectronics and Nanometer Structures--Processing, Measurement, and Phenomena": "J. Vac. Sci. Technol., B: Microelectron. Nanometer Struct.--Process., Meas., Phenom.",
    "Journal of Vacuum Science & Technology, B: Microelectronics Processing and Phenomena": "J. Vac. Sci. Technol., B",
    "Journal of Vinyl & Additive Technology": "J. Vinyl Addit. Technol.",
    "Journal of Virological Methods": "J. Virol. Methods",
    "Journal of Virology": "J. Virol.",
    "Journal of Volcanology and Geothermal Research": "J. Volcanol. Geotherm. Res.",
    "Journal of Wide Bandgap Materials": "J. Wide Bandgap Mater.",
    "Journal of Wood Chemistry and Technology": "J. Wood Chem. Technol.",
    "Kagaku (Kyoto)": "Kagaku (Kyoto)",
    "Kagaku Kogaku": "Kagaku Kogaku",
    "Kagaku Kogaku Ronbunshu": "Kagaku Kogaku Ronbunshu",
    "Kagaku to Seibutsu": "Kagaku to Seibutsu",
    "Kako Gijutsu (Osaka)": "Kako Gijutsu (Osaka)",
    "Kan, Tan, Sui": "Kan, Tan, Sui",
    "Kauchuk i Rezina": "Kauch. Rezina",
    "Kautschuk + Gummi, Kunststoffe": "Kautsch. Gummi, Kunstst.",
    "KEK Proceedings": "KEK Proc.",
    "Kemia - Kemi": "Kem.-Kemi",
    "Kemija u Industriji": "Kem. Ind.",
    "Kemikaru Enjiniyaringu": "Kemikaru Enjiniyaringu",
    "Kemisk Tidskrift": "Kem. Tidskr.",
    "Key Engineering Materials": "Key Eng. Mater.",
    "KGK, Kautschuk Gummi Kunststoffe": "KGK, Kautsch. Gummi Kunstst.",
    "Khimicheskaya Fizika": "Khim. Fiz.",
    "Khimicheskaya Promyshlennost (Moscow)": "Khim. Prom-st. (Moscow)",
    "Khimicheskaya Promyshlennost Segodnya": "Khim. Prom-st. Segodnya",
    "Khimicheskie Volokna": "Khim. Volokna",
    "Khimicheskoe i Neftyanoe Mashinostroenie": "Khim. Neft. Mashinostr.",
    "Khimiko-Farmatsevticheskii Zhurnal": "Khim.-Farm. Zh.",
    "Khimiya Drevesiny": "Khim. Drev.",
    "Khimiya Geterotsiklicheskikh Soedinenii": "Khim. Geterotsikl. Soedin.",
    "Khimiya i Tekhnologiya Topliv i Masel": "Khim. Tekhnol. Topl. Masel",
    "Khimiya i Tekhnologiya Vody": "Khim. Tekhnol. Vody",
    "Khimiya Prirodnykh Soedinenii": "Khim. Prir. Soedin.",
    "Khimiya Tverdogo Topliva (Moscow, Russian Federation)": "Khim. Tverd. Topl. (Moscow, Russ. Fed.)",
    "Khimiya v Interesakh Ustoichivogo Razvitiya": "Khim. Interesakh Ustoich. Razvit.",
    "Khimiya Vysokikh Energii": "Khim. Vys. Energ.",
    "Khimizatsiya Sel\'skogo Khozyaistva": "Khim. Sel\'sk. Khoz.",
    "Kidney International": "Kidney Int.",
    "Kinetics and Catalysis (Translation of Kinetika i Kataliz)": "Kinet. Catal.",
    "Kinetika i Kataliz": "Kinet. Katal.",
    "Kino Zairyo": "Kino Zairyo",
    "Kjemi": "Kjemi",
    "Kobunshi Ronbunshu": "Kobunshi Ronbunshu",
    "Kogyo Zairyo": "Kogyo Zairyo",
    "Koks i Khimiya": "Koks Khim.",
    "Kokuritsu Kogai Kenkyusho Tokubetsu Kenkyu Hokoku": "Kokuritsu Kogai Kenkyusho Kenkyu Hokoku",
    "Kolloidnyi Zhurnal": "Kolloidn. Zh.",
    "Kompleksnoe Ispol\'zovanie Mineral\'nogo Syr\'ya": "Kompleksn. Ispol\'z. Miner. Syr\'ya",
    "Koordinatsionnaya Khimiya": "Koord. Khim.",
    "Korean Journal of Chemical Engineering": "Korean J. Chem. Eng.",
    "Kozhevenno-Obuvnaya Promyshlennost": "Kozh.-Obuvn. Prom-st.",
    "Kratkie Soobshcheniya po Fizike": "Kratk. Soobshch. Fiz.",
    "Kristallografiya": "Kristallografiya",
    "Kunststoffe": "Kunststoffe",
    "Kvantovaya Elektronika (Moscow)": "Kvantovaya Elektron. (Moscow)",
    "Lab on a Chip": "Lab Chip",
    "Laboratory Animals": "Lab. Anim.",
    "Laboratory Investigation": "Lab. Invest.",
    "Laboratory Practice": "Lab. Pract.",
    "Lakokrasochnye Materialy i Ikh Primenenie": "Lakokras. Mater. Ikh Primen.",
    "Langmuir": "Langmuir",
    "Laser and Particle Beams": "Laser Part. Beams",
    "Laser Chemistry": "Laser Chem.",
    "Latvijas Kimijas Zurnals": "Latv. Kim. Z.",
    "LC-GC": "LC-GC",
    "LCGC North America": "LCGC North Am.",
    "Lebensmittel-Wissenschaft und -Technologie": "Lebensm.-Wiss. Technol.",
    "Lecture Notes in Physics": "Lect. Notes Phys.",
    "Letters in Organic Chemistry": "Lett. Org. Chem.",
    "Letters in Peptide Science": "Lett. Pept. Sci.",
    "Liebigs Annalen der Chemie": "Liebigs Ann. Chem.",
    "Lietuvos Fizikos Rinkinys": "Liet. Fiz. Rinkinys",
    "Life Sciences": "Life Sci.",
    "Light Metals (Warrendale, Pennsylvania)": "Light Met. (Warrendale, Pa.)",
    "Lihua Jianyan, Huaxue Fence": "Lihua Jianyan, Huaxue Fence",
    "Linchan Huaxue Yu Gongye": "Linchan Huaxue Yu Gongye",
    "Lipids": "Lipids",
    "Liquid Crystals": "Liq. Cryst.",
    "Liteinoe Proizvodstvo": "Liteinoe Proizvod.",
    "Lithos": "Lithos",
    "Macromolecular Bioscience": "Macromol. Biosci.",
    "Macromolecular Chemistry and Physics": "Macromol. Chem. Phys.",
    "Macromolecular Materials and Engineering": "Macromol. Mater. Eng.",
    "Macromolecular Rapid Communications": "Macromol. Rapid Commun.",
    "Macromolecular Research": "Macromol. Res.",
    "Macromolecular Symposia": "Macromol. Symp.",
    "Macromolecular Theory and Simulations": "Macromol. Theory Simul.",
    "Macromolecules": "Macromolecules",
    "Magnesium Research": "Magnesium Res.",
    "Magnetic Resonance in Chemistry": "Magn. Reson. Chem.",
    "Magyar Kemiai Folyoirat": "Magy. Kem. Foly.",
    "Magyar Kemiai Folyoirat, Kemiai Kozlemenyek": "Magy. Kem. Foly., Kem. Kozl.",
    "Magyar Kemikusok Lapja": "Magy. Kem. Lapja",
    "Main Group Metal Chemistry": "Main Group Met. Chem.",
    "Makromolekulare Chemie": "Makromol. Chem.",
    "Makromolekulare Chemie, Macromolecular Symposia": "Makromol. Chem., Macromol. Symp.",
    "Makromolekulare Chemie, Rapid Communications": "Makromol. Chem., Rapid Commun.",
    "Makromolekulare Chemie, Supplement": "Makromol. Chem., Suppl.",
    "Marine Biology (Berlin)": "Mar. Biol. (Berlin)",
    "Marine Biotechnology": "Mar. Biotechnol.",
    "Marine Chemistry": "Mar. Chem.",
    "Marine Environmental Research": "Mar. Environ. Res.",
    "Marine Pollution Bulletin": "Mar. Pollut. Bull.",
    "Mass Spectrometry Reviews": "Mass Spectrom. Rev.",
    "Materials and Corrosion": "Mater. Corros.",
    "Materials and Manufacturing Processes": "Mater. Manuf. Processes",
    "Materials Characterization": "Mater. Charact.",
    "Materials Chemistry and Physics": "Mater. Chem. Phys.",
    "Materials Engineering (Modena, Italy)": "Mater. Eng. (Modena, Italy)",
    "Materials Forum": "Mater. Forum",
    "Materials Letters": "Mater. Lett.",
    "Materials Research Bulletin": "Mater. Res. Bull.",
    "Materials Research Innovations": "Mater. Res. Innovations",
    "Materials Research Society Symposia Proceedings": "Mater. Res. Soc. Symp. Proc.",
    "Materials Research Society Symposium Proceedings": "Mater. Res. Soc. Symp. Proc.",
    "Materials Science & Engineering, A: Structural Materials: Properties, Microstructure and Processing": "Mater. Sci. Eng., A",
    "Materials Science & Engineering, B: Solid-State Materials for Advanced Technology": "Mater. Sci. Eng., B",
    "Materials Science & Engineering, C: Biomimetic and Supramolecular Systems": "Mater. Sci. Eng., C",
    "Materials Science and Technology": "Mater. Sci. Technol.",
    "Materials Science Forum": "Mater. Sci. Forum",
    "Materials Science in Semiconductor Processing": "Mater. Sci. Semicond. Process.",
    "Materials Science Monographs": "Mater. Sci. Monogr.",
    "Materials Transactions": "Mater. Trans.",
    "Materials Transactions, JIM": "Mater. Trans. JIM",
    "Matrix Biology": "Matrix Biol.",
    "Measurement Science & Technology": "Meas. Sci. Technol.",
    "Measurement Science and Technology": "Meas. Sci. Technol.",
    "Mechanisms of Development": "Mech. Dev.",
    "Mededelingen van de Faculteit Landbouwwetenschappen, Universiteit Gent": "Meded. Fac. Landbouwwet., Rijksuniv. Gent",
    "Medical Immunology": "Med. Immunol.",
    "Medical Science Research": "Med. Sci. Res.",
    "Medicinal Chemistry Research": "Med. Chem. Res.",
    "Medicinal Research Reviews": "Med. Res. Rev.",
    "Mekhanika Kompositnykh Materialov (Zinatne)": "Mekh. Kompoz. Mater. (Zinatne)",
    "Memoirs of the Faculty of Science, Kyushu University, Series C: Chemistry": "Mem. Fac. Sci. Kyushu Univ., Ser. C",
    "Memoirs of the Institute of Scientific and Industrial Research, Osaka University": "Mem. Insts. Sci. Ind. Res., Osaka Univ.",
    "Mendeleev Communications": "Mendeleev Commun.",
    "Metabolic Engineering": "Metab. Eng.",
    "Metabolism, Clinical and Experimental": "Metab., Clin. Exp.",
    "Metal Science and Heat Treatment (Translation of Metallovedenie i Termicheskaya Obrabotka Metallov)": "Met. Sci. Heat Treat.",
    "Metall (Berlin)": "Metall (Berlin)",
    "Metallofizika (Kiev)": "Metallofizika (Akad. Nauk Ukr. SSR, Otd. Fiz. Astron.)",
    "Metallofizika i Noveishie Tekhnologii": "Metallofiz. Noveishie Tekhnol.",
    "Metalloorganicheskaya Khimiya": "Metalloorg. Khim.",
    "Metallovedenie i Termicheskaya Obrabotka Matallov": "Metalloved. Term. Obrab. Met.",
    "Metallurgical and Materials Transactions A: Physical Metallurgy and Materials Science": "Metall. Mater. Trans. A",
    "Metallurgical and Materials Transactions B: Process Metallurgy and Materials Processing Science": "Metall. Mater. Trans. B",
    "Metallurgical Transactions A: Physical Metallurgy and Materials Science": "Metall. Trans. A",
    "Metallurgical Transactions B: Process Metallurgy": "Metall. Trans. B",
    "Metally": "Metally",
    "Meteoritics & Planetary Science": "Meteorit. Planet. Sci.",
    "Methods (San Diego, CA, United States)": "Methods (San Diego, CA, U. S.)",
    "Methods and Findings in Experimental and Clinical Pharmacology": "Methods Finds Exp. Clin. Pharmacol.",
    "Methods in Enzymology": "Methods Enzymol.",
    "Microbeam Analysis": "Microbeam Anal.",
    "Microbiology (Moscow, Russian Federation)(Translation of Mikrobiologiya)": "Microbiology (Moscow, Russ. Fed.)",
    "Microbiology (Reading, United Kingdom)": "Microbiology (Reading, U. K.)",
    "Microbiology and Immunology": "Microbiol. Immunol.",
    "Microchemical Journal": "Microchem. J.",
    "Microchimica Acta": "Microchim. Acta",
    "Microelectronic Engineering": "Microelectron. Eng.",
    "Microporous and Mesoporous Materials": "Microporous Mesoporous Mater.",
    "Microscopy and Microanalysis": "Microsc. Microanal.",
    "Mikrobiologiya": "Mikrobiologiya",
    "Mikrochimica Acta": "Mikrochim. Acta",
    "Milchwissenschaft": "Milchwissenschaft",
    "Mineralium Deposita": "Miner. Deposita",
    "Mineralogical Magazine": "Mineral. Mag.",
    "Mineralogicheskii Zhurnal": "Mineral. Zh.",
    "Mineralogy and Petrology": "Mineral. Petrol.",
    "Minerals & Metallurgical Processing": "Miner. Metall. Process.",
    "Minerals Engineering": "Miner. Eng.",
    "Mini-Reviews in Medicinal Chemistry": "Mini-Rev. Med. Chem.",
    "Mini-Reviews in Organic Chemistry": "Mini-Rev. Org. Chem.",
    "Mitochondrion": "Mitochondrion",
    "Mitteilungen aus der Kaiserlichen Biologischen Anstalt für Land- und Forstwirtschaft": "Mitt. K. Biol. Anst. Land u. Forstw.",
    "Modern Physics Letters A": "Mod. Phys. Lett. A",
    "Modern Physics Letters B": "Mod. Phys. Lett. B",
    "Molecular and Biochemical Parasitology": "Mol. Biochem. Parasitol.",
    "Molecular and Cellular Biochemistry": "Mol. Cell. Biochem.",
    "Molecular and Cellular Biology": "Mol. Cell. Biol.",
    "Molecular and Cellular Endocrinology": "Mol. Cell. Endocrinol.",
    "Molecular and Cellular Neuroscience": "Mol. Cell. Neurosci.",
    "Molecular and Cellular Probes": "Mol. Cell. Probes",
    "Molecular and Cellular Proteomics": "Mol. Cell. Proteomics",
    "Molecular Biology (Moscow, Russian Federation, English Edition) (Translation of Molekulyarnaya Biologiya)": "Mol. Biol. (Moscow, Russ. Fed., Engl. Ed.)",
    "Molecular Biology and Evolution": "Mol. Biol. Evol.",
    "Molecular Biology of the Cell": "Mol. Biol. Cell",
    "Molecular Biology Reports": "Mol. Biol. Rep.",
    "Molecular Biotechnology": "Mol. Biotechnol.",
    "Molecular Brain Research": "Mol. Brain Res.",
    "Molecular Cancer Research": "Mol. Cancer Res.",
    "Molecular Cancer Therapeutics": "Mol. Cancer Ther.",
    "Molecular Carcinogenesis": "Mol. Carcinog.",
    "Molecular Cell": "Mol. Cell",
    "Molecular Crystals and Liquid Crystals": "Mol. Cryst. Liq. Cryst.",
    "Molecular Diversity": "Mol. Diversity",
    "Molecular Endocrinology": "Mol. Endocrinol.",
    "Molecular Genetics and Genomics": "Mol. Genet. Genomics",
    "Molecular Genetics and Metabolism": "Mol. Genet. Metab.",
    "Molecular Immunology": "Mol. Immunol.",
    "Molecular Membrane Biology": "Mol. Membr. Biol.",
    "Molecular Microbiology": "Mol. Microbiol.",
    "Molecular Neurobiology": "Mol. Neurobiol.",
    "Molecular Pharmaceutics": "Mol. Pharm.",
    "Molecular Pharmacology": "Mol. Pharmacol.",
    "Molecular Physics": "Mol. Phys.",
    "Molecular Plant-Microbe Interactions": "Mol. Plant-Microbe Interact.",
    "Molecular Reproduction and Development": "Mol. Reprod. Dev.",
    "Molecular Simulation": "Mol. Simul.",
    "Molecular Therapy": "Mol. Ther.",
    "Molecules and Cells": "Mol. Cells",
    "Molekulyarnaya Biologiya (Moscow)": "Mol. Biol. (Moscow)",
    "Molekulyarnaya Genetika, Mikrobiologiya i Virusologiya": "Mol. Genet., Mikrobiol. Virusol.",
    "Monatshefte fuer Chemie": "Monatsh. Chem.",
    "Monthly Notices of the Royal Astronomical Society": "Mon. Not. R. Astron. Soc.",
    "Mutagenesis": "Mutagenesis",
    "Mutation Research": "Mutat. Res.",
    "Mycological Research": "Mycol. Res.",
    "Nahrung": "Nahrung",
    "Nano Letters": "Nano Lett.",
    "NASA Conference Publication": "NASA Conf. Publ.",
    "National Academy Science Letters (India)": "Natl. Acad. Sci. Lett. (India)",
    "NATO ASI Series, Series A: Life Sciences": "NATO ASI Ser., Ser. A",
    "NATO ASI Series, Series B: Physics": "NATO ASI Ser., Ser. B",
    "NATO ASI Series, Series C: Mathematical and Physical Sciences": "NATO ASI Ser., Ser. C",
    "NATO ASI Series, Series E: Applied Sciences": "NATO ASI Ser., Ser. E",
    "NATO ASI Series, Series H: Cell Biology": "NATO ASI Ser., Ser. H",
    "Natural Product Reports": "Nat. Prod. Rep.",
    "Natural Product Research": "Nat. Prod. Res.",
    "Natural Product Sciences": "Nat. Prod. Sci.",
    "Nature (London)": "Nature (London)",
    "Nature Biotechnology": "Nat. Biotechnol.",
    "Nature Cell Biology": "Nat. Cell Biol.",
    "Nature Genetics": "Nat. Genet.",
    "Nature Immunology": "Nat. Immunol.",
    "Nature Materials": "Nat. Mater.",
    "Nature Medicine (New York)": "Nat. Med.(N.Y.)",
    "Nature Neuroscience": "Nat. Neurosci.",
    "Nature Reviews Cancer": "Nat. Rev. Cancer",
    "Nature Reviews Drug Discovery": "Nat. Rev. Drug Discovery",
    "Nature Reviews Genetics": "Nat. Rev. Genet.",
    "Nature Reviews Immunology": "Nat. Rev. Immunol.",
    "Nature Reviews Microbiology": "Nat. Rev. Microbiol.",
    "Nature Reviews Molecular Cell Biology": "Nat. Rev. Mol. Cell Biol.",
    "Nature Reviews Neuroscience": "Nat. Rev. Neurosci.",
    "Nature Structural & Molecular Biology": "Nat. Struct. Mol. Biol.",
    "Naturwissenschaften": "Naturwissenschaften",
    "Naunyn-Schmiedeberg\'s Archives of Pharmacology": "Naunyn-Schmiedeberg\'s Arch. Pharmacol.",
    "Neftekhimiya": "Neftekhimiya",
    "Neorganicheskie Materialy": "Neorg. Mater.",
    "Neues Jahrbuch fuer Mineralogie, Abhandlungen": "Neues Jahrb. Mineral., Abh.",
    "Neues Jahrbuch fuer Mineralogie, Monatshefte": "Neues Jahrb. Mineral., Monatsh.",
    "Neurochemical Research": "Neurochem. Res.",
    "Neurochemistry International": "Neurochem. Int.",
    "Neuroendocrinology": "Neuroendocrinology",
    "NeuroImmunoModulation": "NeuroImmunoModulation",
    "NeuroMolecular Medicine": "NeuroMol. Med.",
    "Neuron": "Neuron",
    "Neuropeptides (Amsterdam, Netherlands)": "Neuropeptides (Amsterdam, Neth.)",
    "Neuropeptides (Edinburgh)": "Neuropeptides (Edinburgh)",
    "Neuropharmacology": "Neuropharmacology",
    "Neuroscience (Oxford)": "Neuroscience (Oxford)",
    "Neuroscience Letters": "Neurosci. Lett.",
    "Neurosignals": "Neurosignals",
    "Neurotoxicology and Teratology": "Neurotoxicol. Teratol.",
    "New Diamond and Frontier Carbon Technology": "New Diamond Front. Carbon Technol.",
    "New England Journal of Medicine": "N. Engl. J. Med.",
    "New Journal of Chemistry": "New J. Chem.",
    "New Phytologist": "New Phytol.",
    "Nippon Kagaku Kaishi": "Nippon Kagaku Kaishi",
    "Nippon Kikai Gakkai Ronbunshu, A-hen": "Nippon Kikai Gakkai Ronbunshu, A-hen",
    "Nippon Kikai Gakkai Ronbunshu, B-hen": "Nippon Kikai Gakkai Ronbunshu, B-hen",
    "Nippon Kinzoku Gakkaishi": "Nippon Kinzoku Gakkaishi",
    "Nippon Nogei Kagaku Kaishi": "Nippon Nogei Kagaku Kaishi",
    "Nippon Oyo Jiki Gakkaishi": "Nippon Oyo Jiki Gakkaishi",
    "Nippon Seramikkusu Kyokai Gakujutsu Ronbunshi": "Nippon Seramikkusu Kyokai Gakujutsu Ronbunshi",
    "Nippon Shokuhin Kogyo Gakkaishi": "Nippon Shokuhin Kogyo Gakkaishi",
    "Nippon Suisan Gakkaishi": "Nippon Suisan Gakkaishi",
    "Nippon Yakurigaku Zasshi": "Nippon Yakurigaku Zasshi",
    "NIST Special Publication": "NIST Spec. Publ.",
    "Nitric Oxide": "Nitric Oxide",
    "Nordic Pulp & Paper Research Journal": "Nord. Pulp Pap. Res. J.",
    "Nuclear Engineering and Design": "Nucl. Eng. Des.",
    "Nuclear Fusion": "Nucl. Fusion",
    "Nuclear Instruments & Methods in Physics Research, Section A: Accelerators, Spectrometers, Detectors, and Associated Equipment": "Nucl. Instrum. Methods Phys. Res., Sect. A",
    "Nuclear Instruments & Methods in Physics Research, Section B: Beam Interactions with Materials and Atoms": "Nucl. Instrum. Methods Phys. Res., Sect. B",
    "Nuclear Physics A": "Nucl. Phys. A",
    "Nuclear Physics B": "Nucl. Phys. B",
    "Nuclear Physics B, Proceedings Supplements": "Nucl. Phys. B, Proc. Suppl.",
    "Nuclear Science and Engineering": "Nucl. Sci. Eng.",
    "Nuclear Technology": "Nucl. Technol.",
    "Nuclear Tracks and Radiation Measurements": "Nucl. Tracks Radiat. Meas.",
    "Nucleic Acids Research": "Nucleic Acids Res.",
    "Nucleic Acids Research Supplement": "Nucleic Acids Res. Suppl.",
    "Nucleic Acids Symposium Series": "Nucleic Acids Symp. Ser.",
    "Nucleosides & Nucleotides": "Nucleosides Nucleotides",
    "Nucleosides, Nucleotides & Nucleic Acids": "Nucleosides, Nucleotides Nucleic Acids",
    "Nukleonika": "Nukleonika",
    "Nuovo Cimento della Societa Italiana di Fisica, A: Nuclei, Particles and Fields": "Nuovo Cimento Soc. Ital. Fis., A",
    "Nuovo Cimento della Societa Italiana di Fisica, D: Condensed Matter, Atomic, Molecular and Chemical Physics, Biophysics": "Nuovo Cimento Soc. Ital. Fis., D",
    "Nutrition Research (New York)": "Nutr. Res.(N.Y.)",
    "O\'zbekiston Kimyo Jurnali": "O\'zb. Kim. J.",
    "Ogneupory": "Ogneupory",
    "Oil & Gas Journal": "Oil Gas J.",
    "Oil, Gas (Hamburg, Germany)": "Oil, Gas (Hamburg, Ger.)",
    "Oligonucleotides": "Oligonucleotides",
    "OMICS": "OMICS",
    "Oncogene": "Oncogene",
    "Optics and Spectroscopy (Translation of Optika i Spektroskopiya)": "Opt. Spectrosc.",
    "Optics Communications": "Opt. Commun.",
    "Optics Letters": "Opt. Lett.",
    "Optika i Spektroskopiya": "Opt. Spektrosk.",
    "Optiko-Mekhanicheskaya Promyshlennost": "Opt.-Mekh. Prom-st.",
    "Organic & Biomolecular Chemistry": "Org. Biomol. Chem.",
    "Organic Geochemistry": "Org. Geochem.",
    "Organic Letters": "Org. Lett.",
    "Organic Mass Spectrometry": "Org. Mass Spectrom.",
    "Organic Preparations and Procedures International": "Org. Prep. Proced. Int.",
    "Organic Process Research & Development": "Org. Process Res. Dev.",
    "Organic Reaction Mechanisms": "Org. React. Mech.",
    "Organic Reactions (New York)": "Org. React. (N.Y.)",
    "Organic Syntheses": "Org. Synth.",
    "Organometallics": "Organometallics",
    "Oriental Journal of Chemistry": "Orient. J. Chem.",
    "Oxidation Communications": "Oxid. Commun.",
    "Oxidation of Metals": "Oxid. Met.",
    "Oyo Butsuri": "Oyo Butsuri",
    "Oyo Yakuri": "Oyo Yakuri",
    "Ozone: Science & Engineering": "Ozone: Sci. Eng.",
    "Pakistan Journal of Science": "Pak. J. Sci.",
    "Pakistan Journal of Scientific and Industrial Research": "Pak. J. Sci. Ind. Res.",
    "Pakistan Journal of Scientific Research": "Pak. J. Sci. Res.",
    "Paper - Geological Survey of Canada": "Pap. - Geol. Surv. Can.",
    "Particulate Science and Technology": "Part. Sci. Technol.",
    "Pathologie Biologie": "Pathol. Biol.",
    "Pediatric Research": "Pediatr. Res.",
    "Peptide Chemistry": "Pept. Chem.",
    "Peptides (New York)": "Peptides(N.Y.)",
    "Periodica Polytechnica, Chemical Engineering": "Periodica Polytech., Chem. Eng.",
    "Pest Management Science": "Pest Manage. Sci.",
    "Pesticide Biochemistry and Physiology": "Pestic. Biochem. Physiol.",
    "Pesticide Science": "Pestic. Sci.",
    "Pesticides": "Pesticides",
    "Petroleum Science and Technology": "Pet. Sci. Technol.",
    "Pfluegers Archiv": "Pfluegers Arch.",
    "Pharmaceutical and Pharmacological Letters": "Pharm. Pharmacol. Lett.",
    "Pharmaceutical Chemistry Journal (Translation of Khimiko-Farmatsevticheskii Zhurnal)": "Pharm. Chem. J.",
    "Pharmaceutical Development and Technology": "Pharm. Dev. Technol.",
    "Pharmaceutical Research": "Pharm. Res.",
    "Pharmacochemistry Library": "Pharmacochem. Libr.",
    "Pharmacogenomics Journal": "Pharmacogenomics J.",
    "Pharmacological Research": "Pharmacol. Res.",
    "Pharmacology": "Pharmacology",
    "Pharmacology & Therapeutics": "Pharmacol. Ther.",
    "Pharmacology & Toxicology (Copenhagen)": "Pharmacol. Toxicol. (Copenhagen)",
    "Pharmacology, Biochemistry and Behavior": "Pharmacol., Biochem. Behav.",
    "Pharmazie": "Pharmazie",
    "Phase Transitions": "Phase Transitions",
    "Philosophical Magazine": "Philos. Mag.",
    "Philosophical Magazine A: Physics of Condensed Matter: Defects and Mechanical Properties": "Philos. Mag. A",
    "Philosophical Magazine B: Physics of Condensed Matter: Statistical Mechanics, Electronic, Optical and Magnetic Properties": "Philos. Mag. B",
    "Philosophical Magazine B: Physics of Condensed Matter: Structural, Electronic, Optical and Magnetic Properties": "Philos. Mag. B",
    "Philosophical Magazine Letters": "Philos. Mag. Lett.",
    "Philosophical Transactions of the Royal Society of London, Series A: Physical Sciences and Engineering": "Philos. Trans. R. Soc. London, A",
    "Phosphorus, Sulfur and Silicon and the Related Elements": "Phosphorus, Sulfur Silicon Relat. Elem.",
    "Photochemical & Photobiological Sciences": "Photochem. Photobiol. Sci.",
    "Photochemistry and Photobiology": "Photochem. Photobiol.",
    "Photosynthesis Research": "Photosynth. Res.",
    "Physica A: Statistical and Theoretical Physics (Amsterdam)": "Physica A (Amsterdam)",
    "Physica B: Condensed Matter (Amsterdam, Netherlands)": "Physica B (Amsterdam, Neth.)",
    "Physica C: Superconductivity (Amsterdam)": "Physica C (Amsterdam)",
    "Physica C: Superconductivity and Its Applications": "Physica C (Amsterdam, Neth.)",
    "Physica Scripta": "Phys. Scr.",
    "Physica Scripta, T": "Phys. Scr., T",
    "Physica Status Solidi A: Applied Research": "Phys. Status Solidi A",
    "Physica Status Solidi B: Basic Research": "Phys. Status Solidi B",
    "Physical Chemistry Chemical Physics": "Phys. Chem. Chem. Phys.",
    "Physical Review A": "Phys. Rev. A",
    "Physical Review A: Atomic, Molecular, and Optical Physics": "Phys. Rev. A: At., Mol., Opt. Phys.",
    "Physical Review B: Condensed Matter": "Phys. Rev. B: Condens. Matter",
    "Physical Review B: Condensed Matter and Materials Physics": "Phys. Rev. B: Condens. Matter Mater. Phys.",
    "Physical Review C: Nuclear Physics": "Phys. Rev. C: Nucl. Phys.",
    "Physical Review D: Particles and Fields": "Phys. Rev. D: Part. Fields",
    "Physical Review E: Statistical, Nonlinear, and Soft Matter Physics": "Phys. Rev. E: Stat., Nonlinear, Soft Matter Phys.",
    "Physical Review Letters": "Phys. Rev. Lett.",
    "Physics and Chemistry of Glasses": "Phys. Chem. Glasses",
    "Physics and Chemistry of Liquids": "Phys. Chem. Liq.",
    "Physics and Chemistry of Minerals": "Phys. Chem. Miner.",
    "Physics Letters A": "Phys. Lett. A",
    "Physics Letters B": "Phys. Lett. B",
    "Physics of Atomic Nuclei (Translation of Yadernaya Fizika)": "Phys. At. Nucl.",
    "Physics of Fluids": "Phys. Fluids",
    "Physics of Fluids A: Fluid Dynamics": "Phys. Fluids A",
    "Physics of Fluids B: Plasma Physics": "Phys. Fluids B",
    "Physics of Plasmas": "Phys. Plasmas",
    "Physics of the Solid State (Translation of Fizika Tverdogo Tela (Sankt-Peterburg))": "Phys. Solid State",
    "Physics Reports": "Phys. Rep.",
    "Physiologia Plantarum": "Physiol. Plant.",
    "Physiology & Behavior": "Physiol. Behav.",
    "Physiology and Behavior": "Physiol. Behav.",
    "Phytochemical Analysis": "Phytochem. Anal.",
    "Phytochemistry": "Phytochemistry",
    "Phytochemistry (Elsevier)": "Phytochemistry (Elsevier)",
    "Phytochemistry Reviews": "Phytochem. Rev.",
    "Pigment & Resin Technology": "Pigm. Resin Technol.",
    "Pigment Cell Research": "Pigm. Cell Res.",
    "Pis\'ma v Astronomicheskii Zhurnal": "Pis\'ma Astron. Zh.",
    "Pis\'ma v Zhurnal Eksperimental\'noi i Teoreticheskoi Fiziki": "Pis\'ma Zh. Eksp. Teor. Fiz.",
    "Pis\'ma v Zhurnal Tekhnicheskoi Fiziki": "Pis\'ma Zh. Tekh. Fiz.",
    "Pishchevaya Promyshlennost (Moscow)": "Pishch. Prom-st. (Moscow)",
    "Plant and Cell Physiology": "Plant Cell Physiol.",
    "Plant and Soil": "Plant Soil",
    "Plant Cell": "Plant Cell",
    "Plant Cell Reports": "Plant Cell Rep.",
    "Plant Cell, Tissue and Organ Culture": "Plant Cell, Tissue Organ Cult.",
    "Plant Growth Regulation": "Plant Growth Regul.",
    "Plant Molecular Biology": "Plant Mol. Biol.",
    "Plant Physiology": "Plant Physiol.",
    "Plant Physiology and Biochemistry (Amsterdam, Netherlands)": "Plant Physiol. Biochem. (Amsterdam, Neth.)",
    "Plant Science (Amsterdam, Netherlands)": "Plant Sci. (Amsterdam, Neth.)",
    "Plant Science (Limerick, Ireland)": "Plant Sci. (Limerick, Irel.)",
    "Plant, Cell and Environment": "Plant, Cell Environ.",
    "Planta": "Planta",
    "Planta Medica": "Planta Med.",
    "Plasma Chemistry and Plasma Processing": "Plasma Chem. Plasma Process.",
    "Plasma Physics and Controlled Fusion": "Plasma Phys. Controlled Fusion",
    "Plasma Physics and Controlled Nuclear Fusion Research": "Plasma Phys. Controlled Nucl. Fusion Res.",
    "Plasmid": "Plasmid",
    "Plaste und Kautschuk": "Plaste Kautsch.",
    "Plasticheskie Massy": "Plast. Massy",
    "Plastics, Rubber and Composites": "Plast., Rubber Compos.",
    "Platelets": "Platelets",
    "PLoS Biology": "PLoS Biol.",
    "Pochvovedenie": "Pochvovedenie",
    "Polimery (Warsaw)": "Polimery (Warsaw)",
    "Polish Journal of Chemistry": "Pol. J. Chem.",
    "Polish Journal of Pharmacology and Pharmacy": "Pol. J. Pharmacol. Pharm.",
    "Polycyclic Aromatic Compounds": "Polycyclic Aromat. Compd.",
    "Polyhedron": "Polyhedron",
    "Polymer": "Polymer",
    "Polymer (Korea)": "Polymer (Korea)",
    "Polymer Bulletin (Berlin)": "Polym. Bull. (Berlin)",
    "Polymer Bulletin (Heidelberg, Germany)": "Polym. Bull. (Heidelberg, Ger.)",
    "Polymer Composites": "Polym. Compos.",
    "Polymer Degradation and Stability": "Polym. Degrad. Stab.",
    "Polymer Engineering and Science": "Polym. Eng. Sci.",
    "Polymer International": "Polym. Int.",
    "Polymer Journal (Tokyo)": "Polym. J. (Tokyo)",
    "Polymer Preprints (American Chemical Society, Division of Polymer Chemistry)": "Polym. Prepr. (Am. Chem. Soc., Div. Polym. Chem.)",
    "Polymer Reaction Engineering": "Polym. React. Eng.",
    "Polymer Testing": "Polym. Test.",
    "Polymeric Materials Science and Engineering": "Polym. Mater. Sci. Eng.",
    "Polymers & Polymer Composites": "Polym. Polym. Compos.",
    "Polymers for Advanced Technologies": "Polym. Adv. Technol.",
    "Poroshkovaya Metallurgiya (Kiev)": "Poroshk. Metall. (Kiev)",
    "Postepy Biochemii": "Postepy Biochem.",
    "Poultry Science": "Poult. Sci.",
    "Poverkhnost": "Poverkhnost",
    "Powder Diffraction": "Powder Diffr.",
    "Powder Metallurgy": "Powder Metall.",
    "Powder Metallurgy and Metal Ceramics (Translation of Poroshkovaya Metallurgiya (Kiev))": "Powder Metall. Met. Ceram.",
    "Powder Technology": "Powder Technol.",
    "Prace Naukowe Instytutu Technologii Nieorganicznej i Nawozow Mineralnych Politechniki Wroclawskiej": "Pr. Nauk Inst. Technol. Nieorg. Nawozow Miner. Politech. Wroclaw.",
    "Practical Spectroscopy": "Pract. Spectrosc.",
    "Pramana": "Pramana",
    "Precambrian Research": "Precambrian Res.",
    "Preparative Biochemistry & Biotechnology": "Prep. Biochem. Biotechnol.",
    "Preprints - American Chemical Society, Division of Petroleum Chemistry": "Prepr. - Am. Chem. Soc., Div. Pet. Chem.",
    "Preprints of Extended Abstracts presented at the ACS National Meeting, American Chemical Society, Division of Environmental Chemistry": "Prepr. Ext. Abstr. ACS Natl. Meet., Am. Chem. Soc., Div. Environ. Chem.",
    "Preprints of Papers - American Chemical Society, Division of Fuel Chemistry": "Prepr. Pap. - Am. Chem. Soc., Div. Fuel Chem.",
    "Preprints of Symposia - American Chemical Society, Division of Fuel Chemistry": "Prepr. Symp. - Am. Chem. Soc., Div. Fuel Chem.",
    "Pribory i Tekhnika Eksperimenta": "Prib. Tekh. Eksp.",
    "Prikladnaya Biokhimiya i Mikrobiologiya": "Prikl. Biokhim. Mikrobiol.",
    "Priroda (Moscow)": "Priroda (Moscow)",
    "Problemy Prochnosti": "Probl. Prochn.",
    "Proceedings - Electrochemical Society": "Proc. - Electrochem. Soc.",
    "Proceedings - Electronic Components & Technology Conference": "Proc. - Electron. Compon. Conf.",
    "Proceedings - Indian Academy of Sciences, Chemical Sciences": "Proc. - Indian Acad. Sci., Chem. Sci.",
    "Proceedings of SPIE - The International Society for Optical Engineering": "Proc. SPIE-Int. Soc. Opt. Eng.",
    "Proceedings of the AESF Annual Technical Conference": "Proc. - AESF Annu. Tech. Conf.",
    "Proceedings of the American Power Conference": "Proc. Am. Power Conf.",
    "Proceedings of the Estonian Academy of Sciences, Chemistry": "Proc. Est. Acad. Sci., Chem.",
    "Proceedings of the Industrial Waste Conference": "Proc. Ind. Waste Conf.",
    "Proceedings of the Institution of Mechanical Engineers, IMechE Conference": "Proc. Inst. Mech. Eng., IMechE Conf.",
    "Proceedings of the International Conference on Lasers": "Proc. Int. Conf. Lasers",
    "Proceedings of the International Power Sources Symposium": "Proc. Int. Power Sources Symp.",
    "Proceedings of the International Pyrotechnics Seminar": "Proc. Int. Pyrotech. Semin.",
    "Proceedings of the Intersociety Energy Conversion Engineering Conference": "Proc. Intersoc. Energy Convers. Eng. Conf.",
    "Proceedings of the National Academy of Sciences of the United States of America": "Proc. Natl. Acad. Sci. U. S. A.",
    "Proceedings of the National Academy of Sciences, India, Section A: Physical Sciences": "Proc. Natl. Acad. Sci., India, Sect. A",
    "Proceedings of the Royal Society of London, Series A: Mathematical and Physical Sciences": "Proc. R. Soc. London, A",
    "Proceedings of the Royal Society of London, Series B: Biological Sciences": "Proc. R. Soc. London, B",
    "Proceedings of the Society for Experimental Biology and Medicine": "Proc. Soc. Exp. Biol. Med.",
    "Proceedings of the SPI Annual Technical/Marketing Conference": "Proc. SPI Annu. Tech./Mark. Conf.",
    "Proceedings of the Western Pharmacology Society": "Proc. West. Pharmacol. Soc.",
    "Proceedings of the Workshop on Vitamin D": "Proc. Workshop Vitam. D",
    "Process Biochemistry (Barking, UK)": "Process Biochem.",
    "Process Biochemistry (Oxford)": "Process Biochem. (Oxford)",
    "Process Safety and Environmental Protection": "Process Saf. Environ. Prot.",
    "Progress in Astronautics and Aeronautics": "Prog. Astronaut. Aeronaut.",
    "Progress in Brain Research": "Prog. Brain Res.",
    "Progress in Clinical and Biological Research": "Prog. Clin. Biol. Res.",
    "Progress in Colloid & Polymer Science": "Prog. Colloid Polym. Sci.",
    "Progress in Crystal Growth and Characterization of Materials": "Prog. Cryst. Growth Charact. Mater.",
    "Progress in Inorganic Chemistry": "Prog. Inorg. Chem.",
    "Progress in Leukocyte Biology": "Prog. Leukocyte Biol.",
    "Progress in Medicinal Chemistry": "Prog. Med. Chem.",
    "Progress in Nuclear Energy": "Prog. Nucl. Energy",
    "Progress in Nuclear Magnetic Resonance Spectroscopy": "Prog. Nucl. Magn. Reson. Spectrosc.",
    "Progress in Nucleic Acid Research and Molecular Biology": "Prog. Nucleic Acid Res. Mol. Biol.",
    "Progress in Organic Coatings": "Prog. Org. Coat.",
    "Progress in Physical Organic Chemistry": "Prog. Phys. Org. Chem.",
    "Progress in Polymer Science": "Prog. Polym. Sci.",
    "Progress in Reaction Kinetics": "Prog. React. Kinet.",
    "Progress in Reaction Kinetics and Mechanism": "Prog. React. Kinet. Mech.",
    "Progress in Solid State Chemistry": "Prog. Solid State Chem.",
    "Progress in Surface Science": "Prog. Surf. Sci.",
    "Progress of Theoretical Physics": "Prog. Theor. Phys.",
    "Propellants, Explosives, Pyrotechnics": "Propellants, Explos., Pyrotech.",
    "Prostaglandins": "Prostaglandins",
    "Prostaglandins & Other Lipid Mediators": "Prostaglandins Other Lipid Mediators",
    "Prostaglandins, Leukotrienes and Essential Fatty Acids": "Prostaglandins, Leukotrienes Essent. Fatty Acids",
    "Protection of Metals (Translation of Zashchita Metallov)": "Prot. Met.",
    "Protein and Peptide Letters": "Protein Pept. Lett.",
    "Protein Engineering": "Protein Eng.",
    "Protein Engineering, Design & Selection": "Protein Eng., Des. Sel.",
    "Protein Expression and Purification": "Protein Expression Purif.",
    "Protein Science": "Protein Sci.",
    "Proteins: Structure, Function, and Bioinformatics": "Proteins: Struct., Funct., Bioinf.",
    "Proteins: Structure, Function, and Genetics": "Proteins: Struct., Funct., Genet.",
    "Proteomics": "Proteomics",
    "Protides of the Biological Fluids": "Protides Biol. Fluids",
    "Przemysl Chemiczny": "Przem. Chem.",
    "Psychopharmacology (Berlin, Germany)": "Psychopharmacology (Berlin, Ger.)",
    "Pteridines": "Pteridines",
    "Pulmonary Pharmacology & Therapeutics": "Pulm. Pharmacol. Ther.",
    "Pure and Applied Chemistry": "Pure Appl. Chem.",
    "Pyrethrum Post": "Pyrethrum Post",
    "QSAR & Combinatorial Science": "QSAR Comb. Sci.",
    "Quaderni dell\'Ingegnere Chimico Italiano": "Quad. Ing. Chim. Ital.",
    "Quantum Electronics": "Quantum Electron.",
    "Quarterly Reviews of Biophysics": "Q. Rev. Biophys.",
    "Quimica Nova": "Quim. Nova",
    "Radiation Effects and Defects in Solids": "Radiat. Eff. Defects Solids",
    "Radiation Measurements": "Radiat. Meas.",
    "Radiation Physics and Chemistry": "Radiat. Phys. Chem.",
    "Radiation Protection Dosimetry": "Radiat. Prot. Dosim.",
    "Radiation Research": "Radiat. Res.",
    "Radiatsionnaya Bezopasnost i Zashchita AES": "Radiats. Bezop. Zashch. AES",
    "Radiobiologiya": "Radiobiologiya",
    "Radiochemistry (Moscow, Russian Federation)(Translation of Radiokhimiya)": "Radiochemistry (Moscow, Russ. Fed.)",
    "Radiochimica Acta": "Radiochim. Acta",
    "Radiokhimiya": "Radiokhimiya",
    "Radioprotection": "Radioprotection",
    "Radiotekhnika i Elektronika (Moscow)": "Radiotekh. Elektron. (Moscow)",
    "Ranliao Huaxue Xuebao": "Ranliao Huaxue Xuebao",
    "Rapid Communications in Mass Spectrometry": "Rapid Commun. Mass Spectrom.",
    "Rare Metals (Beijing, China)": "Rare Met. (Beijing, China)",
    "Rasplavy": "Rasplavy",
    "Reaction Kinetics and Catalysis Letters": "React. Kinet. Catal. Lett.",
    "Reactive & Functional Polymers": "React. Funct. Polym.",
    "Recent Progress in Hormone Research": "Recent Prog. Horm. Res.",
    "Receptors and Channels": "Recept. Channels",
    "Receuil des Travaux Chimiques des Pays-Bas": "Recl. Trav. Chim. Pays-Bas",
    "Regulatory Peptides": "Regul. Pept.",
    "Rengong Jingti Xuebao": "Rengong Jingti Xuebao",
    "Reproduction (Bristol, United Kingdom)": "Reproduction (Bristol, U. K.)",
    "Reproduction, Nutrition, Development": "Reprod., Nutr., Dev.",
    "Reproductive Toxicology": "Reprod. Toxicol.",
    "Research Communications in Biochemistry and Cell & Molecular Biology": "Res. Commun. Biochem. Cell Mol. Biol.",
    "Research Communications in Chemical Pathology and Pharmacology": "Res. Commun. Chem. Pathol. Pharmacol.",
    "Research Communications in Molecular Pathology and Pharmacology": "Res. Commun. Mol. Pathol. Pharmacol.",
    "Research Communications in Pharmacology and Toxicology": "Res. Commun. Pharmacol. Toxicol.",
    "Research Disclosure": "Res. Discl.",
    "Research in Microbiology": "Res. Microbiol.",
    "Research in Veterinary Science": "Res. Vet. Sci.",
    "Research on Chemical Intermediates": "Res. Chem. Intermed.",
    "Review of Scientific Instruments": "Rev. Sci. Instrum.",
    "Reviews in Analytical Chemistry": "Rev. Anal. Chem.",
    "Reviews in Inorganic Chemistry": "Rev. Inorg. Chem.",
    "Revista de Chimie (Bucharest, Romania)": "Rev. Chim. (Bucharest, Rom.)",
    "Revista de la Sociedad Quimica de Mexico": "Rev. Soc. Quim. Mex.",
    "Revista Portuguesa de Quimica": "Rev. Port. Quim.",
    "Revista Romana de Materiale": "Rev. Rom. Mater.",
    "Revue Roumaine de Biochimie": "Rev. Roum. Biochim.",
    "Revue Roumaine de Chimie": "Rev. Roum. Chim.",
    "Revue Roumaine de Physique": "Rev. Roum. Phys.",
    "Rheologica Acta": "Rheol. Acta",
    "Rinsho Yakuri": "Rinsho Yakuri",
    "RNA": "RNA",
    "Romanian Journal of Physics": "Rom. J. Phys.",
    "Rossiiskii Khimicheskii Zhurnal": "Ross. Khim. Zh.",
    "Rubber Chemistry and Technology": "Rubber Chem. Technol.",
    "Russian Chemical Bulletin (Translation of Izvestiya Akademii Nauk, Seriya Khimicheskaya)": "Russ.Chem.Bull.",
    "Russian Chemical Reviews": "Russ. Chem. Rev.",
    "Russian Journal of Applied Chemistry (Translation of Zhurnal Prikladnoi Khimii) ": "Russ.J.Appl.Chem.",
    "Russian Journal of Bioorganic Chemistry (Translation of Bioorganicheskaya Khimiya) ": "Russ.J.Bioorg.Chem.",
    "Russian Journal of Coordination Chemistry (Translation of Koordinatsionnaya Khimiya) ": "Russ.J.Coord.Chem.",
    "Russian Journal of Electrochemistry (Translation of Elektrokhimiya)": "Russ. J. Electrochem.",
    "Russian Journal of General Chemistry (Translation of Zhurnal Obshchei Khimii) ": "Russ.J.Gen.Chem.",
    "Russian Journal of Genetics (Translation of Genetika (Moscow, Russian Federation)) ": "Russ.J.Genet.",
    "Russian Journal of Organic Chemistry (Translation of Zhurnal Organicheskoi Khimii) ": "Russ.J.Org.Chem.",
    "Russian Journal of Plant Physiology (Translation of Fiziologiya Rastenii (Moscow)) ": "Russ.J.Plant Physiol.",
    "Saibo Kogaku": "Saibo Kogaku",
    "Saishin Igaku": "Saishin Igaku",
    "Sankyo Kenkyusho Nenpo": "Sankyo Kenkyusho Nenpo",
    "Sanop Misaengmul Hakhoechi": "Sanop Misaengmul Hakhoechi",
    "SAR and QSAR in Environmental Research": "SAR QSAR Environ. Res.",
    "Sbornik Vedeckych Praci, Vysoka Skola Chemickotechnologicka Pardubice": "Sb. Ved. Pr., Vys. Sk. Chemickotechnol. Pardubice",
    "Scandinavian Journal of Immunology": "Scand. J. Immunol.",
    "Scandinavian Journal of Laboratory Animal Science": "Scand. J. Lab. Anim. Sci.",
    "Scandinavian Journal of Metallurgy": "Scand. J. Metall.",
    "School Science Review": "Sch. Sci. Rev.",
    "Schweizerische Apotheker-Zeitung": "Schweiz. Apoth.-Ztg.",
    "Science (Washington, DC)": "Science (Washington, DC)",
    "Science and Culture": "Sci. Cult.",
    "Science in China, Series B: Chemistry": "Sci. China, Ser. B: Chem.",
    "Science in China, Series B: Chemistry, Life Sciences, & Earth Sciences": "Sci. China, Ser. B",
    "Science of the Total Environment": "Sci. Total Environ.",
    "Scripta Materialia": "Scr. Mater.",
    "Scripta Metallurgica et Materialia": "Scr. Metall. Mater.",
    "Seibutsu Kogaku Kaishi": "Seibutsu Kogaku Kaishi",
    "Seitai no Kagaku": "Seitai no Kagaku",
    "Semiconductor Science and Technology": "Semicond. Sci. Technol.",
    "Semiconductors (Translation of Fizika i Tekhnika Poluprovodnikov (Sankt-Peterburg))": "Semiconductors",
    "Sen\'i Gakkaishi": "Sen\'i Gakkaishi",
    "Sensors and Actuators, A: Physical": "Sens. Actuators, A",
    "Sensors and Actuators, B: Chemical": "Sens. Actuators, B",
    "Sensors and Actuators, B: Chemical Sensors and Materials": "Sens. Actuators, B",
    "Separation and Purification Methods": "Sep. Purif. Methods",
    "Separation and Purification Technology": "Sep. Purif. Technol.",
    "Separation Science and Technology": "Sep. Sci. Technol.",
    "Sepu": "Sepu",
    "Seria Fizyka (Uniwersytet im. Adama Mickiewicza w Poznaniu)": "Ser. Fiz. (Uniw. im. Adama Mickiewicza Poznaniu)",
    "Serono Symposia Publications from Raven Press": "Serono Symp. Publ. Raven Press",
    "Shanghai Huanjing Kexue": "Shanghai Huanjing Kexue",
    "Shengwu Huaxue Yu Shengwu Wuli Jinzhan": "Shengwu Huaxue Yu Shengwu Wuli Jinzhan",
    "Shengwu Huaxue Yu Shengwu Wuli Xuebao": "Shengwu Huaxue Yu Shengwu Wuli Xuebao",
    "Shengwu Huaxue Zazhi": "Shengwu Huaxue Zazhi",
    "Shenyang Yaoxueyuan Xuebao": "Shenyang Yaoxueyuan Xuebao",
    "Shinku": "Shinku",
    "Shipin Kexue (Beijing)": "Shipin Kexue (Beijing)",
    "Shiyou Huagong": "Shiyou Huagong",
    "Shiyou Xuebao, Shiyou Jiagong": "Shiyou Xuebao, Shiyou Jiagong",
    "Shuichuli Jishu": "Shuichuli Jishu",
    "Sibirskii Khimicheskii Zhurnal": "Sib. Khim. Zh.",
    "Signal Transduction": "Signal Transduction",
    "Silicon Chemistry": "Silicon Chem.",
    "Soap, Cosmetics, Chemical Specialties": "Soap, Cosmet., Chem. Spec.",
    "Society of General Physiologists Series": "Soc. Gen. Physiol. Ser.",
    "Soil Biology & Biochemistry": "Soil Biol. Biochem.",
    "Soil Science": "Soil Sci.",
    "Soil Science Society of America Journal": "Soil Sci. Soc. Am. J.",
    "Solar Energy Materials and Solar Cells": "Sol. Energy Mater. Sol. Cells",
    "Solar Physics": "Sol. Phys.",
    "Solid State Communications": "Solid State Commun.",
    "Solid State Ionics": "Solid State Ionics",
    "Solid State Nuclear Magnetic Resonance": "Solid State Nucl. Magn. Reson.",
    "Solid State Sciences": "Solid State Sci.",
    "Solid-State Electronics": "Solid-State Electron.",
    "Solubility Data Series": "Solubility Data Ser.",
    "Solvent Extraction and Ion Exchange": "Solvent Extr. Ion Exch.",
    "Solvent Extraction Research and Development, Japan": "Solvent Extr. Res. Dev., Jpn.",
    "Somatic Cell and Molecular Genetics": "Somatic Cell Mol. Genet.",
    "Soobshcheniya Akademii Nauk Gruzii": "Soobshch. Akad. Nauk Gruz. SSR",
    "South African Journal of Chemistry": "S. Afr. J. Chem.",
    "SPE Production & Facilities": "SPE Prod. Facil.",
    "SPE Reservoir Evaluation & Engineering": "SPE Reservoir Eval. Eng.",
    "Special Publication - Royal Society of Chemistry": "Spec. Publ. - R. Soc. Chem.",
    "Spectrochimica Acta, Part A: Molecular and Biomolecular Spectroscopy": "Spectrochim. Acta, Part A",
    "Spectrochimica Acta, Part A: Molecular Spectroscopy": "Spectrochim. Acta, Part A",
    "Spectrochimica Acta, Part B: Atomic Spectroscopy": "Spectrochim. Acta, Part B",
    "Spectroscopy (Amsterdam, Netherlands)": "Spectroscopy (Amsterdam, Neth.)",
    "Spectroscopy Letters": "Spectrosc. Lett.",
    "Springer Proceedings in Physics": "Springer Proc. Phys.",
    "Springer Series in Optical Sciences": "Springer Ser. Opt. Sci.",
    "Springer Series in Solid-State Sciences": "Springer Ser. Solid-State Sci.",
    "Springer Series in Surface Sciences": "Springer Ser. Surf. Sci.",
    "Stahl und Eisen": "Stahl Eisen",
    "Stal\'": "Stal\'",
    "STAL, Sciences et Techniques de l\'Animal de Laboratoire": "STAL, Sci. Tech. Anim. Lab.",
    "Starch/Staerke": "Starch/Staerke",
    "Staub - Reinhaltung der Luft": "Staub - Reinhalt. Luft",
    "Steel Research International": "Steel Res. Int.",
    "Steklo i Keramika": "Steklo Keram.",
    "Steroids": "Steroids",
    "Structural Chemistry": "Struct. Chem.",
    "Structure (Cambridge, MA, United States)": "Structure (Cambridge, MA, U. S.)",
    "Structure and Bonding (Berlin)": "Struct. Bonding (Berlin)",
    "Studia Biophysica": "Stud. Biophys.",
    "Studia Universitatis Babes-Bolyai, Chemia": "Stud. Univ. Babes-Bolyai, Chem.",
    "Studies in Environmental Science": "Stud. Environ. Sci.",
    "Studies in Organic Chemistry (Amsterdam)": "Stud. Org. Chem. (Amsterdam)",
    "Studies in Physical and Theoretical Chemistry": "Stud. Phys. Theor. Chem.",
    "Studies in Surface Science and Catalysis": "Stud. Surf. Sci. Catal.",
    "Sulfur Letters": "Sulfur Lett.",
    "Superconductor Science & Technology": "Supercond. Sci. Technol.",
    "Superconductor Science and Technology": "Supercond. Sci. Technol.",
    "Superlattices and Microstructures": "Superlattices Microstruct.",
    "Supramolecular Chemistry": "Supramol. Chem.",
    "Surface & Coatings Technology": "Surf. Coat. Technol.",
    "Surface and Coatings Technology": "Surf. Coat. Technol.",
    "Surface and Colloid Science": "Surf. Colloid Sci.",
    "Surface and Interface Analysis": "Surf. Interface Anal.",
    "Surface Engineering": "Surf. Eng.",
    "Surface Review and Letters": "Surf. Rev. Lett.",
    "Surface Science": "Surf. Sci.",
    "Surface Science Reports": "Surf. Sci. Rep.",
    "Svarochnoe Proizvodstvo": "Svar. Proizvod.",
    "Sverkhprovodimost: Fizika, Khimiya, Tekhnika": "Sverkhprovodimost: Fiz., Khim., Tekh.",
    "Symposium (International) on Combustion, [Proceedings]": "Symp. (Int.) Combust., [Proc.]",
    "Symposium - International Astronomical Union": "Symp. - Int. Astron. Union",
    "Synapse (New York)": "Synapse (N.Y.)",
    "Synlett": "Synlett",
    "Synthesis": "Synthesis",
    "Synthesis and Reactivity in Inorganic and Metal-Organic Chemistry": "Synth. React. Inorg. Met.-Org. Chem.",
    "Synthetic Communications": "Synth. Commun.",
    "Synthetic Lubrication": "Synth. Lubr.",
    "Synthetic Metals": "Synth. Met.",
    "Taehan Kumsok Hakhoechi": "Taehan Kumsok Hakhoechi",
    "Taehan Kumsok, Chaeryo Hakhoechi": "Taehan Kumsok, Chaeryo Hakhoechi",
    "Taikabutsu": "Taikabutsu",
    "Talanta": "Talanta",
    "Tanpakushitsu Kakusan Koso": "Tanpakushitsu Kakusan Koso",
    "Tappi Journal": "Tappi J.",
    "Technical Physics (Translation of Zhurnal Tekhnicheskoi Fiziki)": "Tech. Phys.",
    "Technical Physics Letters (Translation of Pis\'ma v Zhurnal Tekhnicheskoi Fiziki)": "Tech. Phys. Lett.",
    "Technology Reports of the Osaka University": "Technol. Rep. Osaka Univ.",
    "Tenside, Surfactants, Detergents": "Tenside, Surfactants, Deterg.",
    "Teoreticheskaya i Eksperimental\'naya Khimiya": "Teor. Eksp. Khim.",
    "Teoreticheskaya i Matematicheskaya Fizika": "Teor. Mat. Fiz.",
    "Teoreticheskie Osnovy Khimicheskoi Tekhnologii": "Teor. Osn. Khim. Tekhnol.",
    "Teploenergetika (Moscow)": "Teploenergetika (Moscow)",
    "Teplofizika Vysokikh Temperatur": "Teplofiz. Vys. Temp.",
    "Tetrahedron": "Tetrahedron",
    "Tetrahedron Letters": "Tetrahedron Lett.",
    "Tetrahedron: Asymmetry": "Tetrahedron: Asymmetry",
    "Tetsu to Hagane": "Tetsu to Hagane",
    "Textile Research Journal": "Text. Res. J.",
    "THEOCHEM": "THEOCHEM",
    "Theoretica Chimica Acta": "Theor. Chim. Acta",
    "Theoretical and Applied Genetics": "Theor. Appl. Genet.",
    "Theoretical and Experimental Chemistry (Translation of Teoreticheskaya i Eksperimental\'naya Khimiya)": "Theor. Exp. Chem.",
    "Theoretical Chemistry Accounts": "Theor. Chem. Acc.",
    "Theoretical Foundations of Chemical Engineering (Translation of Teoreticheskie Osnovy Khimicheskoi Tekhnologii)": "Theor. Found. Chem. Eng.",
    "Theriogenology": "Theriogenology",
    "Thermochimica Acta": "Thermochim. Acta",
    "Thin Solid Films": "Thin Solid Films",
    "Thrombosis and Haemostasis": "Thromb. Haemostasis",
    "Thrombosis Research": "Thromb. Res.",
    "Tianran Chanwu Yanjiu Yu Kaifa": "Tianran Chanwu Yanjiu Yu Kaifa",
    "Tohoku Journal of Experimental Medicine": "Tohoku J. Exp. Med.",
    "Topics in Catalysis": "Top. Catal.",
    "Topics in Current Chemistry": "Top. Curr. Chem.",
    "Topics in Stereochemistry": "Top. Stereochem.",
    "Toxicological and Environmental Chemistry": "Toxicol. Environ. Chem.",
    "Toxicological Sciences": "Toxicol. Sci.",
    "Toxicology": "Toxicology",
    "Toxicology and Applied Pharmacology": "Toxicol. Appl. Pharmacol.",
    "Toxicology in Vitro": "Toxicol. in Vitro",
    "Toxicology Letters": "Toxicol. Lett.",
    "Toxicology Mechanisms and Methods": "Toxicol. Mech. Methods",
    "Toxicon": "Toxicon",
    "TrAC, Trends in Analytical Chemistry": "TrAC, Trends Anal. Chem.",
    "Traffic (Oxford)": "Traffic (Oxford)",
    "Transactions of the American Foundrymen\'s Society": "Trans. Am. Foundrymen\'s Soc.",
    "Transactions of the Indian Ceramic Society": "Trans. Indian Ceram. Soc.",
    "Transactions of the Indian Institute of Metals": "Trans. Indian Inst. Met.",
    "Transactions of the Institute of Metal Finishing": "Trans. Inst. Met. Finish.",
    "Transactions of the SAEST": "Trans. SAEST",
    "Transgenic Research": "Transgenic Res.",
    "Transition Metal Chemistry (Dordrecht, Netherlands)": "Transition Met. Chem. (Dordrecht, Neth.)",
    "Transition Metal Chemistry (London)": "Transition Met. Chem. (London)",
    "Transplantation Proceedings": "Transplant. Proc.",
    "Trends in Analytical Chemistry": "Trends Anal. Chem.",
    "Trends in Biochemical Sciences": "Trends Biochem. Sci.",
    "Trends in Biotechnology": "Trends Biotechnol.",
    "Trends in Endocrinology and Metabolism": "Trends Endocrinol. Metab.",
    "Trends in Food Science & Technology": "Trends Food Sci. Technol.",
    "Trends in Genetics": "Trends Genet.",
    "Trends in Immunology": "Trends Immunol.",
    "Trends in Microbiology": "Trends Microbiol.",
    "Trends in Neurosciences": "Trends Neurosci.",
    "Trends in Pharmacological Sciences": "Trends Pharmacol. Sci.",
    "Trends in Plant Science": "Trends Plant Sci.",
    "Trenie i Iznos": "Trenie Iznos",
    "Tribology Transactions": "Tribol. Trans.",
    "Tsitologiya": "Tsitologiya",
    "Tsvetnye Metally (Moscow)": "Tsvetn. Met. (Moscow)",
    "Turkish Journal of Chemistry": "Turk. J. Chem.",
    "UCLA Symposia on Molecular and Cellular Biology, New Series": "UCLA Symp. Mol. Cell. Bio., New Ser.",
    "Ukrains\'kii Biokhimichnii Zhurnal": "Ukr. Biokhim. Zh.",
    "Ukrains\'kii Fizichnii Zhurnal": "Ukr. Fiz. Zh.",
    "Ukrainskii Biokhimicheskii Zhurnal": "Ukr. Biokhim. Zh.",
    "Ukrainskii Fizicheskii Zhurnal (Russian Edition)": "Ukr. Fiz. Zh. (Russ. Ed.)",
    "Ukrainskii Khimicheskii Zhurnal (Russian Edition)": "Ukr. Khim. Zh. (Russ. Ed.)",
    "Ultramicroscopy": "Ultramicroscopy",
    "Ultrasonics Sonochemistry": "Ultrason. Sonochem.",
    "Uspekhi Khimii": "Usp. Khim.",
    "Uzbekskii Khimicheskii Zhurnal": "Uzb. Khim. Zh.",
    "Vacuum": "Vacuum",
    "Vascular Pharmacology": "Vasc. Pharmacol.",
    "Verhandlungen - Internationale Vereinigung fuer Theoretische und Angewandte Limnologie": "Verh. - Int. Ver. Theor. Angew. Limnol.",
    "Vestnik Moskovskogo Universiteta, Seriya 2: Khimiya": "Vestn. Mosk. Univ., Ser. 2: Khim.",
    "Vestnik Moskovskogo Universiteta, Seriya 3: Fizika, Astronomiya": "Vestn. Mosk. Univ., Ser. 3: Fiz., Astron.",
    "Vestnik Sankt-Peterburgskogo Universiteta, Seriya 4: Fizika, Khimiya": "Vestn. S.-Peterb. Univ., Ser. 4: Fiz., Khim.",
    "Vestnik Slovenskega Kemijskega Drustva": "Vestn. Slov. Kem. Drus.",
    "Vestsi Akademii Navuk Belarusi, Seryya Biyalagichnykh Navuk": "Vestsi Akad. Navuk BSSR, Ser. Biyal. Navuk",
    "Vestsi Akademii Navuk Belarusi, Seryya Fizika-Energetychnykh Navuk": "Vestsi Akad. Navuk BSSR, Ser. Fiz.-Energ. Navuk",
    "Vestsi Akademii Navuk Belarusi, Seryya Khimichnykh Navuk": "Vestsi Akad. Navuk BSSR, Ser. Khim. Navuk",
    "Vestsi Natsyyanal\'nai Akademii Navuk Belarusi, Seryya Khimichnykh Navuk": "Vestsi Nats. Akad. Navuk Belarusi, Ser. Khim. Navuk",
    "VGB Kraftwerkstechnik": "VGB Kraftwerkstech.",
    "Vibrational Spectroscopy": "Vib. Spectrosc.",
    "Viral Immunology": "Viral Immunol.",
    "Virology": "Virology",
    "Virus Genes": "Virus Genes",
    "Virus Research": "Virus Res.",
    "Vitamins and Hormones (New York)": "Vitam. Horm. (N.Y.)",
    "Voprosy Meditsinskoi Khimii": "Vopr. Med. Khim.",
    "VTT Symposium": "VTT Symp.",
    "Vysokochistye Veshchestva": "Vysokochist. Veshchestva",
    "Vysokomolekulyarnye Soedineniya, Seriya A": "Vysokomol. Soedin., Ser. A",
    "Vysokomolekulyarnye Soedineniya, Seriya A i Seriya B": "Vysokomol. Soedin., Ser. A Ser. B",
    "Vysokomolekulyarnye Soedineniya, Seriya B: Kratkie Soobshcheniya": "Vysokomol. Soedin., Ser. B",
    "Waste Management (Tucson, Arizona)": "Waste Manage. (Tucson, Ariz.)",
    "Water Environment Research": "Water Environ. Res.",
    "Water Quality Research Journal of Canada": "Water Qual. Res. J. Can.",
    "Water Research": "Water Res.",
    "Water Resources (Translation of Vodnye Resursy)": "Water Resour.",
    "Water Resources Research": "Water Resour. Res.",
    "Water Science and Technology": "Water Sci. Technol.",
    "Water, Air, and Soil Pollution": "Water, Air, Soil Pollut.",
    "Wear": "Wear",
    "Weed Science": "Weed Sci.",
    "Weed Technology": "Weed Technol.",
    "Wiley Interdisciplinary Reviews. Cognitive Science Alternative title: WIREs Cognitive Science": "Wiley Interdiscip Rev Cogn Sci",
    "Wiley Interdisciplinary Reviews. Computational Molecular Science Alternative title: WIREs Computational Molecular Science": "Wiley Interdiscip Rev Comput Mol Sci",
    "Wiley Interdisciplinary Reviews. Developmental Biology	Alternative title: WIREs  Developmental Biology": "Wiley Interdiscip Rev Dev Biol",
    "Wiley Interdisciplinary Reviews. Membrane Transport and Signaling Alternative title: WIREs Membrane Transport and Signaling": "Wiley Interdiscip Rev Membr Transp Signal",
    "Wiley Interdisciplinary Reviews. Nanomedicine and Nanobiotechnology Alternative title: WIREs Nanomedicine and Nanobiotechnology": "Wiley Interdiscip Rev Nanomed Nanobiotechnol",
    "Wiley Interdisciplinary Reviews. RNA Alternative title: WIREs RNA": "Wiley Interdiscip Rev RNA",
    "Wiley Interdisciplinary Reviews. Systems Biology and Medicine Alternative title: WIREs Systems Biology and Medicine": "Wiley Interdiscip Rev Syst Biol Med",
    "Wood and Fiber Science": "Wood Fiber Sci.",
    "Wood Science and Technology": "Wood Sci. Technol.",
    "Wuji Huaxue Xuebao": "Wuji Huaxue Xuebao",
    "Wuli": "Wuli",
    "Wuli Huaxue Xuebao": "Wuli Huaxue Xuebao",
    "Wuli Xuebao": "Wuli Xuebao",
    "X-Ray Spectrometry": "X-Ray Spectrom.",
    "X-Ray Structure Analysis Online": "X-Ray Struct. Anal. Online",
    "Xenobiotica": "Xenobiotica",
    "Yadernaya Fizika": "Yad. Fiz.",
    "Yakhak Hoechi": "Yakhak Hoechi",
    "Yakugaku Zasshi": "Yakugaku Zasshi",
    "Yakuri to Chiryo": "Yakuri to Chiryo",
    "Yaowu Fenxi Zazhi": "Yaowu Fenxi Zazhi",
    "Yaoxue Xuebao": "Yaoxue Xuebao",
    "Yeast": "Yeast",
    "Yejin Fenxi": "Yejin Fenxi",
    "Yingyong Huaxue": "Yingyong Huaxue",
    "Yosetsu Gakkai Ronbunshu": "Yosetsu Gakkai Ronbunshu",
    "Youji Huaxue": "Youji Huaxue",
    "Yukagaku": "Yukagaku",
    "Yuki Gosei Kagaku Kyokaishi": "Yuki Gosei Kagaku Kyokaishi",
    "Zairyo": "Zairyo",
    "Zapiski Vsesoyuznogo Mineralogicheskogo Obshchestva": "Zap. Vses. Mineral. O-va.",
    "Zashchita Metallov": "Zashch. Met.",
    "Zavodskaya Laboratoriya": "Zavod. Lab.",
    "Zeitschrift fuer Anorganische und Allgemeine Chemie": "Z. Anorg. Allg. Chem.",
    "Zeitschrift fuer Kristallographie": "Z. Kristallogr.",
    "Zeitschrift fuer Kristallographie - New Crystal Structures": "Z. Kristallogr. - New Cryst. Struct.",
    "Zeitschrift fuer Lebensmittel-Untersuchung und -Forschung": "Z. Lebensm.-Unters. Forsch.",
    "Zeitschrift fuer Metallkunde": "Z. Metallkd.",
    "Zeitschrift fuer Naturforschung, A: Physical Sciences": "Z. Naturforsch., A: Phys. Sci.",
    "Zeitschrift fuer Naturforschung, B: Chemical Sciences": "Z. Naturforsch., B: Chem. Sci.",
    "Zeitschrift fuer Naturforschung, C: Biosciences": "Z. Naturforsch., C: Biosci.",
    "Zeitschrift fuer Naturforschung, C: Journal of Biosciences": "Z. Naturforsch., C: J. Biosci.",
    "Zeitschrift fuer Physik A: Hadrons and Nuclei": "Z. Phys. A: Hadrons Nucl.",
    "Zeitschrift fuer Physik B: Condensed Matter": "Z. Phys. B: Condens. Matter",
    "Zeitschrift fuer Physik C: Particles and Fields": "Z. Phys. C: Part. Fields",
    "Zeitschrift fuer Physik D: Atoms, Molecules and Clusters": "Z. Phys. D: At., Mol. Clusters",
    "Zeitschrift fuer Physikalische Chemie (Muenchen, Germany)": "Z. Phys. Chem. (Muenchen, Ger.)",
    "Zentralblatt fuer Bakteriologie, Supplement": "Zentralbl. Bakteriol., Suppl.",
    "Zeolites": "Zeolites",
    "Zhongcaoyao": "Zhongcaoyao",
    "Zhongguo Jiguang": "Zhongguo Jiguang",
    "Zhongguo Kangshengsu Zazhi": "Zhongguo Kangshengsu Zazhi",
    "Zhongguo Shengwu Huaxue Yu Fenzi Shengwu Xuebao": "Zhongguo Shengwu Huaxue Yu Fenzi Shengwu Xuebao",
    "Zhongguo Xitu Xuebao": "Zhongguo Xitu Xuebao",
    "Zhongguo Yaoli Xuebao": "Zhongguo Yaoli Xuebao",
    "Zhongguo Yiyao Gongye Zazhi": "Zhongguo Yiyao Gongye Zazhi",
    "Zhonghua Fangsh Yixue Yu Fanghu Zazhi": "Zhonghua Fangsh Yixue Yu Fanghu Zazhi",
    "Zhurnal Analiticheskoi Khimii": "Zh. Anal. Khim.",
    "Zhurnal Eksperimental\'noi i Teoreticheskoi Fiziki": "Zh. Eksp. Teor. Fiz.",
    "Zhurnal Evolyutsionnoi Biokhimii i Fiziologii": "Zh. Evol. Biokhim. Fiziol.",
    "Zhurnal Fizicheskoi Khimii": "Zh. Fiz. Khim.",
    "Zhurnal Nauchnoi i Prikladnoi Fotografii": "Zh. Nauchn. Prikl. Fotogr.",
    "Zhurnal Neorganicheskoi Khimii": "Zh. Neorg. Khim.",
    "Zhurnal Obshchei Biologii": "Zh. Obshch. Biol.",
    "Zhurnal Obshchei Khimii": "Zh. Obshch. Khim.",
    "Zhurnal Organicheskoi Khimii": "Zh. Org. Khim.",
    "Zhurnal Prikladnoi Khimii (S. -Peterburg)": "Zh. Prikl. Khim. (Leningrad)",
    "Zhurnal Prikladnoi Spektroskopii": "Zh. Prikl. Spektrosk.",
    "Zhurnal Strukturnoi Khimii": "Zh. Strukt. Khim.",
    "Zhurnal Tekhnicheskoi Fiziki": "Zh. Tekh. Fiz.",
    "Zhurnal Vsesoyuznogo Khimicheskogo Obshchestva im. D. I. Mendeleeva": "Zh. Vses. Khim. O-va. im. D. I. Mendeleeva"
}


