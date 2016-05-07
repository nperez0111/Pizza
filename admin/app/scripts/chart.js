var Chart = Base.extend( {
    oninit: function () {

        this.observe( "chartType", ( newVal, oldVal ) => {
            if ( newVal && ( newVal !== oldVal ) ) {
                this.fire( "rerender" );
            }
        } )
        this.on( "rerender", () => {
            this.set( "instance", new Chartist[ this.get( "chartType" ) ]( this.get( "selector" ), this.get( "data" ), this.get( "options" ), this.get( "responsiveOptions" ) ) );
        } );
    },
    onrender: function () {
        this.fire( "rerender" );
    },
    data: function () {
        return {
            instance: undefined,
            chartType: "Line",
            chartTypes: [ "Bar", "Line" ],
            data: {
                labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
                series: [
                    [ 5, 4, 3, 7, 5, 10, 3, 4, 8, 10, 6, 8 ],
                    [ 3, 2, 9, 5, 4, 6, 4, 6, 7, 8, 7, 4 ]
                ]
            },
            options: {
                seriesBarDistance: 15,
                low: 0,
                high: 10,
                showArea: false,
                fullwidth: true,
                axisY: {
                    onlyInteger: false,
                    title: ""
                },
                axisX: {
                    onlyInteger: true,
                    title: ""
                }
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
    },
    toggleOption: function ( keypath ) {
        this.toggle( "options." + keypath );
    }
} );
