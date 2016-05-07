var Stats = Base.extend( {
    oninit: function () {

    },
    data: function () {
        this.sendToDataBase( {
            data: {
                from: "2015-12-14 17:16:51"
            }
        }, "getByTime/orders/DateOrdered" ).then( JSON.parse, this.errorMessage ).then( ( resp ) => {

            Promise.all( resp.map( ( cur ) => {
                return this.getPrice( cur.OrderSymbols, true ).catch( function ( a ) {
                    console.log( "Problem:", a );
                } );
            } ) ).then( ( a ) => {
                return resp.map( ( curr, i ) => {
                    return this.makeObj( Object.keys( curr ).concat( "Price" ), Object.keys( curr ).map( cur => {
                        return curr[ cur ];
                    } ).concat( a[ i ] ) )
                } );
            } ).then( res => {
                this.set( "data", res );
            } );
        } );
        return {
            data: []
        }
    },
    computed: {
        gData: {
            get: function () {
                return this.makeObj( [ "series", "labels" ], [
                    [ this.get( "data" ).map( cur => {
                        return cur.Price || null;
                    } ) ], this.get( "data" ).map( ( cur, i ) => {
                        return i + "";
                    } )
                ] );
            }
        }
    }
} );
