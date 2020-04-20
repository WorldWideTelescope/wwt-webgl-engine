module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        banner: '/* AAS WorldWide Telescope WebGL engine */\n'
      },

      sdk: {
        src: [
          'scriptsharp-0.8.0/ss.js',
          'wwtlib/bin/wwtlib.js'
        ],
        dest: 'wwtsdk.js',
        nonull: true
      },
    }
  });

  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

  grunt.registerTask('dist-js', ['concat:sdk']);
};
