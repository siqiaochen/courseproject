var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Post = new Schema({
	created_by : {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
	reply_to :  {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
	content : String,
	updated_at : Date,
	thread_id : String
});

var Thread = new Schema({
	owner_id : {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
	title : String,
	content : String,
	updated_at : Date,
	tag_id: { type: [String], index: true } // field level
});

var Tag = new Schema({
	name : String
});
var Todo = new Schema({
	user_id : String,
	content : String,
	updated_at : Date
});
var User = new Schema({
	user_id : String,
	password : String,
	user_right : String	
});
var GitHubUser = new Schema({
	user_id : String,
	password : String,
	user_right : String	
});
mongoose.model('Post', Post);
mongoose.model('Todo', Todo);
mongoose.model('User', User);
mongoose.model('GitHubUser', GitHubUser);