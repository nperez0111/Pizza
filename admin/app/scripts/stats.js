let Base = require( './base' ),
    Stats = ( {
        template: require( './../views/stats.ract' ).template,
        oninit: function () {
            this.on( "openModal", ( event, target ) => {
                var $modal = $( "#" + target + "Date" ).modal( "show" );
                $modal.on( 'hidden.bs.modal', () => {
                    this.findComponent( "Modal" ).fire( "close" )
                } )
            } );
            this.on( "Modal.close", ( event, b ) => {
                this.getStats();
            } )
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
                    from: new Date( "Mon Dec 14 2015 20:16:51" ),
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
            },
            fromTimeStamp: {
                get: function () {
                    var t = this.get( "stats.from" );
                    return `${t.toISOString().slice(0, 10)} ${t.getHours()}:${t.getMinutes()}:0`;
                    //example format "2015-12-14 17:16:51"
                }
            },
            toTimeStamp: {
                get: function () {
                    var t = this.get( "stats.to" );
                    return `${t.toISOString().slice(0, 10)} ${t.getHours()}:${t.getMinutes()}:0`;
                    //"2015-12-14 17:16:51"
                }
            }
        },
        getStats: function () {
            return this.sendToDataBase( {
                data: {
                    from: this.get( "fromTimeStamp" ),
                    to: this.get( "toTimeStamp" )
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
module.exports = Base.extend( Stats );
