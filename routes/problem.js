/**
 * New node file
 */
var mongoose = require( 'mongoose' );
var Problem  = mongoose.model('Problem');
var Solution = mongoose.model('Solution');
exports.showproblemlist = function(req, res){
	Problem.find(function(err, problems, count) {
			res.render('problems', {
				user : req.user,
				title: "Questions",
				problems : problems
			});
		});
}

exports.readproblem = function(req, res){
	Problem.findById(req.params.id,function(err, problem, count) {
		res.render('problem',{
			user : req.user,
			title : 'Questions',
			problem : problem
		});
	});
}
exports.deleteproblem = function(req, res){
	Problem.findById(req.params.id,function(err, problem, count) {
		problem.remove(function (err, problem)
				{
					res.redirect('questions');
				});
	});
}

exports.createproblem = function(req, res){
	res.render('addproblem', {
		user : req.user,
		title: "Questions"
	});

};
exports.createproblem_post = function(req, res){
	if(req.user)
	{
		var newproblem =	new Problem({		
				created_by : req.user._id,
				title : req.body.title,
				question : req.body.question,	
				content : req.body.content,
				time_limit : req.body.time_limit,
				mem_limit : req.body.mem_limit,
				updated_at : Date.now()}
		).save(function(err, problem, count){	
			console.log(err);
			res.redirect('problem/'+problem._id);
			});
	}
	else
	{
		res.redirect('problems');
	}
}

exports.updateproblem = function(req, res){
	if(req.user)
	{

		Problem.findById( req.params.id, function ( err, problem ){
			
			problem.problem_num = req.body.problem_num;
			problem.created_by = req.user._id;
			problem.title = req.body.title;
			problem.question = req.body.question;	
			problem.time_limit = req.body.time_limit;
			problem.mem_limit = req.body.mem_limit;
			problem.updated_at = Date.now();

			problem.save( function ( err, todo, count ){
				res.redirect( 'problems' );
				});
			});
	}
	else
	{
		res.redirect('problems');
	}
}
exports.submitsolution = function(req,res)
{
	if(req.user)
	{

		Problem.findById( req.params.id, function ( err, problem ){
			
			problem.problem_num = req.body.problem_num;
			problem.created_by = req.user._id;
			problem.title = req.body.title;
			problem.question = req.body.question;	
			problem.time_limit = req.body.time_limit;
			problem.mem_limit = req.body.mem_limit;
			problem.updated_at = Date.now();

			problem.save( function ( err, todo, count ){
				res.redirect( 'problems' );
				});
			});
	}
	else
	{
		res.redirect('problems');
	}	
}
