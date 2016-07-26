let Base = require( './base' ),
    Table = require( './table' ),
    Builder = require( './builder' ),
    Chart = require( './chart' ),
    Stats = require( './stats' ),
    Tele = require( './teleprompter' );
var pages = {
    cur: undefined,
    stats: undefined,
    tele: undefined,
    build: undefined,
    table: undefined,
    charter: undefined,
    tableProps: {
        switched: true,
        past: {},
        interval: undefined
    },
    quickOrder: {},
    templateCache: {}
};
window.Router = require( './router' );
Router.route( {
    charter: function () {

        pages.charter = pages.charter || new Chart( {
            el: '#container',
            data: {
                identifier: "woa"
            }
        } );

        return pages.charter;

    },
    telePrompter: function () {


        pages.tele = pages.tele || new Tele( {
            el: '#container'
        } );

        return pages.tele;

    },
    builder: function () {

        pages.build = pages.build || new Builder( {
            el: '#container'
        } );

        return pages.build;

    },
    stats: function () {

        pages.stats = pages.stats || new Stats( {
            el: '#container'
        } );
        return pages.stats;

    },
    "table/:tableName": function ( ctx ) {
        var tableName = ctx.params.tableName;

        pages.table = pages.table || new Table( {
            el: '#container',
            template: require( './../views/tablePage.ract' ).template,
            data: {
                table: tableName,
                tables: [ "users", "other", "orders", "transactions", "toppingsSVG", "MeantToCauseAlert", "settings", "tablesInfo", "symbols", "quickOrdersPizza", "quickOrdersSalad", "quickOrdersWings", "quickOrdersDrink", "pizzaHeadings", "ingredients", "unavailableItems" ]
            }
        } );

        if ( !pages.tableProps.past[ tableName ] ) {
            pages.table.on( "tableSwitch", function ( newRoute ) {
                if ( newRoute[ 0 ] !== newRoute[ 1 ] && newRoute[ 0 ] !== tableName ) {
                    page( "/table/" + newRoute[ 0 ] );
                    pages.tableProps.switched = true;
                }

            } );
            pages.tableProps.past[ tableName ] = true;
        }

        if ( !pages.tableProps.switched ) {
            pages.table.set( "table", tableName );
            //console.log( "table set " );
        }
        pages.tableProps.switched = false;
        //console.trace( "switched off" );


        pages.tableProps.interval = setInterval( function () {
            pages.table.switchTable( {
                type: 'GET'
            }, [ pages.table.get( "table" ), pages.table.get( "table" ) ] ).catch( ( err ) => {
                clearInterval( pages.tableProps.interval );

                pages.table.alerter( 'Sorry, Issues loading Table Data from API..', "<button id='click' class=' btn btn-default'><span class='glyphicon glyphicon-refresh'></span>Click to retry</button>" );

                $( '#click' ).click( function () {

                    $( this ).find( 'span' ).addClass( "glyphicon-refresh-animate" );
                    $( "#alert" ).fadeTo( 500, 0 ).slideUp( 500, function () {
                        $( this ).remove();
                    } );
                    pages.tableProps.interval = setInterval( func, 12000 );

                } );

                pages.table.logger( err );

            } );

        }, 12000 );
        return pages.table;
    },
    "quickOrders/:current": function ( ctx ) {
        var current = ctx.params.current;

        pages.quickOrder[ current ] = pages.quickOrder[ current ] || new Base( {
            el: '#container',
            template: require( './../views/quickOrderEditor.ract' ).template,
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

        return pages.quickOrder[ current ];

    }
} );

function lo( a ) {
    console.log( a );
    return a;
}

Ractive.DEBUG = true;

$( document ).ready( ( a ) => {
    require( './loadComponents' )( {
        builder: Builder,
        table: Table,
        modal: Base.extend( {
            template: require( './../views/modal.ract' ).template
        } ),
        chart: Chart
    }, {
        datepicker: require( 'ractive-datepicker' )

    } );


    var links = {
        tele: "/teleprompter",
        home: '/table/users',
        build: "/builder",
        stats: "/stats",
        charty: "/charter"
    };

    Object.keys( links ).forEach( ( cur ) => {
        $( '#' + cur ).click( ( e ) => {
            Router.to( links[ cur ] );
            e.preventDefault();
        } );
    } );


    $( '#quickOrder a' ).click( function ( e ) {
        var current = $( this ).text();
        Router.to( "/quickOrders/" + current );
        e.preventDefault();
    } );

    Router.base( 'stats' );


} );
