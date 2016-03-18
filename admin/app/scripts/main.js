var table, tele, build, interval, stats, cache = {},
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
    } );

}



$( document ).ready( ( a ) => {
    $( '#tele' ).click( ( e ) => {
        viewBuilder( e, "#tele", "teleprompter", ( template ) => {
            viewBuilder( false, false, "builder", ( componentTemp ) => {
                tele = new Tele( {
                    el: '#container',
                    template: template,
                    components: {
                        //http://docs.ractivejs.org/latest/components#content
                        Builder: function () {
                            var that = this;
                            return Builder.extend( {
                                template: componentTemp,
                                cache: that.cache
                            } );
                        }
                    }
                } );
            } );


        } );
    } ).trigger( "click" );
    $( '#home' ).click( function ( e ) {
        viewBuilder( e, "#home", "tablePage", ( template ) => {
            viewBuilder( false, false, "table", ( componentTemp ) => {
                table = new Table( {
                    // The `el` option can be a node, an ID, or a CSS selector.
                    el: '#container',
                    template: template,
                    data: {
                        table: "users",
                        tables: [ "users", "other", "orders", "transactions", "toppingsSVG", "MeantToCauseAlert", "settings", "tablesInfo", "symbols", "quickOrdersPizza", "quickOrdersSalad", "quickOrdersWings", "quickOrdersDrink", "pizzaHeadings", "ingredients", "unavailableItems" ]
                    },
                    components: {
                        Table: function () {
                            var that = this;
                            return Table.extend( {
                                template: componentTemp,
                                cache: that.cache
                            } )
                        }
                    }
                } );
            } );

        } ).then( ( resp ) => {
            var func = function () {
                table.switchTable( {
                    type: 'GET'
                }, table.get( "table" ) ).then( function () {}, ( err ) => {
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
            };
            interval = setInterval( func, 12000 );
        }, function ( err ) {
            console.log( err );
        } );
    } );
    $( '#build' ).click( function ( e ) {
        viewBuilder( e, "#build", "builder", ( template ) => {
            build = new Builder( {
                // The `el` option can be a node, an ID, or a CSS selector.
                el: '#container',
                template,
                // Here, we're passing in some initial data
                data: {

                }
            } );
        } );
    } );

    $( '#stats' ).click( ( e ) => {
        viewBuilder( e, '#stats', 'stats', ( template ) => {
            stats = new Stats( {
                el: '#container',
                template,
                data: {}
            } );
        } );
    } );

    $( '#quickOrder a' ).click( function ( e ) {
        var current = $( this ).text();
        viewBuilder( e, false, 'quickOrderEditor', ( template ) => {
            viewBuilder( false, false, "table", ( tableComponent ) => {
                viewBuilder( false, false, "builder", ( builderComponent ) => {
                    quickOrder[ current ] = new Base( {
                        el: '#container',
                        template,
                        data: {
                            itemType: current
                        },
                        oninit: function () {
                            var that = this;
                            this.on( 'buildMe', event => {
                                this.buildMe( event );
                            } );
                            this.loadDeps();
                            this.on( 'Builder.checkout', queue => {
                                console.log( queue );
                                $( '#quickOrder' + this.get( 'itemType' ) ).modal( 'hide' );
                                this.findComponent( "Table" ).set( "add.1", this.mapNameToSymbols( queue ) );
                                var b = this.findComponent( "Builder" );
                                b.set( "currentChoices", b.get( "currentChoices" ).map( cur => {
                                    return cur.fill( false );
                                } ) );
                            } );
                        },
                        buildMe: function ( a ) {
                            console.log( $( '#quickOrder' + this.get( 'itemType' ) ) );

                            $( '#quickOrder' + this.get( 'itemType' ) ).modal( 'show' );
                        },
                        components: {
                            Table: function () {
                                var that = this;
                                return Table.extend( {
                                    template: tableComponent,
                                    cache: that.cache
                                } )

                            },
                            Builder: function () {
                                var that = this;
                                return Builder.extend( {
                                    template: builderComponent,
                                    cache: that.cache
                                } )
                            }
                        }
                    } );
                } );
            } );
        } );
    } );

} );
