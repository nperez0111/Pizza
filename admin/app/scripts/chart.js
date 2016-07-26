let Base = require( './base' ),
    Chart = ( {
        template: require( './../views/chart.ract' ).template,
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


            var $tooltip = $( '<div class="tooltip tooltip-hidden"></div>' ).appendTo( $( this.get( "selector" ) ) );

            [ "point", "bar" ].forEach( ( cur ) => {
                //http://jsbin.com/yihubuyaco/edit?css,js,output
                $( this.get( "selector" ) ).on( 'mouseenter', '.ct-' + cur, function () {
                    var value = $( this ).attr( 'ct:value' );

                    $tooltip.text( value );
                    $tooltip.removeClass( 'tooltip-hidden' );
                } );

                $( this.get( "selector" ) ).on( 'mouseleave', '.ct-' + cur, function () {
                    $tooltip.addClass( 'tooltip-hidden' );
                } );

                $( this.get( "selector" ) ).on( 'mousemove', '.ct-' + cur, function ( event ) {
                    $tooltip.css( {
                        left: ( event.offsetX || event.originalEvent.layerX ) - $tooltip.width() / 2,
                        top: ( event.offsetY || event.originalEvent.layerY ) - $tooltip.height() - 20
                    } );
                } );
            } );
            this.fire( "rerender" );
        },
        teardown: function () {
            $( this.get( "selector" ) ).off();
        },
        data: function () {
            return {
                instance: undefined,
                identifier: "chart",
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
                    showArea: false,
                    fullwidth: true,
                    axisY: {
                        onlyInteger: false
                    },
                    axisX: {
                        onlyInteger: true
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
        },
        setMaxMinVal: function ( low, high ) {
            this.set( "options.low", low );
            this.set( "options.high", high );
        }
    } );
module.exports = Base.extend( Chart );
