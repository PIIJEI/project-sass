var gulp = require('gulp'),
	gutil = require('gulp-util'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyHTML = require('gulp-minify-html'),
	concat = require('gulp-concat');

var env, 
	jsSources,
	sassSources,
	htmlSources,
	outputDir,
	sassStyle;

env = 'production';

if (env==='development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
} 

jsSources = ['components/scripts/script.js'];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];

gulp.task('js', function() {
	gulp.src(jsSources)
	.pipe(concat('script.js'))
	.pipe(gulpif(env === 'production', uglify()))
	.pipe(gulp.dest(outputDir + 'js'))
	.pipe(connect.reload())
});

gulp.task('compass', function() {
	gulp.src(sassSources)
	.pipe(compass({
		sass: 'components/sass',
		css: outputDir + 'css',
		image: outputDir + 'images',
		style: sassStyle
	}))
	.on('error', gutil.log)
	.pipe(connect.reload())
});

gulp.task('watch', function() {
	gulp.watch(jsSources, ['js']);
	gulp.watch(['components/sass/*.scss', 'components/sass/*/*.scss'], ['compass']);
	gulp.watch('builds/development/*.html', ['html']);
});

gulp.task('connect', function() {
	connect.server({
		root: outputDir,
		livereload: true
	});
});

gulp.task('html', function() {
	gulp.src('builds/development/*.html')
	.pipe(gulpif(env === 'production', minifyHTML()))
	.pipe(gulpif(env === 'production', gulp.dest(outputDir)))
	.pipe(connect.reload())
});

gulp.task('default', ['watch', 'html', 'js', 'compass', 'connect']);