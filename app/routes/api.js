 const express = require('express');

const router = express.Router();


router.get("/",function(req,res,next){
    //res.send("HOLA MUNDOO!")
    var chat = [{
        nick: "Pedro",
        text: "hola",
      },
      {
         nick: "Manuel",
         text: "hola, que tal",
       }];
       res.json(chat);
});

router.get("/list",function(req,res,next){
  //res.send("HOLA MUNDOO!")
  res.json(chatCtrl.load);

  
});

router.get("/create",function(req,res,next){
  //res.send("HOLA MUNDOO!")

});

router.get("/filtraruser/:user",function(req,res,next){
  //res.send("HOLA MUNDOO!")

     res.json(chat);
});

router.get("/filtrarestado/:estado",function(req,res,next){
  //res.send("HOLA MUNDOO!")

     res.json(chat);
});

router.get("/delete/:id",function(req,res,next){
  //res.send("HOLA MUNDOO!")

     res.json(chat);
});
router.get("/cambiarestado/:id",function(req,res,next){
  //res.send("HOLA MUNDOO!")

     res.json(chat);
});

module.exports = router;