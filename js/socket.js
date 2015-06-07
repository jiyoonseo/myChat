jQuery(function($){
  var socket = io.connect();
  
  //nickname form handle
  var $nickForm=$('#setNick');
  var $nickError = $('#nickError');
  var $nickBox = $('#nickname');
  var $users = $('#users');
  
  //message box handle
  var $messageForm = $('#send-message');
  var $messageBox = $('#message');
  var $chat = $('#chat');
  
  //nickname form handler
  $nickForm.submit(function(e){
    e.preventDefault(); //prevent the default behavior
    socket.emit('new user', $nickBox.val(), function(data){
      if(data){
        $('#nickWrap').hide();
        $('#contentWrap').show();
      }else{
        $nickError.html('The user name you entered was taken. Try again.');
      }
      
    });
    //$nickBox.val('');
  });
  
  //show user name list 
  socket.on('usernames', function(data){
    //show the array
    var userlist= '';
    for(i = 0 ; i<data.length; i++){
      if($nickBox.val() === data[i]){
        userlist += '<span id="myID">'+ data[i] + '(ME)</span><br/>';
      }else{
        userlist += data[i] + '<br/>';  
      }
      
    }

    $users.html(userlist);

  });


  //message box handler
  $messageForm.submit(function(e){
    e.preventDefault(); //no need to refresh the page
    socket.emit('send message', $messageBox.val());
    $messageBox.val('');
  });
  

  //receive from client-side (show nickname and message)
  socket.on('new message', function(data){
    //display the message
    $chat.append("<b><span id='userIDline'>" + data.userid + ":</span></b> " + "<span id='myMsg'>" +data.msg + "</span>" + " <div id='time'>&nbsp;&nbsp;&nbsp;&nbsp;PSD " + data.current_hour + ":" + data.current_min +"</div> <br/>");

  });

  socket.on('private message', function(data){

    //receive receipient name (case sensitive)
    if(data.recepientInRoom == false){

      if($nickBox.val() === data.userid){
        $chat.append("<b><span id='userPrivateIDline'>" + data.userid + "(Private):</span></b> " + "<span id='notDelivered'>" + data.msg + "</span>" + " <div id='time'>&nbsp;&nbsp;&nbsp;&nbsp;PSD " + data.current_hour + ":" + data.current_min +"</div> <br/>");   
        $chat.append("<span id='err'><b>PLEASE CHECK RECEPIENT NAME.(case-sensitive)<Br>Your message has not been delivered successfully.</b><br></span>");             
      }




    }else{ //if data.recepientInRoom exist in the room.

      if($nickBox.val() === data.recepient ){
        //display the private message
        $chat.append("<b><span id='userPrivateIDline'>" + data.userid + " (Private to me):</span></b> " + "<span id='myMsg'>" +data.msg + "</span>" + " <div id='time'>&nbsp;&nbsp;&nbsp;&nbsp;PSD " + data.current_hour + ":" + data.current_min +"</div> <br/>");

      }else if($nickBox.val() === data.userid){
        //display the private message
        $chat.append("<b><span id='userPrivateIDline'>" + data.userid + " (Private to " + data.recepient + "):</span></b> " + "<span id='myMsg'>" +data.msg + "</span>" + " <div id='time'>&nbsp;&nbsp;&nbsp;&nbsp;PSD " + data.current_hour + ":" + data.current_min +"</div> <br/>");
      }
    }


  });

});
