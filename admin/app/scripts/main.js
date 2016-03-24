var table, tele, build, interval, stats, cur, cache = {},
    quickOrder = {};
Ractive.DEBUG = false;

function viewBuilder( evente, el, url, callback ) {

    if ( evente ) {
        evente.preventDefault();
    }

    if ( el && $( el ).parent().hasClass( "active" ) ) {
        return Promise.reject( "Same Element clicked twice" );
    }

    if ( interval ) {
        clearInterval( interval );
    }

    if ( evente ) {
        $( '.nav li' ).each( function () {
            $( this ).removeClass( "active" );
        } );
        $( $( evente.target )[ 0 ] ).parent().addClass( "active" );
    }

    if ( url in cache ) {
        return Promise.resolve( callback( cache[ url ] ) );
    }

    return $.ajax( {
        url: "views/" + url + ".html",
        dataType: "html"
    } ).then( ( template ) => {
        callback( template );
        return template;
    }, ( err ) => {
        var base = new Base();
        base.alerter( "Sorry, Issues loading template file..." );
        return Error( JSON.stringify( err ) );
    } ).then( ( template ) => {
        cache[ url ] = template;
        return template;
    } );

}



$( document ).ready( ( a ) => {
    var components = {
        builder: Builder,
        table: Table,
        modal: Base
    };
    Promise.all( Object.keys( components ).map( ( c ) => {
        return viewBuilder( false, false, c, function ( d ) {
            return d;
        } )
    } ) ).then( ( all ) => {
        Object.keys( components ).forEach( ( cur, i, arr ) => {
            Ractive.components[ cur.charAt( 0 ).toUpperCase() + cur.slice( 1 ) ] = function () {
                var that = this;
                return components[ cur ].extend( {
                    template: all[ i ],
                    cache: that.cache
                } )
            };
        } );
    } );
    $( '#tele' ).click( ( e ) => {
        viewBuilder( e, "#tele", "teleprompter", ( template ) => {
            if ( tele ) {
                tele.insert( tele.el );
                cur.detach();
            }
            tele = tele || new Tele( {
                el: '#container',
                template: template
            } );
            cur = tele;


        } );
    } ).trigger( "click" );
    $( '#home' ).click( function ( e ) {
        viewBuilder( e, "#home", "tablePage", ( template ) => {
            if ( table ) {
                table.insert( table.el );
                cur.detach();

            }
            table = table || new Table( {
                // The `el` option can be a node, an ID, or a CSS selector.
                el: '#container',
                template: template,
                data: {
                    table: "users",
                    tables: [ "users", "other", "orders", "transactions", "toppingsSVG", "MeantToCauseAlert", "settings", "tablesInfo", "symbols", "quickOrdersPizza", "quickOrdersSalad", "quickOrdersWings", "quickOrdersDrink", "pizzaHeadings", "ingredients", "unavailableItems" ]
                }
            } );
            cur = table;

        } ).then( ( resp ) => {
            interval = setInterval( function () {

                table.switchTable( {
                    type: 'GET'
<<<<<<< HEAD
                }, table.get( "table" ) ).catch( ( err ) => {
=======
                }, table.get( "table" ) ).then( function () { /*Successfully loaded the current table*/ }, ( err ) => {

>>>>>>> master
                    clearInterval( interval );

                    table.alerter( 'Sorry, Issues loading Table Data from API..', "<button id='click' class=' btn btn-default'><span class='glyphicon glyphicon-refresh'></span>Click to retry</button>" );

                    $( '#click' ).click( function () {

                        $( this ).find( 'span' ).addClass( "glyphicon-refresh-animate" );
                        $( "#alert" ).fadeTo( 500, 0 ).slideUp( 500, function () {
                            $( this ).remove();
                        } );
                        interval = setInterval( func, 12000 );

                    } );

                    table.logger( err );

                } );

            }, 12000 );
        }, function ( err ) {
            console.log( err );
        } );
    } );
    $( '#build' ).click( function ( e ) {
        viewBuilder( e, "#build", "builder", ( template ) => {
            if ( build ) {
                build.insert( build.el );
                cur.detach();

            }
            build = build || new Builder( {
                // The `el` option can be a node, an ID, or a CSS selector.
                el: '#container',
                template,
                // Here, we're passing in some initial data
                data: {

                }
            } );
            cur = build;
        } );
    } );

    $( '#stats' ).click( ( e ) => {
        viewBuilder( e, '#stats', 'stats', ( template ) => {
            if ( stats ) {
                stats.insert( stats.el );
                cur.detach();

            }
            stats = stats || new Stats( {
                el: '#container',
                template,
                data: {}
            } );
            cur = stats;
        } );
    } );

    $( '#quickOrder a' ).click( function ( e ) {
        var current = $( this ).text();
        viewBuilder( e, false, 'quickOrderEditor', ( template ) => {
            if ( quickOrder[ current ] ) {
                quickOrder[ current ].insert( quickOrder[ current ].el );
                cur.detach();
            }
            quickOrder[ current ] = quickOrder[ current ] || new Base( {
                el: '#container',
                template,
                data: {
                    itemType: current
                },
                oninit: function () {
                    var that = this;
                    this.on( 'buildMe', event => {
                        $( '#quickOrder' + this.get( 'itemType' ) ).modal( 'show' );
                    } );
                    this.loadDeps();
                    this.on( 'Builder.checkout', queue => {
                        $( '#quickOrder' + this.get( 'itemType' ) ).modal( 'hide' );
                        this.findComponent( "Table" ).set( "add.1", this.mapNameToSymbols( queue ) );
                        var b = this.findComponent( "Builder" );
                        b.set( "currentChoices", b.get( "currentChoices" ).map( cur => {
                            return cur.fill( false );
                        } ) );
                    } );
                }
            } );
            cur = quickOrder[ current ];
        } );
    } );

} );
