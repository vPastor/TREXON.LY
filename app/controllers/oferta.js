var mongooose = require('mongoose');
const {
    nextTick
} = require('process');
var Oferta = require("../models/Oferta");
var Proyecto = require("../models/Proyecto");
var User = require("../models/userModel");
var bodyParser = require('body-parser');
const Perfil = require('../models/Perfil');
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
                layout: 'layout',
                template: 'home-template',
                salida: "No se ha podido crear correctamente la oferta, intente de nuevo"
            });
        } else {
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
        var aplicado = false;
        currentValue.aplicados.forEach(function (currentValue2, index, array) {
            console.log(currentValue2);

            if (currentValue2.nickname == (req.session.user.nickname)) {
                aplicado = true;
            }
            console.log(aplicado);
        })
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
            aplicados: currentValue.aplicados,
            yo_aplicado: aplicado
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
    var proyecto = await Oferta.findOne({
        proyecto_id: proyectoid,
        nombre_oferta: nombre_ofertas
    });
    if (!proyecto) {
        res.render('gestionarofertas', {
            layout: 'layout',
            template: 'home-template',
            error: "No se ha podido aplicar a la oferta"
        });
    } else {
        var filter = {
            proyecto_id: proyectoid,
            nombre_oferta: nombre_ofertas
        };
        proyecto.aplicados.push({
            "nickname": req.session.user.nickname,
            estado: "recibido"
        });
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
    var proyecto = await Oferta.findOne({
        proyecto_id: proyectoid,
        nombre_oferta: nombre_ofertas
    });
    if (!proyecto) {
        res.render('gestionarofertas', {
            layout: 'layout',
            template: 'home-template',
            error: "No se ha podido aplicar a la oferta"
        });
    } else {
        var filter = {
            proyecto_id: proyectoid,
            nombre_oferta: nombre_ofertas
        };
        for (var i = 0; i < proyecto.aplicados.length; i++) {

            if (proyecto.aplicados[i].nickname == req.session.user.nickname) {
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

exports.listAplicaciones = async (req, res, next) => {
    var aplicaciones = [];
    console.log("listAplicaciones");
    res.locals.user = req.session.user;

    //proyectoCtrl.delete({        name: "Mercadona"    });
    //var lista_ofertas = await proyectoCtrl.list();
    //console.log("AQUI VIENE LA LISTA");
    /**/
    //res.locals.ofertas = ofertitas;
    var proyecto = await Oferta.find({});
    if (!proyecto) {
        res.render('gestionarofertas', {
            layout: 'layout',
            template: 'home-template',
            error: "No se ha podido gestionar la oferta"
        });
    } else {
        proyecto.forEach(function (currentValue, index, array) {
            currentValue.aplicados.forEach(function (currentValue2, index, array) {
                if (currentValue2.nickname == (req.session.user.nickname)) {
                    aplicaciones.push({
                        nombre_proyecto: currentValue.nombre_proyecto,
                        nombre_oferta: currentValue.nombre_oferta,
                        estado: currentValue2.estado,
                        proyecto_id: currentValue.proyecto_id
                    });
                }
            })


        });
        if (!aplicaciones) {
            aplicaciones = true;
            req.aplicaciones = true;
        } else {
            req.aplicaciones = aplicaciones;
        }

        //if(req.isAPI) res.json(proyecto)
        next();
    }

};

exports.gestionarcandidatos = async (req, res, next) => {
    console.log("gestionarcandidatos");
    res.locals.user = req.session.user;
    var proyectoidynombre = req.params.proyectoidynombre;
    var proyectoid = proyectoidynombre.split("lllllll")[0];
    var nombre_ofertas = proyectoidynombre.split("lllllll")[1];
    //proyectoCtrl.delete({        name: "Mercadona"    });
    //var lista_ofertas = await proyectoCtrl.list();
    //console.log("AQUI VIENE LA LISTA");
    /**/
    //res.locals.ofertas = ofertitas;
    var proyecto = await Oferta.findOne({
        proyecto_id: proyectoid,
        nombre_oferta: nombre_ofertas
    });
    if (!proyecto) {
        res.render('gestionarofertas', {
            layout: 'layout',
            template: 'home-template',
            error: "No se ha podido gestionar la oferta"
        });
    } else {
        //req.session.aplicados = [];
        var ofertitas = {
            nombre_proyecto: proyecto.nombre_proyecto,
            nombre_oferta: proyecto.nombre_oferta,
            proyecto_id: proyecto.proyecto_id,
        };
        req.oferta = ofertitas;
        /*if (!(req.session.currentIndice)) {
            req.session.currentIndice = 0;
        }
        for (var i = 0; i < proyecto.aplicados.length; i++) {
            req.session.aplicados[i].nickname = proyecto.aplicados[i].nickname;
        }*/
        var ofertantes = [];
        proyecto.aplicados.forEach(async function (currentValue, index, array) {
            console.log("Llega aqui");
            var candidato = await User.findOne({
                nickname: currentValue.nickname
            });
            var perfil = await Perfil.findOne({
                nickname: currentValue.nickname
            });
            if (!candidato) {
                res.render('gestionarofertas', {
                    layout: 'layout',
                    template: 'home-template',
                    error: "No se ha podido encontrar el candidato"
                });
            } else if (!perfil) {
                res.render('gestionarofertas', {
                    layout: 'layout',
                    template: 'home-template',
                    error: "No se ha podido encontrar el perfil"
                });
            } else {
                console.log("Legga hasta aqui");
                console.log(index);
                ofertantes[index] = {
                    numero: index,
                    nickname: candidato.nickname,
                    nombre: candidato.name,
                    email: candidato.email,
                    phone: candidato.phone,
                    estado: currentValue.estado
                }
                console.log(ofertantes);

            }



        });
        //proyecto.aplicados.forEach()
        /*var candidatos = await User.findOne({
            nickname: req.session.aplicados[req.session.currentIndice].nickname
        });
        var perfil = await Perfil.findOne({
            nickname: req.session.aplicados[req.session.currentIndice].nickname
        });
        if (!candidato) {
            res.render('gestionarofertas', {
                layout: 'layout',
                template: 'home-template',
                error: "No se ha podido encontrar el candidato"
            });
        } else {
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
        //if(req.isAPI) res.json(proyecto)*/
        req.candidatos = ofertantes;
        next();
    }

};
exports.actualizarestado = async (req, res, next) => {
    console.log("actualiarestado");
    res.locals.user = req.session.user;
    var proyectoidynombre = req.params.proyectoidynombre;
    var proyectoid = proyectoidynombre.split("lllllll")[0];
    var nombre_ofertas = proyectoidynombre.split("lllllll")[1];
    //proyectoCtrl.delete({        name: "Mercadona"    });
    //var lista_ofertas = await proyectoCtrl.list();
    //console.log("AQUI VIENE LA LISTA");
    /**/
    //res.locals.ofertas = ofertitas;
    var proyecto = await Oferta.findOne({
        proyecto_id: proyectoid,
        nombre_oferta: nombre_ofertas
    });
    if (!proyecto) {
        res.render('gestionarofertas', {
            layout: 'layout',
            template: 'home-template',
            error: "No se ha podido gestionar la oferta"
        });
    } else {
        var ofertantes = [];
        proyecto.aplicados.forEach(async function (currentValue, index, array) {
            if (currentValue.nickname == req.body.nickname) {
                if (req.body.estado) {
                    currentValue.estado = req.body.estado;
                }
            }
        });
        
        var nuevosaplicados = proyecto.aplicados;
        var query = {aplicados: nuevosaplicados}
        await Oferta.findOneAndUpdate({
            proyecto_id: proyectoid,
            nombre_oferta: nombre_ofertas
        }, query, function (err, oferta) {
            if (err || !oferta) {
                console.log(err);
                console.log(proyecto);
    
            }
        });
        //proyecto.aplicados.forEach()
        /*var candidatos = await User.findOne({
            nickname: req.session.aplicados[req.session.currentIndice].nickname
        });
        var perfil = await Perfil.findOne({
            nickname: req.session.aplicados[req.session.currentIndice].nickname
        });
        if (!candidato) {
            res.render('gestionarofertas', {
                layout: 'layout',
                template: 'home-template',
                error: "No se ha podido encontrar el candidato"
            });
        } else {
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
        //if(req.isAPI) res.json(proyecto)*/
        next();
    }

};

exports.updateone = async (req, res, next) => {
    var proyectoid = req.params.proyectoid;
    var nombre_oferta = req.params.nombreoferta;
    res.locals.user = req.session.user;
    var query = {
        nombre_oferta: req.body.nombre_oferta,
        role: req.body.role,
        experiencia: req.body.experiencia,
        sueldo: req.body.sueldo,
        descripcion: req.body.descripcion,
    };
    console.log(req.body.sueldo);
    //proyectoCtrl.delete({        name: "Mercadona"    });
    //var lista_ofertas = await proyectoCtrl.list();
    //console.log("AQUI VIENE LA LISTA");
    /**/
    //res.locals.ofertas = ofertitas;
    await Oferta.findOneAndUpdate({
        proyecto_id: proyectoid,
        nombre_oferta: nombre_oferta
    }, query, function (err, oferta) {
        if (err || !oferta) {
            console.log(err);
            console.log(proyecto);

        }
    });
    //if(req.isAPI) res.json(proyecto)
    next();
};
exports.findOne = async (req, res, next) => {
    console.log("find one");
    var nombre_oferta = req.params.nombreoferta;
    var proyecto_id = req.params.proyectoid;
    res.locals.user = req.session.user;
    //proyectoCtrl.delete({        name: "Mercadona"    });
    //var lista_ofertas = await proyectoCtrl.list();
    //console.log("AQUI VIENE LA LISTA");
    /**/
    //res.locals.ofertas = ofertitas;
    var oferta = await Oferta.findOne({
        nombre_oferta: nombre_oferta,
        proyecto_id: proyecto_id
    });
    if (!oferta) {
        res.render('gestionarofertas', {
            layout: 'layout',
            template: 'home-template',
            error: "No se ha podido encontrar la oferta"
        });
    } else {
        ofertitas = {
            nombre_empresa: oferta.nombre_empresa,
            nombre_proyecto: oferta.nombre_proyecto,
            nombre_oferta: oferta.nombre_oferta,
            descripcion: oferta.descripcion,
            estado: oferta.estado,
            proyecto_id: oferta.proyecto_id,
            role: oferta.role,
            experiencia: oferta.experiencia,
            sueldo: oferta.sueldo,
        }
    }
    console.log(ofertitas);
    req.oferta = ofertitas;
    //if(req.isAPI) res.json(proyecto)
    next();
};
exports.listproyecto = async (req, res, next) => {
    var ofertitas = [];
    res.locals.user = req.session.user;
    var proyectoid = req.params.proyectoid;
    var proyecto = await Proyecto.findOne({
        proyecto_id: proyectoid
    });
    if (proyecto == null) {
        res.render('gestionarofertas', {
            layout: 'layout',
            template: 'home-template',
            error: "No se ha podido encontrar proyecto"
        });
    } else {
        var proyectito = {
            proyecto_id: proyecto.proyecto_id,
            nombre_empresa: proyecto.nombre_empresa,
            nombre_proyecto: proyecto.nombre_proyecto,
            descripcion: proyecto.descripcion,
            estado: proyecto.estado,
        };
        req.proyecto = proyectito;
        req.session.proyecto = proyectito;

        //console.log(proyecto)
        var oferta = await Oferta.find({
            proyecto_id: proyectito.proyecto_id
        });
        if (!oferta) {
            res.render('gestionarofertas', {
                layout: 'layout',
                template: 'home-template',
                error: "Este proyecto no tiene ofertas"
            });
        }
        oferta.forEach(function (currentValue, index, array) {
            var aplicado = false;

            currentValue.aplicados.forEach(function (currentValue2, index, array) {
                if (currentValue2.nickname == (req.session.user.nickname)) {
                    aplicado = true;
                }
            });

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
                yo_aplicado: aplicado
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
    var proyecto = await Proyecto.find({
        nombre_empresa: req.session.user.name
    });
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