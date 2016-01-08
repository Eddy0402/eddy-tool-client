module.exports = function(grunt) {
    require('google-closure-compiler').grunt(grunt);
    // Project configuration.
    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),
        'browserify': {
            options: {
                debug: true,
                extensions: ['.js'],
            },
            dev: {
                src: ['src/**/*.js'],
                dest: 'dev/main.js',
            },
            dist: {
                options: {
                    debug: false,
                },
                src: ['build/**/*.min.js'],
                dest: 'dist/main.js',
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
    //grunt.loadNpmTasks('grunt-closure-compiler');

    // Default task(s).
    grunt.registerTask('default', ['browserify:dev']);
    grunt.registerTask('dist', ['browserify:dist','closure-compiler:dist']);

};
