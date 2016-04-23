var table, tele, build, interval, stats, cur, cache = {},
    quickOrder = {},
    tables = {
        switched: true,
        past: {}
    };
Ractive.DEBUG = false;

function viewBuilder( url, el = false, callback = ( a ) => {
    return false;
} ) {


    if ( $( el ).parent().hasClass( "active" ) ) {
        return Promise.reject( "'" + el + "' Element clicked twice" );
    }

    if ( interval ) {
        clearInterval( interval );
    }

    $( '.nav li' ).each( function () {
        $( this ).removeClass( "active" );
    } );

    if ( el ) {
        $( el ).parent().addClass( "active" );
    }

    var resolveCallback = ( template ) => {
        var newOrOld = callback( template );
        if ( newOrOld !== false ) {
            if ( cur ) {
                cur.detach();
            }
            newOrOld.insert( newOrOld.el );
            cur = newOrOld;
        }
        return template;
    };

    if ( url in cache ) {
        return Promise.resolve( resolveCallback( cache[ url ] ) );
    }

    return $.ajax( {
        url: window.location.origin + "/views/" + url + ".html",
        dataType: "html"
    } ).then( resolveCallback, ( err ) => {
        var base = new Base();
        base.alerter( "Sorry, Issues loading template file..." );
        throw Error( JSON.stringify( err ) );
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

        return viewBuilder( c );

    } ) ).then( ( all ) => {

        Object.keys( components ).forEach( ( cur, i, arr ) => {

            Ractive.components[ cur.charAt( 0 ).toUpperCase() + cur.slice( 1 ) ] = function () {
                var that = this;

                return components[ cur ].extend( {
                    template: all[ i ],
                    cache: that.cache
                } );

            };

        } );

    } );

    var links = {
        tele: "/teleprompter",
        home: '/table/users',
        build: "/builder",
        stats: "/stats"
    };

    Object.keys( links ).forEach( ( cur ) => {
        $( '#' + cur ).click( ( e ) => {
            page( links[ cur ] );
            e.preventDefault();
        } );
    } );

    $( '#quickOrder a' ).click( function ( e ) {
        var current = $( this ).text();
        page( "/quickOrders/" + current );
        e.preventDefault();
    } );

    var routes = {
        telePrompter: function () {

            viewBuilder( "teleprompter", "#tele", ( template ) => {

                tele = tele || new Tele( {
                    el: '#container',
                    template: template
                } );

                return tele;

            } );
        },
        builder: function () {
            viewBuilder( "builder", "#build", ( template ) => {

                build = build || new Builder( {
                    // The `el` option can be a node, an ID, or a CSS selector.
                    el: '#container',
                    template,
                    // Here, we're passing in some initial data
                    data: {

                    }
                } );

                return build;

            } );
        },
        stats: function () {
            viewBuilder( 'stats', '#stats', ( template ) => {

                stats = stats || new Stats( {
                    el: '#container',
                    template,
                    data: {}
                } );
                return stats;
            } );
        },
        "table/:tableName": function ( ctx ) {
            var tableName = ctx.params.tableName;
            viewBuilder( "tablePage", false, ( template ) => {

                table = table || new Table( {
                    // The `el` option can be a node, an ID, or a CSS selector.
                    el: '#container',
                    template: template,
                    data: {
                        table: tableName,
                        tables: [ "users", "other", "orders", "transactions", "toppingsSVG", "MeantToCauseAlert", "settings", "tablesInfo", "symbols", "quickOrdersPizza", "quickOrdersSalad", "quickOrdersWings", "quickOrdersDrink", "pizzaHeadings", "ingredients", "unavailableItems" ]
                    }
                } );

                if ( !tables.past[ tableName ] ) {
                    table.on( "tableSwitch", function ( newRoute ) {
                        if ( newRoute[ 0 ] !== newRoute[ 1 ] && newRoute[ 0 ] !== tableName ) {
                            page( "/table/" + newRoute[ 0 ] );
                            //console.log( "tableSwitched fired with", newRoute[ 0 ], tableName );
                            tables.switched = true;
                        }

                    } );
                    tables.past[ tableName ] = true;
                }

                if ( !tables.switched ) {
                    table.set( "table", tableName );
                    //console.log( "table set " );
                }
                tables.switched = false;
                //console.trace( "switched off" );
                return table;

            } ).then( ( resp ) => {
                interval = setInterval( function () {
                    table.switchTable( {
                        type: 'GET'
                    }, [ table.get( "table" ), table.get( "table" ) ] ).catch( ( err ) => {
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
        },
        "quickOrders/:current": function ( ctx ) {
            var current = ctx.params.current;
            viewBuilder( 'quickOrderEditor', false, ( template ) => {

                quickOrder[ current ] = quickOrder[ current ] || new Base( {
                    el: '#container',
                    template,
                    data: {
                        itemType: current
                    },
                    computed: {
                        buildItem: {
                            get: function () {
                                var t = this.get( "itemType" );
                                return t.charAt( 0 ).toLowerCase() + t.slice( 1 ) + "Headings";
                            }
                        }
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

                return quickOrder[ current ];
            } );

        }
    }
    page.base( '/' );
    page( '/', routes.telePrompter );
    page( '', routes.telePrompter );

    Object.keys( routes ).forEach( ( cur ) => {
        page( cur, routes[ cur ] );
    } );

    page();

} );
