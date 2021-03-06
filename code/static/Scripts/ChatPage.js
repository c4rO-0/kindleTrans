$(document).ready(function () { 
// grab the room from the URL
var room = location.search && location.search.split('?')[1];

// create our webrtc connection
var webrtc = new SimpleWebRTC({
    url:'http://papercomment.tech:8888',
    // we don't do video
    localVideoEl: '',
    remoteVideosEl: '',
    // dont ask for camera access
    autoRequestMedia: false,
    // dont negotiate media
    receiveMedia: {
        offerToReceiveAudio: false,
        offerToReceiveVideo: false
    }
});

// called when a peer is created
webrtc.on('createdPeer', function (peer) {
    console.log('createdPeer', peer);

    // show ones own id
    var ownID = webrtc.connection.getSessionid()
    $("#ownID").text("ID : "+ownID)

    var remotes = document.getElementById('remotes');
    if (!remotes) return;
    var container = document.createElement('div');
    container.className = 'peerContainer';
    container.id = 'container_' + webrtc.getDomId(peer);

    // show the peer id
    var peername = document.createElement('div');
    peername.className = 'peerName';
    peername.appendChild(document.createTextNode('Peer: ' + peer.id));
    container.appendChild(peername);

    // show a list of files received / sending
    var filelist = document.createElement('ul');
    filelist.className = 'fileList';
    container.appendChild(filelist);

    // show a file select form
    var fileinput = document.createElement('input');
    fileinput.type = 'file';

    // send a file
    fileinput.addEventListener('change', function() {
        fileinput.disabled = true;

        var file = fileinput.files[0];
        var sender = peer.sendFile(file);

        // create a file item
        var item = document.createElement('li');
        item.className = 'sending';

        // make a label
        var span = document.createElement('span');
        span.className = 'filename';
        span.appendChild(document.createTextNode(file.name));
        item.appendChild(span);

        span = document.createElement('span');
        span.appendChild(document.createTextNode(file.size + ' bytes'));
        item.appendChild(span);

        // create a progress element
        var sendProgress = document.createElement('progress');
        sendProgress.max = file.size;
        item.appendChild(sendProgress);

        // hook up send progress
        sender.on('progress', function (bytesSent) {
            sendProgress.value = bytesSent;
        });
        // sending done
        sender.on('sentFile', function () {
            item.appendChild(document.createTextNode('sent'));

            // we allow only one filetransfer at a time
            fileinput.removeAttribute('disabled');
        });
        // receiver has actually received the file
        sender.on('complete', function () {
            // safe to disconnect now
        });
        filelist.appendChild(item);
    }, false);
    fileinput.disabled = 'disabled';
    container.appendChild(fileinput);

    // show the ice connection state
    if (peer && peer.pc) {
        var connstate = document.createElement('div');
        connstate.className = 'connectionstate';
        container.appendChild(connstate);
        peer.pc.on('iceConnectionStateChange', function (event) {
            var state = peer.pc.iceConnectionState;
            console.log('state', state);
            container.className = 'peerContainer p2p' + state.substr(0, 1).toUpperCase()
                + state.substr(1);
            switch (state) {
            case 'checking': 
                connstate.innerText = 'Connecting to peer...';
                break;
            case 'connected':
            case 'completed': // on caller side
                connstate.innerText = 'Connection established.';
                // enable file sending on connnect
                fileinput.removeAttribute('disabled');
                break;
            case 'disconnected':
                connstate.innerText = 'Disconnected.';
                break;
            case 'failed':
                // not handled here
                break;
            case 'closed':
                connstate.innerText = 'Connection closed.';

                // disable file sending
                fileinput.disabled = 'disabled';
                // FIXME: remove container, but when?
                break;
            }
        });
    }
    remotes.appendChild(container);

    // receiving an incoming filetransfer
    peer.on('fileTransfer', function (metadata, receiver) {
        console.log('incoming filetransfer', metadata);
        var item = document.createElement('li');
        item.className = 'receiving';

        // make a label
        var span = document.createElement('span');
        span.className = 'filename';
        span.appendChild(document.createTextNode(metadata.name));
        item.appendChild(span);

        span = document.createElement('span');
        span.appendChild(document.createTextNode(metadata.size + ' bytes'));
        item.appendChild(span);

        // create a progress element
        var receiveProgress = document.createElement('progress');
        receiveProgress.max = metadata.size;
        item.appendChild(receiveProgress);

        // hook up receive progress
        receiver.on('progress', function (bytesReceived) {
            receiveProgress.value = bytesReceived;
        });
        // get notified when file is done
        receiver.on('receivedFile', function (file, metadata) {
            console.log('received file', metadata.name, metadata.size);
            var href = document.createElement('a');
            href.href = URL.createObjectURL(file);
            href.download = metadata.name;
            href.appendChild(document.createTextNode('download'));
            item.appendChild(href);

            // close the channel
            receiver.channel.close();
        });
        filelist.appendChild(item);
    });
});

// local p2p/ice failure
webrtc.on('iceFailed', function (peer) {
    var connstate = document.querySelector('#container_' + webrtc.getDomId(peer) + ' .connectionstate');
    var fileinput = document.querySelector('#container_' + webrtc.getDomId(peer) + ' input');
    console.log('local fail', connstate);
    if (connstate) {
        connstate.innerText = 'Connection failed.';
        fileinput.disabled = 'disabled';
    }
});

// remote p2p/ice failure
webrtc.on('connectivityError', function (peer) {
    var connstate = document.querySelector('#container_' + webrtc.getDomId(peer) + ' .connectionstate');
    var fileinput = document.querySelector('#container_' + webrtc.getDomId(peer) + ' input');
    console.log('remote fail', connstate);
    if (connstate) {
        connstate.innerText = 'Connection failed.';
        fileinput.disabled = 'disabled';
    }
});

function setRoom(name) {
    // document.querySelector('form').remove();
    // document.getElementById('title').innerText = '房间号/Room: ' + name;
    document.getElementById('subTitle').innerText =  '分享房间链接: ' + location.href;
    $('body').addClass('active');
}

//=========== 随机或得hash值 =====================\\

//产生一个hash值，只有数字，规则和java的hashcode规则相同
function hashCode(str) {
    var h = 0;
    var len = str.length;
    var t = 2147483648;
    for (var i = 0; i < len; i++) {
        h = 31 * h + str.charCodeAt(i);
        if (h > 2147483647) h %= t; //java int溢出则取模
    }
    /*var t = -2147483648 * 2;
     while (h > 2147483647) {
     h += t
     }*/
    return h;
}

function randomWord(randomFlag, min, max) {
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}

function gethashcode() {
    //定义一个时间戳，计算与1970年相差的毫秒数  用来获得唯一时间
    var timestamp = (new Date()).valueOf();
    var myRandom=randomWord(false,6);
    var hashcode=hashCode(myRandom+timestamp.toString());
    return hashcode;
}

if (room) {
    setRoom(room);
    webrtc.joinRoom(room, function (err, res) {
        console.log('joined', room, err, res);
    });
} else {
    $('form>button').attr('disabled', null);
    //$('form').submit(function () { 
    var val = gethashcode().toString(); 
    webrtc.createRoom(val, function (err, name) {
        console.log(' create room cb', arguments);
    
        var newUrl = location.pathname + '?' + name;
        if (!err) {
            history.replaceState({foo: 'bar'}, null, newUrl);
            setRoom(name);
        } else {
            console.log(err);
        }
    });
    // return false; 
//});
         

}
})