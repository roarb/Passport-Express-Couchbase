/**
 * Created by rhoeh on 5/8/2016.
 */
var cb = require('couchbase');
var cluster = new cb.Cluster('couchbase://127.0.0.1');
var bucket = cluster.openBucket('warmahordes');

var records = [
    { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] }
    , { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
];

exports.findById = function(id, cb) {

    bucket.get('users', function(err, result) {
        process.nextTick(function() {
            var idx = id - 1;
            if (err) throw err;

            var records = result.value.users; // from couchbase
            console.log(records);
            if (records[idx]) {
                cb(null, records[idx]);
            } else {
                cb(new Error('User ' + id + ' does not exist'));
            }

        });
    });

};

exports.findByUsername = function(username, cb) {

    bucket.get('users', function(err, result) {
        process.nextTick(function() {
            if (err) throw err;
            var records = result.value.users; // from couchbase now.
            
            for (var i = 0, len = records.length; i < len; i++) {
                var record = records[i];
                if (record.username === username) {
                    return cb(null, record);
                }
            }
            return cb(null, null);
        });
    });
};