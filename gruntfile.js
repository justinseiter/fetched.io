var path = require('path');

module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      js: {
        src: [
          'public/javascripts/vendor/jquery.min.js',
          'public/javascripts/vendor/masonry.pkgd.min.js',
          'public/javascripts/vendor/jquery.tooltipster.min.js',
          'public/javascripts/vendor/pace.min.js',
          'public/javascripts/vendor/fonticons.js',
          'public/javascripts/vendor/jquery.zoom.min.js' ,
          'public/javascripts/fetched.js',
        ],
        dest: 'public/dist/app.js'
      }
    },
    uglify: {
      dist: {
        src: 'public/dist/app.js',
        dest: 'public/dist/app.min.js'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['concat', 'uglify'])
}
