const express = require('express');
const router = express.Router();
var chatCtrl = require('../controllers/chat');
var inciCtrl = require('../controllers/incidencia');
var bodyParser = require('body-parser');
var app = require("../../index");
router.get("/",function(req,res,next){
    console.log("Hola llega aqui!");
    res.render('login', { layout: 'layout', template: 'home-template' });
});
router.get('/login', function (req, res) {
    //res.locals.role = req.session.role;
    /*if (req.session.user) {
        res.render('info', {
            layout: 'layout', template: 'home-template',
            message: "Session is already started "
        });
    } else {*/
        res.render('login', { layout: 'layout', template: 'home-template' });
   // }
});

router.get('/index', function (req, res) {
    //res.locals.role = req.session.role;
    /*if (req.session.user) {
        res.render('info', {
            layout: 'layout', template: 'home-template',
            message: "Session is already started "
        });
    } else {*/
        res.render('index', { layout: 'layout', template: 'home-template' });
   // }
});

//route the /register get and render to de registration page
//and save the role session in local to send it to the view
router.get('/register', function (req, res) {
    res.render('registration', { layout: 'layout', template: 'home-template' });
});
//import users controller
var userCtrl = require("../controllers/user.js");
router.post("/validate_login",async function (req,res){
    var name = req.body.user;
    var password = req.body.password;
    var query = {
        "name": name,
        "password": password
    };
        var resp = await userCtrl.login(query);
        console.log(resp);
        if(resp==false)
        {
                res.render('login', {
                layout: 'layout', template: 'home-template',
                salida: "User not found"
            });
        }
        else{
            console.log("ahora viene el user de respuesta /n");
            console.log(resp);
            res.render('index',{ "user": resp
            });
            
        }
        
    }
        );

//Create a route for create new user
router.route("/create")
    .post(userCtrl.register);

module.exports = router;
