/**
 * New node file
 */


//var utils    = require( './utils' );
var mongoose = require( 'mongoose' );
var Post 	 = mongoose.model('Post');
var Vote 	 = mongoose.model('Vote');

exports.vote_up = function ( req, res ){
	if(req.user)
	{
		Post.update({ _id:  req.params.id }, { 
				$addToSet: { vote_up: req.user._id },
				$pull: {vote_down: req.user.id}
			}, function ( err, todo, count ){
			res.send( 'Success' );
		});
	}
	else
	{
		res.send( 'Failure' );
	}
};

exports.vote_down = function ( req, res ){
	if(req.user)
	{
		Post.update({ _id:  req.params.id }, {
				$addToSet: { vote_down: req.user._id },
				$pull: {vote_up: req.user.id}
			}, function ( err, todo, count ){
			res.send('Success');
		});
	}
	else
	{
		res.send( 'Failure' );
	}
};