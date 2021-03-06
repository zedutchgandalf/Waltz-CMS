var express   = require('express'),
    mongoose  = require('mongoose'),
    config    = require('../config/waltz.conf');
var router = express.Router();

// MAIN
router.get('/', function(req, res) {
    return res.send({
        "message" : "Welcome to the Waltz API!"
    });
});

// INFO
var infoRouter = require('./info.js');
router.use(config.epInfo, infoRouter);

// POSTS
var postsRouter = require('./posts.js');
router.use(config.epPosts, postsRouter);

// USERS
var usersRouter = require('./users.js');
router.use(config.epUsers, usersRouter);

// EVENTS
var eventsRouter = require('./events.js');
router.use(config.epEvents, eventsRouter);

// PAGES
var pagesRouter = require('./pages.js');
router.use(config.epPages, pagesRouter);

// 404
router.use('*', function (req, res){
    res.status(404).send({
        "error" : "Page not found."
    });
});

router.use(function(err, req, res, next){
	if (err.name === "UnauthorizedError") {
		res.status(401);
		res.json({
			error : err.name + ": " + err.message
		});
	} else {
		res.status(err.status || 500);
	}
});

module.exports = router;