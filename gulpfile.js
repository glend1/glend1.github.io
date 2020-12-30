const del = require('del');
const {src, dest, series, parallel, watch} = require('gulp');
const browserSync = require('browser-sync').create();
const htmllint = require('gulp-htmllint');
const fancyLog = require('fancy-log');
const colors = require('ansi-colors');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
//TODO fix these warnings
const cssmin = require('gulp-cssmin');
//TODO have an option to make this silent
const jsmin = require('gulp-jsmin');
const eslint = require('gulp-eslint');

function clean(cb) {
    del('public/**', {force:true});
    cb();
}

function html() {
    return src('private/index.html')
        .pipe(htmllint({"rules": {
            "line-end-style": false,
            "id-class-style": "dash"
        }}, htmllintReporter))
        .pipe(htmlmin({ 
            "collapseWhitespace": true 
        }))
        .pipe(dest('public'));
}

function htmllintReporter(filepath, issues) {
	if (issues.length > 0) {
		issues.forEach(function (issue) {
			fancyLog(colors.cyan('[gulp-htmllint] ') + colors.white(filepath + ' [' + issue.line + ',' + issue.column + ']: ') + colors.red('(' + issue.code + ') ' + issue.msg));
		});
		process.exitCode = 1;
	}
};

function media() {
    return src('private/media/**')
        .pipe(imagemin({
            "silent": true
        }))
        .pipe(dest('public/media'));
}

function jslint() {
    return src('private/script/**')
        //TODO gul-ellint needs updating to support the newer version of eslint
        .pipe(eslint({fix:true}))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(dest('private/script'));
}

function javascript() {
    return src('private/script/**')
        .pipe(jsmin())
        .pipe(dest('public/script'));
}

function css() {
    return src('private/style/**')
        .pipe(cssmin())
        .pipe(dest('public/style'));
}

function server(cb)	{
    browserSync.init({
        server: {
            baseDir: 'public/',
            notify: false,
			open: false
        }
    }); 
    cb();
};

function reload(cb) {
    if (browserSync.active) {
        browserSync.reload()
    };
    cb()
};

function watcher(cb) {
    watch('private/index.html').on('change', series(exports.html, reload));
    watch('private/media/**').on('change', series(exports.media, reload));
    watch('private/script/**').on('change', series(exports.javascript, reload));
    watch('private/style/**').on('change', series(exports.css, reload));
    cb();
};

//TODO add sourcemaps?
exports.clean = clean;
exports.html = html;
exports.media = media;
exports.javascript = series(jslint, javascript);
exports.css = css;
exports.server = server;
exports.watcher = watcher;
exports.build = series(exports.clean, parallel(exports.html, exports.media, exports.javascript, exports.css));
exports.auto = series(exports.build, exports.watcher);
exports.autoload = series(exports.auto, server);
exports.default = exports.autoload;