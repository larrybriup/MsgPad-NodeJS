/**
 * 消息的数据库交互
 */
var assert = require('assert');
var DB = require('./DB.js').DB;
var ObjectId = require('mongodb').ObjectID;

var docName = 'messages';

/*
 将类函数类数组对象 arguments 转换成数组
 */
function args2arr(args) {
    return Array.prototype.slice.call(args);
}

/*
 调用回调函数
 */
function invokeCallback() {
    if (typeof this === 'function') {
        this(args2arr(arguments).shift());
    }
}

/*
 消息与数据库的交互接口
 */
module.exports.Message = {
    /*
     向数据库添加消息
     */
    insert: function (message, callback) {
        DB(docName, function (db, collection) {
            collection.bulkWrite([{insertOne:{document:message}}], function (err, result) {
                assert.equal(null, err);
                invokeCallback.call(callback, result);
                db.close();
            });
        });
    },
    /*
     查询数据库的消息列表
     */
    get: function (callback, limit) {
        DB(docName, function (db, collection) {
            var cursor = collection.find();

            if (typeof limit === 'number') {
                cursor = cursor.limit(limit);
            }
            var data = [];

            cursor.each(function (err, doc) {
                assert.equal(null, err);
                if (typeof doc !== 'undefined' && doc != null) {
                    data.push(doc);
                } else {
                    invokeCallback.call(callback, data);
                    db.close();
                }
            });
        });
    },
    /*
     删除指定id的消息
     */
    delete: function (id, callback) {
        DB(docName, function (db, collection) {
            collection.deleteOne({
                _id: ObjectId(id)
            }, function (err, result) {
                assert.equal(null, err);
                invokeCallback.call(callback, result);
                db.close();
            });
        })
    }
}
