
/**
 * Module dependencies.
 */
require( './models/qaforum' );
require( './models/problem' );
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , question = require('./routes/question')
  , problem = require('./routes/problem')
  , vote = require('./routes/vote')
  , http = require('http')
  , path = require('path');

var crypto = require('crypto');
var app = express();
var engine = require('ejs-locals');
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

app.locals.appname = "Express.js Todo app";
	

// all environments
app.set('port', process.env.PORT || 3000);
app.engine( 'ejs', engine );
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.static(process.cwd() + '/public'));
//app.use(express.static('files'));
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(express.bodyParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use( app.router );
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


//mongoose
mongoose.connect('mongodb://dbmgr:csq1234%^&*@oceanic.mongohq.com:10003/app23120409');

app.get('/', routes.index);
app.get('/login', user.login);
app.post('/login', passport.authenticate('local'), function(req, res) {res.redirect('/');});
app.get('/register', user.register);
app.post('/register', user.register_post);
app.post('/logout', user.logout);
app.post('/create', routes.create);
app.get('/destroy/:id', routes.destroy);
app.get( '/edit/:id', routes.edit );
app.post('/update/:id', routes.update);
// question page
app.get('/questions', question.showquestionlist);
app.get('/question/create', question.createquestion);
app.post('/question/create', question.createquestion_post);
app.get('/question/:id', question.question);
app.post('/question/answer/:id', question.answer_post);
app.get('/question/delete/:id', question.deletequestion);
app.get('/answer/delete/:id', question.answer_delete);
app.get('/vote_up/:id', vote.vote_up);
app.get('/vote_down/:id', vote.vote_down);
// problem page
app.get('/problems', problem.showproblemlist);
app.get('/problem/create',problem.createproblem);
app.post('/problem/create',problem.createproblem_post);
app.get('/problem/:id',problem.readproblem);



/*
 * Load the S3 information from the environment variables.
 */
var AWS_ACCESS_KEY = "AKIAISE4B4YSHXHOQUWQ";
var AWS_SECRET_KEY = "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";
var S3_BUCKET = "oj-files";

// app upload
/*
 * Respond to GET requests to /sign_s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and the
 * anticipated URL of the image.
 */
app.get('/sign_s3', function(req, res){
	console.log("new upload");
    var object_name = req.query.s3_object_name;
    var mime_type = req.query.s3_object_type;

    var now = new Date();
    var expires = Math.ceil((now.getTime() + 10000)/1000); // 10 seconds from now
    var amz_headers = "x-amz-acl:public-read";  

    var put_request = "PUT\n\n"+mime_type+"\n"+expires+"\n"+amz_headers+"\n/"+S3_BUCKET+"/"+object_name;

    var signature = crypto.createHmac('sha1', AWS_SECRET_KEY).update(put_request).digest('base64');
    signature = encodeURIComponent(signature.trim());
    signature = signature.replace('%2B','+');

    var url = 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+object_name;

    var credentials = {
        signed_request: url+"?AWSAccessKeyId="+AWS_ACCESS_KEY+"&Expires="+expires+"&Signature="+signature,
        url: url
    };
    res.write(JSON.stringify(credentials));
    res.end();
});



app.all('*',function(req,res){res.send(404);});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


