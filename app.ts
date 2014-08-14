import express = require('express');
var mongoose = require('mongoose');           // mongoose for mongodb
var morgan = require('morgan');       // log requests to the console (express4)
var bodyParser = require('body-parser');  // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var favicon = require('serve-favicon');
import routes = require('./routes/index');
import user = require('./routes/user');
import api = require('./routes/api');
import http = require('http');
import path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('dev'));                     // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' }));      // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                   // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

import stylus = require('stylus');
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// App config model ===========================

var AppConfig = mongoose.model('AppConfig', {
    last_run: Date,
    recent_files: [],
    opened_files: [],
    current_project: [],
    recent_projects: []
});

var app_config = {};

AppConfig.find(function (err, configs) {
    if (!err) {
        if (configs.length > 0)
            app_config = configs[0];
        else {
            app_config = AppConfig.create({
                last_run: new Date()
            }, function (err, conf) {
                    if (!err)
                        app_config = conf;
                });
        }
    }
});

api.api(app, app_config);

// Application Routes ===================================
app.get('*', routes.index);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
