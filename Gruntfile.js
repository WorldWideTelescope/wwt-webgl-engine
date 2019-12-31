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
        src: ['sdk/wwtlib.js'],
        dest: 'sdk/wwtlib.js',
        replacements: [
          {
            from: "define('wwtlib', ['ss'], function(ss) {",
            to: 'window.wwtlib = function(){'
          }, {
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
          'sdk/ss.js',
          'sdk/wwtlib.js'
        ],
        dest: 'sdk/wwtsdk.js'
      },
    },

    uglify: {
      sdk: {
        src: '<%= concat.sdk.dest %>',
        dest: 'sdk/wwtsdk.min.js'
      },
    }
  });

  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

  grunt.registerTask('dist-js', ['replace:wwtlib', 'concat:sdk', 'uglify:sdk']);
};
