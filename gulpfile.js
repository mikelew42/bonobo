var gulp = require('gulp'),
	livereload = require('gulp-livereload'),
	open = require('open'),
	express = require('express');


gulp.task('server', function(next){
	var server = express().use(express.static( __dirname + '/public' )).listen(9876, next);
	open("http://localhost/", "chrome");
});

gulp.task('default', ['server'], function(){
	var refresh = livereload();

	gulp.watch(['public/*.*', 'public/**/*.*']).on('change', function(file){
		refresh.changed(file.path);
	});

});