var mongooose = require('mongoose');
const { nextTick } = require('process');
var Proyecto = require("../models/Proyecto");

// c) Controlador de asignaturas.js en la que aparezcan los métodos de listar, crear, 
// editar y eliminar así como la conexión al correspondiente modelo con Mongoose. (4p)
exports.create = async (req,res,next) => {
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
    var proyecto = new Proyecto(query);
    var res = await proyecto.save((err, res) => {
        if (err){
            console.log(err);
            res.render('crearoferta', {
                layout: 'layout', template: 'home-template',
                salida: "No se ha podido crear correctamente el proyecto, intente de nuevo"
            });
        }
        else{
            console.log("INSERTADO EN LA DB");
            console.log(res);
            next();
        }
        
    });
};

exports.list = async (req,res, next) => {
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
            empresario: currentValue.empresario,
            name: currentValue.name,
            descripcion: currentValue.descripcion,
            puestos: {
                fotografos: currentValue.puestos.fotografos,
                diseniadores: currentValue.puestos.diseniadores,
                programadores: currentValue.puestos.programadores,
                publicistas: currentValue.puestos.publicistas,
            },
            fotografos: currentValue.fotografos,
            diseniadores: currentValue.diseniadores,
            programadores: currentValue.programadores,
            publicistas: currentValue.publicistas,
            estado: currentValue.estado,

        }
    });    
    req.proyecto=ofertitas;
    console.log(proyecto);
    //if(req.isAPI) res.json(proyecto)
    next();
};
exports.findOne = async (req,res, next) => {
    
    var nombre_oferta = req.params.ernombre;
    res.locals.user = req.session.user;
    console.log("nombre oferta");
    console.log(nombre_oferta);
    //proyectoCtrl.delete({        name: "Mercadona"    });
    //var lista_ofertas = await proyectoCtrl.list();
    //console.log("AQUI VIENE LA LISTA");
    /**/
    //res.locals.ofertas = ofertitas;
    var proyecto = await Proyecto.findOne({name:nombre_oferta});
    console.log(proyecto);
        var ofertitas = {
            empresario: proyecto.empresario,
            name: proyecto.name,
            descripcion: proyecto.descripcion,
            puestos: {
                fotografos: proyecto.puestos.fotografos,
                diseniadores: proyecto.puestos.diseniadores,
                programadores: proyecto.puestos.programadores,
                publicistas: proyecto.puestos.publicistas,
            },
            fotografos: proyecto.fotografos,
            diseniadores: proyecto.diseniadores,
            programadores: proyecto.programadores,
            publicistas: proyecto.publicistas,
            estado: proyecto.estado,

        };
     
    req.proyecto=ofertitas;
    console.log(proyecto);
    //if(req.isAPI) res.json(proyecto)
    next();
};

exports.listOwn = async (req,res, next) => {
    var ofertitas = [];
    res.locals.user = req.session.user;
    //proyectoCtrl.delete({        name: "Mercadona"    });
    //var lista_ofertas = await proyectoCtrl.list();
    //console.log("AQUI VIENE LA LISTA");
    /**/
    //res.locals.ofertas = ofertitas;
    var proyecto = await Proyecto.find({empresario:req.session.user.name});
    proyecto.forEach(function (currentValue, index, array) {
        console.log(index)
         ofertitas[index] = {
            empresario: currentValue.empresario,
            name: currentValue.name,
            descripcion: currentValue.descripcion,
            puestos: {
                fotografos: currentValue.puestos.fotografos,
                diseniadores: currentValue.puestos.diseniadores,
                programadores: currentValue.puestos.programadores,
                publicistas: currentValue.puestos.publicistas,
            },
            fotografos: currentValue.fotografos,
            diseniadores: currentValue.diseniadores,
            programadores: currentValue.programadores,
            publicistas: currentValue.publicistas,
            estado: currentValue.estado,

        }
    });    
    req.proyecto=ofertitas;
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
