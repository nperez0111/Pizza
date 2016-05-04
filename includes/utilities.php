<?PHP

function rest_success( $data ) {
    http_response_code( 200 );
    echo json_encode( [ 'status' => "OK", 'message' => $data ] );
}

function rest_error( $error, $errorCode ) {
    http_response_code( $errorCode );
    echo json_encode( [ "status" => "ERROR", "data" => $error, "Solution" => "Check http request type, Check Credentials, Check URL parameters" ] );
    return;
}

function checkTableReqs( $table, & $JSON ) {
    global $routes;
    switch ( $table ) {
        case "users":
            if ( isset( $JSON[ 'password' ] ) ) {
                $JSON[ 'password' ] = create_hash( $JSON[ 'password' ] );
                //rest_error("Mal-Formed JSON please read Documentation, missing 'password' property",400);
                //return false;
            }
            //echo json_encode($JSON);
            break;
    }
    foreach( $routes[ $table ][ 'identifiers' ] as $val ) {
        if ( !isset( $JSON[ $val ] ) ) {
            rest_error( "Mal-Formed JSON please read Documentation, missing '".$val.
                "' property", 400 );
            return false;
        }
    }
    return true;
}

function isMethodAllowed( $table, $accessor ) {
    global $routes;
    if ( isAdmin() ) {
        return true;
    }
    $i = array_search( $accessor, [ "GET", "POST", "PUT", "DELETE" ] ) || -1;
    if ( $i == -1 ) {
        return false;
    }
    return @$routes[ $table ][ 'methods' ][ $i ] == 1 ? true : false;
}

function isIdentifier( $table, $test ) {
    global $routes;
    if ( isset( $routes[ $table ] ) == false ) {
        return false;
    }
    return array_search( $test, $routes[ $table ][ 'identifiers' ] ) !== false;
}

function isInside( $arr, $val, $searchFor ) {
    return array_search( $searchFor, $arr[ $x ][ $val ] ) || -1;
}

//true for props in array format false for comma delimited string
function buildProps( $table, $bool ) {
    global $routes;
    return $bool ? $routes[ $table ][ 'props' ] : implode( ",", $routes[ $table ][ 'props' ] );
}

function buildIdentifiers( $table, $bool ) {
    global $routes;
    return $bool ? $routes[ $table ][ 'identifiers' ] : implode( ",", $routes[ $table ][ 'identifiers' ] );
}

?>
