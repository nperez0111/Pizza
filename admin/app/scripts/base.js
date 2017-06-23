window.Ractive = require( 'ractive/ractive.min' );
let Base = Ractive.extend( {
            url: 'http://' + ( ( window.location.hostname.split( "." ).length ) === 2 ? "api." + ( window.location.hostname ) + "/" : ( window.location.hostname.split( "." ).length ) === 3 ? ( "api." + window.location.hostname.split( "." ).splice( 1, 2 ).join( "." ) + "/" ) : ( window.location.hostname + ':80' + '/pizza/api/v1/' ) ),
            //url: "http://api.joeshonestpizza.com/",
            alerter: function ( str, moreInfo ) {
                    var other = ( str.str || str ) + "";
                    moreInfo = ( ( moreInfo ) ? ( moreInfo.join ? moreInfo.join( "</p><p>" ) : moreInfo ) : "undefined" ) + "";
                    if ( !str.el && ( $( '#alert' ).length === 0 ) ) {
                        $( '#container' ).prepend( '<div id="alert" style="display:none" class="alert alert-danger"></div>' );
                    }
                    $( str.el || '#alert' ).html( `<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><h3>${( other ? other : "" )}</h3>${( moreInfo === 'undefined' ? "" : `<p> ${moreInfo}</p>` ) }<p>Check internet connection Or <a href='mailto:nperez0111@gmail.com'>Contact Support.</a></p>` ).fadeIn().slideDown();
        $( "a[data-dismiss='alert']" ).click( function () {
            $( "#alert" ).alert( "close" );
        } );
        return true;
    },
    notifications: [],
    notify( title, message, time, typely ) {
        var that = this,
            not = $.notify( {
                title: ( typely && typely === "error" ? '<span class="glyphicon glyphicon-warning-sign"></span> ' + title : title ),
                message: message
            }, {
                type: typely || '',
                delay: ( time || 0 ) + 4000,
                placement: {
                    from: "bottom",
                    align: "right"
                },
                template: `
                <div data-notify="container" class="col-xs-11 col-sm-3 alert alert-minimalist alert-minimalist-{0}" role="alert">
                    <button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button><img data-notify="icon" class="img-circle pull-left">
                    <span data-notify="title">{1}</span>
                    <span data-notify="message">{2}</span>
                </div>`
            } );
        this.notifications.push( not );
        return not;
    },
    sendToDataBase ( obj, urlEx ) {
        obj = $.extend( {
            type: "GET",
            dataType: "json",
            url: this.url + ( urlEx || "" ),
            headers: {
                Authorization: "Basic " + btoa( "nick@nickthesick.com" + ':' + "0046788285" )
            }
        }, obj );
        obj.data = $.extend( {
            login: {
                Email: "nick@nickthesick.com",
                password: "0046788285"
            }
        }, obj.data );
        if ( obj.type.valueOf() === "POST" ) {
            obj.data = JSON.stringify( obj.data );
        }
        var that = this;
        return new Promise( ( resolve, reject ) => {
            $.ajax( obj ).then( ( r ) => {
                resolve( ( r.message ) );
            }, ( err ) => {
                console.group( "DataBase Error, '%s'ing '%s'", obj.type.toLowerCase(), urlEx );
                that.logger( err.responseText ? err.responseText : err, true );
                that.logger( obj, true );
                console.groupEnd();
                reject( err.responseText ? JSON.parse( err.responseText ).data : JSON.stringify( err ) );
            } );
        } );
    },
    parseTime( a ) {
        return a.split( " " )[ 0 ].split( "-" ).map(
            function ( q ) {
                return ( parseInt( q, 10 ) );
            } ).concat( a.split( " " )[ 1 ].split( ":" ).map(
            function ( q ) {
                return ( parseInt( q, 10 ) );
            } ) );
    },
    cache: {},
    loadDeps() {
        var that = this;
        return Promise.all( [ this.getCache( "symbols", function () {
                return new Promise( ( resolve, reject ) => {
                    that.sendToDataBase( {
                        type: "GET"
                    }, "symbols" ).then( JSON.parse, reject ).then( ( ret ) => ret.map( ( cur ) => this.makeObj( cur.Name, cur.Symbol ) ).reduce( ( prev, cur ) => $.extend( cur, prev ) ) ).then( JSON.stringify ).then( resolve );
                } );
            }, true ),
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
            } )
        ].concat( this.deps.map( dep => {
            return this.getCache( dep[ 0 ], dep[ 1 ], true );
        } ) ) );
    },
    deps: [],
    getCache( prop, func, isPromise, isNotJSON ) {
        if ( prop in this.cache || ( localStorage && localStorage.getItem( prop ) ) ) {
            if ( localStorage && localStorage.getItem( prop ) ) {
                this.cache[ prop ] = isNotJSON ? localStorage.getItem( prop ) : JSON.parse( localStorage.getItem( prop ) );
            }
            return isPromise ? Promise.resolve( this.cache[ prop ] ) : this.cache[ prop ];
        }
        if ( !( func instanceof Function ) ) {
            this.logger( prop + " not cached yet!" );
            return Promise.reject( prop );
        }
        return func.call( this ).then( ( obj ) => {
            this.cache[ prop ] = isNotJSON ? obj : JSON.parse( obj );
            if ( false && localStorage ) {
                localStorage.setItem( prop, obj );
            }
            return this.cache[ prop ];
        }, ( err ) => {
            this.logger( err, true );
            throw err;
        } );

    },
    sortOrder( order ) {
        //return order;
        var arr = order.split( this.cache.settings.dbdelimiter ).sort( ( a, b ) => {

            return this.cache.priorities.indexOf( a ) - this.cache.priorities.indexOf( b );

        } );
        this.logger( arr );
        return arr.join( this.cache.settings.dbdelimiter );
        //returns the order sorted correctly
        //the sort should be accessed from the database within the init method
        //this should access wherever that is stored and properly sort it correctly

    },
    toArray ( possibleStr ) {
        //http://stackoverflow.com/questions/4059147/check-if-a-variable-is-a-string
        return ( typeof possibleStr === 'string' || possibleStr instanceof String ) ? possibleStr.split( this.cache.settings.dbdelimiter ) : possibleStr;

    },
    mapNameToSymbols( name, reverse ) {
        name = this.toArray( name );
        return name.map( ( cur ) => {
            var ingredients = this.cache.symbols[ cur ];
            if ( reverse ) {
                Object.keys( this.cache.symbols ).forEach( ( key ) => {
                    if ( this.cache.symbols[ key ] == cur ) {
                        ingredients = key;
                    }
                } );
            }
            if ( ingredients ) {
                return ingredients;
            }
            this.errorMessage( cur + ": Was not found" );
            return false;
        } ).join( this.cache.settings.dbdelimiter );
    },
    getPrice( order, isSymbol ) {
        var symboled = isSymbol ? order : this.mapNameToSymbols( order );
        this.logger( symboled );
        return this.getCache( isSymbol ? symboled : symboled.join( " " ), () => {
            return new Promise( ( resolve, reject ) => {
                this.sendToDataBase( {
                    data: {
                        orderName: symboled
                    }
                }, "getPrice" ).then( JSON.parse, reject ).then( ( o ) => {
                    resolve( o ? o[ 0 ] : null );
                } );
            } );
        }, true, true );
    },
    onClose() {
        return this;
    },
    keyBindings: [],
    unrender( apply ) {
        $( "#alert" ).alert( 'close' );
        var that = this.onClose();
        that.notifications.forEach( ( a ) => {
            a.close();
        } );
        that.notifications = [];
        Mousetrap.unbind( that.keyBindings );
    },
    logger( a, warning ) {
        if ( /unminified/.test( function () { /*unminified*/ } ) ) {
            if ( warning ) {
                console.warn( a );
            } else {
                console.trace( a );
            }
        }
        return a;
    },
    pick( obj, prop ) {
        if ( Array.isArray( prop ) ) {
            var ret = {};
            prop.forEach( ( cur, i, arr ) => {
                ret[ prop ] = obj[ prop ];
            } );
            return ret;
        }
        return obj[ prop ];
    },
    makeObj( keys, values ) {
        var ret = {};
        if ( Array.isArray( keys ) && Array.isArray( values ) ) {
            keys.forEach( ( cur, i ) => {
                ret[ cur ] = values[ i ];
            } );

        } else {
            ret[ keys ] = values;
        }
        return ret;
    },
    toggle( keypath ) {
        this.set( keypath, !this.get( keypath ) );
    },
    ifPassesDo( arr, condition, doer ) {

        return arr.map( function ( cur, i ) {
            return condition( cur, i ) ? doer( cur, i ) : cur;
        } );

    },
    iterateOver( obj, doThat ) {
        Object.keys( obj ).forEach( function ( cur, i ) {
            doThat( obj[ cur ], cur, obj );
        } );
        return Object.keys( obj );
    },
    sequence() {
        return this.compose.apply( this, Array.from( arguments ).reverse() );
    },
    compose() {
        var fns = arguments;

        return function ( result ) {
            for ( var i = fns.length - 1; i > -1; i-- ) {
                result = fns[ i ].call( this, result );
            }

            return result;
        };
    },
    errorMessage( err ) {
        console.log( err );
        console.log( this );
        this.notify( "Error occured", err, 5000, "error" );
        throw err;
        return err;
    },
    debounce( t, r ){
        var e = null;
        return function () {
            var n = this,
                o = arguments;
            clearTimeout( e ), e = setTimeout( function () {
                t.apply( n, o )
            }, r )
        }
    }
} );
module.exports = Base;
export {
    Base
};
