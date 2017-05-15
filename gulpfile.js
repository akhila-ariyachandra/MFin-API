// Dependencies
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const notify = require('gulp-notify');
const livereload = require('gulp-livereload');
const fs = require('fs');
 
// Tasks
gulp.task('logCheck', function(){
	// Check if directory exists
	if(!isDirSync('logs')){
		fs.mkdirSync('logs');
	}
	// Check if file exists
	if(!isFileSync('logs/MFin.log')){
		fs.writeFileSync('logs/MFin.log', '');
	}	
});

gulp.task('server', function() {
	// listen for changes
	livereload.listen();
	// configure nodemon
	nodemon({
		// the script to run the app
		script: 'src/app.js',
		ext: 'js'
	}).on('restart', function(){
		// when the app has restarted, run livereload.
		gulp.src('src/app.js')
			.pipe(livereload())
			.pipe(notify('Restarting server, please wait...'));
	})
});

gulp.task('default',['logCheck','server'],function(){
});

// Functions
function isDirSync(aPath){
	try{
		return fs.statSync(aPath).isDirectory();
	}catch(e){
		if(e.code == 'ENOENT'){
			return false;
		}else{
			throw e;
		}
	}
}

function isFileSync(aPath){
	try{
		return fs.statSync(aPath).isFile();
	}catch(e){
		if(e.code == 'ENOENT'){
			return false;
		}else{
			throw e;
		}
	}
}