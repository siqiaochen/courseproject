/**
 * New node file
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    nickname: String,
    birthdate: Date,
    role: String
});


Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);


exports.requireRole = function(role) {
    return function(req, res, next) {
        if(req.session.user)
        {
        	Account.findById(req.params.id,function(err, account, count) {
        		if(account.role === 'admin')
        			next();
        		else if(account.role === 'role')
        			next();
        		else
                    res.send(403);
        	});
        }
        else
            res.send(403);
    }
}