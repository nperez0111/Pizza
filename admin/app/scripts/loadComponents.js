module.exports = ( components, singletons ) => {
    console.log( 'ran' )

    Object.keys( components ).forEach( ( cur, i, arr ) => {

        Ractive.components[ cur.charAt( 0 ).toUpperCase() + cur.slice( 1 ) ] = function () {
            var that = this;

            return components[ cur ].extend( {
                cache: that.cache
            } );

        };

    } );


    Object.keys( singletons ).forEach( cur => {
        Ractive.components[ cur ] = singletons[ cur ];

    } );

}
