
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



app.all('*',function(req,res){res.send(404);});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


