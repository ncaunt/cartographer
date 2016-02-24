var express = require('express');
var hbs = require('hbs');
var _ = require('lodash');
var favicon = require('serve-favicon');
var logger = require('./logging');
var AppServer = require('./libs/AppServer');

var server = function () {
    var app = express();
    var httpServer;
    var applicationRoot = __dirname + '/';

    app.set('view engine', 'html');
    app.set('views', applicationRoot + 'views');
    app.engine('html', hbs.__express);
    app.use("/static", express.static(applicationRoot + 'static'));
    app.use(favicon(applicationRoot + 'static' + '/favicon.ico'));

    app.get('/', function (req, res){
        res.render('index.hbs');
    })

    return {
        start: function (options, callback) {
            httpServer = new AppServer(app, options);
            httpServer.start(function (err) {
                if(err){
                    logger.logError('Encountered error while starting server', {
                        message: err.message,
                        stack: err.stack
                    });
                    return;
                }
                logger.logInfo('server listening on port: ' + options.port)
                callback();
            });
        },
        stop: function (callback) {
            httpServer.stop(callback);
        }
    };
};

if (require.main === module) {
    new server().start({
        port: 1234
    }, function () {});
}

module.exports = server;