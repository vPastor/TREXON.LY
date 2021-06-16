//import model
User = require('../models/userModel.js');
/**
 * Function check if user and passwor exists in the database and do the login
 * if the validation is correct we create the query with the username and password
 * collected from the form and we make the login
 * we validate the fields user and password, if the validation returns errors,
 * we redirect to the login page with an error message
 */
exports.login = async (req, res, next) => {

    var name = req.body.user;
    var password = req.body.password;
    var query = {
        "nickname": name,
        "password": password
    };


    var resp = await User.findOne(query);
    console.log(resp);
    if (!resp) {
        res.render('login', {
            layout: 'layout', template: 'home-template', salida: "User not found"
        });
    }
    else{
        var user = {
            nickname: resp.nickname || "Provisional",
            name: resp.name,
            email: resp.email,
            phone: resp.phone,
            role: resp.role,
            location: "Barcelona"
        }
        /*, function (err, res) {
        resp = res;
        if (err) console.log(err)
        console.log("LOGGIN CORRECTO");
        //console.log(respuesta);
        console.log(resp);r
        return resp;
    });*/
        req.user = user;
        req.session.user = user;
        next();
    }
    

};


/**
 * Function to delete the user and role variable session and redirect to the home
 */
exports.logout = function (req, res) {
    delete req.session.user;
    delete req.session.role;
    res.render('/', {
        layout: 'layout', template: 'home-template'
    });
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
exports.register = function (req, res, next) {
    //res.locals.role = req.session.role;
    //errors = validate(req);
    /*if (errors) {
        req.session.errors = errors;
        res.render('registration', {
            layout: 'layout', template: 'home-template', errors: errors
        });
    }
    else {*/
    //req.session.success = true;

    var usertocreate = new User();
    usertocreate.nickname = req.body.nickname,
        usertocreate.name = req.body.fullname,
        usertocreate.email = req.body.email,
        usertocreate.phone = req.body.phone,
        usertocreate.role = req.body.role,
        usertocreate.password = req.body.password,
        usertocreate.location = "Barcelona",
        //hay que hacer la imagen importandola y guardandola en public
        //si nos flipamos, podemos pedir el CV, y poder acceder a el desde la vista
        //tambien importar los proyectos



        //create a new user object
        usertocreate.save(function (err) {
            if (err) {
                console.log(err);
                res.render('registration', {
                    layout: 'layout', template: 'home-template', message: "User altready exist"
                });
            } else {
                next();
            }
        });

};
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
            layout: 'layout', template: 'home-template', errors: errors
        });
    } else {
        User.remove({
            name: req.body.namedelete
        }, function (err, user) {
            //console.log(user);
            //console.log(user.deletedCount);

            if (err || user.deletedCount === 0) {
                res.render('delete', {
                    layout: 'layout', template: 'home-template', message: "User don't deleted"
                });
            } else {
                //si la validacion a ido bien redirige a la misma pagina con un mensaje de exito.
                res.render('delete', {
                    layout: 'layout', template: 'home-template', message: "User deleted correctly"
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
    res.locals.role = req.session.role;
    errors = validate(req);
    if (errors) {
        req.session.errors = errors;
        res.render('update', {
            layout: 'layout', template: 'home-template', errors: errors
        });
    }
    else {
        User.findOneAndUpdate({ nickname: req.session.user.nickname }, req.body, function (err, user) {

            if (err || !user) {
                res.render('update', {
                    layout: 'layout', template: 'home-template', message: "Error, user don't exist"
                });
            }
            else {
                res.render('update', {
                    layout: 'layout', template: 'home-template', message: 'User updated correctly'
                });
            }
        });
    };

};
/**
 * Funtion validate the data of a user
 */
function validate(req) {
    //validation of inputs
    req.checkBody('fullname', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Please enter a valid email').isEmail();
    req.checkBody('password', 'Invalid password').isLength({ min: 6 })
    password2 = req.body.password2;
    req.checkBody('password', 'Passwords must match').matches(password2);
    req.checkBody('phone', 'Phone is invalid').isMobilePhone(['es-ES']);

    const errors = req.validationErrors();
    return errors;
}