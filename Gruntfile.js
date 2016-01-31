module.exports = function(grunt) {
    require('google-closure-compiler').grunt(grunt);

    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),
        'browserify': {
            options: {
                extensions: ['.js'],
            },
            dist: {
                options: {
                    debug: false,
                },
                src: ['build/**/*.min.js'],
                dest: 'dist/main.js',
            },
            dev: {
                options: {
                    browserifyOptions:{
                        debug: true, /* for source maps */
                    },
                    debug: true,
                    keepAlive: 'true',
                    watch: 'true',
                },
                src: ['./src/**/*.js'],
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
        'compass': {
            options: {
                sassDir: 'sass',
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
                    watch: true,
                    cssDir: 'dev/css',
                },
            },
        },
        'concurrent': {
            options: {
                logConcurrentOutput: true,
            },
            dev: {
                tasks: ['browserify:dev', 'compass:dev'],
            },
        },
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-concurrent');

    // Default task(s).
    grunt.registerTask('default', ['concurrent:dev']);
    grunt.registerTask('dist', ['closure-compiler:dist', 'browserify:dist', 'compass:dist']);

};
