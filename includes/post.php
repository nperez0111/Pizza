<?PHP

/*

  _____   ____   _____ _______
 |  __ \ / __ \ / ____|__   __|
 | |__) | |  | | (___    | |
 |  ___/| |  | |\___ \   | |
 | |    | |__| |____) |  | |
 |_|     \____/|_____/   |_|



*/
function rest_post( $req ) {
    if ( checkPrivileges( $req[ 0 ] ) == false ) {
        rest_error( "Insufficient privelege to DATABASE", 401 );
        return;
    }
    $resp = reqRouter( $req, "POST" );
    if ( $resp == 0 ) {
        rest_error( "Check URL Request, The value you are attempting to set to may already be taken, You may not be fetching the correct value or column", 400 );
        return;
    }

    //$resp==2 user is accessing /tableName/identifier and is updating to values that are available

    $response = $resp == 1 ? sql_POST( $req ) : sql_POST_ALL( $req );
    if ( isset( $response ) ) {
        global $JSON;
        rest_success( "'$req[1]' Has Been Updated Successfully!" );
    } else {
        rest_error( "POST ERROR Has Occurred", 500 );
    }
    return 0;
}

function sql_POST( $req ) {
    $table = $req[ 0 ];
    $col = $req[ 1 ];
    $id = $req[ 2 ];
    global $routes;
    global $JSON;
    include '../../includes/database.php';
    $STR = "UPDATE ".$table." SET ".$col."=:val WHERE ".$routes[ $table ][ 'identifier' ]."='".$id."'";
    $stmt = $db -> prepare( $STR );
    $resul = $stmt -> execute( [ ":val" => $JSON[ $col ] ] );
    return true;
}

function sql_POST_ALL( $req ) {
    $table = $req[ 0 ];
    $col = $req[ 1 ];
    global $routes;
    global $JSON;
    include '../../includes/database.php';

    $STR = "UPDATE ".$table." SET ";

    $keys = $routes[ $table ][ 'identifiers' ];
    $arr = [];
    for ( $i = 0; $i < count( $keys ); $i++ ) {
        $STR.= $keys[ $i ]."=:".$keys[ $i ].( $i + 1 < count( $keys ) ? "," : "" );
        $arr[ ":".$keys[ $i ] ] = $JSON[ $keys[ $i ] ];
    }
    $STR .= " WHERE ".$routes[ $table ][ 'identifier' ]."=:valu";
    //UPDATE settings SET keyKey=:keyKey,val=:val WHERE keyKey=:valu
    $stmt = $db -> prepare( $STR );
    $resul = $stmt -> execute( array_merge( [ ":valu" => $col ], $arr ) );
    //echo $STR;
    //print_r($arr);
    return true;
}

?>
