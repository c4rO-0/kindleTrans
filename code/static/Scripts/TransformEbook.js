

function toggleNewFeatures() {
    let target = document.getElementById('newFeatures')
    if (target.classList.contains('newFeaturesHide')) {
        target.classList.remove('newFeaturesHide')
    } else {
        target.classList.add('newFeaturesHide')
    }
}

function hideNewFeature(event) {
    let target = document.getElementById('newFeatures')
    if (!event.target.closest('#newFeatures') && !target.classList.contains('newFeaturesHide')) {
        target.classList.add('newFeaturesHide')
    }
}

function showNewFeatures() {
    let target = document.getElementById('newFeatures')
    if (target.classList.contains('newFeaturesHide')) {
        target.classList.remove('newFeaturesHide')
    }
}

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
        'BJ': { ipUrl: "http://60.205.168.178/", url: 'http://60.205.168.178/TransformEbook', resTime: undefined, name: '中国', id: 'server-zh', host: ['60.205.168.178'] },
        'JK': { ipUrl: "http://81.2.242.163/", url: 'http://papercomment.tech/TransformEbook', resTime: undefined, name: '欧洲', id: 'server-eu', host: ['81.2.242.163', 'papercomment.tech', 'tool.papercomment.tech'] }
    }

    // console.log('disk available : ', diskAvail)
    // if(diskAvail )

    // console.log("准备");
    $("#fileUpload").on("change", function (e) {
        let fileName = e.target.files[0].name
        $(this).next(".custom-file-label").html(fileName)
    })

    // current
    let host = location.hostname

    for (let loc of Object.keys(urlList)) {
        if (urlList[loc].id) {
            $('#server-list').append('<a class="btn btn-outline-secondary text-dark" \
            id="'+ urlList[loc].id + '" \
            href="'+ urlList[loc].url + '">' + urlList[loc].name + '</a>')
        }
        if (urlList[loc].host.includes(host)) {
            $('#' + urlList[loc].id).addClass('bg-success')
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
            if (urlList[minPingKey].resTime > urlList[loc].resTime) {
                minPingKey = loc
            }
        }

        $('#server-suggest').append('推荐您使用<a href="' + urlList[minPingKey].url + '">' + urlList[minPingKey].name + '</a>服务器')

    })


    // 设置磁盘空间
    let total =  diskAvail / diskUsage - 1048576
    // console.log(diskAvail, diskUsage , total, (total- (diskAvail - 1048576))/total )
    // console.log(String((total- (diskAvail - 1048576))/total*100.)+'%')
    $('#hard-disk .progress-bar:eq(0)').css('width', String((total- (diskAvail - 1048576))/total*100.)+'%' )

    $('#hard-disk .progress-bar:eq(1)').css('width', String(100.-(total- (diskAvail - 1048576))/total*100.)+'%' )

    $('#hard-disk .progress-bar:eq(0)').text('硬盘已使用'+((total- (diskAvail - 1048576))/total*100.).toFixed(2)+'%' )

    $('#hard-disk .progress-bar:eq(1)').removeClass("bg-danger")
    $('#hard-disk .progress-bar:eq(1)').removeClass("bg-warning")
    $('#hard-disk .progress-bar:eq(1)').removeClass("bg-success")
    if(diskAvail < 1048576*2 || (1.-(total- (diskAvail - 1048576))/total) < 0.3 ){
        $('#hard-disk .progress-bar:eq(1)').addClass("bg-danger")
    }else if(diskAvail < 1048576*4 || (1.-(total- (diskAvail - 1048576))/total) < 0.5 ){
        $('#hard-disk .progress-bar:eq(1)').addClass("bg-warning")
    }else{
        $('#hard-disk .progress-bar:eq(1)').addClass("bg-success")
    }
})