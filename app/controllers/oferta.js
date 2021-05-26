var mongooose = require('mongoose');
const { nextTick } = require('process');
var Oferta = require("../models/Oferta");
var Proyecto = require("../models/Proyecto");
var User = require("../models/userModel");
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
    console.log("el nombre oferta");
    console.log(req.body.nombre_oferta);
    var query = {
        nombre_empresa: req.session.user.name,
        nombre_oferta: req.body.nombre_oferta,
        nombre_proyecto: p_nombre,
        role: req.body.role,
        experiencia: req.body.experiencia,
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
        //console.log(currentValue.nombre_empresa);
        ofertitas[index] = {
            nombre_empresa: currentValue.nombre_empresa,
            nombre_proyecto: currentValue.nombre_proyecto,
            nombre_oferta: currentValue.nombre_oferta,
            descripcion: currentValue.descripcion,
            estado: currentValue.estado,
            proyecto_id: currentValue.proyecto_id,
            role: currentValue.role,
            experiencia: currentValue.experiencia,
            sueldo: currentValue.sueldo,
            aplicados:currentValue.aplicados,
            yo_aplicado: currentValue.aplicados.includes(req.session.user.nickname)
        }
    });
    req.ofertas = ofertitas;
    console.log("OFERTITAS!");
    console.log(ofertitas);
    //if(req.isAPI) res.json(proyecto)
    next();
};

exports.aplicaroferta = async (req, res, next) => {
    console.log("aplicar");
    res.locals.user = req.session.user;
    var proyectoidynombre = req.params.proyectoidynombre;
    var proyectoid = proyectoidynombre.split("lllllll")[0];
    //console.log(proyectoid);
    var nombre_ofertas = proyectoidynombre.split("lllllll")[1];
    //console.log(nombre_ofertas);
    //proyectoCtrl.delete({        name: "Mercadona"    });
    //var lista_ofertas = await proyectoCtrl.list();
    //console.log("AQUI VIENE LA LISTA");
    /**/
    //res.locals.ofertas = ofertitas;
    var proyecto = await Oferta.findOne({ proyecto_id: proyectoid, nombre_oferta: nombre_ofertas });
    if (!proyecto) {
        res.render('gestionarofertas', { layout: 'layout', template: 'home-template', error: "No se ha podido aplicar a la oferta" });
    }
    else {
        var filter = { proyecto_id: proyectoid, nombre_oferta: nombre_ofertas };
        proyecto.aplicados.push(req.session.user.nickname);
        console.log("PROYECTO APLICADOOOOS!");
        console.log(proyecto.aplicados);
        let doc = await Oferta.findOneAndUpdate(filter, proyecto, {
            new: true
        });
        console.log(doc);
        res.locals.mensaje = "Se ha aplicado a esta oferta correctamente!";

        //if(req.isAPI) res.json(proyecto)
        next();
    }

};


exports.desaplicaroferta = async (req, res, next) => {
    console.log("desaplicar");
    res.locals.user = req.session.user;
    var proyectoidynombre = req.params.proyectoidynombre;
    var proyectoid = proyectoidynombre.split("lllllll")[0];
    console.log(proyectoid);
    var nombre_ofertas = proyectoidynombre.split("lllllll")[1];
    console.log(nombre_ofertas);
    //proyectoCtrl.delete({        name: "Mercadona"    });
    //var lista_ofertas = await proyectoCtrl.list();
    //console.log("AQUI VIENE LA LISTA");
    /**/
    //res.locals.ofertas = ofertitas;
    var proyecto = await Oferta.findOne({ proyecto_id: proyectoid, nombre_oferta: nombre_ofertas });
    if (!proyecto) {
        res.render('gestionarofertas', { layout: 'layout', template: 'home-template', error: "No se ha podido aplicar a la oferta" });
    }
    else {
        var filter = { proyecto_id: proyectoid, nombre_oferta: nombre_ofertas };
        for( var i = 0; i < proyecto.aplicados.length; i++){ 
    
            if ( proyecto.aplicados[i] == req.session.user.nickname) { 
                console.log("se ha eliminado de los aplicados");
                proyecto.aplicados.splice(i, 1); 
            }
        
        }
        console.log("PROYECTO APLICADOOOOS!");
        console.log(proyecto.aplicados);
        let doc = await Oferta.findOneAndUpdate(filter, proyecto, {
            new: true
        });
        console.log(doc);
        res.locals.mensaje = "Se ha eliminado la aplicacion a esta oferta correctamente!";

        //if(req.isAPI) res.json(proyecto)
        next();
    }

};

