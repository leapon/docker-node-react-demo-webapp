'use strict';
var express = require('express');
var session = require('express-session');
var fs = require('fs');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var compression = require('compression')
var _ = require('underscore');
var tool = require('leaptool');

var app = {};

app.db = null;
app.engine = require('webEngine')(app);
app.cb = function(error, docs, info, req, res, callback) {
    if (callback) {
        if (error) {
            console.log('Error:', error);
            callback(error, docs, info, req, res);
        } else {
            callback(error, docs, info, req, res);
        }
    } else {
        if (error) {
            app.error(error);
        }
        var result = {
            error: error,
            docs: docs,
            info: info
        };
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(result));
        res.end();
    }
};

app.getPage = function(req) {
    var user = req.session && req.session.user || null;
    return {
        user: user
    };
};

app.renderInfoPage = function(error, docs, info, req, res) {
    var page = { error:error, info:info };
    res.render('common/info.html', { app: app, req: req, page: page });
};

function setup(cbSetup) {
    // create express server
    app.server = express();
    // read setting
    app.setting = tool.getDefaultSetting(__dirname);
    var siteSetting = null;
    try {
        siteSetting = require('./setting').setting;
    } catch (e) {
        console.log('use default setting');
    }
    //console.log('site setting:', siteSetting);
    app.setting = _.extend(app.setting, siteSetting);
    // setup swig as view engine
    app.server.engine('html', cons.swig);
    app.server.set('views', path.join(__dirname, 'views'));
    app.server.set('view engine', 'html');
    // setup middleware
    app.server.use(favicon(path.join(__dirname, app.setting.public_name, 'image', 'favicon.ico')));
    app.server.use(compression());
    app.server.use(logger('dev'));
    app.server.use(bodyParser.json());
    app.server.use(bodyParser.urlencoded());
    app.server.use(cookieParser());
    app.server.use(session({
        secret:'mykey123456',
        saveUninitialized: true,
        resave: true,
        cookie: { maxAge: 120 * 60 * 1000 }  //session expires in 120 minutes   
    }));
    app.server.use(express.static(path.join(__dirname, app.setting.public_name)));
    // setup database connection
    if (app.setting.database && app.setting.database.type) {
        var Database = require(app.setting.database.type + '-database');
        app.db = new Database(app, function() {
            setupModules(app, cbSetup);
        });
    } else {
        setupModules(app, cbSetup);
    }
}

// setup modules under app_modules folder
function setupModules(app, cbSetup) {
    // load application modules
    app.module = {};
    var modulePath = path.join(app.setting.server_path, app.setting.app_modules_name);
    fs.readdir(modulePath, function(error, files) {
        if (error) {
            console.log('Error in setupModules:', error);
            process.exit();
        } else {
            for (var i = 0; i < files.length; i++) {
                var moduleName = files[i].split('.')[0];
                var modulePath = './' + app.setting.app_modules_name + '/' + moduleName;
                app.module[moduleName] = require(modulePath)(app);
            }
            setupServer(app, cbSetup);
        }
    });
}

// setup web server properties
function setupServer(app, cbSetup) {
    // catch 404 and forward to error handler
    app.server.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    // development error handler - will print stacktrace
    if (app.server.get('env') === 'development') {
        app.server.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('web/error', {
                message: err.message,
                error: err
            });
        });
    }
    // production error handler - no stacktraces leaked to user
    app.server.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('web/error', {
            message: err.message,
            error: {}
        });
    });
    cbSetup && cbSetup(app);
}

module.exports = function(callback) {
    // setup is asynchrous (database connect), so callback is needed to wait setup to complete
    setup(function(app) {
        callback && callback(app);
    });
};
