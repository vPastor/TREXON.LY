//import model
User = require('../models/userModel.js');
/**
 * Function check if user and passwor exists in the database and do the login
 * if the validation is correct we create the query with the username and password
 * collected from the form and we make the login
 * we validate the fields user and password, if the validation returns errors,
 * we redirect to the login page with an error message
 */
exports.login = function (req, res) {
    var user = req.body.user;
    var password = req.body.password;
   
    req.checkBody('user', 'User Name is required').notEmpty();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({ min: 6 });

    const errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
        res.render('login', {
            layout: 'layout', template: 'home-template',
            errors: errors
        });

    }
    else {
        req.session.success = true;
        var query = {
            name: user,
            password: password
        };

        User.find(query).exec(function (err, user) {
            var len = user.length;

            user.forEach(element => {
                req.session.role = element.role
            });

            if (err) {
                console.log('Error: ', err);
                return;
            };
            if (len != 0) {
                req.session.user = user;
                role = req.session.role;
                res.locals.role = req.session.role;
                res.locals.user = req.session.user;
                //console.log(role); 

                res.render('info', {
                    layout: 'layout', template: 'home-template'
                });
            } else {
                res.render('login', {
                    layout: 'layout', template: 'home-template',
                    salida: "User not found"
                });
            };
        });
    };
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
exports.register = function (req, res) {
    res.locals.role = req.session.role;
    //errors = validate(req);
    /*if (errors) {
        req.session.errors = errors;
        res.render('registration', {
            layout: 'layout', template: 'home-template', errors: errors
        });
    }
    else {*/
        req.session.success = true;
        var user = new User();
        user.name = req.body.fullname;
        user.email = req.body.email;
        user.phone = req.body.phone;
        user.role = req.body.role;
        user.password = req.body.password;
        //create a new user object
        user.save(function (err) {
            if (err) {
                res.render('registration', {
                    layout: 'layout', template: 'home-template', message: "User altready exist"
                });
            } else {
                res.render('registration', {
                    layout: 'layout', template: 'home-template', message: "User created correctly"
                });
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
        User.findOneAndUpdate({ name: req.body.fullname }, req.body, function (err, user) {

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