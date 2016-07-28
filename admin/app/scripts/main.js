const Base = require( './base' ),
    Table = require( './table' ),
    Builder = require( './builder' ),
    Chart = require( './chart' ),
    routeHandler = require( './handleRoutes' );

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
        datepicker: Base

    } );


    routeHandler();


} );
