// Dependencies
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const notify = require('gulp-notify');
const livereload = require('gulp-livereload');
const fs = require('fs');
 
// Tasks
gulp.task('logCheck', function(){
	fs.stat('logs/MFin.log', function(err, stat){
		if(err!=null){	// File does not exists
			fs.mkdirSync('logs');
			fs.writeFileSync('logs/MFin.log', '');
		}	
	});
});

gulp.task('server', function() {
	// listen for changes
	livereload.listen();
	// configure nodemon
	nodemon({
		// the script to run the app
		script: 'app.js',
		ext: 'js'
	}).on('restart', function(){
		// when the app has restarted, run livereload.
		gulp.src('app.js')
			.pipe(livereload())
			.pipe(notify('Restarting server, please wait...'));
	})
});

gulp.task('default',['logCheck','server'],function(){
});