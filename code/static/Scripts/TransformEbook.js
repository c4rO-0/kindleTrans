

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

function getImageSize(imgFile){

    return new Promise((resolve, reject) => {

        var reader = new FileReader();

        //Read the contents of Image File.
        reader.readAsDataURL(imgFile);
        reader.onload = function (e) {
        
          //Initiate the JavaScript Image object.
          var image = new Image();
        
          //Set the Base64 string return from FileReader as source.
          image.src = e.target.result;
        
          //Validate the File Height and Width.
          image.onload = function () {
            resolve({'height':this.height, 'width':this.width})
          };
        };
    })
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

    $("#coverUpload").on("change", function (e) {
        let fileName = e.target.files[0].name

        $('.alert-cover').remove()
        getImageSize(e.target.files[0]).then((size)=>{
            console.log('cover : ', size.height, size.width)
            if(size.height/size.width != 960/640){

                $('#formUpload').append(
                    "<div class='alert alert-danger alert-cover' role='alert'>"
                    + "封面尺寸要求长宽比 3:2" + ", 上传的封面比例为" +String(size.height/size.width)+ ":1 尺寸为 " + String(size.height)+'x'+String(size.width) +"."
                    + "请重新上传."
                    + "</div>"
                )
                $("#coverUpload").get(0).value = '';
            }else{
                $(this).next(".custom-file-label").html(fileName)
            }
        })

    })

    // $("#buttonUpload").on("click", function (e) {
    //     let fileName = e.target.files[0].name
    //     $(this).next(".custom-file-label").html(fileName)

    //     getImageSize(e.target.files[0]).then((size)=>{
    //         console.log('cover : ', size.height, size.width)
    //         if(size.height >100 || size.width > 100){
    //             $('#formUpload').append(
    //                 "<div class='alert alert-danger' role='alert'>"
    //                 + "封面尺寸要求 XXxXX" + ", 上传的封面尺寸为 " + String(size.height)+'x'+String(size.width) +
    //                 "</div>"
    //             )
    //         }
    //     })

    // })


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
    // let total =  diskAvail / (1.-diskUsage + 1.E-8)
    // console.log(diskAvail, diskUsage , total, (total- (diskAvail - 1048576))/total )
    // console.log(String((total- (diskAvail - 1048576))/total*100.)+'%')

    // $('#hard-disk .progress-bar:eq(0)').css('width', String((total- (diskAvail - 1048576))/total*100.)+'%' )

    // $('#hard-disk .progress-bar:eq(1)').css('width', String(100.-(total- (diskAvail - 1048576))/total*100.)+'%' )

    // if((1.-(total- (diskAvail - 1048576))/total) > 0.5 ){
        
    //     $('#hard-disk .progress-bar:eq(1)').text('可用硬盘'+(100.-(total- (diskAvail - 1048576))/total*100.).toFixed(2)+'%' )
    // }else{
    //     $('#hard-disk .progress-bar:eq(0)').text('硬盘已使用'+((total- (diskAvail - 1048576))/total*100.).toFixed(2)+'%' )
    // }
    

    // $('#hard-disk .progress-bar:eq(1)').removeClass("bg-danger")
    // $('#hard-disk .progress-bar:eq(1)').removeClass("bg-warning")
    // $('#hard-disk .progress-bar:eq(1)').removeClass("bg-success")
    // if(diskAvail < 1048576*2 || (1.-(total- (diskAvail - 1048576))/total) < 0.3 ){
    //     $('#hard-disk .progress-bar:eq(1)').addClass("bg-danger")
    // }else if(diskAvail < 1048576*4 || (1.-(total- (diskAvail - 1048576))/total) < 0.5 ){
    //     $('#hard-disk .progress-bar:eq(1)').addClass("bg-warning")
    // }else{
    //     $('#hard-disk .progress-bar:eq(1)').addClass("bg-success")
    // }

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