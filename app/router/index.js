var express = require('express'),
    router  = express.Router();

var envVariables = {
    env : function(variable) {
        var fileEnd = variable.indexOf('.');
        if (fileEnd < 0) {
            console.error("Environment variables should always contain at least one dot '.'! This is invalid:", variable);
            return "%ERROR:" + variable + "%";
        } else {
            var file = "../config/" + variable.substr(0, fileEnd) + ".conf";
            var envConf = require(file);
            return envConf[variable.substr(fileEnd + 1)];
        }
    },
    doctype : 'html'
};

router.get('/modals/:name', function(req, res) {
    var name = req.params.name;
    res.render('modals/' + name, envVariables);
});

router.get('/views/:name', function(req, res) {
    var name = req.params.name;
    res.render('views/' + name, envVariables);
});

router.get('/components/:name', function(req, res) {
    var name = req.params.name;
    res.render('components/' + name, envVariables);
});

router.get('/widgets/:name', function(req, res) {
    var name = req.params.name;
    res.render('widgets/' + name, envVariables);
});

router.get('/errors/:name', function(req, res) {
    var name = req.params.name;
    res.render('errors/' + name, envVariables);
});

router.get('/', function(req, res) {
    res.render('index', envVariables);
});

router.get('/favicon.*', function(req, res) {
    // TODO: Provide a way to serve the icon as favicon
    res.status(404).send({
        "error" : "Page not found."
    });
});

router.use('*', function (req, res) {
    res.render('index', envVariables);
});

module.exports = router;