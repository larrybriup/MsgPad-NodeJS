/**
 * ��Ϣ�����ݿ⽻��
 */
var assert = require('assert');
var DB = require('./DB.js').DB;
var ObjectId = require('mongodb').ObjectID;

var docName = 'messages';

/*
 ���ຯ����������� arguments ת��������
 */
function args2arr(args) {
    return Array.prototype.slice.call(args);
}

/*
 ���ûص�����
 */
function invokeCallback() {
    if (typeof this === 'function') {
        this(args2arr(arguments).shift());
    }
}

/*
 ��Ϣ�����ݿ�Ľ����ӿ�
 */
module.exports.Message = {
    /*
     �����ݿ������Ϣ
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
     ��ѯ���ݿ����Ϣ�б�
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
     ɾ��ָ��id����Ϣ
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
