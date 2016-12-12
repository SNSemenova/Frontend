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
    js: 'src/scripts/*.js',
    partials: 'src/templates/partials/*.html',
    mock: 'src/mockapi/*.json',
    dist: {
      css:  'dist/styles/',
      images: 'dist/images',
      html: 'dist/',
      vendor: 'dist/vendor/',      
      js: 'dist/scripts/',
      partials: 'dist/partials/',
      mock: 'dist/mockapi/'
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

gulp.task('mock', function () {
  return gulp.src(path.mock)
    .pipe(gulp.dest(path.dist.mock));
});

gulp.task('partials', function () {
  return gulp.src(path.partials)
    .pipe(gulp.dest(path.dist.partials));
});

gulp.task('js', function () {
  return gulp.src(path.js)
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(path.dist.js));
});

gulp.task('build', ['html', 'css', 'images', 'vendor', 'partials', 'mock', 'js']);

gulp.task('watch', function () {
  gulp.watch(path.css, ['css']);
  gulp.watch(path.html, ['html']);
  gulp.watch(path.images, ['images']);
  gulp.watch(path.vendor.css, ['vendor']);    
  gulp.watch(path.mock, ['mock']);    
  gulp.watch(path.js, ['js']);
  gulp.watch(path.partials, ['partials']);
});

gulp.task('serve', ['watch'], function() {
  browserSync.init({
    server: {
      baseDir: path.dist.html
    }
  });
  gulp.watch('dist/**').on('change', browserSync.reload);
});
