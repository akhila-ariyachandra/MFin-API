/*--------------------Dependencies--------------------*/
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const notify = require('gulp-notify');
const livereload = require('gulp-livereload');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

/*--------------------Paths--------------------*/
const appFiles = [
	'src/app.js', // Server file
	'src/middleware.js', // Middleware file
	'src/db.js', // Database file
	'src/headers/modelHeader.js', 'src/models/*.js', // Model files
	'src/headers/controllerHeader.js', 'src/controllers/*.js', // Controller files
	'src/routes.js', // Routes
	'src/footer.js'// Footer
];
const viewFiles = [
	'src/views/header.html',
	'src/views/entities/*.html',
	'src/views/footer.html'
];
const dest = 'build';

/*--------------------Tasks--------------------*/
gulp.task('build', function () {
	// Concat View files
	gulp.src(viewFiles)
		.pipe(concat('index.html'))
		.pipe(gulp.dest(dest));

	// Concat and minify Javascript files
	gulp.src(appFiles)
		.pipe(concat('app.js'))
		.pipe(gulp.dest(dest))
		.pipe(rename('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(dest));

	return;
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

gulp.task('default', ['build', 'server'], function () {
});

// Used for debugging
gulp.task('debug', ['build', 'serverDebug'], function () {
});
