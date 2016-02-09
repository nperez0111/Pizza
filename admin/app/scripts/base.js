var Base = Ractive.extend( {
    //url: 'http://' + ( ( window.location.hostname.split( "." ).length ) === 2 ? "api." + ( window.location.hostname ) + "/" : ( window.location.hostname.split( "." ).length ) === 3 ? ( "api." + window.location.hostname.split( "." ).splice( 1, 2 ).join( "." ) + "/" ) : ( window.location.hostname + ':80' + '/pizza/api/v1/' ) ),
    url: "http://api.nickthesick.com/",
    alerter: function ( str, moreInfo ) {
        var other = ( str.str || str ) + "";
        moreInfo = ( ( moreInfo ) ? ( moreInfo.join ? moreInfo.join( "</p><p>" ) : moreInfo ) : "undefined" ) + "";
        if ( !str.el && ( $( '#alert' ).length === 0 ) ) {
            $( '#container' ).prepend( '<div id="alert" style="display:none" class="alert alert-danger"></div>' );
        }
        $( str.el || '#alert' ).html( "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><h3>" + ( other ? other : "" ) + "</h3>" + ( moreInfo === 'undefined' ? "" : "<p>" + moreInfo + "</p>" ) + "<p>Check internet connection Or <a href='mailto:nperez0111@gmail.com'>Contact Support.</a></p>" ).fadeIn().slideDown();
        $( "a[data-dismiss='alert']" ).click( function () {
            $( "#alert" ).alert( "close" );
        } );
        return true;
    },
    notifications: [],
    notify: function ( title, message, time, typely ) {
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
                template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-minimalist alert-minimalist-{0}" role="alert">' +
                    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button><img data-notify="icon" class="img-circle pull-left">' +
                    '<span data-notify="title">{1}</span>' +
                    '<span data-notify="message">{2}</span>' +
                    '</div>'
            } );
        this.notifications.push( not );
        return not;
    },
    sendToDataBase: function ( obj, urlEx ) {
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
    cache: {},
    getCache: function ( prop, func, isPromise, isNotJSON ) {
        if ( prop in this.cache || ( localStorage.getItem( prop ) ) ) {
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
            this.notify( "Error occured", err, 1000, "error" );
        } );

    },
    onClose: function () {
        return this;
    },
    keyBindings: [],
    unrender: function ( apply ) {
        $( "#alert" ).alert( 'close' );
        var that = this.onClose();
        that.notifications.forEach( ( a ) => {
            a.close();
        } );
        that.notifications = [];
        Mousetrap.unbind( that.keyBindings );
    },
    logger: function ( a, warning ) {
        if ( true ) {
            if ( warning ) {
                console.warn( a );
            } else {
                console.log( a );
            }
        }
        return a;
    },
    debounce: ( t, r ) => {
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
