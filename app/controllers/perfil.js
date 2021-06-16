//import model
var Perfil = require('../models/Perfil.js');
const path = require("path");
var User = require('../models/userModel.js');


//FUNCION QUE CARGA EL PERFIL EN CASO DE TENERLO
exports.listprofile = async function (req, res, next) {
    var perfil = await Perfil.findOne({
        nickname: req.session.user.nickname
    });
    if (!perfil) {
        req.message = "Complete su perfil";
        next();
    } else {
        var userprofile = {
            nickname: perfil.nickname,
            experiencia: perfil.experiencia,
            formacion: perfil.formacion,
            intereses: perfil.intereses,
            portfolio: perfil.portfolio,
            foto: perfil.foto
        }
        req.profile = userprofile;
        next();
    }
};

//FUNCION QUE LISTA LOS PERFILES DE LOS CANDIDATOS
exports.listprofiles = async function (req, res, next) {
    var perfil = await Perfil.findOne({
        nickname: req.params.nickname
    });
    if (!perfil) {
        req.message = "Esta persona no ha completado su perfil";
    } else {
        var userprofile = {
            nickname: perfil.nickname,
            experiencia: perfil.experiencia,
            formacion: perfil.formacion,
            intereses: perfil.intereses,
            portfolio: perfil.portfolio,
            foto: perfil.foto
        }
        req.profile = userprofile;
        
    }
    var resp = await User.findOne({
        nickname: req.params.nickname
    });
    if (!resp) {
        req.message = "No se ha podido encontrar este candidato";
    } else {
        var user = {
            nickname: resp.nickname,
            name: resp.name,
            email: resp.email,
            phone: resp.phone,
            role: resp.role,
            location: "Barcelona"
        }
        req.candidato = user;
        req.profile = userprofile;
        
    }
    req.
    next();
};

//FUNCION QUE CREA O ACTUALIZA LOS PERFILES CON LA INFORMACION DE LAS VISTAS
exports.profile = async function (req, res, next) {
    var fotito = true;
    var usertocreate;
    console.log(req.files);
    if (!req.files || Object.keys(req.files).length == 0) {
        fotito = false;
        console.log("no llega foto");
    } else {
        console.log("llega foto");
        var profileFile = req.files.profileFile;
        var uploadPath = '/app/app/views/images/' + req.session.user.nickname +profileFile.name;
        await profileFile.mv(uploadPath, function (err) {
            if (err) {
                return res.status(500).send(err);
            } else {
                fotito = true;
            }

        });
    }
    if (fotito) {
        usertocreate = {
            nickname: req.session.user.nickname,
            experiencia: req.body.experiencia,
            formacion: req.body.formacion,
            intereses: req.body.intereses,
            portfolio: [],
            foto:  req.session.user.nickname +profileFile.name
        }
    } else {
        usertocreate = {
            nickname: req.session.user.nickname,
            experiencia: req.body.experiencia,
            formacion: req.body.formacion,
            intereses: req.body.intereses,
            portfolio: [],
        }

    }



    console.log(req.session.user.nickname);
    await Perfil.findOneAndUpdate({
        nickname: req.session.user.nickname
    }, usertocreate, function (err, perfil) {
        if (err || !perfil) {
            console.log(err);
            console.log(perfil);
            var p = new Perfil(usertocreate);
            p.save(function (err) {
                if (err) {
                    console.log(err);
                    res.render('error', {
                        layout: 'layout',
                        template: 'home-template',
                        message: err
                    });
                } else {
                    req.perfil = usertocreate;
                    next();
                }
            });
        } else {
            req.perfil = usertocreate;
            next();
        }
    });
};

//DEMAS FUNCIONES
exports.delete = function (req, res) {
    res.locals.role = req.session.role;
    req.checkBody('namedelete', 'Name is required').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
        res.render('delete', {
            layout: 'layout',
            template: 'home-template',
            errors: errors
        });
    } else {
        User.remove({
            name: req.body.namedelete
        }, function (err, user) {
            if (err || user.deletedCount === 0) {
                res.render('delete', {
                    layout: 'layout',
                    template: 'home-template',
                    message: "User don't deleted"
                });
            } else {
                //si la validacion a ido bien redirige a la misma pagina con un mensaje de exito.
                res.render('delete', {
                    layout: 'layout',
                    template: 'home-template',
                    message: "User deleted correctly"
                });
            }
        });
    }
}

exports.update = function (req, res) {


    User.findOneAndUpdate({
        name: req.body.fullname
    }, req.body, function (err, user) {

        if (err || !user) {
            res.render('update', {
                layout: 'layout',
                template: 'home-template',
                message: "Error, user don't exist"
            });
        } else {
            res.render('update', {
                layout: 'layout',
                template: 'home-template',
                message: 'User updated correctly'
            });
        }
    });
};

