/*--------------------Dependencies--------------------*/
const gulp = require("gulp");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");

/*--------------------Paths--------------------*/
const appFiles = [
    "src/app.js", // Server file
    "src/middleware.js", // Middleware file
    "src/db.js", // Database file
    "src/headers/modelHeader.js", "src/models/*.js", // Model files
    "src/headers/controllerHeader.js", "src/controllers/*.js", // Controller files
    "src/routes.js", // Routes
    "src/footer.js"// Footer
];
const viewFiles = [
    "src/views/header.html",
    "src/views/entities/*.html",
    "src/views/footer.html"
];
const dest = "build";

/*--------------------Tasks--------------------*/
gulp.task("build", function () {
	// Concat View files
    gulp.src(viewFiles)
		.pipe(concat("index.html"))
		.pipe(gulp.dest(dest));

	// Concat and minify Javascript files
    gulp.src(appFiles)
		.pipe(concat("app.js"))
		.pipe(gulp.dest(dest))
		.pipe(rename("app.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest(dest));

    return;
});