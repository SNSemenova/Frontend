var gulp = require('gulp');
var nunjucks = require('gulp-nunjucks');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var reload = browserSync.reload;
var cssmin = require('gulp-cssmin');
const autoprefixer = require('gulp-autoprefixer');

var path = {
    css:  'src/styles/*.css',
    html: 'src/templates/*.html',
    vendor: {
        css:  'src/vendor/styles/*.css'
    },
    images: 'src/images/*.*',
    dist: {
      css:  'dist/styles/',
      images: 'dist/images',
      html: 'dist/',
      vendor: 'dist/vendor/'
    }
};

gulp.task('default', ['build', 'serve', 'watch']);

gulp.task('css', function () {
  return gulp.src(path.css)
    .pipe(autoprefixer({
      browsers: ['last 4 versions']
    }))
    .pipe(cssmin())
    .pipe(concat('style.css'))  
    .pipe(gulp.dest(path.dist.css));
});

gulp.task('vendor', function () {
  return gulp.src(path.vendor.css)
    .pipe(autoprefixer({
      browsers: ['last 4 versions']
    }))
    .pipe(cssmin())
    .pipe(concat('style.css'))  
    .pipe(gulp.dest(path.dist.vendor));
})

gulp.task('html', function () {
  return gulp.src(path.html)
    .pipe(nunjucks.compile())
    .pipe(gulp.dest(path.dist.html));
});

gulp.task('images', function () {
    gulp.src(path.images) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.images)) //И бросим в build
        .pipe(reload({stream: true}));
});

gulp.task('build', ['html', 'css', 'images', 'vendor']);

gulp.task('watch', function () {
  gulp.watch(path.css, ['css']);
  gulp.watch(path.html, ['html']);
  gulp.watch(path.images, ['images']);
  gulp.watch(path.images, ['vendor']);
});

gulp.task('serve', ['watch'], function() {
  browserSync.init({
    server: {
      baseDir: path.dist.html
    }
  });
  gulp.watch('dist/**').on('change', browserSync.reload);
});
