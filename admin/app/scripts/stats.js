var Stats = Base.extend( {
    oninit: function () {
        tele.sendToDataBase( {
            data: {
                from: "2015-12-14 17:16:51"
            }
        }, "getByTime/orders/DateOrdered" ).then( JSON.parse, this.errorMessage ).then( ( resp ) => {
            this.set( "data", resp );
        } );
    },
    data: function () {
            return {
                data: "well ok."
            }
        }
        //tele.sendToDataBase({data:{from:"2015-12-14 17:16:51"}},"getByTime/orders/DateOrdered").then(tele.logger,tele.logger)
} );
