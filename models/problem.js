/**
 * New node file
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var Problem = new Schema({
	problem_num : Number,
	created_by : {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
	title : String,
	question : String,
	time_limit : Number,
	mem_limit : Number,
	inputs : [String],
	outputs : [String],
	updated_at : Date,
	tags : { type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}], index: true } // field level
});


var Solution = new Schema({
	created_by : {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
	problem_id : {type: mongoose.Schema.Types.ObjectId, ref: 'Problem'},
	code : String,
	language : Number,
	result : Number,
	output : String,
	time_taken : Number,
	mem_taken : Number,
	updated_at : Date
});


mongoose.model('Problem', Problem);
mongoose.model('Solution', Solution);