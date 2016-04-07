var table, tele, build, interval, stats, cur, cache = {},
    quickOrder = {};
Ractive.DEBUG = false;

function viewBuilder( url, evente=false, el=false, callback=(a)=>{return false;}) {
    var resolveCallback = ( template ) => {
        var newOrOld=callback(template);
        if(newOrOld!==false){
            if(cur){
                cur.detach();
            }
            newOrOld.insert( newOrOld.el );
            cur = newOrOld;
        }
        return template;
    };
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
        return Promise.resolve( resolveCallback( cache[ url ] ) );
    }

    return $.ajax( {
        url: "views/" + url + ".html",
        dataType: "html"
    } ).then( resolveCallback, ( err ) => {
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
        return viewBuilder( c);
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
        viewBuilder( "teleprompter", e, "#tele", ( template ) => {
            
            tele = tele || new Tele( {
                el: '#container',
                template: template
            } );
            return tele;


        } );
    } ).trigger( "click" );
    $( '#home' ).click( function ( e ) {
        viewBuilder( "tablePage", e, "#home", ( template ) => {

            table = table || new Table( {
                // The `el` option can be a node, an ID, or a CSS selector.
                el: '#container',
                template: template,
                data: {
                    table: "users",
                    tables: [ "users", "other", "orders", "transactions", "toppingsSVG", "MeantToCauseAlert", "settings", "tablesInfo", "symbols", "quickOrdersPizza", "quickOrdersSalad", "quickOrdersWings", "quickOrdersDrink", "pizzaHeadings", "ingredients", "unavailableItems" ]
                }
            } );
            return table;

        },table ).then( ( resp ) => {
            interval = setInterval( function () {

                table.switchTable( {
                    type: 'GET'
                }, table.get( "table" ) ).catch( ( err ) => {
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
        viewBuilder( "builder" , e, "#build", ( template ) => {
            
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
    } );

    $( '#stats' ).click( ( e ) => {
        viewBuilder( 'stats', e, '#stats', ( template ) => {
            
            stats = stats || new Stats( {
                el: '#container',
                template,
                data: {}
            } );
            return stats;
        } );
    } );

    $( '#quickOrder a' ).click( function ( e ) {
        var current = $( this ).text();
        viewBuilder( 'quickOrderEditor', e, false, ( template ) => {
            
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
    } );

} );
