var Builder = Base.extend( {
    oninit: function () {
        this.observe( "currentChoices", ( newVal, oldVal, obj ) => {
            var currentSize = this.size();
            this.set( 'curSize', this.get( 'types[0]' )[ ( this.get( 'currentChoices' ) || [
                [ true ]
            ] )[ 0 ].indexOf( true ) || 0 ] );
            this.set( "toppingsSelected", this.get( "currentChoices" ).length < 2 ? [] : this.get( "currentChoices" ).filter( ( cur, i, arr ) => {
                return i !== 0;
            } ).map( ( arr, r ) => {
                return arr.map( ( val, c ) => {
                    return val ? this.get( "types" )[ r + 1 ][ c ] : false;
                } );
            } ).reduce( ( a, b ) => {
                return a.concat( b );
            } ).filter( ( val ) => {
                return val !== false;
            } ) );
        } );
        this.observe( "toppingsSelected", ( newVal ) => {
            this.getCache( "toppingsSVG", ( a ) => {
                return new Promise( ( resolve, reject ) => {
                    this.sendToDataBase( {
                        type: "GET"
                    }, "toppingsSVG" ).then( JSON.parse, reject ).then( resolve );
                } );
            }, true, true ).then( ( resp ) => {
                var obj = {},
                    data = this.get( "svg" );
                resp.forEach( ( cur ) => {
                    var temp = new Ractive( {
                        data: data,
                        template: cur.svg
                    } );
                    obj[ cur.title + cur.size ] = temp.toHTML();
                } );
                return obj;
            }, this.logger ).then( resp => {
                this.set( "toppingsSVG", resp );
                return resp;
            } );
        } );
        this.on( "staged", ( event ) => {
            this.queue = this.get( "toppingsSelected" ).slice( 0 );
            this.queue.unshift( this.get( "types" )[ 0 ][ this.get( "currentChoices" )[ 0 ].indexOf( true ) ] );
            this.fire( "checkout", this.queue );
        } );
        this.inits.call( this );
    },
    inits: function () {
        this.getLabels( "pizzaHeadings" );
    },
    data: function () {
        return {
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
                radius: 0
            },
            toppingsSelected: [],
            toppingsSVG: [],
            curSize: ''
        };
    },
    queue: [],
    size: function () {
        var currentSize = this.get( "currentChoices[0]" ).indexOf( true ),
            possibleSizes = this.get( "sizes" );
        this.animate( "svg.radius", currentSize > -1 ? possibleSizes[ currentSize ] : 0 );
        return currentSize;
    },
    getLabels: function ( urlEx ) {
        var that = this;
        this.getCache( urlEx, function () {
            return that.sendToDataBase( {
                type: "GET"
            }, urlEx + "/sortBy/Name" );
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
            that.set( "headings", titles );
            that.set( "currentChoices", types.map( ( obj ) => {
                return obj.slice( 0 ).fill( false );
            } ) );
            that.set( "types", types );

        }, ( err ) => {
            that.notify( "Error occured", err, 5000, "error" );
        } );
    }
} );
