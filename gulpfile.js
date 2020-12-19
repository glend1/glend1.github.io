const del = require('del');
const {src, dest, series, parallel, watch} = require('gulp');
const browserSync = require('browser-sync').create();


function clean(cb) {
    del('public/**', {force:true});
    cb();
}

function html(cb) {
    src('private/index.html').pipe(dest('public'));
    cb();
}

function media(cb) {
    src('private/media/**').pipe(dest('public/media'));
    cb();
}

function javascript(cb) {
    src('private/script/**').pipe(dest('public/script'));
    cb();
}

function css(cb) {
    src('private/style/**').pipe(dest('public/style'));
    cb();
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
}

function watcher(cb) {
    watch('private/index.html').on('change', series(html, reload));
    watch('private/media/**').on('change', series(media, reload));
    watch('private/script/**').on('change', series(javascript, reload));
    watch('private/style/**').on('change', series(css, reload));
    cb();
};

exports.clean = clean;
exports.html = html;
exports.media = media;
exports.javascript = javascript;
exports.css = css;
exports.server = server;
exports.watcher = watcher;
exports.build = series(clean, parallel(html, media, javascript, css));
exports.auto = series(exports.build, watcher);
exports.autoload = series(server, exports.auto);
exports.default = exports.auto;