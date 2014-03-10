/*
 * GET users listing.
 */

var passport = require('passport');
var Account = require('../models/account');

exports.login = function(req, res) {
	if (req.user) {
		res.redirect('/');
	} else {
		res.render('login', {
			user : req.user,
			title : 'Express Todo'
		});
	}
};

exports.register = function(req, res) {
	res.render('register', {});
};

exports.register_post = function(req, res) {
	Account.register(new Account({
		username : req.body.username
	}), req.body.password, function(err, account) {
		if (err) {
			return res.render('register', {
				account : account
			});
		}

		passport.authenticate('local')(req, res, function() {
			res.redirect('/');
		});
	});
};

exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};
