// Connect to PeerJS, have server assign an ID instead of providing one
// Showing off some of the configs available with PeerJS :).
var peer = new Peer({
    host: 'papercomment.tech', port: 9000,
  
    // Set highest debug level (log everything!).
    debug: 3,
  
    // Set a logging function:
    logFunction: function() {
      var copy = Array.prototype.slice.call(arguments).join(' ');
      $('.log').append(copy + '<br>');
    }
  });
  var connectedPeers = {};
  
  // Show this peer's ID.
  peer.on('open', function(id){
    $('#pid').text(id);
  });
  
  // Await connections from others
  peer.on('connection', connect);
  
  peer.on('error', function(err) {
    console.log(err);
  })
  
  // Handle a connection object.
  function connect(c) {
    // Handle a chat connection.
    if (c.label === 'chat') {
      var chatbox = $('<div></div>').addClass('connection').addClass('active').attr('id', c.peer);
      var header = $('<h1></h1>').html('Chat with <strong>' + c.peer + '</strong>');
      var messages = $('<div><em>Peer connected.</em></div>').addClass('messages');
      chatbox.append(header);
      chatbox.append(messages);
   
      // Select connection handler.
      chatbox.on('click', function() {
        if ($(this).attr('class').indexOf('active') === -1) {
          $(this).addClass('active');
        } else {
          $(this).removeClass('active');
        }
      });
      $('.filler').hide();
      $('#connections').append(chatbox);
  
      c.on('data', function(data) {
        messages.append('<div><span class="peer">' + c.peer + '</span>: ' + data +
          '</div>');
          });
          c.on('close', function() {
            alert(c.peer + ' has left the chat.');
            chatbox.remove();
            if ($('.connection').length === 0) {
              $('.filler').show();
            }
            delete connectedPeers[c.peer];
          });
    }
    if (c.label === 'activity') {
      c.on('data', function(data) {
        // console.log(data)
        if(data.activity == "uploading"){
          if(data.filesize < 1000){
            var strFileSize = data.filesize + " B"
          }else if(data.filesize < 1000000){
            var strFileSize = data.filesize/1000 + " KB"
          }else if(data.filesize < 1000000000){
            var strFileSize = data.filesize/1000000 + "MB"
          }else{
            var strFileSize = data.filesize/1000000000 + "TB"
          }

          $('#' + c.peer).find('.messages').append('<div><span class="file">' +
              c.peer + ' is uploading '+ data.filename+ ', Size : ' + strFileSize + '. Please wait.</span></div>');          
        }

        if(data.activity == "upDone"){

          $('#' + c.peer).find('.messages').append('<div><span class="file">' +
              c.peer + ' has received '+ data.filename+ '.</span></div>');          
        }

      });
    }
    if (c.label === 'file') {
      c.on('data', function(data) {
        // If we're getting a file, create a URL for it.
        if (data.file.constructor === ArrayBuffer) {
        //   console.log(data)
          var dataView = new Uint8Array(data.file);
        //   console.log(String.fromCharCode.apply(null, new Uint8Array(data)))
          var dataBlob = new Blob([dataView]);
          var url = window.URL.createObjectURL(dataBlob);

          $('#' + c.peer).find('.messages').append('<div><span class="file">' +
              c.peer + ' has sent you a <a  download="' + data.filename + '" href="' + url + '">file : ' + data.filename + '</a>.</span></div>');

            eachActiveConnection(function(c, $c) {
              if (c.label === 'activity' ){
                c.send({
                  activity:"upDone",
                  filename: data.filename
                })
              }
            });          
        }
      });
    }
    connectedPeers[c.peer] = 1;
  }
  
  $(document).ready(function() {
    // Prepare file drop box.
    var box = $('#box');
    box.on('dragenter', doNothing);
    box.on('dragover', doNothing);
    box.on('drop', function(e){
      e.originalEvent.preventDefault();
      var file = e.originalEvent.dataTransfer.files[0];
      // console.log(file.size/(1000*1000))
      if( file.size/(1000*1000) > 100 ){
        $("#warning").text(file.name + " is larger than 100Mb")
      }else{
        $("#warning").text("")
        eachActiveConnection(function(c, $c) {
            if (c.label === 'activity' ){
              c.send({
                activity:"uploading",
                filename: file.name,
                filesize: file.size
              })
            }
            if (c.label === 'file') {
    
              c.send({        
                file: file,
                filename: file.name,
                filetype: file.type});
    
              $c.find('.messages').append('<div><span class="file">You are uploading ' + file.name + '. Please wait.</span></div>');
            }
          });
      }

    });
    function doNothing(e){
      e.preventDefault();
      e.stopPropagation();
    }
  
    // Connect to a peer
    $('#connect').click(function() {
      var requestedPeer = $('#rid').val();
      if (!connectedPeers[requestedPeer]) {
        // Create 2 connections, one labelled chat and another labelled file.
        var c = peer.connect(requestedPeer, {
          label: 'chat',
          serialization: 'none',
          metadata: {message: 'hi i want to chat with you!'}
        });
        c.on('open', function() {
          connect(c);
        });
        c.on('error', function(err) { alert(err); });

        var f = peer.connect(requestedPeer, { label: 'file', reliable: true });
        f.on('open', function() {
          connect(f);
        });
        f.on('error', function(err) { alert(err); });

        // 传递系统消息
        var m = peer.connect(requestedPeer, { label: 'activity' });
        m.on('open', function() {
          connect(m);
        });
        m.on('error', function(err) { alert(err); });        

      }
      connectedPeers[requestedPeer] = 1;
    });
  
    // Close a connection.
    $('#close').click(function() {
      eachActiveConnection(function(c) {
        c.close();
      });
    });
  
    // Send a chat message to all active connections.
    $('#send').submit(function(e) {
      e.preventDefault();
      // For each active connection, send the message.
      var msg = $('#text').val();
      eachActiveConnection(function(c, $c) {
        if (c.label === 'chat') {
          c.send(msg);
          $c.find('.messages').append('<div><span class="you">You: </span>' + msg
            + '</div>');
        }
      });
      $('#text').val('');
      $('#text').focus();
    });
  

  
    // Show browser version
    $('#browsers').text(navigator.userAgent);
  });
  
  // Make sure things clean up properly.
  
  window.onunload = window.onbeforeunload = function(e) {
    if (!!peer && !peer.destroyed) {
      peer.destroy();
    }
  };
  
  // Goes through each active peer and calls FN on its connections.
  function eachActiveConnection(fn) {
    var actives = $('.active');
    var checkedIds = {};
    actives.each(function() {
      var peerId = $(this).attr('id');

      if (!checkedIds[peerId]) {
        var conns = peer.connections[peerId];
        for (var i = 0, ii = conns.length; i < ii; i += 1) {
          var conn = conns[i];
          fn(conn, $(this));
        }
      }

      checkedIds[peerId] = 1;
    });
  }