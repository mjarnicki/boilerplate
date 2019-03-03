var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var gulpIf = require('gulp-if');
var imagemin = require('gulp-imagemin');
var babel = require('gulp-babel');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence')


gulp.task('sass', function(){
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
})

gulp.task('babel', function(){
    return gulp.src('app/js/**/*.*')
        .pipe(babel({
            presets: ['babel-preset-env', 'babel-preset-react']
        }))
        .pipe(gulp.dest('app/jsnew'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('browserSync', function(){
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
})

gulp.task('useref', function(){
    return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/images'))
})

gulp.task('fonts', function(){
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean:dist', function(){
    return del.sync('dist');
})

gulp.task('watch', ['browserSync', 'sass'], function(){
    gulp.watch('app/scss/**/*.scss', ['sass']); 
    gulp.watch('app/js/**/*.*', ['babel']); 
    gulp.watch('app/*.html', browserSync.reload); 
  })

gulp.task('build', function (callback) {
    runSequence('clean:dist', ['sass', 'babel','useref', 'images', 'fonts'], callback)
})

gulp.task('default', function(callback){
    runSequence(['browserSync', 'babel','sass', 'watch'], callback)
})