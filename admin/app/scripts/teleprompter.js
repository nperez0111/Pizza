var Tele = Base.extend( {
    oninit: function () {
        this.getQuickOrders();
        this.on( 'order', function ( event ) {
            this.order( event );
        } );
        this.on( 'rmvqueue', function ( event ) {
            this.rmvqueue( event );
        } );
        this.on( 'build', function ( event ) {
            this.build( this.get( "type" )[ event.index.cur ].name );
        } );
        this.on( 'show', function ( event ) {
            $( $( event.node ).data( 'target' ) ).modal( "show" );
        } );
        this.on( 'checkout', function ( event ) {
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

        this.getCache( "priorities", function () {
            return new Promise( function ( resolve, reject ) {
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
                }, "join" ).then( function ( a ) {
                    resolve( JSON.stringify( JSON.parse( a ).map( function ( cur ) {
                        cur.Priority = parseInt( cur.Priority, 10 );
                        return cur;
                    } ) ) );
                }, function ( a ) {
                    reject( a );
                } );
            } );
        } );
        this.getCache( "settings", function () {
            return new Promise( function ( resolve, reject ) {
                that.sendToDataBase( {
                    type: "GET"
                }, "settings" ).then( JSON.parse, reject ).then( function ( ob ) {
                    resolve( JSON.stringify( ob.map( function ( cur ) {
                        var ret = {};
                        ret[ cur.keyKey ] = cur.val;
                        return ret;
                    } ).reduce( function ( prev, cur, index, arr ) {
                        $.extend( cur, prev );
                        return cur;
                    } ) ) );
                } );
            } );
        }, true ).then( function ( a ) {
            that.set( "cols", parseInt( a.columns, 10 ) );
            return a;
        } );
        this.getCache( "symbols", function () {
            return new Promise( function ( resolve, reject ) {
                that.sendToDataBase( {
                    type: "GET"
                }, "symbols" ).then( JSON.parse, reject ).then( function ( ret ) {
                    resolve( JSON.stringify( ret.map( function ( cur ) {
                        var ret = {};
                        ret[ cur.Name ] = cur.Symbol;
                        return ret;
                    } ).reduce( function ( prev, cur, index, arr ) {
                        $.extend( cur, prev );
                        return cur;
                    } ) ) );
                } );
            } );
        } );
    },
    keyBindings: [ 'shift+a' ],
    data: function () {
        return {
            cols: 2,
            queue: []
        };
        //TODO implement the default types with their settings
    },
    types: [ "Pizza", "Wings", "Salad", "Drink" ],
    getQuickOrders: function () {
        var obj = {},
            that = this,
            arr = this.types.filter( function ( a ) {
                return a.toLowerCase() !== 'drink'
            } );
        arr.forEach( function ( title ) {
            obj[ "quickOrders" + title ] = [ "Name" ];
        } );

        this.getCache( "types", function () {
            return that.sendToDataBase( {
                    type: "GET",
                    data: obj,
                },
                "columns" );
        }, true ).then( function ( ret ) {
            for ( var i = 0, l = arr.length; i < l; i++ ) {
                that.set( "type[" + i + "].quickOrders", ret[ "quickOrders" + arr[ i ] ][ 0 ] );
            }
            return arr;
        } );
    },
    order: function ( obj ) {
        var param = this.get( obj.keypath ),
            that = this,
            arry = this.types;
        this.sendToDataBase( {
            type: "GET"
        }, "quickOrders" + arry[ parseInt( obj.keypath.split( "." )[ 1 ], 10 ) ] + "/search/Name/" + param ).then( function ( object ) {
            var ob = JSON.parse( object )[ 0 ];
            that.getPrice( ob.Name ).then( function ( pri ) {
                that.stageOrder( $.extend( ob, {
                    Price: pri
                } ) );
            } );

        } );
    },
    placeOrder: function ( order ) {
        if ( this.get( "queue" ).length === 0 ) {
            this.notify( "Nothing to Order", "Queue is empty :<", 0, "error" );
            return false;
        }
        var that = this;
        return that.sendToDataBase( {
            type: "PUT",
            data: {
                OrderSymbols: order.map( function ( obj ) {
                    return that.sortOrder( obj.OrderName );
                } ).join( that.cache.settings.splitter )
            }
        }, "placeOrder" ).then( function ( message ) {
            that.notify( message, "Order Fulfilled : >" );
            that.set( "queue", [] );
        }, function ( message ) {
            that.notify( "Order Unsuccessful", "No Worries just retry to send the order, Check internet connection." );
        } );


    },
    getPrice: function ( order ) {
        return new Promise( function ( resolve, reject ) {
            resolve( order.length );
        } );
    },
    stageOrder: function ( order ) {
        var not = this.notify( 'Order of <span class="underline">' + order.Name + '</span> has been added successfully!', '<button class="btn btn-default rmv"><span class="glyphicon glyphicon-remove table-remove"></span>Remove Order</button>' ),
            that = this;
        $( '.rmv' ).click( function () {

            that.get( "queue" ).every( function ( obj, index, arr ) {
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
    },
    sortOrder: function ( order ) {
        //return order;
        var special = [ "SM", "MD", "LG" ];
        //console.log(this.cache.priorities);
        var arr = order.split( this.cache.settings.dbdelimiter ).sort( function ( a, b ) {
            if ( special.indexOf( a ) > -1 ) {
                return -1;
            } else {
                return 1;
            }
        } );
        this.logger( arr );
        return arr.join( this.cache.settings.dbdelimiter );
        //console.log(arr);
        /*/returns the order sorted correctly
        database = this.settings().delimiter;
        //the sort should be accessed from the database within the init method
        //this should access wherever that is stored and properly sort it correctly
        return order.split(database.delimiter).sort(function(a, b) {
            //this is totally just an I think ...
            return this.getPriority().indexOf(a) - this.getPriority().indexOf(b);
        });*/
    },
    mapNameToSymbols: function ( name ) {
        //http://stackoverflow.com/questions/4059147/check-if-a-variable-is-a-string
        if ( typeof name === 'string' || name instanceof String ) {
            name = name.split( that.settings.dbdelimiter );
        }
        var that = this;
        return name.map( function ( cur ) {
            return that.cache.symbols[ cur ] || false;
        } );
    },
    builder: {},
    build: function ( name ) {
        name = name.toLowerCase();
        var buildy, that = this;
        return $.ajax( {
            url: "views/builder.html",
            dataType: "html"
        } ).then( function ( template ) {
            buildy = new Builder( {
                // The `el` option can be a node, an ID, or a CSS selector.
                el: '#modal',
                template: template,
                inits: function () {
                    this.getLabels( name + "Headings" );
                    this.on( "checkout", function ( queue ) {
                        $( '#moduler' ).modal( 'hide' );
                        that.getPrice( queue.join( that.cache.settings.dbdelimiter ) ).then( function ( p ) {
                            that.stageOrder( {
                                Name: queue.join( that.cache.settings.dbdelimiter ),
                                OrderName: that.mapNameToSymbols( queue ),
                                Price: p
                            } );
                        } );
                    } );
                },
                // Here, we're passing in some initial data
                data: {

                }
            } );
            return buildy;
        }, function ( err ) {
            that.alerter( "Sorry, Issues loading template file..." );
            return Error( JSON.stringify( err ) );
        } ).then( function ( build ) {
            that.builder = build;
            $( '#moduler' ).modal( 'show' );
            return build;
        } );
    }
} );
