var mongooose = require('mongoose');
var Oferta = require("../models/Oferta");
var Proyecto = require("../models/Proyecto");
var User = require("../models/userModel");
var bodyParser = require('body-parser');
const Perfil = require('../models/Perfil');

//FUNCION QUE CREA UNA OFERTA
exports.create = async (req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.proyecto = req.session.proyecto;
    var p_id = req.session.proyecto.proyecto_id;
    var p_nombre = req.session.proyecto.nombre_proyecto;
    var query = {
        nombre_empresa: req.session.user.name,
        nombre_oferta: req.body.nombre_oferta,
        nombre_proyecto: p_nombre,
        role: req.body.role,
        experiencia: req.body.experiencia,
        sueldo: req.body.sueldo,
        descripcion: req.body.descripcion,
        proyecto_id: p_id,
        estado: "Abierto",
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

//FUNCION QUE LISTA LAS OFERTAS
exports.list = async (req, res, next) => {
    var ofertitas = [];
    res.locals.user = req.session.user;
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
    next();
};

//FUNCION PARA QUE EL USUARIO EN SESSION APLIQUE A UNA OFERTA
exports.aplicaroferta = async (req, res, next) => {
    res.locals.user = req.session.user;
    var proyectoidynombre = req.params.proyectoidynombre;
    var proyectoid = proyectoidynombre.split("lllllll")[0];
    var nombre_ofertas = proyectoidynombre.split("lllllll")[1];
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
        let doc = await Oferta.findOneAndUpdate(filter, proyecto, {
            new: true
        });
        res.locals.mensaje = "Se ha aplicado a esta oferta correctamente!";
        next();
    }

};

//FUNCION PARA QUE EL USUARIO EN SESSION DESAPLIQUE A UNA OFERTA
exports.desaplicaroferta = async (req, res, next) => {
    res.locals.user = req.session.user;
    var proyectoidynombre = req.params.proyectoidynombre;
    var proyectoid = proyectoidynombre.split("lllllll")[0];
    var nombre_ofertas = proyectoidynombre.split("lllllll")[1];
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
        let doc = await Oferta.findOneAndUpdate(filter, proyecto, {
            new: true
        });
        res.locals.mensaje = "Se ha eliminado la aplicacion a esta oferta correctamente!";
        //if(req.isAPI) res.json(proyecto)
        next();
    }

};

//ESTA FUNCION LISTA LAS OFERTAS EN LAS QUE EL USUARIO EN SESSION ESTA INSCRITO
exports.listAplicaciones = async (req, res, next) => {
    var aplicaciones = [];
    res.locals.user = req.session.user;
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
        next();
    }

};
//APLICACION PARA GESTIONAR LOS CANDIDATOS
exports.gestionarcandidatos = async (req, res, next) => {
    console.log("gestionarcandidatos");
    res.locals.user = req.session.user;
    var proyectoidynombre = req.params.proyectoidynombre;
    var proyectoid = proyectoidynombre.split("lllllll")[0];
    var nombre_ofertas = proyectoidynombre.split("lllllll")[1];
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
        var ofertitas = {
            nombre_proyecto: proyecto.nombre_proyecto,
            nombre_oferta: proyecto.nombre_oferta,
            proyecto_id: proyecto.proyecto_id,
        };
        req.oferta = ofertitas;
        var ofertantes = [];
        proyecto.aplicados.forEach(async function (currentValue, index, array) {
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
            }
        });
        req.candidatos = ofertantes;
        next();
    }

};

//FUNCION QUE ACTUALIZA EL ESTADO DE UN APLICANTE EN UNA OFERTA
exports.actualizarestado = async (req, res, next) => {
    res.locals.user = req.session.user;
    var proyectoidynombre = req.params.proyectoidynombre;
    var proyectoid = proyectoidynombre.split("lllllll")[0];
    var nombre_ofertas = proyectoidynombre.split("lllllll")[1];
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
        next();
    }

};

//FUNCION QUE ACTUALIA UNA OFERTA
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

//FUNCION QUE ENCUENTRA LA OFERTA EN CUESTION
exports.findOne = async (req, res, next) => {
    console.log("find one");
    var nombre_oferta = req.params.nombreoferta;
    var proyecto_id = req.params.proyectoid;
    res.locals.user = req.session.user;
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

//FUNCION QUE DEVUELVE TODAS LAS OFERTAS DE UN PROYECTO
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
        req.ofertas = ofertitas;
        next();
    }
};

//FUNCION QUE LISTA LAS OFERTAS PROPIAS
exports.listOwn = async (req, res, next) => {
    console.log("list own");
    var ofertitas = [];
    res.locals.user = req.session.user;
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