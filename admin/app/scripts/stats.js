var Stats = Base.extend( {
    oninit: function () {

    },
    data: function () {
        this.sendToDataBase( {
            data: {
                from: "2015-12-14 17:16:51"
            }
        }, "getByTime/orders/DateOrdered" ).then( JSON.parse, this.errorMessage ).then( this.logger ).then( ( resp ) => {
            this.set( "data", resp );
            var symbols = resp.map( ( cur ) => {
                return this.getPrice( cur.OrderSymbols, true );
            } );
            Promise.all( symbols ).then( this.logger );
        } );
        return {
            data: "well ok."
        }
    }
} );
