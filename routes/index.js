//var utils    = require( './utils' );
var mongoose = require( 'mongoose' );
var Thread 	 = mongoose.model('Thread');
/*
 * GET home page.
 */

exports.index = function(req, res){
	Thread.find().populate('created_by').exec(function(err, thread, count) {
		res.render('index', {
			user : req.user,
			title: "Questions",
			thread : thread
		});
	});
};

exports.create = function(req, res){
	if(req.user)
	{
		new Post({
			content : req.body.content,
			created_by : req.user._id,
			updated_at : Date.now()}).save(function(err, todo, count){
			res.redirect('/');
		});
	}
	else
	{
		res.redirect('/');
	}
};

exports.destroy = function(req, res){
	Post.findById(req.params.id, function (err, todo){
		todo.remove(function (err, todo)
		{
			res.redirect('/');
		});
	});
};

exports.edit = function (req,res){
	Post.find(function (err, posts) {
		res.render('edit',{
			title : 'Questions',
			posts : posts,
			current : req.params.id
		});		
	});	
};
exports.update = function ( req, res ){
	Post.findById( req.params.id, function ( err, todo ){
		todo.content    = req.body.content;
		todo.updated_at = Date.now();
		todo.save( function ( err, todo, count ){
			res.redirect( '/' );
			});
		});
};

//** express turns the cookie key to lowercase **
/*
exports.current_user = function ( req, res, next ){
	var user_id = req.cookies ?
			req.cookies.user_id : undefined;
	if( !user_id ){
		res.cookie( 'user_id', utils.uid( 32 ));
		}
	next();
};
*/
