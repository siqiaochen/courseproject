/**
 * New node file
 */

var mongoose = require( 'mongoose' );
var Problem  = mongoose.model('Problem');
var oj_client = require( '../helper/ojconnector' );

var solutions =[];
var currID = 0;
exports.send_solution = function(req, res){

	console.log(req.params.id);
	Problem.findById(req.params.id,function(err, problem, count) {
		console.log('set solution');

		currID ++;
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
		//var client = new oj_client("127.0.0.1",5001,my_solution);
		client.starttime = new Date();
		client.ans_id = currID;
		solutions.push(client);
		var ans = {
			id : my_solution.id
		}
		
		res.send(ans);
	});

};

exports.get_solution_info = function(req, res){

	out_solution = [];
	for (var i=0;i<solutions.length;i++)
	{	var ans_id = solutions[i].ans_id;
	 	var problem_id = solutions[i].problem_id;
		var answer = solutions[i].answer();
		var status = solutions[i].status();
		var element = {
			ans_id : ans_id,
			problem_id : problem_id,
			answer : answer,
			status : status
		};

		console.log(element);
		out_solution.push(element);
	}
	res.send(out_solution);

};
function removeOldSolution()
{
	
	for (var i=(solutions.length-1);i>=0;i--)
	{	
		var starttime = solutions[i].starttime;
		var dnow = new Date();
		if((dnow.getTime()-starttime.getTime()) / 1000 > 500)
		{
			solutions.splice(i, 1);
		}
	}
}
setInterval(removeOldSolution, 6000);

