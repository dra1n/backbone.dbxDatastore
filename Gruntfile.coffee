# Generated on 2013-08-21 using generator-bower 0.0.1
'use strict'

mountFolder = (connect, dir) ->
  connect.static require('path').resolve(dir)

module.exports = (grunt) ->
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  yeomanConfig =
    src: 'src'
    dist : 'dist'

  grunt.initConfig
    yeoman: yeomanConfig

    coffee:
      dist:
        files: [
          expand: true
          cwd: '<%= yeoman.src %>'
          src: '{,*/}*.coffee'
          dest: '<%= yeoman.dist %>'
          rename: (dest, src) -> "#{dest}/#{src.replace(/\.coffee$/, '.js')}"
        ]

    uglify:
      build:
        src: '<%=yeoman.dist %>/backbone.dbxDatastore.js'
        dest: '<%=yeoman.dist %>/backbone.dbxDatastore.min.js'

    mochaTest:
      test:
        options:
          reporter: 'spec'
          compilers: 'coffee:coffee-script'
        src: ['test/**/*.coffee']

    grunt.registerTask 'default', [
      'mochaTest'
      'coffee'
      'uglify'
    ]
