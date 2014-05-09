/**
 * New node file
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    nickname: String,
    birthdate: Date,
    roles: String
});
var Role = new Schema({
	created_by : {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
    roles: String
});


Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);

module.exports = mongoose.model('Role', Role);

exports.requireRole = function(role) {
    return function(req, res, next) {
        if(req.session.user && req.session.user.roles === role)
            next();
        else
            res.send(403);
    }
}