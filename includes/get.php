<?PHP


/*

   _____ ______ _______
  / ____|  ____|__   __|
 | |  __| |__     | |
 | | |_ |  __|    | |
 | |__| | |____   | |
  \_____|______|  |_|



*/
function rest_get( $req ) {
    global $JSON;
    if ( checkPrivileges( $req[0] )==false ) {
        return;
    }
    $resp=reqRouter( $req, "GET" );
    $response;
    switch ( $resp ) {
    case 1:
        global $routes;
        $order=@$routes[$req[0]]["orderBy"];
        if ( isset( $order ) ) {
            $response=sql_GET_ALL( $req[0], [$order, "ASC"] );
        }
        else {
            $response=sql_GET_ALL( $req[0], [$routes[$req[0]]['identifier'], "ASC"] );
        }
        break;
    case 2:
        $response=( sql_GET( $req ) );
        break;
    case 3:
        $response=( sql_GET_ROW( $req ) );
        break;
    case 4:
        $response=( sql_GET_SORT( $req, true ) );
        break;
    case 5:
        $response=( sql_GET_SORT( $req, false ) );
        break;
    case 6:
        $response=sql_GET_COLUMNS();
        break;
    case 7:
        $response=sql_GET_JOIN($JSON);
        break;
    case 8:
        $response=getPrice($JSON);
        break;
    case 9:
        $response=getByTime($req,$JSON);
        break;
    case 0:
    default:
        rest_error( "Mal-Formed request, check url params", 400 );
        return;
    }

    if ( isset( $response )&&( is_array( $response )&&count( $response )>0 ) ) {
        rest_success( json_encode( $response ) );
    }
    else {
        rest_error( "Empty Results, Check if item exists in dataBase, Check Url requested.", 404 );
    }
    return 0;
}


/*

     _______.  ______       __              ___      .__   __.  _______     .______        ______    __    __  .___________. __  .__   __.   _______
    /       | /  __  \     |  |            /   \     |  \ |  | |       \    |   _  \      /  __  \  |  |  |  | |           ||  | |  \ |  |  /  _____|
   |   (----`|  |  |  |    |  |           /  ^  \    |   \|  | |  .--.  |   |  |_)  |    |  |  |  | |  |  |  | `---|  |----`|  | |   \|  | |  |  __
    \   \    |  |  |  |    |  |          /  /_\  \   |  . `  | |  |  |  |   |      /     |  |  |  | |  |  |  |     |  |     |  | |  . `  | |  | |_ |
.----)   |   |  `--'  '--. |  `----.    /  _____  \  |  |\   | |  '--'  |   |  |\  \----.|  `--'  | |  `--'  |     |  |     |  | |  |\   | |  |__| |
|_______/     \_____\_____ \_______|   /__/     \__\ |__| \__| |_______/    | _| `._____| \______/   \______/      |__|     |__| |__| \__|  \______|


*/

