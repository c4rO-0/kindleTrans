// //获取浏览器信息
// function getBrowserInfo(){
//     var Sys = {};
//     var ua = navigator.userAgent.toLowerCase();
//     var s;
//     (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
//     (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
//     (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
//     (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
//     (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
//     (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

    
//     if (Sys.ie) {

//         // console.log('IE: ' + Sys.ie);
//         return {"name":'IE',"version":Sys.ie}
//     }
//     if (Sys.firefox) {
//         console.log('Firefox: ' + Sys.firefox);
//         return {"name":'Firefox',"version":Sys.firefox}
//     }
//     if (Sys.chrome) {
//         console.log('Chrome: ' + Sys.chrome);
//         return {"name":'Chrome',"version":Sys.chrome}
//     }
//     if (Sys.opera) {
//         // console.log('Opera: ' + Sys.opera);
//         return {"name":'Opera',"version":Sys.opera}
//     }
//     if (Sys.safari) {
//         // console.log('Safari: ' + Sys.safari);
//         return {"name":'Safari',"version":Sys.safari}
//     }

//     console.log('unknown: ');    
//     return {"name":'Unknown',"version":0}
// }

// //promise based asynchronous xmlHttpRequest
// function asynHttpRequest(method, url) {

//     return new Promise((resolve, reject) => {
//         console.log("%c" + "requesting...: " + url, "color:#00ff00")//DEBUG
//         const xhr = new XMLHttpRequest();
       
            
//         xhr.open(method, url, true);
//         xhr.onload = () => {
//             // checkResponse(xhr);//DEBUG
//             resolve(xhr.response);
//         };
//         xhr.onerror = () => {
//             console.log("error occur while accessing " + url);
//             reject("error when http requesting");
//         };
//         if (method == "POST") {
//             xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
//         };//needed in post mode
//         //counter-anit-scraping

//         browserInfo = getBrowserInfo()
//         if(browserInfo["name"] == "Firefox"){    
//             xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 5.1; rv:37.0) Gecko/20100101 Firefox/37.0');
//         }else if(browserInfo["name"] == "Chrome"){
//             // xhr.setRequestHeader('User-Agent', 'Chrome/51.0.2704.63 Safari/537.36'); 
//         }
        
//         xhr.send();
//         // popUpNotification("in asyn... request sent");//DEBUG)
//     });

// }

// function searchDouban(bookName) {
//     let url = 'https://www.douban.com/search?cat=1001&q='+bookName

//     return new Promise((resolve, reject) => {
//         asynHttpRequest("GET",url).then((html) =>{ resolve(html)})
//     })
// }

$(document).ready(function () { 
    console.log("准备");

    // searchDouban("圣女的救济 ").then((html) => {

    //     console.log(html)

    // })

    // p = asynHttpRequest("GET",'https://www.douban.com/search?cat=1001&q=圣女的救济 ')
    // p = asynHttpRequest("GET",'https://www.douban.com/search?cat=1001&q=圣女的救济 ')

    // p.then(() => {

    //     console.log(p);
    // })

})