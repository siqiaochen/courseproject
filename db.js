var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Post = new Schema({
	user_id : String,
	reply_to : String,
	content : String,
	updated_at : Date
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