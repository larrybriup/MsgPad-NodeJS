var express = require('express');
var router = express.Router();
var db = require('../code/DB.js').db;
var title = 'MessagePAD';
var NodeLogger = require('../code/Logger').NodeLogger;
var msg = require('../code/Msg').Message;

// NodeLogger是自己写的日志工具
var log = new NodeLogger('index', {target: NodeLogger.TO_FILE, filename: 'logs'});

router.route('/').get(function (req, res, next) {
    msg.get(function (data) {
        res.render('index', {title: title, data: data});
    });
});

/*
 消息的ajax请求处理路由
 */
router.route('/msg')
    .get(function (req, res, next) {
    })
    .post(function (req, res, next) {
        var params = req.body;
        var message = {
            name: params.name,
            email: params.email,
            message: params.message,
            date: new Date().getTime()
        };

        msg.insert(message, function (result) {
            message._id = result.insertedIds[0];
            res.json(message);
        });
    }).put(function (req, res, next) {

    }).delete(function (req, res, next) {
        msg.delete(req.body.id, function (result) {
            res.json(result);
        });
    });

module.exports = router;
