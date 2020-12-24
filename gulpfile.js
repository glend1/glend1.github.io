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
const jsmin = require('gulp-jsmin');

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
    watch('private/index.html').on('change', series(html, reload));
    watch('private/media/**').on('change', series(media, reload));
    watch('private/script/**').on('change', series(javascript, reload));
    watch('private/style/**').on('change', series(css, reload));
    cb();
};

//TODO add sourcemaps?
exports.clean = clean;
exports.html = html;
exports.media = media;
exports.javascript = javascript;
exports.css = css;
exports.server = server;
exports.watcher = watcher;
exports.build = series(clean, parallel(html, media, javascript, css));
exports.auto = series(exports.build, watcher);
exports.autoload = series(exports.auto, server);
exports.default = exports.autoload;