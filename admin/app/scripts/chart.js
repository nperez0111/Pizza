var Chart = Base.extend( {
    oninit: function () {
        this.observe( "identifier", ( newVal, oldVal ) => {
            if ( !newVal ) {
                return;
            }

        } );
        this.on( "rerender", () => {
            new Chartist.Bar( this.get( "selector" ), this.get( "data" ), this.get( "options" ), this.get( "responsiveOptions" ) );
        } );

    },
    data: function () {
        return {
            data: {
                labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
                series: [
                    [ 5, 4, 3, 7, 5, 10, 3, 4, 8, 10, 6, 8 ],
                    [ 3, 2, 9, 5, 4, 6, 4, 6, 7, 8, 7, 4 ]
                ]
            },
            options: {
                seriesBarDistance: 15
            },
            responsiveOptions: [
                [ 'screen and (min-width: 641px) and (max-width: 1024px)', {
                    seriesBarDistance: 10,
                    axisX: {
                        labelInterpolationFnc: function ( value ) {
                            return value;
                        }
                    }
                } ],
                [ 'screen and (max-width: 640px)', {
                    seriesBarDistance: 5,
                    axisX: {
                        labelInterpolationFnc: function ( value ) {
                            return value[ 0 ];
                        }
                    }
                } ]
            ]
        }
    },
    computed: {
        selector: {
            get: function () {
                return "." + this.get( "identifier" );
            }
        }
    }
} );
