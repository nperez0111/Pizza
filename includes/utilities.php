<?PHP

function rest_success( $data ) {
    http_response_code( 200 );
    echo json_encode( ['status'=>"OK", 'message'=>$data] );
}

function rest_error( $error, $errorCode ) {
    http_response_code( $errorCode );
    echo json_encode( ["status"=>"ERROR", "data"=>$error, "Solution"=>"Check http request type, Check Credentials, Check URL parameters"] );
    return;
}

function checkTableReqs( $table, &$JSON ) {
    global $routes;
    switch ( $table ) {
    case"users":
        if ( isset( $JSON['password'] ) ) {
            $JSON['password']=create_hash( $JSON['password'] );
            //rest_error("Mal-Formed JSON please read Documentation, missing 'password' property",400);
            //return false;
        }
        //echo json_encode($JSON);
        for ( $i=0, $arr=$routes[$table]['identifiers'];$i<count( $arr );$i++ ) {
            if ( !isset( $JSON[$arr[$i]] ) ) {
                rest_error( "Mal-Formed JSON please read Documentation, missing '".$arr[$i]."' property", 400 );
                return false;
            }
        }
        return true;
        break;
    }
    return true;
}

function isMethodAllowed( $table, $accessor ) {
    global $routes;
    $i=0;
    switch ( $accessor ) {
    case "GET":
        $i=0;
        break;
    case "POST":
        $i=1;
        break;
    case "PUT":
        $i=2;
        break;
    case "DELETE":
        $i=3;
        break;
    default:
        return false;
    }
    if ( isAdmin() ) {
        return true;
    }
    return @$routes[$table]['methods'][$i]==1?true:false;
}

function isIdentifier( $table, $test ) {
    global $routes;
    if(isset($routes[$table])==false){
        return false;
    }
    return array_search( $test, $routes[$table]['identifiers'] )!==false;
}

function isInside($arr,$val,$searchFor){
    for($x=0;$x<count($arr);$x++){
            if($arr[$x][$val]==$searchFor){
                return $x;
            }
        }
        return -1;
}

//true for props in array format false for comma delimited string
function buildProps( $table, $bool ) {
    global $routes;
    return $bool?$routes[$table]['props']:implode( ",", $routes[$table]['props'] );
}

function buildIdentifiers( $table, $bool ) {
    global $routes;
    return $bool?$routes[$table]['identifiers']:implode( ",", $routes[$table]['identifiers'] );
}

?>