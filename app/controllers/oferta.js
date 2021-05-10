var mongooose = require('mongoose');
const { nextTick } = require('process');
var Oferta = require("../models/Oferta");
var Proyecto = require("../models/Proyecto");
var bodyParser = require('body-parser');
var contador = 0;
// c) Controlador de asignaturas.js en la que aparezcan los métodos de listar, crear, 
// editar y eliminar así como la conexión al correspondiente modelo con Mongoose. (4p)
exports.create = async (req, res, next) => {
    console.log("create");
    res.locals.user = req.session.user;
    res.locals.proyecto = req.session.proyecto;
    var p_id = req.session.proyecto.proyecto_id;
    var p_nombre = req.session.proyecto.nombre_proyecto;
    console.log("el user");
    console.log(req.session.user);
    var query = {
        nombre_empresa: req.session.user.name,
        nombre_proyecto: p_nombre,
        role: req.body.role,
        exexperiencia: req.body.exexperiencia,
        sueldo: req.body.sueldo,
        descripcion: req.body.descripcion,
        proyecto_id: p_id,
        estado: "abierto",
        aplicados: []
    };    
    var oferta = new Oferta(query);
    req.oferta = oferta;
    var res = await oferta.save((err, res) => {
        if (err) {
            console.log(err);
            res.render('crearoferta', {
                layout: 'layout', template: 'home-template',
                salida: "No se ha podido crear correctamente la oferta, intente de nuevo"
            });
        }
        else {
            console.log("INSERTADO EN LA DB");
            console.log(res);
            next();
        }

    });
};

exports.list = async (req, res, next) => {
    var ofertitas = [];
    console.log("list");
    res.locals.user = req.session.user;
    //proyectoCtrl.delete({        name: "Mercadona"    });
    //var lista_ofertas = await proyectoCtrl.list();
    //console.log("AQUI VIENE LA LISTA");
    /**/
    //res.locals.ofertas = ofertitas;
    var oferta = await Oferta.find({});
    oferta.forEach(function (currentValue, index, array) {
        console.log(index)
        ofertitas[index] = {
            nombre_empresa: currentValue.nombre_empresa,
            nombre_proyecto: currentValue.nombre_proyecto,
            descripcion: currentValue.descripcion,
            estado: currentValue.estado,
            proyecto_id: currentValue.proyecto_id
        }
    });
    req.ofertas = ofertitas;
    console.log(oferta);
    //if(req.isAPI) res.json(proyecto)
    next();
};
exports.findOne = async (req, res, next) => {
    console.log("find one");
    var nombre_oferta = req.params.ernombre;
    res.locals.user = req.session.user;
    console.log("nombre oferta");
    console.log(nombre_proyecto);
    //proyectoCtrl.delete({        name: "Mercadona"    });
    //var lista_ofertas = await proyectoCtrl.list();
    //console.log("AQUI VIENE LA LISTA");
    /**/
    //res.locals.ofertas = ofertitas;
    var proyecto = await Proyecto.findOne({ nombre_proyecto: nombre_oferta });
    console.log(proyecto);
    var ofertitas = {
        nombre_empresa: proyecto.nombre_empresa,
        nombre_proyecto: proyecto.nombre_proyecto,
        nombre_oferta: proyecto.nombre_oferta,
        descripcion: proyecto.descripcion,
        estado: proyecto.estado,
        role: proyecto.role,
        experiencia: proyecto.experiencia,
        proyecto_id: proyecto.proyecto_id
    };

    req.proyecto = ofertitas;
    console.log(proyecto);
    //if(req.isAPI) res.json(proyecto)
    next();
};
exports.listproyecto = async (req, res, next) => {
    //console.log("list proyecto");
    var ofertitas = [];
    res.locals.user = req.session.user;
    
    var proyectoid = req.params.proyectoid;
    //console.log("prouecyto id");
    //console.log(proyectoid);

    //proyectoCtrl.delete({        name: "Mercadona"    });
    //var lista_ofertas = await proyectoCtrl.list();
    //console.log("AQUI VIENE LA LISTA");
    /**/
    //res.locals.ofertas = ofertitas;
    //proyectoid = "PrinterestProyecto de prueba";
    var proyecto = await Proyecto.findOne({ proyecto_id: proyectoid });
    console.log("PROYECTO DE SESSION");
    console.log(proyecto);
    console.log(proyecto.proyecto_id);
    var proyectito = {
        proyecto_id: proyecto.proyecto_id,
        nombre_empresa: proyecto.nombre_empresa,
        nombre_proyecto: proyecto.nombre_proyecto,
        descripcion: proyecto.descripcion,
        estado: proyecto.estado,
    };
    console.log("PROYECTO DE SESSION");
    console.log(proyectito);
    req.proyecto = proyectito;
    req.session.proyecto = proyectito;

    //console.log(proyecto)
    var oferta = await Oferta.find({ proyecto_id: req.session.proyecto_id });
    oferta.forEach(function (currentValue, index, array) {
        ofertitas[index] = {
            nombre_empresa: currentValue.nombre_empresa,
            nombre_proyecto: currentValue.nombre_proyecto,
            nombre_oferta: currentValue.nombre_oferta,
            descripcion: currentValue.descripcion,
            estado: currentValue.estado,
            role: currentValue.role,
            experiencia: currentValue.experiencia,
            proyecto_id: currentValue.proyecto_id
        }
    });
    console.log("Lo que viene de la base de datos "),
    console.log(ofertitas);
    req.ofertas = ofertitas;
    //if(req.isAPI) res.json(proyecto)
    next();
    //res.render('gestionarofertas', { layout: 'layout', template: 'home-template', ofertas: req.ofertas, proyecto: req.proyecto });
};

exports.listOwn = async (req, res, next) => {
    console.log("list own");
    var ofertitas = [];
    res.locals.user = req.session.user;
    //proyectoCtrl.delete({        name: "Mercadona"    });
    //var lista_ofertas = await proyectoCtrl.list();
    //console.log("AQUI VIENE LA LISTA");
    /**/
    //res.locals.ofertas = ofertitas;
    var proyecto = await Proyecto.find({ nombre_empresa: req.session.user.name });
    proyecto.forEach(function (currentValue, index, array) {
        console.log(index)
        ofertitas[index] = {
            nombre_empresa: currentValue.nombre_empresa,
            nombre_proyecto: currentValue.nombre_proyecto,
            descripcion: currentValue.descripcion,
            estado: currentValue.estado,
            proyecto_id: currentValue.proyecto_id
        }
    });
    req.proyecto = ofertitas;
    console.log(proyecto);
    //if(req.isAPI) res.json(proyecto)
    next();
};
exports.edit = async (req) => {
    var res = await req.save((err, res) => {
        if (err) console.log(err);
        console.log("INSERTADO EN LA DB");

    });
    return res;

};

exports.delete = async (req) => {
    var res = await Proyecto.deleteOne(req);


    return res;

};
