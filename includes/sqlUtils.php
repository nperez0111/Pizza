<? PHP
//returns array for the spl executer and string with what is missing if the json obj does not have the property required
function buildJSONInput( $table, $JSON ) {
    $keys = buildIdentifiers( $table, true );
    $arr = [];
    for ( $i = 0; $i < count( $keys ); $i++ ) {
        if ( !isset( $JSON[ $keys[ $i ] ] ) ) {
            return $keys[ $i ];
        }
        $arr[ ":".$keys[ $i ] ] = $JSON[ $keys[ $i ] ];
    }
    return $arr;
}

function buildJSONInputWProps( $table, $JSON ) {
    $keys = buildprops( $table, true );
    $arr = [];
    for ( $i = 0; $i < count( $keys ); $i++ ) {
        if ( !isset( $JSON[ $keys[ $i ] ] ) ) {
            return $keys[ $i ];
        }
        $arr[ ":".$keys[ $i ] ] = $JSON[ $keys[ $i ] ];
    }
    return $arr;
} ?>
