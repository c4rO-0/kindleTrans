
function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onloadend = function () {
        callback()
    }

    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}


$(document).ready(function () {

    let urlList = {
        'BJ': { ipUrl: "http://60.205.168.178/", url:'http://60.205.168.178/TransformEbook', resTime: undefined, name: '中国', id:'server-zh', host: ['60.205.168.178'] },
        'JK': { ipUrl: "http://81.2.242.163/", url:'http://papercomment.tech/TransformEbook', resTime: undefined, name: '欧洲', id:'server-eu', host: ['81.2.242.163', 'papercomment.tech', 'tool.papercomment.tech'] }
    }

    // console.log("准备");
    $("#fileUpload").on("change", function (e) {
        let fileName = e.target.files[0].name
        $(this).next(".custom-file-label").html(fileName)
    })

    // current
    let host = location.hostname 

    for (let loc of Object.keys(urlList)) {
        if(urlList[loc].id ){
            $('#server-list').append('<a class="btn btn-outline-secondary text-dark" \
            id="'+ urlList[loc].id +'" \
            href="'+urlList[loc].url+'">'+ urlList[loc].name +'</a>')
        }
        if(urlList[loc].host.includes(host)){
            $('#'+urlList[loc].id).addClass('bg-success')
        }
    }


    // ping
    let pingTimeStart = (new Date()).getTime()

    let promiseArray = []

    for (let loc of Object.keys(urlList)) {

        promiseArray.push(
            new Promise((resolve, reject) => {
                httpGetAsync(urlList[loc].ipUrl, () => {
                    // console.log(loc, 'resp')
                    urlList[loc].resTime = (new Date()).getTime() - pingTimeStart
                    resolve()
                })
            })
        )

    }

    Promise.all(promiseArray).then(() => {
        // console.log(urlList)
        let minPingKey = 'BJ'
        // let minPing = urlList[minPingKey].resTime
        for (let loc of Object.keys(urlList)) {
            if(urlList[minPingKey].resTime > urlList[loc].resTime){
                minPingKey = loc
            }
        }

        $('#server-suggest').append('推荐您使用<a href="'+urlList[minPingKey].url+'">'+urlList[minPingKey].name+'</a>服务器')

    })




})