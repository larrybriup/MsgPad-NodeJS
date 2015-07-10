/*
�������ݿ⹤��
 */
var mongo = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';

/*
���ݿ�����ӿ�
ʹ�÷�����
DB('collectionName', function(db, collection){
    // ʹ�� db �� collection
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