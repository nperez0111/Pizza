window.page = require( 'page' );
let events = {
    willDetach: [ () => {} ],
    willAttach: [ () => {} ],
    willRoute: [ () => {} ],
    hasDetached: [ () => {} ],
    hasAttached: [ () => {} ],
    hasRouted: [ () => {} ],
    init: [ () => {} ]
};
const fire = ( eve, thisArg, argsArr ) => {

    if ( !Array.isArray( argsArr ) ) {

        argsArr = [ argsArr ];

    }

    return Promise.resolve( events[ eve ].map( cur => {

        return cur.apply( thisArg, argsArr );

    } ) );

}

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

                            return fire( "willAttach", this, cur + " has not been instantiated yet." ).then( a => {

                                Router.routes[ cur ] = newRoutes[ cur ].apply( this, arguments );
                                return a;

                            } ).then( fire( "hasAttached", this, Router.routes[ cur ] ) ).then( fire( "hasRouted", this, cur ) );

                        } else {
                            return fire( "willAttach", this, Router.routes[ cur ] ).then( a => {

                                Router.routes[ cur ].insert( Router.routes[ cur ].el );
                                return a;

                            } ).then( fire( "hasAttached", this, Router.routes[ cur ] ) ).then( fire( "hasRouted", this, cur ) );

                        }

                    },

                    allAtOnce = () => {

                        return handleattachements.apply( this, arguments ).then( () => {

                            Router.cur = Router.routes[ cur ];
                            return Router.cur;

                        } );

                    };

                if ( Router.cur !== null ) {

                    return fire( "willDetach", this, Router.cur ).then( ( a => {

                        Router.cur.detach();

                        return true;

                    } ) ).then( fire( "hasDetached", this, Router.cur ) ).then( allAtOnce );

                } else {

                    return allAtOnce();

                }

            } );
        } );
    },
    base: function ( route ) {
        fire( "init", this, route ).then( () => {

            page.base( '/' );
            page( '/', route );
            page( '', route );
            page( {

                hashbang: true

            } );

        } );
    },
    to: function ( route ) {

        fire( "willRoute", this, route ).then( () => {
            return page( route );
        } );

    },
    on: function ( event, callback ) {

        events[ event ].push( callback );
        return this;

    },
    off: function ( event = false, index ) {

        if ( event === false ) {

            const keys = Object.keys( events );

            events = keys.map( ( c ) => {

                return [ events[ c ][ 0 ] ];

            } ).reduce( ( p, r, i ) => {

                let ret = {};
                ret[ keys[ i ] ] = r;
                return Object.assign( {}, p, ret );

            }, {} );

        } else {

            if ( Number( index ) === index ) {

                events[ event ].splice( index, 1 );

            } else {

                events[ event ] = [ events[ event ][ 0 ] ];

            }

        }

        return this;
    },
    fire

};
