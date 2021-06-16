var mongooose = require('mongoose');
const {
    nextTick
} = require('process');
var Proyecto = require("../models/Proyecto");

// c) Controlador de asignaturas.js en la que aparezcan los métodos de listar, crear, 
// editar y eliminar así como la conexión al correspondiente modelo con Mongoose. (4p)
exports.create = async (req, res, next) => {
    res.locals.user = req.session.user;
    console.log("el user");
    console.log(req.session.user);
    var query = {
        nombre_empresa: req.session.user.nickname,
        nombre_proyecto: req.body.nombre_proyecto,
        descripcion: req.body.descripcion,
        proyecto_id: req.session.user.nickname + req.body.nombre_proyecto,
        estado: "abierto",
    };
    var proyecto = new Proyecto(query);
    var res = await proyecto.save((err, res) => {
        if (err) {
            console.log(err);
            res.render('crearoferta', {
                layout: 'layout',
                template: 'home-template',
                salida: "No se ha podido crear correctamente el proyecto, intente de nuevo"
            });
        } else {
            console.log("INSERTADO EN LA DB");
            console.log(res);
            req.proyecto = proyecto;
            next();

        }

    });
};

exports.list = async (req, res, next) => {
    var ofertitas = [];
    res.locals.user = req.session.user;
    //proyectoCtrl.delete({        name: "Mercadona"    });
    //var lista_ofertas = await proyectoCtrl.list();
    //console.log("AQUI VIENE LA LISTA");
    /**/
    //res.locals.ofertas = ofertitas;
    var proyecto = await Proyecto.find({});
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
exports.findOne = async (req, res, next) => {
    var proyectoid = req.params.ernombre;
    res.locals.user = req.session.user;
    //proyectoCtrl.delete({        name: "Mercadona"    });
    //var lista_ofertas = await proyectoCtrl.list();
    //console.log("AQUI VIENE LA LISTA");
    /**/
    //res.locals.ofertas = ofertitas;
    var proyecto = await Proyecto.findOne({
        proyecto_id: proyectoid
    });
    var ofertitas = {
        proyecto_id: proyecto.proyecto_id,
        nombre_empresa: proyecto.nombre_empresa,
        nombre_proyecto: proyecto.nombre_proyecto,
        descripcion: proyecto.descripcion,
        estado: proyecto.estado,
    };

    req.proyecto = ofertitas;
    console.log(req.proyecto);
    //if(req.isAPI) res.json(proyecto)
    next();
};
exports.updateone = async (req, res, next) => {
    var proyectoid = req.params.ernombre;
    res.locals.user = req.session.user;
    var query = {
        nombre_proyecto: req.body.nombre_proyecto,
        descripcion: req.body.descripcion,
        estado: "abierto",
    };
    //proyectoCtrl.delete({        name: "Mercadona"    });
    //var lista_ofertas = await proyectoCtrl.list();
    //console.log("AQUI VIENE LA LISTA");
    /**/
    //res.locals.ofertas = ofertitas;
    await Proyecto.findOneAndUpdate({
        proyecto_id: proyectoid
    }, query, function (err, proyecto) {
        if (err || !proyecto) {
            console.log(err);
            console.log(proyecto);
            res.render('proyectos', {
                layout: 'layout',
                template: 'home-template',
                salida: "NO SE HA PODIDO ACTUALIZAR EL PROYECTO",
                msg:"NO SE HA PODIDO ACTUALIZAR EL PROYECTO",
                error: err
            });
        } 
    });
    //if(req.isAPI) res.json(proyecto)
    next();
};


exports.listOwn = async (req, res, next) => {
    var ofertitas = [];
    res.locals.user = req.session.user;
    console.log(req.session.user.nickname);
    //proyectoCtrl.delete({        name: "Mercadona"    });
    //var lista_ofertas = await proyectoCtrl.list();
    //console.log("AQUI VIENE LA LISTA");
    /**/
    //res.locals.ofertas = ofertitas;
    var proyecto = await Proyecto.find({
        nombre_empresa: req.session.user.nickname
    });
    proyecto.forEach(function (currentValue, index, array) {
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