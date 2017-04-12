var express =require('express');
var path=require('path');
var static =require('serve-static');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var _=require('underscore');
var port = process.env.PORT || 3000;
var app = express();

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/movies');


app.set('views','./views/pages');
app.set('view engine','jade');
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.jsion());
app.use(static(path.join(__dirname,'public')));
app.locals.moment = require('moment');
app.listen(3000);

console.log('movie started on port' + port);

// index page
app.get('/',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}
		res.render('index',{title:'movie 首页',movies:movies})
	})
})

// detail page
app.get('/movie/:id',function(req,res){
	var id = req.params.id;
	Movie.findById(id,function(err,movie){
		// var title='movie ' +movie.title;
		res.render('detail',{title:'movie ' + movie.title,movie:movie})
	})
})

// admin page
app.get('/admin/movie',function(req,res){
	res.render('admin',{title:'movie 后台录入',movie:{
		title:'',
		doctor:'',
		country:'',
		year:'',
		poster:'',
		flash:'',
		summary:'',
		language:''
	}})
})


// admin update movie
app.get('/admin/update/:id',function(req,res){
	var id = req.params.id;
	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{title:'movie 后台更新',movie:movie})
		})
	}
})

// admin post movie
app.post('/admin/movie/new',function(req,res){
	var id=req.body.movie._id;
	var movieObj= req.body.movie;
	var _movie;
	if(id!=='undefined'){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}
			_movie = _.extend(movie,movieObj);
			_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}
				res.redirect('/movie/'+movie._id);
			})
		})
	} else {
		_movie = new Movie({
			doctor:movieObj.doctor,
			title:movieObj.title,
			language:movieObj.language,
			country:movieObj.country,
			summary:movieObj.summary,
			flash:movieObj.flash,
			poster:movieObj.poster,
			year:movieObj.year,
		})
		_movie.save(function(err,movie){
			if(err){
				console.log(err)
			}
			res.redirect('/movie/'+movie._id);
		})
	}
})


// list page
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}
		res.render('list',{title:'movie 列表页面',movies:movies})
	})
	
})

// list delete movie
app.delete('/admin/list',function(req,res){
	var id = req.query.id;
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err) {
				console.log(err)
			} else {
				res.json({success:1})
			}
		})
	}
})