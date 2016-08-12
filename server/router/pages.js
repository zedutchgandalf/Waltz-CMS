var express          = require('express'),
    checkSession     = require('./helpers.js').SessionManager.checkSession,
    getCorrectLocale = require('./helpers.js').getCorrectLocale,
    Page             = require('../models/page.js'),
    config           = require('../config/waltz.conf');
var router = express.Router();

router.get('/', function(req, res) {
    Page.find(function(err, pages) {
        if (!err) {
            return res.send(pages);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.post('/', checkSession, function(req, res) {
    var title = req.body.title;

    var urlString = title.toLowerCase()
                         .trim()
                         .replace(/ /g, "_");
    var now = new Date().toISOString();

    var page = new Page({
        title      : title,
        content    : req.body.content,
        urlString  : urlString,
        lastEditBy : req.session.name,
        lastEditOn : now
    });

    page.save(function(err) {
        if (!err) {
            return res.status(200).send(page);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/:urlString', function(req, res) {
    var urlString = req.params.urlString;
    var locale = getCorrectLocale(req);

    Page.findOne({
        urlString : urlString
    }, function(err, page) {
        if (!page && !err) {
            return res.status(404).send();
        } else if (err) {
            return res.status(500).send(err);
        }
        
        var localizedPage = Page.schema.methods.toJSONLocalizedOnly(page, locale, config.defaultLocale);

        return res.status(200).send(localizedPage);
    });
});

router.put('/:urlString', checkSession, function(req, res) {
    var urlString = req.params.urlString;
    var locale = getCorrectLocale(req);
    var now = new Date().toISOString();

    Page.findOne({
        urlString : urlString
    }, function(err, page) {
        if (!page && !err) {
            return res.status(404).send();
        } else if(err) {
            console.error("Error retrieving a page object before editing:", err);
            return res.status(500).send(err);
        }

        page.title[locale]      = req.body.title;
        page.content[locale]    = req.body.content;
        page.lastEditBy         = req.session.name;
        page.lastEditOn         = now;

        page.save(function(err) {
            if (!err) {
                var localizedpage = Page.schema.methods.toJSONLocalizedOnly(page, locale, config.defaultLocale);

                return res.status(200).send(localizedpage);
            } else {
                console.error("Error saving a page object:", err);
                return res.status(500).send(err);
            }
        });
    });
});

router.delete('/:urlString', checkSession, function(req, res) {
    var urlString = req.params.urlString;

    Page.remove({
        urlString : urlString
    }, function(err) {
        return console.error(err);
    });

    return res.sendStatus(204);
});

module.exports = router;