function sql_GET_SORT( $req, $bool ) {
    //$bool?"sort by pref":"sort ASC"
    return $bool?sql_GET_ALL( $req[0], [$req[2], $req[3]] ):sql_GET_ALL( $req[0], [$req[2], "ASC"] );
}
function sql_GET_ROW( $req ) {
    $table=$req[0];
    global $routes;
    include '../../includes/database.php';
    $stmt = $db->prepare( "SELECT ".$req[2]." FROM `".$table."`" );
    $resul = $stmt->execute();
    $arr=[];
    while ( $row = $stmt->fetch( PDO::FETCH_ASSOC ) ) {
        array_push( $arr, $row[$req[2]] );
    }
    return $arr;
}
function sql_GET( $req ) {
    $table=$req[0];
    $queryBy=$req[2];
    $value=$req[3];
    global $routes;
    include '../../includes/database.php';
    $stmt = $db->prepare( "SELECT ".implode( ",", $routes[$table]['identifiers'] )." FROM `".$table."` WHERE ".$queryBy."=:val" );
    $resul = $stmt->execute( array( ":val"=>$value ) );
    $arr=[];
    while ( $row = $stmt->fetch( PDO::FETCH_ASSOC ) ) {
        array_push( $arr, $row );
    }
    return $arr;

}
function sql_GET_ALL( $tabl, $pos ) {
    global $routes;
    include '../../includes/database.php';
    $arr=[];
    $STR="SELECT ".implode( ",", $routes[$tabl]['identifiers'] )." FROM `".$tabl."`".( isset( $pos )?( " ORDER BY ".$pos[0]." ".$pos[1] ):"" );
    $stmt=$db->prepare( $STR );
    $resul=$stmt->execute();
    while ( $row = $stmt->fetch( PDO::FETCH_ASSOC ) ) {
        $data=[];
        for ( $i=0;$i<count( $routes[$tabl]['identifiers'] );$i++ ) {
            $data[$routes[$tabl]['identifiers'][$i]]=$row[$routes[$tabl]['identifiers'][$i]];
        }
        array_push( $arr, $data );
    }
    return $arr;
}
function sql_GET_COLUMNS() {
    global $JSON;
    $arr=[];
    foreach ( $JSON as $table=>$val ) {
        if ( $table!=="login" && $table !=="/columns" ) {
            if ( is_array( $val ) ) {
                //array_push($arr,"IS Array");
                $arr[$table]=[];
                for ( $i=0;$i<count( $val );$i++ ) {
                    $cur=$val[$i];
                    if ( !isIdentifier( $table, $cur ) ) {
                        return null;
                    }
                    array_push( $arr[$table], sql_GET_ROW( [$table, "", $val[$i]] ) );
                }
            }
            else {
                if ( !isIdentifier( $table, $val ) ) {
                    return null;
                }
                $arr[$table]=sql_GET_ROW( [$table, "", $val] );
            }

        }
    }
    return $arr;
}
function sql_GET_JOIN($JSON) {
    include '../../includes/database.php';
    $required=["from", "tables", "relations", "select"];
    $STR="SELECT ";
    for ( $i=0;$i<count( $JSON["select"] );$i++ ) {
        $STR.=$JSON["select"][$i].( $i+1==count( $JSON["select"] )?" ":", " );
    }
    $STR.="FROM ".$JSON["from"]." ";
    for ( $i=0;$i<count( $JSON["tables"] );$i++ ) {
        $STR.="INNER JOIN ".$JSON["tables"][$i]." ";
    }
    $STR.="ON ";
    for ( $r=0;$r<count( $JSON["relations"] );$r++ ) {
        $STR.=$JSON["relations"][$r][0]." = ".$JSON["relations"][$r][1].( $r+1==count( $JSON["relations"] )?" ":" AND " );
    }
    $stmt=$db->prepare( $STR );
    $resul=$stmt->execute();
    $arr=[];
    while ( $row = $stmt->fetch( PDO::FETCH_ASSOC ) ) {
        array_push( $arr, $row );
    }
    return $arr;
}

function getByTime($req,$JSON){
    include '../../includes/database.php';
    global $routes;
    $table=$req[1];
    $row=$req[2];
    $from=@$JSON['from'];
    $to=@$JSON['to'];
    if(!isset($routes[$table])||!isIdentifier($table,$row)||!isset($from)||($routes[$table]['time']==$row)==false||strtotime($from)==false||isset($to)?strtotime($to)==false:false){
        return [];
    }
    $arr=[];
    //http://stackoverflow.com/questions/5125076/sql-query-to-select-dates-between-two-dates
    $STR="SELECT ".implode( ",", $routes[$table]['identifiers'] )." FROM `".$table."` WHERE ".$routes[$table]['time']." between '".$from."' and '".(isset($to)?$to:date('Y-m-d'))."'";
    $stmt=$db->prepare( $STR );
    $resul=$stmt->execute();
    
    while ( $currow = $stmt->fetch( PDO::FETCH_ASSOC ) ) {
        $data=[];
        for ( $i=0;$i<count( $routes[$table]['identifiers'] );$i++ ) {
            $data[$routes[$table]['identifiers'][$i]]=$currow[$routes[$table]['identifiers'][$i]];
        }
        array_push( $arr, $data );
    }
    return $arr;

}

?>