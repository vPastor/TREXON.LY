const express = require('express');
const router = express.Router();
var chatCtrl = require('../controllers/chat');
var inciCtrl = require('../controllers/proyecto');
var bodyParser = require('body-parser');
var app = require("../../index");
const multer = require('multer');

var upload = multer({
    dest: 'public/uploads',
    limits: {
        fileSize: 3000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
});
/*router.use( function (req, res, next) {
    if(req.session.user)
    {
        next();
    }
    else{
        res.render('login', { layout: 'layout', template: 'home-template' });
    }
    
  });*/
router.get("/", function (req, res, next) {
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
    res.locals.user = req.session.user;
    res.render('index', { layout: 'layout', template: 'home-template' });
    // }
});
router.get('/crearoferta', function (req, res) {
    //res.locals.role = req.session.role;
    /*if (req.session.user) {
        res.render('info', {
            layout: 'layout', template: 'home-template',
            message: "Session is already started "
        });
    } else {*/
    res.locals.user = req.session.user;
    res.render('crearoferta', { layout: 'layout', template: 'home-template' });
    // }
});

//route the /register get and render to de registration page
//and save the role session in local to send it to the view
router.get('/register', function (req, res) {
    res.render('registration', { layout: 'layout', template: 'home-template' });
});
//import users controller
var userCtrl = require("../controllers/user.js");
router.post("/validate_login", userCtrl.login);
router.post("/validate_login", function (req, res, next) {
    req.session.user = req.user;
    res.render('index', {
        layout: 'layout', template: 'home-template',
        user: req.user
    });
});
var proyectoCtrl = require("../controllers/proyecto.js");
router.get('/ofertas', proyectoCtrl.list);
router.get('/ofertas', function (req, res, next) {
    res.render('ofertas', { layout: 'layout', template: 'home-template', ofertas: req.proyecto });
});
router.get('/gestionarofertas', proyectoCtrl.listOwn);
router.get('/gestionarofertas', function (req, res, next) {
    res.render('gestionarofertas', { layout: 'layout', template: 'home-template', ofertas: req.proyecto });
});

router.get('/editarproyecto/:ernombre', proyectoCtrl.findOne);
router.get('/editarproyecto/:ernombre', function (req, res, next) {
    res.render('editaroferta', { layout: 'layout', template: 'home-template', ofertas: req.proyecto });
});
//OFERTAS
/*
router.get('/ofertas', async function (req, res) {
    //res.locals.role = req.session.role;
    /*if (req.session.user) {
        res.render('info', {
            layout: 'layout', template: 'home-template',
            message: "Session is already started "
        });
    } else {
    
    console.log(res.locals.ofertas[0].empresario)
    res.render('ofertas', { layout: 'layout', template: 'home-template', test:ofertitas });
    // }
});*/



router.post("/crearoferta", proyectoCtrl.create
);
router.post("/crearoferta", function (req, res, next) {
    res.render('index', {
        layout: 'layout', template: 'home-template'
    });
}
);
router.get('/logout', function (req, res) {
    delete req.session.user;
    res.render('login', {
        layout: 'layout', template: 'home-template'
    });
});




//Create a route for create new user
router.post("/create", userCtrl.register);
router.post("/create", function (req, res, next) {
    res.render('login', {
        layout: 'layout', template: 'home-template'
    });
});
module.exports = router;
