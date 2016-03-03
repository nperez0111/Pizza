var Tele = Base.extend( {
    oninit: function () {
        this.on( 'order', ( event ) => {
            this.order( event );
        } );
        this.on( 'rmvqueue', ( event ) => {
            this.rmvqueue( event );
        } );
        this.on( 'build', ( event ) => {
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
        var that = this;
        Mousetrap.bind( this.keyBindings[ 0 ], function () {
            that.placeOrder( that.get( "queue" ) );
        } );
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
        } ).then( ( resp ) => {
            return this.getQuickOrders();
        } ).then( ( quickOrders ) => {
            return this.getCache( "symbols", function () {
                return new Promise( ( resolve, reject ) => {
                    that.sendToDataBase( {
                        type: "GET"
                    }, "symbols" ).then( JSON.parse, reject ).then( ( ret ) => {
                        return ret.map( ( cur ) => {
                            return this.makeObj( cur.Name, cur.Symbol );
                        } ).reduce( ( prev, cur ) => {
                            $.extend( cur, prev );
                            return cur;
                        } );
                    } ).then( JSON.stringify ).then( resolve );
                } );
            }, true ).then( ( symbols ) => {
                this.getCache( "unavailableItems", function () {
                    return new Promise( ( resolve, reject ) => {
                        this.sendToDataBase( {
                            type: "GET"
                        }, "unavailableItems" ).then( JSON.parse, reject ).then( JSON.stringify ).then( resolve );
                    } );
                }, true ).then( ( resp ) => {
                    return resp.map( ( cur ) => {
                        return symbols[ cur.ingredient ];
                    } );
                } ).then( this.logger ).then( ( unavailableItems ) => {
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

        this.getCache( "priorities", function () {
            return new Promise( ( resolve, reject ) => {
                that.sendToDataBase( {
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
        } );
        this.getCache( "settings", function () {
            return new Promise( ( resolve, reject ) => {
                that.sendToDataBase( {
                    type: "GET"
                }, "settings" ).then( JSON.parse, reject ).then( ( ob ) => {
                    return ob.map( ( cur ) => {
                        return this.makeObj( cur.keyKey, cur.val );
                    } ).reduce( ( prev, cur, index, arr ) => {
                        $.extend( cur, prev );
                        return cur;
                    } );
                } ).then( JSON.stringify ).then( resolve );
            } );
        }, true ).then( ( a ) => {
            that.set( "cols", parseInt( a.columns, 10 ) );
            return a;
        } );


    },
    keyBindings: [ 'shift+a' ],
    data: function () {
        return {
            cols: 2,
            queue: [],
            type: [],
            unavailableItems: [],
            cur: "pizza"
        };
        //TODO implement the default types with their settings
    },
    unavailable: function ( a ) {
        console.log( this );
        this.logger( a );
        return true;
    },
    types: [ "Pizza", "Wings", "Salad", "Drink" ],
    buildYourOwn: [ true, true, true, false ],
    getQuickOrders: function () {
        var obj = {},
            that = this,
            b = this.buildYourOwn, //this.get( "buildYourOwn" ),
            arr = this.types.filter( ( a, i ) => {
                return b[ i ];
            } );
        arr.forEach( ( title ) => {
            obj[ "quickOrders" + title ] = [ "Name", "OrderName" ];
        } );
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
                        data: obj,
                    },
                    "columns" );
            }, true ).then( ( ret ) => {

                return Object.keys( ret ).map( ( quickOrders, r ) => {
                    return ret[ quickOrders ][ 0 ].map( ( cur, i ) => {
                        return this.makeObj( [ 'Name', 'OrderName' ], [ cur, ret[ quickOrders ][ 1 ][ i ] ] );
                    } );
                } );

            }, reject ).then( ( resp ) => {

                resp.forEach( ( cur, i ) => {
                    this.set( "type." + i + ".quickOrders", cur );
                } );

                return resp;
            } ).then( resolve );
        } );
    },
    order: function ( obj ) {
        var param = this.get( obj.keypath ),
            arry = this.types;

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
    getPrice: function ( order, isSymbol ) {
        var symboled = isSymbol ? order : this.mapNameToSymbols( order );
        this.logger( symboled );
        return this.getCache( symboled, () => {
            return new Promise( ( resolve, reject ) => {
                this.sendToDataBase( {
                    data: {
                        orderName: symboled
                    }
                }, "getPrice" ).then( JSON.parse, reject ).then( ( o ) => {
                    resolve( o[ 0 ] );
                } );
            } );
        }, false, true );
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
    },
    rmvqueue: function ( obj ) {
        return this.get( "queue" ).splice( obj.index.i, 1 );
    }
} );
