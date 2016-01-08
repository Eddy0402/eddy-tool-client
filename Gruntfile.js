module.exports = function(grunt) {

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
                transform: ['uglify'],
            },
            src: '<%= browserify.dev.src %>',
            dest: 'dist/main.js',
        },
    },
    'uglify': {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');

  // Default task(s).
  grunt.registerTask('default', ['browserify:dev']);
  grunt.registerTask('dist', ['browserify:dist']);

};
