/**
 * New node file
 */

var mongoose = require( 'mongoose' );
var Problem  = mongoose.model('Problem');
var oj_client = require( '../helper/ojconnector' );

var solutions =[];

exports.send_solution = function(req, res){

	console.log(req.params.id);
	Problem.findById(req.params.id,function(err, problem, count) {
		console.log('set solution');
		var my_solution = {};
		my_solution.problem = {};
		my_solution.problem.id = req.params.id;
		my_solution.problem.solution = new Buffer(req.body.solution).toString('base64');

		//my_solution.problem.in = [];
		//my_solution.problem.out = [];
		my_solution.problem.testcases = [];
		if(problem.inputs.length == problem.outputs.length)
		{
			for(var i=0;i<problem.inputs.length;i++)
			{
				var data = {
				data_in : problem.inputs[i],
				data_out: problem.outputs[i]
				};
				my_solution.problem.testcases.push(data);
			}
		}
		console.log(my_solution);
		
		var client = new oj_client("192.168.1.18",5001,my_solution);
		solutions.push(client);
		var ans = {
			id : solutions.indexOf(client)
		}
		
		res.send(ans);
	});

};

exports.get_solution_info = function(req, res){

	out_solution = [];
	for (var i=0;i<solutions.length;i++)
	{ 	var problem_id = solutions[i].problem_id;
		var answer = solutions[i].answer();
		var status = solutions[i].status();
		var element = {
			id : problem_id,
			answer : answer,
			status : status
		};

		console.log(element);
		out_solution.push(element);
	}
	res.send(out_solution);

};

