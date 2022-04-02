


let urlList = {
    'music163': { ipUrl: "https://music.163.com/", url: 'https://music.163.com/', resTime: undefined, name: '网易云音乐', id: 'server-music163', host: ['https://music.163.com/'] },
    'youtube': { ipUrl: "https://www.youtube.com/", url: 'https://www.youtube.com/', resTime: undefined, name: 'youtube', id: 'server-youtube', host: ['https://www.youtube.com/'] }
}

let minPingKey = 'music163'

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onloadend = function () {
        callback()
    }

    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

$(document).ready(function () {


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
        window.urlList = urlList
        // let minPing = urlList[minPingKey].resTime
        for (let loc of Object.keys(urlList)) {
            if (urlList[minPingKey].resTime > urlList[loc].resTime) {
                minPingKey = loc
            }
        }
        window.minPingKey = minPingKey
        console.log('SERVER:', minPingKey)
    })


    $(document).on('click', '#living_in_the_Shadows', ()=>{

        let url = ''
        if(minPingKey == 'music163'){
            url = 'https://music.163.com/#/song?id=1352831739'
        }else{
            url = 'https://www.youtube.com/watch?v=_2Q07nYdmvs&ab_channel=MatthewPerrymanJones-Topic'
        }
        window.open(url, '_blank').focus();
    })
})