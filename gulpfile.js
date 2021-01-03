//TODO fix these warnings
const del = require('del');
const {src, dest, series, parallel, watch} = require('gulp');
const browserSync = require('browser-sync').create();
const htmllint = require('gulp-htmllint');
const fancyLog = require('fancy-log');
const colors = require('ansi-colors');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const cssmin = require('gulp-cssmin');
//TODO have an option to make this silent
const jsmin = require('gulp-jsmin');
const eslint = require('gulp-eslint');
const sass = require('gulp-sass');

const publicFolder = 'public';
const privateFolder = 'private';
const any = "/**";
const index = "/index.html";
const mediaFolder = "media";
const scriptFolder = "script";
const styleFolder = "style";

function clean(cb) {
    del(`public${any}`, {force:true});
    cb();
}

function html() {
    return src(`${privateFolder}${index}`)
        .pipe(htmllint({"rules": {
            "line-end-style": false,
            "id-class-style": "dash"
        }}, htmllintReporter))
        .pipe(htmlmin({ 
            "collapseWhitespace": true 
        }))
        .pipe(dest(publicFolder));
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
    return src(`${privateFolder}/${mediaFolder}${any}`)
        .pipe(imagemin({
            "silent": true
        }))
        .pipe(dest(`${publicFolder}/${mediaFolder}`));
}

function jslint() {
    return src(`${privateFolder}/${scriptFolder}${any}`)
        //TODO gul-ellint needs updating to support the newer version of eslint
        .pipe(eslint({fix:true}))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(dest(`${privateFolder}/${scriptFolder}`));
}

function javascript() {
    return src(`${privateFolder}/${scriptFolder}${any}`)
        .pipe(jsmin())
        .pipe(dest(`${publicFolder}/${scriptFolder}`));
}

function css() {
    return src(`${privateFolder}/${styleFolder}${any}`)
        .pipe(sass().on('error', sass.logError))
        .pipe(cssmin())
        .pipe(dest(`${publicFolder}/${styleFolder}`));
}

function server(cb)	{
    browserSync.init({
        server: {
            baseDir: `${publicFolder}/`,
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
    watch(`${privateFolder}${index}`).on('change', series(exports.html, reload));
    watch(`${privateFolder}/${mediaFolder}${any}`).on('change', series(exports.media, reload));
    watch(`${privateFolder}/${scriptFolder}${any}`).on('change', series(exports.javascript, reload));
    watch(`${privateFolder}/${styleFolder}${any}`).on('change', series(exports.css, reload));
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