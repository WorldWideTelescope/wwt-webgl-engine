module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  RegExp.quote = function (string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //remove the AMD dependency from the ScriptSharp output.
    replace: {
      wwtlib: {
        src: ['wwtlib/bin/wwtlib.js'],
        dest: 'wwtlib-replaced.js',
        replacements: [
          {
            from: "define('wwtlib', ['ss'], function(ss) {",
            to: 'window.wwtlib = function(){'
          },
          {
            from: 'return $exports;\n});',
            to: 'return $exports;\n}();'
          }
        ]
      }
    },

    concat: {
      options: {
        banner: '/* AAS WorldWide Telescope WebGL engine */\n'
      },

      sdk: {
        src: [
          'scriptsharp-0.8.0/ss.js',
          '<%= replace.wwtlib.dest %>'
        ],
        dest: 'wwtsdk.js'
      },
    },

    uglify: {
      sdk: {
        src: '<%= concat.sdk.dest %>',
        dest: 'wwtsdk.min.js'
      },
    }
  });

  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

  grunt.registerTask('dist-js', ['replace:wwtlib', 'concat:sdk', 'uglify:sdk']);
};
