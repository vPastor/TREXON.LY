const express = require('express');
const router = express.Router();
var chatCtrl = require('../controllers/chat');
var inciCtrl = require('../controllers/incidencia');
var bodyParser = require('body-parser');

router.get("/",function(req,res,next){
    console.log("Hola llega aqui!");
    res.render('login', { layout: 'layouts', template: 'home-template' });
});
router.get('/login', function (req, res) {
    //res.locals.role = req.session.role;
    /*if (req.session.user) {
        res.render('info', {
            layout: 'layout', template: 'home-template',
            message: "Session is already started "
        });
    } else {*/
        res.render('login', { layout: 'layouts', template: 'home-template' });
   // }
});

//route the /register get and render to de registration page
//and save the role session in local to send it to the view
router.get('/register', function (req, res) {
    res.render('registration', { layout: 'layout', template: 'home-template' });
});
//import users controller
var user = require("../controllers/user.js");
router.route("/validate_login")
    .post(user.login);

//Create a route for create new user
router.route("/create")
    .post(user.register);

module.exports = router;
