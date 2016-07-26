const Routes = require( './routes' );

window.Router = require( './router' );

Router.route( Routes( "Main" ) );

module.exports = () => {
    var links = Routes( "links" );

    Object.keys( links ).forEach( ( cur ) => {
        $( '#' + cur ).click( ( e ) => {
            Router.to( links[ cur ] );
            e.preventDefault();
            $( '.nav li' ).each( function () {
                $( this ).removeClass( "active" );
            } );
            $( $( '#' + cur ).parent() ).addClass( 'active' );
        } );
    } );


    $( '#quickOrder a' ).click( function ( e ) {
        var current = $( this ).text();
        Router.to( "/quickOrders/" + current );
        e.preventDefault();
    } );

    Router.base( 'stats' );
}
