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
router.post("/validate_login", async function (req, res) {
    var name = req.body.user;
    var password = req.body.password;
    var query = {
        "name": name,
        "password": password
    };
    var resp = await userCtrl.login(query);
    if (resp == false) {
        res.render('login', {
            layout: 'layout', template: 'home-template',
            salida: "User not found"
        });
    }
    else {
        var user = {
            name: resp[0].name,
            email: resp[0].email,
            phone: resp[0].phone,
            role: resp[0].role,
            location: "Barcelona"
        }
        //app.locals.user = user;
        req.session.user = user;
        res.locals.user = user;
        res.render('index', {
            layout: 'layout', template: 'home-template',
            user: user, nombre: "hola"
        });
    }

}
);

router.get('/ofertas', proyectoCtrl.list);
router.get('/ofertas', function (req, res, next) {
    res.render('ofertas', { layout: 'layout', template: 'home-template', proyecto:req.proyecto });
})

//OFERTAS

router.get('/ofertas', async function (req, res) {
    //res.locals.role = req.session.role;
    /*if (req.session.user) {
        res.render('info', {
            layout: 'layout', template: 'home-template',
            message: "Session is already started "
        });
    } else {*/
    var ofertitas = [];
    res.locals.user = req.session.user;
    //proyectoCtrl.delete({        name: "Mercadona"    });
    var lista_ofertas = await proyectoCtrl.list();
    console.log("AQUI VIENE LA LISTA");
    lista_ofertas.forEach(function (currentValue, index, array) {
        console.log(index)
        ofertitas[index] = {
            empresario: currentValue.empresario,
            name: currentValue.name,
            descripcion: currentValue.descripcion,
            /*puestos: {
                fotografos: currentValue.puestos.fotografos,
                diseniadores: currentValue.puestos.diseniadores,
                programadores: currentValue.puestos.programadores,
                publicistas: currentValue.puestos.publicistas,
            },*/
            fotografos: currentValue.fotografos,
            diseniadores: currentValue.diseniadores,
            programadores: currentValue.programadores,
            publicistas: currentValue.publicistas,
            estado: currentValue.estado,

        }
    });
    res.locals.ofertas = ofertitas;
    console.log(res.locals.ofertas[0].empresario)
    res.render('ofertas', { layout: 'layout', template: 'home-template', test:ofertitas });
    // }
});


var proyectoCtrl = require("../controllers/proyecto.js");
router.post("/crearoferta", async function (req, res) {
    res.locals.user = req.session.user;
    console.log("el user");
    console.log(req.session.user);
    var query = {
        empresario: req.session.user.name,
        name: req.body.fullname,
        descripcion: req.body.description,
        puestos: {
            "fotografos": req.body.numf,
            "diseniadores": req.body.numd,
            "programadores": req.body.nump,
            "publicistas": req.body.numpub
        },
        fotografos: req.body.numf,
        diseniadores: req.body.numd,
        programadores: req.body.nump,
        publicistas: req.body.numpub,
        estado: "abierto"
    };
    var resp = await proyectoCtrl.create(query);
    console.log(resp);
    if (resp == false) {
        res.render('crearoferta', {
            layout: 'layout', template: 'home-template',
            salida: "No se ha podido crear correctamente el proyecto, intente de nuevo"
        });
    }
    else {
        console.log("ahora viene el proyecto de respuesta /n");
        console.log(resp);
        res.render('index', {
            layout: 'layout', template: 'home-template',
        });
    }

}
);

router.get('/logout', function (req, res) {
    delete req.session.user;
    res.render('login', {
        layout: 'layout', template: 'home-template'
    });
});




//Create a route for create new user
router.post("/create", async function (req, res) {
    var usertocreate = {
        name: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        role: req.body.role,
        password: req.body.password,
        location: req.body.location,
        //hay que hacer la imagen importandola y guardandola en public
        //si nos flipamos, podemos pedir el CV, y poder acceder a el desde la vista
        //tambien importar los proyectos

    }
    var resp = await userCtrl.register(usertocreate);
    console.log(resp);

});
module.exports = router;
