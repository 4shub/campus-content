// grab our gulp packages
const gulp  = require('gulp'),
      gutil = require('gulp-util'),
      concat = require('gulp-concat'),
      babel = require('gulp-babel'),
      sass = require('gulp-sass');


const merge = require('streamqueue');

const css_packages = [
  'node_modules/normalize.css/normalize.css'
]

const js_packages = [
  'node_modules/jquery/dist/jquery.min.js',
  'node_modules/jquery.scrollto/jquery.scrollTo.min.js',
]


function onError(err) {
  console.log(err);
  this.emit('end');
}

gulp.task('js', () =>
    merge({ objectMode: true },
      gulp.src(js_packages)
        .pipe(concat('import.js')),
      gulp.src('serve/js/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('zzz_.js'))
      ).pipe(concat('app.js'))
        .pipe(gulp.dest('src/static/js'))
);

gulp.task('scss', () =>
      merge({ objectMode: true },
              gulp.src(css_packages)
                .pipe(concat('import.css')),
              gulp.src('serve/css/**/*.scss')
                .pipe(concat('app.scss'))
                .pipe(sass().on('error', onError))
            ).pipe(concat('app.css'))
             .pipe(gulp.dest('src/static/css'))
             .on('error', onError)
);

gulp.task('img', () =>
      gulp.src('serve/img/**/*.png')
       .pipe(gulp.dest('src/static/img'))
);


gulp.task('scss:watch', function () {
  gulp.watch('serve/css/**/*.scss', ['scss']);
});

gulp.task('js:watch', function () {
  gulp.watch('serve/js/**/*.js', ['js']);
});


gulp.task('img:watch', function () {
  gulp.watch('serve/js/**/*.png', ['img']);
});

const development_tasks = [ 'js', 'scss', 'img', 'scss:watch', 'js:watch', 'img:watch']


// default
gulp.task('default', development_tasks, function() {
  return gutil.log('Gulp is running!')
});

// production task
gulp.task('production', [ 'js', 'scss', 'img' ], function() {
  return gutil.log('Compiled everything!')
});
