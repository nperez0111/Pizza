var Stats = Base.extend( {
    oninit: function () {
        this.getStats().then( res => {
            return this.set( "data", res );
        } ).then( res => {
            this.findComponent( "Chart" ).fire( "rerender" );
        } );
    },
    data: function () {

        return {
            data: [],
            stats: {
                from: "2015-12-14 17:16:51",
                to: new Date()
            }
        }
    },
    computed: {
        gData: {
            get: function () {
                return this.makeObj( [ "series", "labels" ], [
                    [ this.get( "data" ).map( cur => {
                        return cur.Price || null;
                    } ), this.get( "data" ).map( cur => {
                        return cur.Price || null;
                    } ) ],
                    [ "First", "Second", "Third" ]
                ] );
            }
        }
    },
    getStats: function () {
        return this.sendToDataBase( {
            data: {
                from: this.get( "stats.from" )
            }
        }, "getByTime/orders/DateOrdered" ).then( JSON.parse, this.errorMessage ).then( ( resp ) => {

            return Promise.all( resp.map( ( cur ) => {
                return this.getPrice( cur.OrderSymbols, true ).catch( function ( a ) {
                    console.log( "Problem:", a );
                } );
            } ) ).then( ( a ) => {
                return resp.map( ( curr, i ) => {
                    return this.makeObj( Object.keys( curr ).concat( "Price" ), Object.keys( curr ).map( cur => {
                        return curr[ cur ];
                    } ).concat( a[ i ] ) )
                } );
            } );
        } );
    }
} );
