/**
 * New node file
 */
//var utils    = require( './utils' );
var mongoose = require( 'mongoose' );
var Post 	 = mongoose.model('Post');
var Vote 	 = mongoose.model('Vote');
var Thread 	 = mongoose.model('Thread');
var Tag 	 = mongoose.model('Tag');
/*
 * GET home page.
 */

exports.showquestionlist = function(req, res){
	var q_index = parseInt(req.query.index);
	var q_size = parseInt(req.query.size);
	console.log(q_index);
	console.log(q_size);
	if(isNaN(q_index))
	{
		q_index = 0;
	}
	if(isNaN(q_size) || q_size > 10|| q_size < 1)
	{		
		q_size = 10;
	}

	Thread.count({}, function (err, thread_count) {
		Thread.find({},null, {skip:q_index,limit:q_size}).populate('created_by').populate("question").exec(function(err, threads, count) {

			console.log(thread_count);
			console.log(q_index);
			console.log(q_size);
			res.render('questions', {
				user : req.user,
				title: "Questions",
				threads : threads,
				current_page : q_index,
				page_size : q_size,
				total : thread_count
			});
		});
	});
};

exports.createquestion = function(req, res){
		res.render('addquestion', {
			user : req.user,
			title: "Questions"
		});

};

exports.createquestion_post = function(req, res){
	if(req.user)
	{
		var newthread =	new Thread({
			title : req.body.title,
			created_by : req.user._id,
			updated_at : Date.now()}).save(function(err, newthread, count){					
				new Post({
					content : req.body.content,
					created_by : req.user._id,
					thread_id : newthread._id,
					updated_at : Date.now()}).save(function(err, newpost, count){
						console.log(err);
						Thread.findById( newthread._id, function ( err, curthread ){
							console.log(newpost);
							curthread.question = newpost._id;
							curthread.save();
							res.redirect('questions');
						});
				});					
			});
	}
	else
	{
		res.redirect('questions');
	}
};


exports.deletequestion = function(req,res){
	if(req.user)
	{
		Thread.findById(req.params.id, function ( err, thread ){
			thread.remove(function (err, thread)
			{
				Post.remove({thread_id : thread._id},function(err, posts){
					if (err) return handleError(err);
				});
				res.redirect('questions');
			});
		});
	}
	else
	{
		res.redirect('questions');
	}
}
exports.question = function(req, res){
		Thread.findById(req.params.id).populate('created_by').populate("question").exec( function ( err, thread ){

			Post.find({thread_id : thread._id}).populate('created_by').exec(function(err, posts){
				res.render('question',{
					user : req.user,
					title : 'Questions',
					thread : thread,
					posts : posts
				});
			});			
		});
	
};
exports.answer_post = function(req, res){
	if(req.user)
	{
		new Post({
			content : req.body.content,
			created_by : req.user._id,
			thread_id : req.params.id,
			updated_at : Date.now()}).save(function(err, todo, count){
			res.redirect('question/'+ req.params.id);
		});
	}
	else
	{
		res.redirect('/');
	}
};
exports.answer_delete = function(req, res){
	if(req.user)
	{
		Post.findById(req.params.id, function ( err, post ){
			post.remove(function (err, post)
			{
				res.redirect('question/'+post.thread_id);
			});
		});
	}
	else
	{
		res.redirect('/');
	}
};
exports.editquestion = function(req, res){
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
