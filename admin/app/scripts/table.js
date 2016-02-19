var Table = Base.extend( {

    oninit: function ( options ) {
        //add the on handlers
        this.on( 'add', ( event ) => {
            this.add( event );
        } );
        this.on( 'edit', ( event ) => {
            this.edit( event );
        } );
        this.on( 'revert', ( event ) => {
            this.revert( event );
        } );
        this.on( 'delete', ( event ) => {
            this.delete( event );
        } );
        this.on( 'save', ( event ) => {
            this.save( event );
        } );
        this.observe( "table", ( newVal, oldVal, obj ) => {
            this.switchTable( {
                type: 'GET',
            }, newVal );
        } );

        var that = this,
            list = this.keyBindings,
            functions = [ "save", "revert", "delete" ];
        Mousetrap.bind( list, ( e, combo ) => {
            if ( e.preventDefault ) {
                e.preventDefault();
            } else {
                // internet explorer
                e.returnValue = false;
            }
            that[ functions[ list.indexOf( combo ) ] ]( {
                index: {
                    r: that.get( "editing.cur" )
                }
            } );

            return false;
        } );

    },
    keyBindings: [ "ctrl+s", "ctrl+z", "ctrl+d" ],
    add: function ( obj ) {
        var itemToAdd = this.get( 'add' ),
            missing = false;

        $( obj.node ).html( "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> Loading..." );

        $( obj.el || 'th .input-group' ).each( function ( i ) {
            if ( itemToAdd.length < i || !itemToAdd[ i ] ) {
                $( this ).addClass( "has-error" );
                $( this ).find( 'input' ).focus();
                missing = true;
            } else {
                $( this ).removeClass( "has-error" );
            }
            if ( i === 0 ) {
                $( this ).find( 'input' ).focus();
            }
        } );
        if ( missing ) {
            $( obj.node ).html( '<span class="glyphicon glyphicon-floppy-saved"></span> Add' );
            return false;
        }
        this.set( "add", [] );
        this.get( 'data' ).push( itemToAdd );
        var that = this;
        return this.sendToDataBase( {
            type: "PUT",
            data: this.makeObj( this.get( 'rows' ), itemToAdd )
        }, this.get( "table" ) + '/' ).then( ( o ) => {

            $( obj.node ).html( '<span class="glyphicon glyphicon-floppy-saved"></span> Add' );
            return o;
        }, ( a ) => {
            that.get( 'data' ).splice( that.get( 'data' ).length - 1, 1 );
            $( obj.node ).html( '<span class="glyphicon glyphicon-floppy-saved"></span> Add' );
            that.errorMessage( a );
            throw a;
        } ).then( ( message ) => {
            that.notify( message, "Table Row added!" );
        } );
    },
    edit: function ( e ) {
        var row = e.index.r,
            col = e.index.c,
            preEdit = e.context;
        if ( this.get( "editing.notAllowed" )[ col ] ) {
            return false;
        }
        if ( !this.get( "editing.past" )[ row ] ) {
            this.set( "editing.past." + row, this.get( "data[" + row + "]" ) );
        }
        this.set( "editing.cur", row );
        return true;
    },
    revert: function ( obj ) {
        this.set( "editing.cur", -1 );
        var prev = this.get( "editing.past" ),
            row = obj.index.r,
            cur = $( $( $( obj.el || "tbody tr" ).get( row ) ).find( "td" ) ),
            to = this.get( "data[" + row + "]" );

        delete prev[ row ];
        this.set( "editing.past", prev );
        cur.each( function ( i ) {
            if ( $( this ).text() !== ( to[ i ] + "" ) ) {
                $( this ).text( to[ i ] );
            }
        } );
        this.notify( "Changes not saved", "All changes have been reverted." );
        return true;
    },
    delete: function ( obj ) {
        var rowOfDeletion = this.get( "data" ).splice( obj.index.r, 1 )[ 0 ],
            that = this;

        this.sendToDataBase( {
            type: "DELETE"
        }, this.get( 'table' ) + "/" + rowOfDeletion[ this.get( 'editing.notAllowed' ).indexOf( true ) ] ).then( function ( message ) {
            that.notify( "Delete went well!", message );
        }, that.errorMessage );
        return rowOfDeletion;
    },
    save: function ( obj ) {
        this.set( "editing.cur", -1 );
        var row = obj.index.r,
            previous = this.get( "editing.past" ),
            data = this.get( "data" ),
            cur = $( $( $( obj.el || "tbody tr" ).get( row ) ).find( "td" ) ),
            arr = [],
            flag = true,
            that = this; //assume they are the same

        cur.each( function ( i ) {
            if ( i < previous[ row ].length ) {
                arr.push( $( this ).text() );
                if ( $( this ).text() !== ( previous[ row ][ i ] ) + "" ) {
                    flag = false;
                    $( this ).removeClass( "missing" );
                    //they are different
                    if ( $( this ).text() === "" ) {
                        $( this ).addClass( "missing" );
                        flag = true;
                        return false;
                        //not getting away with nothing mister
                    }
                }
            }
        } );

        if ( !flag ) {
            //send to database to update val
            var that = this;
            that.logger( this.makeObj( this.get( 'rows' ), arr ) );
            this.sendToDataBase( {
                type: "POST",
                data: this.makeObj( this.get( 'rows' ), arr )
            }, this.get( "table" ) + "/" + previous[ row ][ this.get( 'editing.notAllowed' ).indexOf( true ) ] ).then( ( message ) => {
                that.notify( "Changes Saved!", message );
                return message;
            }, that.errorMessage );
        } else {
            //are the same do nothing
            return false;
        }
        delete previous[ row ];
        this.set( "editing.past", previous );
        return true;
        //find a way of tracking what has even been edited
    },

    moveTo: function ( from, to ) {
        if ( from !== parseInt( from, 10 ) || to !== parseInt( to, 10 ) ) {
            return false;
        }
        if ( from > to ) {
            from = from + to;
            to = from - to;
            from = from - to;
        }
        var data = this.get( "data" ),
            x = data.splice( from, 1 ),
            y = data.splice( to - 1, 1 );
        data.splice( from, 0, y[ 0 ] );
        data.splice( to, 0, x[ 0 ] );
        return true;
    },
    switchTable: function ( obj, str ) {


        return this.sendToDataBase( obj, str ).then( JSON.parse, ( err ) => {
            this.alerter( "Sorry, Issues loading Table Data from API.." );
            return Error( JSON.stringify( err ) );
        } ).then( ( objs ) => {

            var arr = objs.map( ( cur ) => {
                return Object.keys( cur ).map( ( key ) => {
                    return ( cur[ key ] );
                } );
            } );

            this.set( "data", arr.map( ( row ) => {
                return row.map( ( col ) => {
                    return col == "" ? " " : col;
                } );
            } ) );

            this.set( "rows", Object.keys( objs[ 0 ] ) );

            return arr;

        } ).then( ( data ) => {
            var tabler = this.get( "table" ),
                val = this.getCache( "tablesInfo" + tabler, ( a ) => {
                    return new Promise( ( resolve, reject ) => {
                        this.sendToDataBase( {
                            type: "GET"
                        }, ( "tablesInfo/search/tableName/" + tabler ) ).then( ( response ) => {
                            return JSON.parse( response )[ 0 ];
                        }, ( err ) => {
                            this.notify( "Table Missing", "This may not be a valid table according to DataBase!" );
                            reject( err );
                            return ( err );

                        } ).then( resolve );
                    } );
                }, true, true ).then( ( response ) => {

                    this.set( "editing.notAllowed", JSON.parse( response.primaryKeyArr ) );
                    this.set( "description", response.description );

                    return response;
                } );

            return data;
        } );
    }
} );
