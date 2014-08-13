module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: grunt.file.readJSON('config.json'),

    clean: {
      fonts: [
        "<%= config.paths.dist.fonts.eot %>",
        "<%= config.paths.dist.fonts.otf %>",
        "<%= config.paths.dist.fonts.woff %>",
      ],
      css: [
        '<%= config.paths.dist.css.dir %>*.css'
      ],
      zapf: [
        "<%= config.paths.src.zapf %>"
      ]
    },



    command : {
        eot: {
            cmd  : '<%= config.commands.eot %> < <%= config.paths.src.otf %> > <%= config.paths.dist.fonts.eot %>'
        },
        woff: {
            cmd  : '<%= config.commands.woff %> <%= config.paths.src.otf %> && mv <%= config.paths.src.woff %> <%= config.paths.dist.fonts.woff %>'
        },
        otf: {
          cmd  : 'cp <%= config.paths.src.otf %> <%= config.paths.dist.fonts.otf %>'
        },
        zapf: {
          cmd: ' <%= config.commands.zapf %> <%= config.paths.src.zapf %> <%= config.paths.src.ttf %><%= config.paths.src.font %>'
        }
    },

    sass: {
        dist: {
          options: {
            style: 'expanded'
          },
          files: {
            '<%= config.paths.dist.css.dir %><%= config.paths.dist.css.file %>': '<%= config.paths.src.sass %>'
          }
        }
    },

    cssmin: {
        dist: {
            options: {
                report: 'gzip',
                keepSpecialComments: 0
            },
            files: {
                '<%= config.paths.dist.css.dir %><%= config.paths.dist.css.min %>': ['<%= config.paths.dist.css.dir %><%= config.paths.dist.css.file %>']
            }
        }
    },

    //
    font_sampler: {
      main: {
        options: {
          fontname: 'Symbol Font',
          charmap: '<%= config.paths.src.zapf %>',
          dest: 'index.html',
          sass: 'src/sass/_glyphs.scss',
          sizes: [18],
          stylesheets: ["http://cdn.ink.sapo.pt/3.0.2/css/ink.min.css","dist/css/symbol-font.css"],
          col_width: 100,
          sample_template: '{% glyph %}\n',
          glyph_template: '<div class="xlarge-10 large-15 medium-20 small-20 tiny-25"><button class="ink-button all-100 black p{% size %}"><span class="sf {% glyph %}"></span></button></div>\n'
        }
      }
    },

    watch: {
      options: {
        spawn: false
      },
      fonts: {
        files: ['<%= config.paths.src.otf %>'],
        tasks: ['webfonts'],
      },
      css: {
        files: ['<%= config.paths.src.sass %>**/*.scss'],
        tasks: ['css'],
      }
    }

  });

  // load tasks
  grunt.loadNpmTasks('grunt-font-sampler');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-commands');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // register tasks
  grunt.registerTask('default', ['zapf','webfonts','css','font_sampler']);
  grunt.registerTask('zapf', ['clean:zapf','command:zapf']);
  grunt.registerTask('webfonts', ['clean:fonts','command:otf','command:eot','command:woff']);
  grunt.registerTask('css', ['clean:css','sass','cssmin']);
  grunt.registerTask('dev', ['watch']);


};
