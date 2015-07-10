/*
这是数据库工具
 */
var mongo = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';

/*
数据库操作接口
使用方法：
DB('collectionName', function(db, collection){
    // 使用 db 和 collection
});
 */
module.exports.DB = function (name, callback) {
    mongo.connect(url, function (err, db) {
        assert.equal(null, err);
        var collection = db.collection(name);
        if (typeof collection === 'undefined') {
            db.createCollection(name);
            collection = db.collection(name);
        }
        if (typeof callback === 'function') {
            callback(db, collection);
        }
    });
};