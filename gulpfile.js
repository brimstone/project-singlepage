var gulp		= require("gulp")
	lr			= require("tiny-lr"),
	less		= require("gulp-less"),
	minifycss	= require("gulp-minify-css"),
	rename		= require("gulp-rename"),
	livereload	= require("gulp-livereload"),
	ngmin		= require("gulp-ngmin"),
	smoosher	= require('gulp-smoosher'),
	minifyHTML	= require('gulp-minify-html'),
	server		= lr();

gulp.task("watch", function () {
	server.listen(35729, function (err) {
		if (err) return console.log(err);

//build:
//- single.html (copied from src)
		gulp.watch("src/single.html", ["html"]);
//- module/*/*.js (from src/) 
		gulp.watch("src/module/*/*.js", ["js"]);
//- module/*/*.css (from src/module/*/*.less) 
		gulp.watch("src/module/*/*.less", ["less"]);
//- single.less (from src/less/*.less) 
		gulp.watch("src/single.less", ["less-single"]);

//dist:
//- module/*.js (from ngmin and html2js)
		gulp.watch("build/module/*.js", ["dist-js"]);
//- all.css (concat from build/single.css and build/modules/*.css) 
		gulp.watch(["build/*.css", "build/module/*.css" ], ["dist-css"]);
//- single.html (copied from build) 
		gulp.watch("build/single.html", ["dist-html"]);
//- singlepage-0.0.0.html (from smoosh and minimize) 
	});
});

gulp.task("default", ["build", "dist", "watch"]);
gulp.task("build", ["html", "js", "less", "less-single"]);
gulp.task("dist", ["dist-js", "dist-css", "dist-html"]);


// build things go from src to build
// stolen from https://github.com/ChrisSoutham/GulpJS-Bootstrap-LESS/blob/master/gulpfile.js
//	.pipe(livereload(server))


//build:
//- single.html (copied from src)
gulp.task("html", function () {
	gulp.src("src/single.html")
	.pipe(gulp.dest("build"))
});
//- module/*/*.js (from src/) 
gulp.task("js", function () {
	gulp.src("src/module/*/*.js")
	.pipe(gulp.dest("build/"))
});
//- module/*/*.css (from src/module/*/*.less) 
gulp.task("less", function () {
	gulp.src("src/module/*/*.less")
	.pipe(less())
	.pipe(gulp.dest("build"))
});
//- single.less (from src/less/*.less) 
gulp.task("less-single", function () {
	gulp.src("src/single.less")
	.pipe(less())
	.pipe(gulp.dest("build"))
});

//dist:
//- module/*.js (from ngmin and html2js)
gulp.task("dist-js", function () {
	gulp.src("build/module/*.js")
	.pipe(ngmin())
	.pipe(rename("all.min.js"))
	.pipe(gulp.dest("dist"))
});
//- all.css (concat from build/single.css and build/modules/*.css) 
gulp.task("dist-css", function () {
	gulp.src(["build/*.css", "build/module/*.css" ])
	.pipe(minifycss())
	.pipe(rename("all.css"))
	.pipe(gulp.dest("dist"))
});
//- single.html (copied from build) 
gulp.task("dist-html", function () {
	gulp.src("build/single.html")
	.pipe(livereload(server))
	.pipe(gulp.dest("dist"));

	gulp.src("dist/single.html")
	.pipe(smoosher())
	.pipe(minifyHTML({comments:true,spare:true}))
	.pipe(rename("single-v0.0.0.html"))
	.pipe(livereload(server))
	.pipe(gulp.dest("dist"));
});
//- singlepage-0.0.0.html (from smoosh and minimize) 
