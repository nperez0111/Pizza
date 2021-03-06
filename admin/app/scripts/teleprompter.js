let Base = require( './base' ),
    Tele = ( {
        template: require( './../views/tele.ract' ).template,
        oninit: function () {
            this.on( 'order', ( event ) => {
                this.order( event );
            } );
            this.on( 'rmvqueue', ( event ) => {
                this.get( "queue" ).splice( event.index.i, 1 );
            } );
            this.on( 'build', ( event, a ) => {
                console.log( event, a );
                //this.build( this.get( "type" )[ event.index.cur ].name );
                this.set( "cur", this.get( "type" )[ event.index.cur ].name.toLowerCase() );
                $( '#moduler' ).modal( 'show' );
            } );
            this.on( 'show', ( event ) => {
                $( $( event.node ).data( 'target' ) ).modal( "show" );
            } );
            this.on( "Builder.checkout", ( queue ) => {
                $( '#moduler' ).modal( 'hide' );
                this.getPrice( queue.join( this.cache.settings.dbdelimiter ) ).then( function ( p ) {
                    this.stageOrder( {
                        Name: queue.join( this.cache.settings.dbdelimiter ),
                        OrderName: this.mapNameToSymbols( queue ),
                        Price: p
                    } );
                } );
            } );
            this.on( 'checkout', ( event ) => {
                if ( this.get( "queue" ).length === 0 ) {
                    //nothing in queue to order
                    return false;
                }

                this.placeOrder( this.get( "queue" ) );
            } );
            this.on( 'Modal.close', ( event ) => {
                var b = this.findComponent( "Builder" );
                b.set( "currentChoices", b.get( "currentChoices" ).map( ( cur ) => cur.fill( false ) ) );
            } );
            var that = this;
            Mousetrap.bind( this.keyBindings[ 0 ], function () {
                that.placeOrder( that.get( "queue" ) );
            } );
            this.loadDeps();


        },
        deps: [
            [ "priorities", function () {
                return new Promise( ( resolve, reject ) => {
                    this.sendToDataBase( {
                        type: "GET",
                        data: {
                            tables: [ "symbols" ],
                            from: "ingredients",
                            relations: [
                                [ "symbols.Name", "ingredients.Symbol" ]
                            ],
                            select: [ "symbols.Symbol", "symbols.Name", "ingredients.Priority" ]
                        }
                    }, "join" ).then( JSON.parse, reject ).then( ( resp ) => {
                        return resp.map( ( cur ) => {
                            cur.Priority = parseInt( cur.Priority, 10 );
                            return cur;
                        } );
                    } ).then( JSON.stringify ).then( resolve );
                } );
            } ]
        ],
        keyBindings: [ 'shift+a' ],
        data: function () {
            var that = this;
            this.getCache( "teleSettings", function () {
                return that.sendToDataBase( {
                    type: "GET"
                }, "teleSettings/sortBy/build/DESC" );
            }, true ).then( ( resp ) => {
                resp.forEach( ( cur, i ) => {
                    this.set( "type." + i, {
                        name: cur.suffix,
                        quickOrders: [],
                        buildYourOwn: parseInt( cur.build, 10 ) == 1 ? true : false
                    } );
                } );
                return resp.map( cur => cur.suffix );
            } ).then( ( resp ) => {
                this.set( "titles", resp );
                var that = this;
                return new Promise( ( resolve, reject ) => {
                    this.getCache( "quickOrdersDrink", function () {
                        return that.sendToDataBase( {
                            type: "GET"
                        }, "quickOrdersDrink" );
                    }, true ).then( ( resp ) => {
                        this.set( "type.3.quickOrders", resp );
                        return resp;
                    } );
                    this.getCache( "types", function () {
                        return that.sendToDataBase( {
                                type: "GET",
                                data: [ {} ].concat( resp.filter( ( a, i ) => {
                                    return this.buildYourOwn[ i ];
                                } ) ).reduce( ( a, b, i ) => {
                                    return $.extend( a, this.makeObj( "quickOrders" + b, [ "Name", "OrderName" ] ) );
                                } ),
                            },
                            "columns" );
                    }, true ).then( ( ret ) => Object.keys( ret ).map( ( quickOrders, r ) => ret[ quickOrders ][ 0 ].map( ( cur, i ) => this.makeObj( [ 'Name', 'OrderName' ], [ cur, ret[ quickOrders ][ 1 ][ i ] ] ) ) ), reject ).then( ( resp ) => {

                        resp.forEach( ( cur, i ) => {
                            this.set( "type." + i + ".quickOrders", cur );
                        } );

                        return resp;
                    } ).then( resolve );
                } );
            } ).then( ( quickOrders ) => {
                return this.getCache( "symbols", function () {
                    return new Promise( ( resolve, reject ) => {
                        that.sendToDataBase( {
                            type: "GET"
                        }, "symbols" ).then( JSON.parse, reject ).then( ( ret ) => ret.map( ( cur ) => this.makeObj( cur.Name, cur.Symbol ) ).reduce( ( prev, cur ) => $.extend( cur, prev ) ) ).then( JSON.stringify ).then( resolve );
                    } );
                }, true ).then( ( symbols ) => {
                    return this.sendToDataBase( {
                        type: "GET"
                    }, "unavailableItems" ).then( JSON.parse ).then( ( resp ) => resp.map( ( cur ) => symbols[ cur.ingredient ] ) ).then( ( unavailableItems ) => {
                        this.set( "unavailableItems", unavailableItems );
                        return unavailableItems;
                    } ).then( ( unavailableItems ) => {
                        var type = this.get( "type" ),
                            haveInCommon = ( arr, arry ) => {
                                var bool = false;
                                arry.forEach( inavail => {
                                    arr.forEach( cur => {
                                        if ( inavail == cur ) {
                                            bool = true;
                                        }
                                    } );
                                } );
                                return bool;
                            };
                        type.forEach( ( cur, r ) => {
                            cur.quickOrders.forEach( ( item, c ) => {
                                if ( haveInCommon( unavailableItems, this.toArray( item.OrderName ) ) ) {
                                    this.set( "type." + r + ".quickOrders." + c, $.extend( item, {
                                        isUnavailable: true
                                    } ) );
                                }

                            } );
                        } );
                    } );
                } );
            } );
            return {
                cols: 2,
                queue: [],
                type: [],
                titles: [],
                unavailableItems: [],
                cur: "pizza"
            };
            //TODO implement the default types with their settings
        },
        computed: {
            lowerTitles: {
                get: function () {
                    return this.get( "titles" ).map( cur => {
                        return cur.slice( 0, 1 ).toLowerCase() + cur.slice( 1 );
                    } )
                }
            }
        },
        buildYourOwn: [ true, true, true, false ],
        order: function ( obj ) {
            var param = this.get( obj.keypath ),
                arry = this.get( "titles" );

            this.getPrice( param.OrderName, true ).then( ( pri ) => {
                this.stageOrder( $.extend( param, {
                    Price: pri
                } ) );
                return pri;
            }, ( err ) => {
                this.errorMessage( "'" + param.Name + "' was not added to the checkout." )
            } );
        },
        placeOrder: function ( order ) {
            if ( this.get( "queue" ).length === 0 ) {
                this.notify( "Nothing to Order", "Queue is empty :<", 0, "error" );
                return false;
            }
            return this.sendToDataBase( {
                type: "PUT",
                data: {
                    OrderSymbols: order.map( ( obj ) => {
                        return this.sortOrder( obj.OrderName );
                    } ).join( this.cache.settings.splitter )
                }
            }, "placeOrder" ).then( ( message ) => {
                this.notify( message, "Order Fulfilled : >" );
                this.set( "queue", [] );
            }, ( message ) => {
                this.notify( "Order Unsuccessful", "No Worries just retry to send the order, Maybe check internet connection." );
                throw message;
            } );


        },
        stageOrder: function ( order ) {
            var not = this.notify( 'Order of <span class="underline">' + order.Name + '</span> has been added successfully!', '<button class="btn btn-default rmv"><span class="glyphicon glyphicon-remove table-remove"></span>Remove Order</button>' ),
                that = this;
            $( '.rmv' ).click( function () {

                that.get( "queue" ).every( ( obj, index, arr ) => {
                    if ( obj.Name === order.Name ) {
                        arr.splice( index, 1 );
                        not.close();
                        return false;
                    }
                    return true;
                } );
            } );
            return this.get( 'queue' ).push( order );
        }
    } );
module.exports = Base.extend( Tele );
