const express = require('express');
const router = express.Router();

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
/*routers.use( function (req, res, next) {
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
    res.render('login', { layout: 'layout', template: 'home-template' });
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

// USER

var userCtrl = require("../controllers/user.js");
//Create a route for create new user
router.post("/create", userCtrl.register);
router.post("/create", function (req, res, next) {
    res.render('login', {
        layout: 'layout', template: 'home-template', salida: 'Usuario creado correctamente'
    });
});

//route the /register get and render to de registration page
//and save the role session in local to send it to the view
router.get('/register', function (req, res) {
    res.render('registration', { layout: 'layout', template: 'home-template' });
});

router.post("/validate_login", userCtrl.login);
router.post("/validate_login", function (req, res, next) {
    req.session.user = req.user;
    res.render('index', {
        layout: 'layout', template: 'home-template',
        user: req.user
    });
});



router.get('/logout', function (req, res) {
    delete req.session.user;
    res.render('login', {
        layout: 'layout', template: 'home-template'
    });
});


//PROYECTOS

var proyectoCtrl = require("../controllers/proyecto.js");

router.get('/proyecto/:ernombre', proyectoCtrl.findOne);
router.get('/proyecto/:ernombre', function (req, res, next) {
    res.render('proyectos', { layout: 'layout', template: 'home-template', proyectos: req.proyecto });
});


router.get('/editarproyecto/:ernombre', proyectoCtrl.findOne);
router.get('/editarproyecto/:ernombre', function (req, res, next) {
    res.render('editaroferta', { layout: 'layout', template: 'home-template', proyectos: req.proyecto });
});

router.get('/gestionarproyectos', proyectoCtrl.listOwn);
router.get('/gestionarproyectos', function (req, res, next) {
    res.render('gestionarproyectos', { layout: 'layout', template: 'home-template', proyectos: req.proyecto });
});

router.get('/proyectos', proyectoCtrl.list);
router.get('/proyectos', function (req, res, next) {
    res.render('proyectos', { layout: 'layout', template: 'home-template', proyectos: req.proyecto });
});

router.get("/crearproyecto", function (req, res, next) {
    res.locals.user =req.session.user
    res.render('crearproyecto', {
        layout: 'layout', template: 'home-template'
    });
}
);

router.post("/crearproyecto", proyectoCtrl.create
);
router.post("/crearproyecto", function (req, res, next) {
    res.render('proyectos', {
        layout: 'layout', template: 'home-template', proyectos: req.proyecto
    });
}
);

//OFERTAS

var ofertaCtrl = require("../controllers/oferta.js");

router.get('/ofertas', ofertaCtrl.list);
router.get('/ofertas', function (req, res, next) {
    res.render('ofertas', { layout: 'layout', template: 'home-template', ofertas: req.ofertas });
});
router.get('/verofertas/:ernombre', ofertaCtrl.listproyecto);
router.get('/verofertas/:ernombre', function (req, res, next) {
    res.render('ofertas', { layout: 'layout', template: 'home-template', ofertas: req.ofertas });
});
router.get('/gestionarofertas/:proyectoid', ofertaCtrl.listproyecto);
router.get('/gestionarofertas/:proyectoid', function (req, res, next) {
    res.render('gestionarofertas', { layout: 'layout', template: 'home-template', ofertas: req.ofertas, proyecto: req.proyecto });
});

router.get("/crearoferta", function (req, res, next) {
    
    res.render('crearoferta', {
        layout: 'layout', template: 'home-template', proyecto: req.proyecto
    });
}
);

router.post("/crearoferta", ofertaCtrl.create
);
router.post("/crearoferta", function (req, res, next) {
    res.render('gestionarofertas', {
        layout: 'layout', template: 'home-template', ofertas: req.oferta, proyecto: req.proyecto
    });
}
);





module.exports = router;
