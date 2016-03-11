module.exports = function(grunt) {
    require('google-closure-compiler').grunt(grunt);

    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),
        'browserify': {
            options: {
                extensions: ['.js'],
                alias: { jquery : 'jquery-browserify' },
            },
            dist: {
                options: {
                    debug: false,
                },
                src: ['src/index.js'],
                dest: 'dist/main.js',
            },
            dev: {
                options: {
                    browserifyOptions:{
                        debug: true, /* for source maps */
                    },
                    debug: true,
                },
                src: ['./src/index.js'],
                dest: 'dev/main.js',
            },
        },
        'closure-compiler': {
            dist: {
                files: {
                   'dist/main.min.js' : ['dist/main.js'],
                },
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    create_source_map: 'dist/main.min.js.map',
                    output_wrapper: '(function(){\n%output%\n}).call(this)\n//# sourceMappingURL=main.min.js.map',
                },
            }
        },
        'jshint': {
            options: {
                jshintrc: '.jshintrc',
                ignores: ['src/third_party/**/*.js'],
            },
            js: ['src/**/*.js'],
        },
        'compass': {
            options: {
                sassDir: 'sass',
                fontsDir: 'assets/font'
            },
            dist: {
                options: {
                    environment: 'production',
                    outputStyle: 'compress',
                    cssDir: 'dist/css',
                },
            },
            dev: {
                options: {
                    cssDir: 'dev/css',
                },
            },
        },
        'watch': {
            options: {
                spawn: true,
                atBegin: true,
            },
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['jshint:js', 'browserify:dev'],
            },
            css: {
                files: ['sass/**/*.scss'],
                tasks: ['compass:dev'],
            },
            html: {
                files: ['src/**/*.js', 'sass/**/*.scss'],
                tasks: ['cachebreaker:html'],
            },
        },
        'concurrent': {
            options: {
                logConcurrentOutput: true,
            },
            dev: {
                tasks: ['watch:scripts', 'watch:css', 'watch:html'],
            },
        },
        'cachebreaker': {
            html: {
                options: {
                    match: ['main.js', 'css/ui.css', 'css/load.css'],
                    replacement: 'time',
                    position: 'append',
                },
                files: {
                    src: ['html/index.html']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-cache-breaker');

    grunt.registerTask('default', ['concurrent:dev']);
    grunt.registerTask('dist', ['jshint:js', 'browserify:dist', 'closure-compiler:dist', 'compass:dist']);

};
