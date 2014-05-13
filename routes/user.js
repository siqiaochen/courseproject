/*
 * GET users listing.
 */

var passport = require('passport');
var Account = require('../models/account');
var settings = require('../helper/config');
var configMgr  = settings.configMgr;

exports.login = function(req, res) {
	if (req.user) {
		res.redirect('/');
	} else {
		res.render('login', {
			user : req.user,
			title : 'Questions'
		});
	}
};

exports.register = function(req, res) {
	res.render('register', {
		user : req.user,
		title: "Questions"
		});
};

exports.register_post = function(req, res) {

	console.log(configMgr.config);
	if(configMgr.config.open_registration !== true)
	{
		res.redirect('/');
	}
	else if(configMgr.config.is_firstrun !== false)
		{
			Account.register(new Account({
				username : req.body.username,
				role : 'admin'
			}), req.body.password, function(err, account) {
				if (err) {
					return res.render('register', {
						account : account
					});
				}
				configMgr.config.is_firstrun = false;
				configMgr.writeconfig();
				passport.authenticate('local')(req, res, function() {
					res.redirect('/');
				});
			});
		}
		else
		{
			Account.register(new Account({
				username : req.body.username,
				role : ''
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
		}
	
};

exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};
