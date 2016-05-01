<?PHP

/*

  _____  ______ _      ______ _______ ______
 |  __ \|  ____| |    |  ____|__   __|  ____|
 | |  | | |__  | |    | |__     | |  | |__
 | |  | |  __| | |    |  __|    | |  |  __|
 | |__| | |____| |____| |____   | |  | |____
 |_____/|______|______|______|  |_|  |______|

 

*/
function rest_delete( $req ) {
    if ( checkPrivileges( $req[ 0 ] ) == false ) {
        rest_error( "Insufficient priveleges to DATABASE", 401 );
        return;
    }
    $resp = reqRouter( $req, "DELETE" );
    if ( $resp == 0 ) {
        rest_error( "Check URL Request, The value you are attempting to delete may not exist, check ID '".$req[ 1 ].
            "'", 400 );
        return;
    }
    $response = sql_DELETE( $req );
    if ( isset( $response ) ) {
        global $JSON;
        rest_success( "'$req[1]' was deleted successfully!" );
    } else {
        rest_error( "DELETION ERROR", 500 );
    }
    return 0;
}

function sql_DELETE( $req ) {
    $table = $req[ 0 ];
    $id = $req[ 1 ];
    global $routes;
    global $JSON;
    include '../../includes/database.php';
    $STR = "DELETE FROM ".$table." WHERE ".$routes[ $table ][ 'identifier' ]. "=:val";
    $stmt = $db -> prepare( $STR );
    $resul = $stmt -> execute( [ ":val" => $id ] );
    return true;
}

?>
