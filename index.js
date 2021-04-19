//INICIALIZACION DE VARIABLES
let hbs = require('express-handlebars');
var express = require("express");
//VARIABLES DE ENVIROMENT
var dotenv = require('dotenv');
dotenv.config();

var bodyParser = require('body-parser');
var app = express();
var path = require("path");
var ctrlDir = "app/controllers";
//var chatCtrl = require(path.join(ctrlDir, "chat"));
var chatCtrl = require("./app/controllers/chat");
var router = express.Router();



const port = process.env.PORT;
var server = require("http")
    .createServer(app)
    .listen(port, () => {
        console.log("server running on: " + port);
    });
app.set("views", __dirname + "/app/views");

//app.use(express.static(__dirname+'/app/public'));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, '/app/views/images')));

// view engine setup
app.set('view engine', 'hbs');

app.engine( 'hbs', hbs( {
  extname: 'hbs',
  defaultView: 'layout',
  layoutsDir: __dirname + '/app/views/layouts/',
  partialsDir: __dirname + '/app/views/partials/'
}));
/*app.engine(
    'hbs',
    expressHbs({
       extname: "hbs",
       defaultLayout: "",
       layoutsDir: "",
    })
 );*/

//ESTO ES PARA DECIRLE A EXPRESS DE DONDE COGER LAS VISTAS
//ENRUTADOR REDIRIGIENDO A ROUTES/GETS
//SE PUEDE HACER CON CUALQUIER SITUACION
var getRoutes = require('./app/routes/gets');
var apis = require('./app/routes/api');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use('/', getRoutes);
app.use('/api', apis);

/*
//CONECTAR A LA BASE DE DATOS
var mongoose = require("mongoose");
//mongoose.connect('mongodb://devroot:devroot@mongo/chat?authMechanism=SCRAM-SHA-1');
mongoose.connect('mongodb://mongo:27017/chat', { useNewUrlParser: true }, (err, res) => {
    if (err) console.log('ERROR NO SE HA PODIDO CONECTAR A LA BASE DE DATOS => ' + err);
    else console.log('Database online: ' + process.env.MONGO_DB);
});

*/

//ESTAS DOS LINEAS NO RECUERDO
app.use("/", router);
module.exports = app;