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
    });

    grunt.loadNpmTasks('grunt-browserify');

    // Default task(s).
    grunt.registerTask('default', ['browserify:dev']);
    grunt.registerTask('dist', ['closure-compiler:dist','browserify:dist']);

};
