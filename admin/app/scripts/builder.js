var Builder = Base.extend( {
    oninit: function () {
        this.observe( "toppingsSelected", ( newVal, oldVal ) => {
            this.getCache( "toppingsSVG", ( a ) => {
                return new Promise( ( resolve, reject ) => {
                    this.sendToDataBase( {
                        type: "GET"
                    }, "toppingsSVG" ).then( JSON.parse, reject ).then( resolve );
                } );
            }, true, true ).then( ( resp ) => {
                return resp.forEach( ( cur ) => {
                    this.set( "toppingsSVG", $.extend( this.get( "toppingsSVG" ), this.makeObj( cur.title + cur.size, cur.svg ) ) );
                } );
            }, this.logger ).then( resp => {
                if ( oldVal && newVal && newVal.length > oldVal.length ) {
                    var x = newVal.filter( ( i ) => {
                            return oldVal.indexOf( i ) < 0;
                        } ).map( ( item ) => {
                            return [ this.makeObj( "svg.Anim" + item, 0 ),
                                this.makeObj( "svg.Anim" + item, 100 )
                            ];
                        } ),
                        options = {
                            easing: 'linear'
                        };
                    //here is passing in an object of keypath:value pairs into set and animate
                    var mapper = ( numero ) => {
                        return x.map( cur => {
                            return cur[ numero ];
                        } ).reduce( ( a, b ) => {
                            return $.extend( a || {}, b[ 1 ] );
                        } )
                    }
                    this.set( mapper( 0 ) );

                    this.animate( mapper( 1 ), options );
                }

                return resp;
            } );
        } );
        this.observe( "labels", ( newVal ) => {
            if ( !newVal ) {
                return;
            }
            this.getCache( newVal, ( a ) => {
                return this.sendToDataBase( {
                    type: "GET"
                }, newVal + "/sortBy/Name" );
            }, true ).then( ( obj ) => {
                var titles = [],
                    types = [
                        []
                    ];
                obj.forEach( ( obj ) => {
                    if ( titles.indexOf( obj.Title ) === -1 ) {
                        if ( obj.Title === "Size" ) {
                            titles.unshift( obj.Title );
                            types.unshift( [ obj.Name ] );
                        } else {
                            titles.push( obj.Title );
                            types[ titles.length - 1 ] = [ ( obj.Name ) ];
                        }
                    } else {
                        types[ titles.indexOf( obj.Title ) ].push( obj.Name );
                    }
                } );
                this.set( "headings", titles );
                this.set( "currentChoices", types.map( ( obj ) => {
                    return obj.slice( 0 ).fill( false );
                } ) );
                this.set( "types", types );

            }, ( err ) => {
                this.notify( "Error occured", err, 5000, "error" );
            } );
        } );
        this.on( "staged", ( event ) => {
            this.queue = this.get( "toppingsSelected" ).slice( 0 );
            this.queue.unshift( this.get( "curSize" ) );
            this.fire( "checkout", this.queue );
        } );
        this.on( "debugg", ( event, passed ) => {
            this.debugger( ( passed.split( ":" )[ 0 ] ) == "add" ? "up" : "down", parseInt( passed.split( ":" )[ 1 ] ) );
        } );
    },
    data: function () {
        return {
            labels: "pizzaHeadings",
            headings: [],
            types: [
                []
            ],
            currentChoices: [
                [],
                [],
                []
            ],
            sizes: [ 45, 37.5, 30 ],
            svg: {
                radius: 0,
                anim: 0,
                debug: 1
            },
            ani: function ( item, multiplier = 1 ) {
                return ( multiplier * ( ( this.get( "svg.Anim" + item ) || 100 ) / 100 ) );
            },
            toppingsSVG: {},
            dynamicSVG: function ( curSize, toppingsSelected ) {
                //http://jsfiddle.net/nperez0111/bcbyzv02/
                var s = curSize,
                    temp = "",
                    svgs = this.get( "toppingsSVG" ),
                    t = toppingsSelected,
                    part = t.slice( 0 ).sort().join( "" ) + s;
                if ( !s || !t || t.length == 0 ) {
                    this.partials[ "emptiness" ] = "";
                    return "emptiness";
                }
                if ( part in this.partials ) {
                    return part;
                }
                t.forEach( ( cur ) => {
                    var key = cur + s;
                    if ( key in svgs ) {
                        temp += "<g id='" + key + "' class='" + cur + "'>" + svgs[ key ] + "</g>";
                    }
                } );
                //console.log( "Size" + s + "<br>" + t.join( ", " ) + temp );
                this.partials[ part ] = temp;
                return part;
            }
        };
    },
    debugger: function ( direction = "up", amount = 1 ) {
        if ( direction == "up" ) {
            this.set( "svg.debug", this.get( "svg.debug" ) + amount );
        } else {
            this.set( "svg.debug", this.get( "svg.debug" ) - amount );
        }
        console.log( "At:", this.get( "svg.debug" ) );
    },
    queue: [],
    computed: {
        curSize: {
            get: function () {
                return this.get( 'types[0]' )[ ( this.get( 'currentChoices' ) || [
                    [ true ]
                ] )[ 0 ].indexOf( true ) || 0 ];
            },
            set: function ( a ) {
                this.set( {
                    types: a[ 0 ],
                    currentChoices: a[ 1 ]
                } );
            }
        },
        toppingsSelected: {
            get: function () {
                var currentSize = this.get( "currentChoices" )[ 0 ].indexOf( true );
                this.animate( "svg.radius", currentSize > -1 ? this.get( "sizes" )[ currentSize ] : 0 );
                return this.get( "currentChoices" ).length < 2 ? [] : this.get( "currentChoices" ).filter( ( cur, i, arr ) => {
                    return i !== 0;
                } ).map( ( arr, r ) => {
                    return arr.map( ( val, c ) => {
                        return val ? this.get( "types" )[ r + 1 ][ c ] : false;
                    } );
                } ).reduce( ( a, b ) => {
                    return a.concat( b );
                } ).filter( ( val ) => {
                    return val !== false;
                } );
            },
            set: function ( newArr ) {
                console.log( newArr );
                this.set( {
                    currentChoices: [ false, newArr[ 0 ] ],
                    types: newArr[ 1 ]
                } );
            }
        }
    }
} );
