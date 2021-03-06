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
router.use( function (req, res, next) {
    if(req.session.user)
    {
        console.log(req.session.user.name);
    }
    next();
  });
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
var perfilCtrlr = require("../controllers/perfil.js");
var ofertCtrlr =  require("../controllers/oferta.js");
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
router.post("/validate_login", perfilCtrlr.listprofile);
router.post("/validate_login", ofertCtrlr.listAplicaciones);
router.post("/validate_login", function (req, res, next) {

    console.log(req.aplicaciones);
    console.log( req.user);
    req.session.user = req.user;
    res.render('perfil', {
        layout: 'layout', template: 'home-template',
        user: req.session.user, userprofile: req.profile, verticalnavbar:req.aplicaciones, msg:req.message
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
    res.render('proyectos', { layout: 'layout', template: 'home-template', proyecto: req.proyecto });
});


router.get('/editarproyecto/:ernombre', proyectoCtrl.findOne);
router.get('/editarproyecto/:ernombre', function (req, res, next) {
    res.render('editarproyecto', { layout: 'layout', template: 'home-template', proyectos: req.proyecto });
});

router.post('/editarproyecto/:ernombre', proyectoCtrl.updateone);
router.post('/editarproyecto/:ernombre', proyectoCtrl.findOne);
router.post('/editarproyecto/:ernombre', function (req, res, next) {
    res.render('proyectos', { layout: 'layout', template: 'home-template', proyectos: req.proyecto });
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
    res.render('gestionarproyectos', {
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
//VER OFERTAS
router.get('/verofertas/:proyectoid', ofertaCtrl.listproyecto);
router.get('/verofertas/:proyectoid', function (req, res) {
    res.render('ofertas', { layout: 'layout', template: 'home-template', ofertas: req.ofertas });
});
router.get('/gestionarofertas/:proyectoid', ofertaCtrl.listproyecto);
router.get('/gestionarofertas/:proyectoid', function (req, res, next) {
    res.render('gestionarofertas', { layout: 'layout', template: 'home-template', ofertas: req.ofertas, proyecto: req.proyecto });
});
router.get('/gestionaraplicantes', function (req, res, next) {
    res.render('elegircandidatos', { layout: 'layout', template: 'home-template', verticalnavbar:true });
});

router.get('/editaroferta/:proyectoid/:nombreoferta', ofertaCtrl.findOne);
router.get('/editaroferta/:proyectoid/:nombreoferta', function (req, res, next) {
    res.render('editaroferta', { layout: 'layout', template: 'home-template', oferta: req.oferta });
});
router.post('/editaroferta/:proyectoid/:nombreoferta', ofertaCtrl.updateone);
router.post('/editaroferta/:proyectoid/:nombreoferta', ofertaCtrl.listproyecto);
router.post('/editaroferta/:proyectoid/:nombreoferta', function (req, res, next) {
    res.render('gestionarofertas', { layout: 'layout', template: 'home-template', ofertas: req.ofertas, proyecto: req.proyecto });
});

router.get('/aplicaroferta/:proyectoidynombre', ofertaCtrl.aplicaroferta);
router.get('/aplicaroferta/:proyectoidynombre', ofertaCtrl.list);
router.get('/aplicaroferta/:proyectoidynombre', function (req, res, next) {
    res.render('ofertas', { layout: 'layout', template: 'home-template', ofertas: req.ofertas, proyecto: req.proyecto });
});


router.get('/desaplicaroferta/:proyectoidynombre', ofertaCtrl.desaplicaroferta);
router.get('/desaplicaroferta/:proyectoidynombre', ofertaCtrl.list);
router.get('/desaplicaroferta/:proyectoidynombre', function (req, res, next) {
    res.render('ofertas', { layout: 'layout', template: 'home-template', ofertas: req.ofertas, proyecto: req.proyecto });
});
//DOING
router.get('/elegircandidatos/:proyectoidynombre', ofertaCtrl.gestionarcandidatos);
router.get('/elegircandidatos/:proyectoidynombre', function (req, res, next) {
    res.render('candidatura', { layout: 'layout', template: 'home-template', candidatos: req.candidatos, oferta: req.oferta});
});

router.post('/actualizarestado/:proyectoidynombre', ofertaCtrl.actualizarestado);
router.post('/actualizarestado/:proyectoidynombre', ofertaCtrl.gestionarcandidatos);
router.post('/actualizarestado/:proyectoidynombre', function (req, res, next) {
    res.render('candidatura', { layout: 'layout', template: 'home-template', candidatos: req.candidatos, oferta: req.oferta});
});


router.get("/crearoferta/:proyectoid", function (req, res, next) {
    res.render('crearoferta', {
        layout: 'layout', template: 'home-template', proyecto: req.session.proyecto, user: req.session.user
    });
}
);

router.post("/crearoferta", ofertaCtrl.create);
router.post("/crearoferta", function (req, res, next) {
    res.render('gestionarofertas', {
        layout: 'layout', template: 'home-template', ofertas: req.oferta, proyecto: req.session.proyecto, user: req.session.user
    });
}
);

//PERFIL

var perfilCtrl = require("../controllers/perfil.js");

router.post('/updateprofile', perfilCtrl.profile);
router.post('/updateprofile', ofertaCtrl.listAplicaciones);
router.post('/updateprofile', function (req, res, next) {
    res.render('perfil', { layout: 'layout', template: 'home-template', msg:"Perfil actualizado", user: req.session.user , userprofile: req.perfil, verticalnavbar: req.aplicaciones});
});
router.get("/perfil", perfilCtrlr.listprofile);
router.get("/perfil", ofertCtrlr.listAplicaciones);
router.get("/perfil", function (req, res, next) {
    res.render('perfil', {
        layout: 'layout', template: 'home-template',
        user: req.session.user, userprofile: req.profile, verticalnavbar:req.aplicaciones
    });
});

router.get("/vercandidato/:nickname", perfilCtrlr.listprofiles);
router.get("/vercandidato/:nickname", function (req, res, next) {
    res.render('verperfil', {
        layout: 'layout', template: 'home-template',
        user: req.candidato, userprofile: req.profile
    });
});


module.exports = router;
