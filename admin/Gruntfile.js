// Generated on 2016-07-25 using
// generator-ractive 0.2.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function ( grunt ) {

    // Time how long tasks take. Can help when optimizing build times
    require( 'time-grunt' )( grunt );

    // Load grunt tasks automatically
    require( 'load-grunt-tasks' )( grunt );

    // Configurable paths
    var config = {
        app: 'app',
        dist: 'dist',
        authN: {
            host: 'ftp.nickthesick.com',
            authKey: 'main'
        },
        auth: {
            host: 'gator4194.hostgator.com',
            authKey: 'joes'
        }
    };

    // Define the configuration for all the tasks
    grunt.initConfig( {

        // Project settings
        config: config,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: [ 'bower.json' ],
                tasks: [ 'wiredep' ]
            },
            jstest: {
                files: [ 'test/{,*/}*.js' ],
                tasks: [ 'test:watch' ]
            },
            gruntfile: {
                files: [ 'Gruntfile.js' ]
            },
            sass: {
                files: [ '<%= config.app %>/styles/{,*/}*.{scss,sass}' ],
                tasks: [ 'sass:server', 'autoprefixer' ]
            },
            styles: {
                files: [ '<%= config.app %>/styles/{,*/}*.css' ],
                tasks: [ 'newer:copy:styles', 'autoprefixer' ]
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '.tmp/scripts/{,*/}*.js',
                    '<%= config.app %>/images/{,*/}*'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                open: true,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function ( connect ) {
                        return [
                            connect.static( '.tmp' ),
                            connect().use( '/bower_components', connect.static( './bower_components' ) ),
                            connect.static( config.app )
                        ];
                    }
                }
            },
            test: {
                options: {
                    open: false,
                    port: 9001,
                    middleware: function ( connect ) {
                        return [
                            connect.static( '.tmp' ),
                            connect.static( 'test' ),
                            connect().use( '/bower_components', connect.static( './bower_components' ) ),
                            connect.static( config.app )
                        ];
                    }
                }
            },
            dist: {
                options: {
                    base: '<%= config.dist %>',
                    livereload: false
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [ {
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                } ]
            },
            server: '.tmp'
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require( 'jshint-stylish' )
            },
            all: [
                'Gruntfile.js',
                '<%= config.app %>/scripts/{,*/}*.js',
                'test/{,*/}*.js'
            ]
        },

        // Mocha testing framework configuration options
        mocha: {
            test: {
                options: {
                    run: true,
                    urls: [ 'http://<%= connect.options.hostname %>:<%= connect.test.options.port %>/spec_runner.html' ]
                }
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        sass: {
            options: {
                sourcemap: true,
                loadPath: 'bower_components'
            },
            dist: {
                files: [ {
                    expand: true,
                    cwd: '<%= config.app %>/styles',
                    src: [ '*.{scss,sass}' ],
                    dest: '.tmp/styles',
                    ext: '.css'
                } ]
            },
            server: {
                files: [ {
                    expand: true,
                    cwd: '<%= config.app %>/styles',
                    src: [ '*.{scss,sass}' ],
                    dest: '.tmp/styles',
                    ext: '.css'
                } ]
            }
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: [ '> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1' ]
            },
            dist: {
                files: [ {
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                } ]
            }
        },

        // Automatically inject Bower components into the HTML file
        wiredep: {
            app: {
                ignorePath: /^\/|\.\.\//,
                src: [ '<%= config.app %>/index.html' ]
            },
            sass: {
                src: [ '<%= config.app %>/styles/{,*/}*.{scss,sass}' ],
                ignorePath: /(\.\.\/){1,2}bower_components\//
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= config.dist %>/scripts/{,*/}*.js',
                        '<%= config.dist %>/styles/{,*/}*.css',
                        '<%= config.dist %>/images/{,*/}*.*',
                        '<%= config.dist %>/styles/fonts/{,*/}*.*',
                        '<%= config.dist %>/*.{ico,png}'
                    ]
                }
            }
        },

        // Build the application using Browserify
        browserify: {
            options: {
                transform: [ 'ractify', [ 'debowerify', {
                    preferNPM: true
                } ], 'babelify' ],
                watch: true,
                browserifyOptions: {
                    debug: true
                }
            },
            dist: {
                files: {
                    '.tmp/scripts/app.js': '<%= config.app %>/scripts/app.js'
                }
            },
            test: {
                files: {
                    '.tmp/scripts/tests.js': 'test/{,*/}*.js'
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            options: {
                dest: '<%= config.dist %>'
            },
            html: '<%= config.app %>/index.html'
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            options: {
                assetsDirs: [ '<%= config.dist %>', '<%= config.dist %>/images' ]
            },
            html: [ '<%= config.dist %>/{,*/}*.html' ],
            css: [ '<%= config.dist %>/styles/{,*/}*.css' ]
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [ {
                    expand: true,
                    cwd: '<%= config.app %>/images',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.dist %>/images'
                } ]
            }
        },

        svgmin: {
            dist: {
                files: [ {
                    expand: true,
                    cwd: '<%= config.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= config.dist %>/images'
                } ]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [ {
                    expand: true,
                    cwd: '<%= config.dist %>',
                    src: '{,*/}*.html',
                    dest: '<%= config.dist %>'
                } ]
            }
        },

        // By default, your `index.html`'s <!-- Usemin block --> will take care
        // of minification. These next options are pre-configured if you do not
        // wish to use the Usemin blocks.
        // cssmin: {
        //   dist: {
        //     files: {
        //       '<%= config.dist %>/styles/main.css': [
        //         '.tmp/styles/{,*/}*.css',
        //         '<%= config.app %>/styles/{,*/}*.css'
        //       ]
        //     }
        //   }
        // },
        // uglify: {
        //   dist: {
        //     files: {
        //       '<%= config.dist %>/scripts/scripts.js': [
        //         '<%= config.dist %>/scripts/scripts.js'
        //       ]
        //     }
        //   }
        // },
        // concat: {
        //   dist: {}
        // },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [ {
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/{,*/}*.webp',
                        '{,*/}*.html',
                        'styles/fonts/{,*/}*.*'
                    ]
                } ]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },

        // Run some tasks in parallel to speed up build process
        concurrent: {
            server: [
                'sass:server',
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'sass',
                'copy:styles',
                'imagemin',
                'svgmin'
            ]
        },
        'ftp-deploy': {
            build: {
                auth: config.auth,
                src: 'dist/',
                dest: '/public_html/admin/',
                exclusions: [ '*.md', 'dist/**/Thumbs.db' ]
            },
            api: {
                auth: config.auth,
                src: '../api/v1/',
                dest: '/public_html/api/v1/',
                exclusions: [ '*.md' ]
            },
            includes: {
                auth: config.auth,
                src: '../includes/',
                dest: '/public_html/includes/',
                exclusions: [ '*.md', 'database.php' ]
            },
            buildN: {
                auth: config.authN,
                src: 'dist/',
                dest: '/public_html/admin/',
                exclusions: [ '*.md', 'dist/**/Thumbs.db' ]
            },
            apiN: {
                auth: config.authN,
                src: '../api/v1/',
                dest: '/public_html/api/v1/',
                exclusions: [ '*.md' ]
            },
            includesN: {
                auth: config.authN,
                src: '../includes/',
                dest: '/public_html/includes/',
                exclusions: [ '*.md', 'database.php' ]
            }
        }
    } );


    grunt.registerTask( 'serve', 'start the server and preview your app, ' +
        '--allow-remote for remote access',
        function ( target ) {
            if ( grunt.option( 'allow-remote' ) ) {
                grunt.config.set( 'connect.options.hostname', '0.0.0.0' );
            }
            if ( target === 'dist' ) {
                return grunt.task.run( [ 'build', 'connect:dist:keepalive' ] );
            }

            grunt.task.run( [
                'clean:server',
                'wiredep',
                'concurrent:server',
                'autoprefixer',
                'connect:livereload',
                'browserify',
                'watch'
            ] );
        } );

    grunt.registerTask( 'server', function ( target ) {
        grunt.log.warn( 'The `server` task has been deprecated. ' +
            'Use `grunt serve` to start a server.'
        );
        grunt.task.run( [ target ? ( 'serve:' + target ) : 'serve' ] );
    } );

    grunt.registerTask( 'test', function ( target ) {
        if ( target !== 'watch' ) {
            grunt.task.run( [
                'clean:server',
                'concurrent:test',
                'autoprefixer'
            ] );
        }

        grunt.task.run( [
            'browserify:test',
            'connect:test',
            'mocha'
        ] );
    } );

    grunt.registerTask( 'build', [
        'clean:dist',
        'wiredep',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'browserify',
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',
        'rev',
        'usemin',
        'htmlmin'
    ] );

    grunt.registerTask( 'default', [
        'newer:jshint',
        'test',
        'build'
    ] );
};
