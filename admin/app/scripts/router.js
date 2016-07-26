window.page = require( 'page' );
let events = {
    willDetach: ( a ) => {
        console.log( a )
    },
    willAttach: () => {},
    hasDetached: () => {},
    hasAttached: () => {}
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

                            return Promise.resolve( events.willAttach.call( this, cur + " has not been instantiated yet." ) ).then( ( a => {

                                Router.routes[ cur ] = newRoutes[ cur ].apply( this, arguments );

                                return true;

                            } )() ).then( events.hasAttached.apply( this, Router.routes[ cur ] ) );

                        } else {

                            return Promise.resolve( events.willAttach.call( this, Router.routes[ cur ] ) ).then( ( a => {

                                Router.routes[ cur ].insert( Router.routes[ cur ].el );

                                return true;

                            } )() ).then( events.hasAttached.call( this, Router.routes[ cur ] ) );


                        }

                    },

                    allAtOnce = () => {

                        return handleattachements.apply( this, arguments ).then( () => {

                            Router.cur = Router.routes[ cur ];
                            return Router.cur;
                        } );
                    };


                if ( Router.cur !== null ) {

                    return Promise.resolve( events.willDetach.call( this, Router.cur ) ).then( ( a => {

                        Router.cur.detach();

                        return true;

                    } ) ).then( events.hasDetached.call( this, Router.cur ) ).then( allAtOnce );

                } else {

                    return allAtOnce();

                }


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
