var path = require('path')
    , exec = require('child_process').exec
;

module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'index.js', 'spec/*.js']
            , options: {
                'laxcomma': true
                , 'multistr': true
            }
        }
        , env: {
            options : {
            }
            , test: {
            }
            , coverage: {
                COVERAGE: true
            }
        }
        , jasmine_node: {
            options: {
                specDir: 'spec'
                , junitDir: './build/'
            }
        }
        , jasmine_node_coverage: {
            options: {
                coverDir: 'coverage'
                , specDir: 'spec'
                , junitDir: './build/'
            }
        }
        , plato: {
            dashr: {
              options : {
                jshint : false
              }
              , files: {
                'plato': ['index.js', 'spec/*.js'],
              }
            }
            , options: {
                jshint: {
                    'laxcomma': true
                    , 'multistr': true
                }
            }
          },
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-plato');

    // Default task(s).
    grunt.registerTask('default', ['jshint']);

    grunt.registerTask('test', [
        'jshint', 
        'jasmine_node_coverage',
        'plato'
    ]); 

     grunt.registerTask('jasmine_node', 'jasmine_node', function() {
       var done = this.async()
            , options = this.options()
        ;

            var jcmd = 'jasmine-node '
                .concat(options.specDir)
                .concat(' --forceexit --junitreport --output ')
                .concat(options.junitDir)
            ;

        exec(jcmd, { }, 
            function(err, stdout, stderr) {
                grunt.log.write(stdout);
                grunt.log.write(stderr);
                done();
            });
     });

     grunt.registerTask('jasmine_node_coverage', 'Istanbul code coverage for jasmine_node', function() {
        var done = this.async()
            , options = this.options()
        ;

        var coverCmd = 'node_modules/istanbul/lib/cli.js cover '
            .concat('--dir ')
            .concat(options.coverDir)
            .concat(' -x ' + "'**/spec/**'" + ' jasmine-node')
            .concat(' -- ' )
            .concat(options.specDir)
            .concat(' --forceexit --junitreport --output ')
            .concat(options.junitDir);

        exec(coverCmd, { }, function(err, stdout, stderr) {
                grunt.log.write(stdout);
                grunt.log.write(stderr);
                if (err) { return done(false); }
                grunt.log.write('Server-side coverage available at: ' +
                        path.join(options.coverDir, 'lcov-report', 'index.html'));
                done();
        });
    });
};
