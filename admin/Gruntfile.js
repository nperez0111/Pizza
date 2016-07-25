// Generated on 2015-11-09 using
// generator-webapp 1.1.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function ( grunt ) {

    // Time how long tasks take. Can help when optimizing build times
    require( 'time-grunt' )( grunt );

    // Automatically load required grunt tasks
    require( 'jit-grunt' )( grunt, {
        useminPrepare: 'grunt-usemin'
    } );

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
            babel: {
                files: [ '<%= config.app %>/scripts/{,*/}*.js' ],
                tasks: [ 'babel:dist' ]
            },
            babelTest: {
                files: [ 'test/spec/{,*/}*.js' ],
                tasks: [ 'babel:test', 'test:watch' ]
            },
            gruntfile: {
                files: [ 'Gruntfile.js' ]
            },
            sass: {
                files: [ '<%= config.app %>/styles/{,*/}*.{scss,sass}' ],
                tasks: [ 'sass', 'postcss' ]
            },
            styles: {
                files: [ '<%= config.app %>/styles/{,*/}*.css' ],
                tasks: [ 'newer:copy:styles', 'postcss' ]
            }
        },

        browserSync: {
            options: {
                notify: false,
                background: true,
                watchOptions: {
                    ignored: ''
                }
            },
            livereload: {
                options: {
                    files: [
                        '<%= config.app %>/{,*/}*.html',
                        '<%= config.app %>/views/{,*/}*.html',
                        '.tmp/styles/{,*/}*.css',
                        '<%= config.app %>/images/{,*/}*',
                        '.tmp/scripts/{,*/}*.js'
                    ],
                    port: 9000,
                    server: {
                        baseDir: [ '.tmp', config.app ],
                        routes: {
                            '/bower_components': './bower_components'
                        }
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    open: false,
                    logLevel: 'silent',
                    host: 'localhost',
                    server: {
                        baseDir: [ '.tmp', './test', config.app ],
                        routes: {
                            '/bower_components': './bower_components',
                            '/app': './app'
                        }
                    }
                }
            },
            dist: {
                options: {
                    background: false,
                    server: '<%= config.dist %>'
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
        eslint: {
            target: [
                'Gruntfile.js',
                '<%= config.app %>/scripts/{,*/}*.js',
                '!<%= config.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },

        // Mocha testing framework configuration options
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: [ 'http://<%= browserSync.test.options.host %>:<%= browserSync.test.options.port %>/index.html' ]
                }
            }
        },

        // Compiles ES6 with Babel
        babel: {
            options: {
                sourceMap: true
            },
            dist: {
                files: [ {
                    expand: true,
                    cwd: '<%= config.app %>/scripts',
                    src: '{,*/}*.js',
                    dest: '.tmp/scripts',
                    ext: '.js'
                } ]
            },
            test: {
                files: [ {
                    expand: true,
                    cwd: 'test/spec',
                    src: '{,*/}*.js',
                    dest: '.tmp/spec',
                    ext: '.js'
                } ]
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        sass: {
            options: {
                sourceMap: true,
                sourceMapEmbed: true,
                sourceMapContents: true,
                includePaths: [ '.' ]
            },
            dist: {
                files: [ {
                    expand: true,
                    cwd: '<%= config.app %>/styles',
                    src: [ '*.{scss,sass}' ],
                    dest: '.tmp/styles',
                    ext: '.css'
                } ]
            }
        },

        postcss: {
            options: {
                map: true,
                processors: [
                    // Add vendor prefixed styles
                    require( 'autoprefixer' )( {
                        browsers: [ '> 1%', 'last 2 versions', 'Firefox ESR' ]
                    } )
                ]
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
                src: [ '<%= config.app %>/index.html', 'test/index.html' ],
                exclude: [ 'bootstrap.js' ],
                ignorePath: /^(\.\.\/)*\.\./
            },
            sass: {
                src: [ '<%= config.app %>/styles/{,*/}*.{scss,sass}' ],
                ignorePath: /^(\.\.\/)+/
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= config.dist %>/scripts/{,*/}*.js',
                    '<%= config.dist %>/styles/{,*/}*.css',
                    '<%= config.dist %>/styles/fonts/{,*/}*.*',
                    '<%= config.dist %>/*.{ico,png}'
                ]
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
                assetsDirs: [
                    '<%= config.dist %>',
                    '<%= config.dist %>/styles'
                ]
            },
            html: [ '<%= config.dist %>/*.html' ],
            css: [ '<%= config.dist %>/styles/{,*/}*.css' ]
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [ {
                    expand: true,
                    cwd: '<%= config.app %>/images',
                    src: '<%= config.app %>/{,*/}*.{gif,jpeg,jpg,png}',
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
                    conservativeCollapse: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    // true would impact styles with attribute selectors
                    removeRedundantAttributes: false,
                    useShortDoctype: true
                },
                files: [ {
                    expand: true,
                    cwd: '<%= config.dist %>',
                    src: '*.html',
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
                        'images/{,*/}*.webp',
                        '{,*/}*.html',
                        'styles/fonts/{,*/}*.*'
                    ]
                }, {
                    expand: true,
                    dot: true,
                    cwd: '.',
                    src: 'bower_components/bootstrap-sass/assets/fonts/bootstrap/*',
                    dest: '<%= config.dist %>'
                } ]
            }
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
        },
        uncss: {
            dist: {
                files: {
                    'dist/css/tidy.css': [ 'dist/compressed.html' ]
                }
            }
        },
        // Run some tasks in parallel to speed up build process
        concurrent: {
            server: [
                'babel:dist',
                'sass'
            ],
            test: [
                'babel'
            ],
            dist: [
                'babel',
                'sass',
                'imagemin',
                'svgmin'
            ]
        },
        "file-creator": {
            options: {
                openFlags: 'w'
            },
            folder: {
                "dist/compressed.html": function ( fs, fd, done ) {
                    var glob = grunt.file.glob;
                    var _ = grunt.util._;
                    var Ractive = require( 'ractive/ractive.js' );
                    Ractive.DEBUG = false;
                    fs.writeSync( fd, '<!DOCTYPE html> <html lang=en> <head> <meta charset=utf-8> <title>Admin Page</title> <meta name=description content=""> <meta name=ROBOTS content="NOINDEX, NOFOLLOW"> <meta name=viewport content="width=device-width,initial-scale=1"> <link rel="shortcut icon" href=/favicon.b25e58c4.ico> <link rel=apple-touch-icon href=/apple-touch-icon.9727d3c2.png> <link rel=stylesheet href=styles/vendor.css> <link rel=stylesheet href=styles/main.css>  <body>  <div class=container> <div class=header> <ul class="nav nav-pills pull-right"> <li class=active><a href=#>Home</a></li> <li><a href=teleprompter.html>Tele-Prompter</a></li> <li><a href=#>Contact</a></li> </ul> <h3 class=text-muted>Admin Page</h3> </div> <div id=alert style=display:none class="alert alert-danger"></div> <div class=container-fluid id=container>' );
                    glob( 'app/views/**/*.html', function ( err, files ) {
                        var i = 0;
                        _.each( files, function ( file ) {

                            fs.readFile( file, "utf8", function ( err, data ) {
                                if ( err ) {
                                    throw ( err );
                                }
                                var r = new Ractive( {
                                    template: data,
                                    data: {
                                        cols: 2,
                                        queue: [],
                                        headings: [],
                                        types: [
                                            []
                                        ],
                                        rows: [ 'Some', 'Error', 'Occurred' ],
                                        add: [],
                                        editing: {
                                            cur: 1,
                                            past: {},
                                            notAllowed: [ false, false, false ]
                                        },
                                        data: [
                                            [ "Check", "If", "Connected" ],
                                            [ "To", "The", "Internet" ]
                                        ],
                                        table: "users",
                                        tables: [ "users" ],
                                        orders: [],
                                        type: [ {
                                            name: "Pizza",
                                            quickOrders: [ "Large eperoni" ],
                                            buildYourOwn: true
                                        }, {
                                            name: "Wings",
                                            quickOrders: [ "Spicy buffalo" ],
                                            buildYourOwn: true
                                        }, {
                                            name: "Salad",
                                            quickOrders: [ "Regular", "Lechuga" ],
                                            buildYourOwn: true
                                        }, {
                                            name: "Drink",
                                            quickOrders: [ "Sprite", "Coke", "Diet Coke", "Materva", "Water" ],
                                            buildYourOwn: false,
                                            images: [ "sprite.png", "coke.jpg", "diet_coke.jpg", "materva.png", "water.jpg" ]
                                        } ],
                                        currentChoices: [
                                            []
                                        ],
                                        sizes: [ 45, 37.5, 30 ],
                                        svg: {
                                            radius: 30
                                        },
                                    }
                                } );
                                fs.writeSync( fd, r.toHTML() );
                                if ( i + 1 == files.length ) {
                                    fs.writeSync( fd, '<div class=progress> <div class="progress-bar progress-bar-striped active" style="width: 100%"> Loading... </div> </div> </div> <div class=footer> </div> </div>' );
                                    done();
                                }
                                i++;
                            } );
                        } );

                    } );
                }
            }
        }

    } );


    grunt.registerTask( 'serve', 'start the server and preview your app', function ( target ) {

        if ( target === 'dist' ) {
            return grunt.task.run( [ 'build', 'browserSync:dist' ] );
        }

        grunt.task.run( [
            'clean:server',
            'wiredep',
            'concurrent:server',
            'postcss',
            'browserSync:livereload',
            'watch'
        ] );
    } );

    grunt.registerTask( 'server', function ( target ) {
        grunt.log.warn( 'The `server` task has been deprecated. Use `grunt serve` to start a server.' );
        grunt.task.run( [ target ? ( 'serve:' + target ) : 'serve' ] );
    } );

    grunt.registerTask( 'test', function ( target ) {
        if ( target !== 'watch' ) {
            grunt.task.run( [
                'clean:server',
                'concurrent:test',
                'postcss',
                'babel:test',
                'babel:dist'
            ] );
        }

        grunt.task.run( [
            'browserSync:test',
            'mocha'
        ] );
    } );

    grunt.registerTask( 'build', [
        'clean:dist',
        'wiredep',
        'babel',
        'useminPrepare',
        'concurrent:dist',
        'postcss',
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',
        'usemin',
        'htmlmin'
    ] );

    grunt.registerTask( 'default', [
        'newer:eslint',
        'test',
        'build'
    ] );

    grunt.registerTask( 'deploy', function ( argue ) {
        grunt.loadNpmTasks( 'grunt-ftp-deploy' );
        grunt.option( 'force', true );
        argue = argue || "";
        grunt.task.run( [ 'build' ].concat( [ 'ftp-deploy:build', 'ftp-deploy:api', 'ftp-deploy:includes' ].map( function ( cur ) {
            return cur + argue;
        } ) ) );

    } );
    grunt.registerTask( 'tidy', function ( argue ) {
        grunt.loadNpmTasks( "grunt-uncss" );
        grunt.task.run( [ "file-creator", "uncss" ] );

    } );
};
