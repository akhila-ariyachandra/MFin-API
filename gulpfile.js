/*--------------------Dependencies--------------------*/
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const notify = require('gulp-notify');
const livereload = require('gulp-livereload');
const fs = require('fs');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

/*--------------------Paths--------------------*/
const appFiles = [
	'src/app.js', // Server file
	'src/db.js', // Database file
	'src/headers/modelHeader.js', 'src/models/*.js', // Model files
	'src/headers/controllerHeader.js', 'src/controllers/*.js', // Controller files
	'src/routes.js', // Routes
	'src/footer.js'// Footer
];
const dest = 'build';

/*--------------------Tasks--------------------*/
gulp.task('build', function () {
	// Copy View files
	gulp.src('src/views/*.html')
		.pipe(gulp.dest('build/views'));

	// Concat and minify Javascript files
	gulp.src(appFiles)
		.pipe(concat('app.js'))
		.pipe(gulp.dest(dest))
		.pipe(rename('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(dest));

	return;
});

gulp.task('logCheck', function () {
	// Check if directory exists
	if (!isDirSync('logs')) {
		fs.mkdirSync('logs');
	}
	// Check if file exists
	if (!isFileSync('logs/MFin.log')) {
		fs.writeFileSync('logs/MFin.log', '');
	}
});

// Run server using minified file
gulp.task('server', function () {
	// While running the server the env variable is set to dev
	process.env.NODE_ENV = 'dev';
	// listen for changes
	livereload.listen();
	// configure nodemon
	nodemon({
		// the script to run the app
		script: 'build/app.min',
		ext: 'js'
	}).on('restart', function () {
		// when the app has restarted, run livereload.
		gulp.src('build/app.min.js')
			.pipe(livereload())
			.pipe(notify('Restarting server, please wait...'));
	})
});

// Run server using file that hasn't been minified
// Makes it easier to debug
gulp.task('serverDebug', function () {
	// While running the server the env variable is set to dev
	process.env.NODE_ENV = 'dev';
	// listen for changes
	livereload.listen();
	// configure nodemon
	nodemon({
		// the script to run the app
		script: 'build/app',
		ext: 'js'
	}).on('restart', function () {
		// when the app has restarted, run livereload.
		gulp.src('build/app.js')
			.pipe(livereload())
			.pipe(notify('Restarting server, please wait...'));
	})
});

gulp.task('default', ['build', 'logCheck', 'server'], function () {
});

// Used for debugging
gulp.task('debug', ['build', 'logCheck', 'serverDebug'], function () {
});

/*--------------------Functions--------------------*/
function isDirSync(aPath) {
	try {
		return fs.statSync(aPath).isDirectory();
	} catch (e) {
		if (e.code == 'ENOENT') {
			return false;
		} else {
			throw e;
		}
	}
}

function isFileSync(aPath) {
	try {
		return fs.statSync(aPath).isFile();
	} catch (e) {
		if (e.code == 'ENOENT') {
			return false;
		} else {
			throw e;
		}
	}
}