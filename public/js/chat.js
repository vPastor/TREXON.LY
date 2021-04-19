$(document).ready(function () {
  console.log("hola!");
  var content = $("#content");
  content.hide();
  $("#errorn").hide();
  //Inicializa socket con IO
  const socket = io();
  var nickname = $("#nickname");
  var setNick = $("#setNick");
  var users = $("#users");
  var currentuser = "";
  var sala = $('#selectRoom').find("option:selected").val();
  console.log("Sala al principio "+sala);
  //Cuando cambia el select redirigimos a la URL del chat
  $('#selectRoom').on("change",()=>{
    
    sala = $(this).find("option:selected").val();
    console.log("Sala al cambiar "+sala);
    console.log("cambiando de salaa"+sala);
    window.location.href = "/chat/"+sala;
  })
  setNick.click(function(e){
      e.preventDefault();
      socket.emit('newUser',nickname.val(),function(data){
          if(data){
            $("#nickContainer").hide();
            $("#content").show();
            currentuser=nickname.val();
            
          }else{
            $("#errorn").show();
          }
      })
  })
  //Accion cuando el usuario envia mensaje con submit
  $("#send").submit(function (e) {
    e.preventDefault();
    msg = $("#msg").val();
    console.log(msg);
    /*
    $("#chat").append(`<p>${msg}<p>`);*/
    var toSend = {user:currentuser,text:msg}
    console.log("Sala al enviar "+sala);
    socket.emit("sendmsg"+sala,toSend);
  });

  //Acciones a realizar cuando se detecta actividad en el canal newMsg
  socket.on('newMsg',function(data){
    console.log("Mensaje recibido");
    var user = data.user;
    var msg = data.text;
    $("#chat").append(`<p>${user}- ${msg}<p>`);
  });
  socket.on('usernames',function(data){
    console.log("username nuevo");

    var keys = Object.keys(data);
    $("#users").html();
    for (var i =0;i<keys.length;i++)
    {
      $("#users").append(`<p style="color: #0000fe">${keys[i]}</p>`);;
    }

  });
  socket.on('newMsg'+sala,function(data){
    console.log("Mensaje recibido en la sala "+sala);
    var user = data.user;
    var msg = data.text;
    $("#chat").append(`<p>${user}- ${msg}<p>`);
  });
});