exports.gestionarcandidatos = async (req, res, next) => {
    console.log("gestionarcandidatos");
    res.locals.user = req.session.user;
    var proyectoidynombre = req.params.proyectoidynombre;
    var proyectoid = proyectoidynombre.split("lllllll")[0];
    console.log(proyectoid);
    var nombre_ofertas = proyectoidynombre.split("lllllll")[1];
    console.log(nombre_ofertas);
    //proyectoCtrl.delete({        name: "Mercadona"    });
    //var lista_ofertas = await proyectoCtrl.list();
    //console.log("AQUI VIENE LA LISTA");
    /**/
    //res.locals.ofertas = ofertitas;
    var proyecto = await Oferta.findOne({ proyecto_id: proyectoid, nombre_oferta: nombre_ofertas });
    if (!proyecto) {
        res.render('gestionarofertas', { layout: 'layout', template: 'home-template', error: "No se ha podido gestionar la oferta" });
    }
    else {
        req.session.aplicados =[];
        req.session.oferta = proyecto;
        if(!(req.session.currentIndice))
        {
            req.session.currentIndice = 0;
        }
        for( var i = 0; i < proyecto.aplicados.length; i++){ 
            req.session.aplicados[i]=proyecto.aplicados[i];
        }
        var candidato = await User.findOne({ nickname: req.session.aplicados[req.session.currentIndice]});
        if (!candidato) {
            res.render('gestionarofertas', { layout: 'layout', template: 'home-template', error: "No se ha podido encontrar el candidato" });
        }else{
            var user = {
                nickname: candidato.nickname,
                name: candidato.name,
                email: candidato.email,
                phone: candidato.phone,
                role: candidato.role,
                location: "Barcelona"
            }
            console.log(user);
            req.candidato = user;
        }
        //if(req.isAPI) res.json(proyecto)
        next();
    }

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
    if (!proyecto) {
        res.render('gestionarofertas', { layout: 'layout', template: 'home-template', error: "No se ha podido encontrar proyecto" });
    }
    console.log(proyecto);
    var ofertitas = {
        nombre_empresa: proyecto.nombre_empresa,
        nombre_proyecto: proyecto.nombre_proyecto,
        nombre_oferta: proyecto.nombre_oferta,
        descripcion: proyecto.descripcion,
        estado: proyecto.estado,
        role: proyecto.role,
        experiencia: proyecto.experiencia,
        sueldo: currentValue.sueldo,
        proyecto_id: proyecto.proyecto_id,
        aplicados: currentValue.aplicados,
        yo_aplicado: currentValue.aplicados.includes(req.session.user.nickname)
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
    console.log(proyectoid);
    //console.log("prouecyto id");
    //console.log(proyectoid);

    //proyectoCtrl.delete({        name: "Mercadona"    });
    //var lista_ofertas = await proyectoCtrl.list();
    //console.log("AQUI VIENE LA LISTA");
    /**/
    //res.locals.ofertas = ofertitas;
    //proyectoid = "PrinterestProyecto de prueba";
    var proyecto = await Proyecto.findOne({ proyecto_id: proyectoid });
    console.log(proyecto);
    if (proyecto == null) {
        res.render('gestionarofertas', { layout: 'layout', template: 'home-template', error: "No se ha podido encontrar proyecto" });
    }
    else {
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
        var oferta = await Oferta.find({ proyecto_id: proyectito.proyecto_id });
        if (!oferta) {
            res.render('gestionarofertas', { layout: 'layout', template: 'home-template', error: "Este proyecto no tiene ofertas" });
        }
        oferta.forEach(function (currentValue, index, array) {
            var aplicado = false;
            ofertitas[index] = {
                nombre_empresa: currentValue.nombre_empresa,
                nombre_proyecto: currentValue.nombre_proyecto,
                nombre_oferta: currentValue.nombre_oferta,
                descripcion: currentValue.descripcion,
                estado: currentValue.estado,
                role: currentValue.role,
                sueldo: currentValue.sueldo,
                experiencia: currentValue.experiencia,
                proyecto_id: currentValue.proyecto_id,
                aplicados: currentValue.aplicados,
                yo_aplicado: currentValue.aplicados.includes(req.session.user.nickname)
            }
        });
        console.log("Lo que viene de la base de datos "),
            console.log(ofertitas);
        req.ofertas = ofertitas;
        //if(req.isAPI) res.json(proyecto)
        next();
        //res.render('gestionarofertas', { layout: 'layout', template: 'home-template', ofertas: req.ofertas, proyecto: req.proyecto });
    }
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
            nombre_oferta: currentValue.nombre_oferta,
            descripcion: currentValue.descripcion,
            estado: currentValue.estado,
            role: currentValue.role,
            experiencia: currentValue.experiencia,
            sueldo: currentValue.sueldo,
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
