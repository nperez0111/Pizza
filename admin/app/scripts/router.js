window.page = require( 'page' );

module.exports = {
    cur: null,
    routes: {},
    route: function ( newRoutes ) {
        Object.keys( newRoutes ).forEach( ( cur ) => {
            var Router = this;
            Router.routes[ cur ] = null;

            page( cur, function () {
                if ( Router.cur !== null ) {
                    Router.cur.detach()
                }

                if ( Router.routes[ cur ] === null ) {
                    Router.routes[ cur ] = newRoutes[ cur ].apply( this, arguments );
                } else {
                    Router.routes[ cur ].insert( Router.routes[ cur ].el )
                }


                Router.cur = Router.routes[ cur ];

            } );
        } );
    },
    base: function ( route ) {
        page.base( '/' );
        page( '/', route );
        page( '', route );
        page( {
            hashbang: true
        } );
    },
    to: function ( route ) {
        page( route );
    }
};
