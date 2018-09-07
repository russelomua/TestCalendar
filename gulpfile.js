'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
	concat = require('gulp-concat'),
	connect = require('gulp-connect'),
	less = require('gulp-less'),
	rimraf = require('rimraf');

var path = {
	build: {
		base: "dist/",
		js: "dist/js/",
		css: "dist/css/",
		fonts: "dist/fonts/",
		tpls: "dist/tpls/"
	},
	src: {
		html: "src/index.html",
		tpls: 'src/tpls/**/*.html',
		js: [
			"src/js/app.js"
		],
		css: [
			"src/css/app.css"
		],
		lib: [
			"node_modules/angular/angular.min.js",
			"node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js",
			"node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
			"node_modules/angular-i18n/angular-locale_ru-ua.js",
			"node_modules/ngstorage/ngStorage.min.js"
		],
		fonts: "node_modules/bootstrap/dist/fonts/*"
	},
	watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
		html: 'src/index.html',
		tpls: 'src/tpls/**/*.html',
		js: 'src/**/*.js',
		css: 'src/css/**/*.css'
    },
    clean: 'dist'
}

gulp.task('lib', function () {
	//Compile libs to one file
	return gulp.src(path.src.lib)
		.pipe(concat('lib.js'))
		.pipe(gulp.dest(path.build.js))
		.pipe(connect.reload());
});

gulp.task('js', function () {
	return gulp.src(path.src.js)
		.pipe(concat('app.js'))
		.pipe(gulp.dest(path.build.js))
		.pipe(connect.reload());
});

gulp.task('css', function () {
    return gulp.src(path.src.css, {base: path.build.css})
		.pipe(less())
		.pipe(concat('app.css'))
        .pipe(gulp.dest(path.build.css))
        .pipe(connect.reload()); //server reload
});

gulp.task('html', function () {
    return gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.base))
        .pipe(connect.reload()); //server reload
});

gulp.task('tpls', function () {
    return gulp.src(path.src.tpls)
        .pipe(gulp.dest(path.build.tpls))
        .pipe(connect.reload()); //server reload
});

gulp.task('fonts', function () {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(connect.reload()); //server reload
});

gulp.task('watch', function(){
	gulp.watch(path.watch.html, gulp.parallel('html'));
	gulp.watch(path.watch.tpls, gulp.parallel('tpls'));
	gulp.watch(path.watch.js, gulp.parallel('js'));
	gulp.watch(path.watch.css, gulp.parallel('css'));
});

gulp.task('clean', function (cb) {
    return rimraf(path.clean, cb);
});

gulp.task('connect', function () {
    return connect.server({
		root: path.build.base,
		livereload: true,
        host: "0.0.0.0",
		port: 3000,
        fallback: path.build.base+'index.html'
	});
});

gulp.task('build', gulp.series(['lib', 'js', 'css', 'html', 'fonts', 'tpls' ]));

gulp.task('default', gulp.parallel(['build', 'connect', 'watch']));