var gulp = require('gulp'),
	gutil = require('gulp-util'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	concat = require('gulp-concat'),
	connect = require('gulp-connect'),
	uglify = require('gulp-uglify');

var env, 
	jsSources,
	sassSources,
	htmlSources,
	outputDir;

env = process.env.NODE_ENV || 'development';

if (env==='development') {
	outputDir = 'builds/development/'
} else {
	outputDir = 'builds/production/';
}


jsSources = ['components/scripts/script.js'];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];

gulp.task('js', function() {
	gulp.src(jsSources)
	.pipe(concat('script.js'))
	.pipe(browserify())
	.pipe(gulp.dest(outputDir + 'js'))
	.pipe(connect.reload())
});

gulp.task('compass', function() {
	gulp.src(sassSources)
	.pipe(compass({
		sass: 'components/sass',
		image: outputDir + 'images',
		style: 'expanded'
	}))
	.on('error', gutil.log)
	.pipe(gulp.dest(outputDir + 'css'))
	.pipe(connect.reload())
});

gulp.task('watch', function() {
	gulp.watch(jsSources, ['js']);
	gulp.watch(outputDir + '*.scss', ['compass']);
	gulp.watch(htmlSources, ['html']);
});

gulp.task('connect', function() {
	connect.server({
		root: outputDir,
		livereload: true
	});
});

gulp.task('html', function() {
	gulp.src(htmlSources)
	.pipe(connect.reload())
});

gulp.task('default', ['html', 'js', 'compass', 'connect', 'watch']);