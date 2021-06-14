//import model
var Perfil = require('../models/Perfil.js');
const path = require("path");
/**
 * Function check if user and passwor exists in the database and do the login
 * if the validation is correct we create the query with the username and password
 * collected from the form and we make the login
 * we validate the fields user and password, if the validation returns errors,
 * we redirect to the login page with an error message
 */



/**
 * Function to delete the user and role variable session and redirect to the home
 */
exports.listprofile = async function (req, res, next) {
    var perfil = await Perfil.findOne({
        nickname: req.session.user.nickname
    });
    if (!perfil) {
        res.render('perfil', {
            layout: 'layout',
            template: 'home-template',
            msg: "Complete el perfil"
        });
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

//
/**
 * Function that receives all fields from the registration form,
 * validates them and saves them in the database.
 * we validate the fields with the function valiate, if the validation returns errors,
 * we redirect to the login page with an error message 
 * if the validation is correct we create a new user object and the 
 * we insert in the database
 */
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
        //(path.join(path.dirname('/app/server/src/'), '/src/public/images/') + file.name)
        var uploadPath = '/app/app/views/images/' + profileFile.name;
        await profileFile.mv(uploadPath, function (err) {
            if (err) {
                return res.status(500).send(err);
            } else {
                fotito =true;
            }

        });
    }
    var fotasa;
    if(fotito)
    {
        usertocreate = {
            nickname : req.session.user.nickname,
        experiencia : req.body.experiencia,
        formacion : req.body.formacion,
        intereses : req.body.intereses,
        portfolio : [],
        foto: profileFile.name
        }
    }else{
        usertocreate = {
            nickname : req.session.user.nickname,
        experiencia : req.body.experiencia,
        formacion : req.body.formacion,
        intereses : req.body.intereses,
        portfolio : [],
        }

    }
    
    
    
    console.log( req.session.user.nickname);
    await Perfil.findOneAndUpdate({nickname: req.session.user.nickname}, usertocreate, function (err, perfil) {
        if (err || !perfil) {
            console.log(err);
            console.log(perfil);
            /*usertocreate.save(function (err) {
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
            });*/
        } else {
            req.perfil = usertocreate;
            next();
        }
    });
};


//hay que hacer la imagen importandola y guardandola en public
//si nos flipamos, podemos pedir el CV, y poder acceder a el desde la vista
//tambien importar los proyectos



//create a new user object

/**
 * Function that removes a user from the user's name.
 * first validates the name and if the validation is correct it deletes it.
 * of the database and returns a message of success, but returns us 
 * error when deleting user. And if the user does not exist also we 
 * sent a message
 */
exports.delete = function (req, res) {
    //console.log(req.body.namedelete);
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
            //console.log(user);
            //console.log(user.deletedCount);

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
/**
 * Function that updates the data of a user, we collect the fields of the form,
 * we validate these fields and if the validation is correct we update the data
 * if he doesn't send us an error message.
 * If the user does not exist gives us an error
 */
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

/**
 * Funtion validate the data of a user
 */
function validate(req) {
    //validation of inputs
    req.checkBody('fullname', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Please enter a valid email').isEmail();
    req.checkBody('password', 'Invalid password').isLength({
        min: 6
    })
    password2 = req.body.password2;
    req.checkBody('password', 'Passwords must match').matches(password2);
    req.checkBody('phone', 'Phone is invalid').isMobilePhone(['es-ES']);

    const errors = req.validationErrors();
    return errors;
}