window.page = require( 'page' );
let events = {
    willDetach: () => {
        console.log( 'willdetach' );
    },
    willAttach: () => {
        console.log( 'willattach' );
    },
    hasDetached: () => {
        console.log( 'hasdetached' );
    },
    hasAttached: () => {
        console.log( 'hasattached' );
    }
};
module.exports = {
    cur: null,
    routes: {},
    route: function ( newRoutes ) {
        Object.keys( newRoutes ).forEach( ( cur ) => {
            var Router = this;
            Router.routes[ cur ] = null;

            page( cur, function () {
                let handleattachements = () => {
                    if ( Router.routes[ cur ] === null ) {
                        return Promise.resolve( events.willAttach.apply( this, Router.cur ) ).then( ( a => {
                            Router.routes[ cur ] = newRoutes[ cur ].apply( this, arguments );
                            return true;
                        } )() ).then( events.hasAttached.apply( this, Router.cur ) );

                    } else {
                        return Promise.resolve( events.willAttach.apply( this, Router.cur ) ).then( ( a => {
                            Router.routes[ cur ].insert( Router.routes[ cur ].el );
                            return true;
                        } )() ).then( events.hasAttached.apply( this, Router.cur ) );

                    }
                }
                if ( Router.cur !== null ) {
                    Promise.resolve( events.willDetach.apply( this, Router.cur ) ).then( ( a => {
                        Router.cur.detach();
                        return true;
                    } )() ).then( events.hasDetached.apply( this, Router.cur ) ).then( handleattachements );
                } else {
                    handleattachements();
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
    },
    on: function ( event, callback ) {
        events[ event ] = callback;
        return this;
    }
};
