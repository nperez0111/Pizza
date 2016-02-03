<?php
// curl -i --data {\"fname\":\"NICK\",\"lname\":\"POST\",\"Email\":\"rf@gh.co\",\"password\":\"test\"} -u nick@nickthesick.com:0046788285 -X PUT http://localhost/pizza/api/v1/users/
//curl -i -u nick@nickthesick.com:0046788285 -X GET http://localhost/pizza/api/v1/users/sortBy/Email/DESC
//curl -i -u nick@nickthesick.com:0046788285 -X DELETE http://localhost/pizza/api/v1/users/rf@gh.com
// curl -i --data {\"fname\":\"NICK\",\"lname\":\"POST\",\"Email\":\"rf@gh.com\",\"password\":\"test\"} -u nick@nickthesick.com:0046788285 -X POST http://localhost/pizza/api/v1/users/Email/rf@gh.o
// curl -i --data {\"Email\":\"nick@nickthesick.com\",\"password\":\"0046788285\"} -X LOGIN http://localhost/pizza/api/v1/logout
//curl -i --data {\"FName\":\"NICK\",\"LName\":\"POSTER\",\"Email\":\"Rf@Gh.Co\",\"password\":\"test\"} -u nick@nickthesick.com:0046788285 -X POST http://localhost/pizza/api/v1/users/Rf@Gh.Co
session_start();
header( 'Content-Type: application/json' );
define( "PBKDF2_HASH_ALGORITHM", "sha256" );
define( "PBKDF2_ITERATIONS", 1003 );
define( "PBKDF2_SALT_BYTE_SIZE", 24 );
define( "PBKDF2_HASH_BYTE_SIZE", 24 );

define( "HASH_SECTIONS", 4 );
define( "HASH_ALGORITHM_INDEX", 0 );
define( "HASH_ITERATION_INDEX", 1 );
define( "HASH_SALT_INDEX", 2 );
define( "HASH_PBKDF2_INDEX", 3 );
$adminRequired=["users"];
$keyRoutes=["columns", "join", "placeOrder","getPrice"];
include '../../includes/routes.php';
global $possibleRoutes;
$routes=$possibleRoutes;
$JSON = array();
$val=file_get_contents( 'php://input' );
//parse_str(file_get_contents('php://input'), $JSON);
if ( $_SERVER['REQUEST_METHOD']=='POST' ) {
    $JSON=( json_decode( $val, true ) );
}
else if ( $_SERVER['REQUEST_METHOD']=='GET' ) {
        $JSON=$_GET;
    }
else {
    parse_str( $val, $JSON );
}

/*
   _____ ____  _____   _____
  / ____/ __ \|  __ \ / ____|
 | |   | |  | | |__) | (___
 | |   | |  | |  _  / \___ \
 | |___| |__| | | \ \ ____) |
  \_____\____/|_|  \_\_____/

  */

// curl "http://localhost/api/v1/users" -X OPTIONS -i
if ( isset( $_SERVER['HTTP_ORIGIN'] ) ) {
    header( 'Access-Control-Allow-Credentials: true' );
    header( 'Access-Control-Max-Age: 86400' );    // cache for 1 day
    header( "Access-Control-Allow-Headers: *" );
}

// Access-Control headers are received during OPTIONS requests
if ( $_SERVER['REQUEST_METHOD'] == 'OPTIONS' ) {

    if ( isset( $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] ) ){
        header( "Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, ADD, LOGIN, DELETE, LOGOUT" );
    }

    if ( isset( $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'] ) ){
        header( "Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}" );
    }
    http_response_code( 204 );
    exit( 0 );
}

include '../../includes/database.php';

if ( !( ( isset( $_SESSION['loggedin'] )&&$_SESSION['loggedin']==true )||( loginWJson() )||( checkUser( @$_SERVER["PHP_AUTH_USER"], @$_SERVER["PHP_AUTH_PW"] ) ) ) ) {
    rest_error( "You must be logged in to use this API.", 401 );
    exit;
    die;
}

if ( isset( $_SERVER['SCRIPT_URL'] ) ) {
    $_SERVER['PATH_INFO']=str_replace( '/api/v1', '', $_SERVER['SCRIPT_URL'] );
}
else{
    $_SERVER['PATH_INFO']=str_replace( '/pizza/api/v1', '', $_SERVER['REDIRECT_URL'] );
}

if ( @$_SERVER['PATH_INFO']==null ) {
    rest_error( "You are requesting an empty set.", 400 );
    exit;
    die;
}
$method = $_SERVER['REQUEST_METHOD'];
$request = explode( "/", substr( @$_SERVER['PATH_INFO'], 1 ) );

switch ( $method ) {
case 'PUT':
    //add
    rest_put( $request );
    break;
case 'POST':
    //update
    rest_post( $request );
    break;
case 'GET':
    //get
    rest_get( $request );
    break;
case 'DELETE':
    //remove
    rest_delete( $request );
    break;
case 'LOGIN':
    $var=( reqRouter( $request, "LOGIN" ) );
    if ( $var==1 ) {
        rest_success( "Successfully logged in..." );
        return;
    }
    else if ( $var==2 ) {
            rest_success( json_encode( ["location"=>"signin.php"] ) );
            return;
        }
    else {
        rest_error( "Bad request", 400 );
        return;
    }
    break;
case 'OPTIONS':
    return;
    break;
default:
    rest_error( $request, 400 );
    break;
}

function rest_success( $data ) {
    http_response_code( 200 );
    echo json_encode( ['status'=>"OK", 'message'=>$data] );
}

function rest_error( $error, $errorCode ) {
    http_response_code( $errorCode );
    echo json_encode( ["status"=>"ERROR", "data"=>$error, "Solution"=>"Check http request type, Check Credentials, Check URL parameters"] );
    return;
}

/*

  _____   ____   _____ _______
 |  __ \ / __ \ / ____|__   __|
 | |__) | |  | | (___    | |
 |  ___/| |  | |\___ \   | |
 | |    | |__| |____) |  | |
 |_|     \____/|_____/   |_|



*/
function rest_post( $req ) {
    if ( checkPrivileges( $req[0] )==false ) {
        rest_error( "Insufficient privelege to DATABASE", 401 );
        return;
    }
    $resp=reqRouter( $req, "POST" );
    if ( $resp==0 ) {
        rest_error( "Check URL Request, The value you are attempting to set to may already be taken, You may not be fetching the correct value or column", 400 );
        return;
    }

    //$resp==2 user is accessing /tableName/identifier and is updating to values that are available

    $response=$resp==1?sql_POST( $req ):sql_POST_ALL( $req );
    if ( isset( $response ) ) {
        global $JSON;
        rest_success( "'$req[1]' Has Been Updated Successfully!" );
    }
    else {rest_error( "POST ERROR Has Occurred", 500 );}
    return 0;
}
/*

  _____  _    _ _______
 |  __ \| |  | |__   __|
 | |__) | |  | |  | |
 |  ___/| |  | |  | |
 | |    | |__| |  | |
 |_|     \____/   |_|



*/
function rest_put( $req ) {
    global $routes;
    global $JSON;
    include '../../includes/database.php';
    $table=$req[0];
    if ( checkPrivileges( $req[0] )==false||checkTableReqs( $req[0], $JSON )==false ) {
        rest_error( "Insufficient Priveleges OR incorrect JSON Requirements", 401 );
        return;
    }
    $ret=reqRouter( $req, "PUT" );
    if ( $ret==0 ) {
        rest_error( "Item Exists Or Incorrect JSON Properties.", 409 );
        return;
    }
    else if ( $ret==2 ) {
            if(!isset($JSON["OrderSymbols"])){
                rest_error("NO Order received, check JSON",406);
            }
            $list=$JSON["OrderSymbols"];
            $orders=explode(" , ",$list);
            $arr=[];
            for($i=0;$i<count($orders);$i++){
                $ingredients=explode(" ",$orders[$i]);
                array_push($arr,$ingredients);
                //from here we need to check that each ingrediant is valid and available?
            }
            /*print_r($list);
            echo "\n";
            print_r($orders);
            echo "\n";
            print_r($arr);*/
            rest_error("Order fulfilled!",400);
            return;
        }

    if ( $req[0]=="users" ) {
        if ( !filter_var( $JSON["Email"], FILTER_VALIDATE_EMAIL ) ) {
            rest_error( "Invalid Email, Please Enter a Valid Email address.", 406 );
            return;
        }
    }

    $stmt=$db->prepare( sql_PUT( $table ) );
    $ex=buildJSONInputWProps( $table, $JSON );

    if ( is_string( $ex ) ) {
        rest_error( "Property: '".$ex."' is not set on provided JSON Object. Your JSON May be Mal-Formed,incorrect for the database or some other error may have occured", 400 );
        return;
    }
    $var=$stmt->execute( $ex );
    if ( $var ) {
        rest_success( 'Inputted Successfully Into the DataBase!' );
    }
    else {
        rest_error( 'Input unsuccessful. Check spelling this is usually thrown when an item should match another tables item.', 406 );
    }
    /*
    $stmt = $db->prepare(sql_PUT($req));
    $stmt->execute(array(':fname' => $fname, ':lname' => $lname,':email' => $email,':pass' => $password,':verified'=>0));*/
    return 0;
}
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
        $response=getPrice();
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

  _____  ______ _      ______ _______ ______
 |  __ \|  ____| |    |  ____|__   __|  ____|
 | |  | | |__  | |    | |__     | |  | |__
 | |  | |  __| | |    |  __|    | |  |  __|
 | |__| | |____| |____| |____   | |  | |____
 |_____/|______|______|______|  |_|  |______|



*/
function rest_delete( $req ) {
    if ( checkPrivileges( $req[0] )==false ) {
        rest_error( "Insufficient priveleges to DATABASE", 401 );
        return;
    }
    $resp=reqRouter( $req, "DELETE" );
    if ( $resp==0 ) {
        rest_error( "Check URL Request, The value you are attempting to delete may not exist, check ID '".$req[1]."'", 400 );
        return;
    }
    $response=sql_DELETE( $req );
    if ( isset( $response ) ) {
        global $JSON;
        rest_success( "'$req[1]' was deleted successfully!" );
    }
    else {rest_error( "DELETION ERROR", 500 );}
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
/*

  _____  ______ ____  _    _ ______  _____ _______   _____   ____  _    _ _______ ______ _____
 |  __ \|  ____/ __ \| |  | |  ____|/ ____|__   __| |  __ \ / __ \| |  | |__   __|  ____|  __ \
 | |__) | |__ | |  | | |  | | |__  | (___    | |    | |__) | |  | | |  | |  | |  | |__  | |__) |
 |  _  /|  __|| |  | | |  | |  __|  \___ \   | |    |  _  /| |  | | |  | |  | |  |  __| |  _  /
 | | \ \| |___| |__| | |__| | |____ ____) |  | |    | | \ \| |__| | |__| |  | |  | |____| | \ \
 |_|  \_\______\___\_\\____/|______|_____/   |_|    |_|  \_\\____/ \____/   |_|  |______|_|  \_\



*/
function reqRouter( $req, $http ) {
    global $keyRoutes;
    global $routes;
    global $JSON;
    if ( isset( $req )&&( array_search( $req[0], $keyRoutes )!==false ) ) {

    }
    else if ( !isset( $req[0] )||( !isMethodAllowed( $req[0], $http )&&!( $http=="LOGIN"||$http=="LOGOUT" ) ) ) {

            //rest_error("Bad Request",401);
            return 0;
        }
    if ( $http=="GET" ) {
        if ( count( $req )==1 ) {
            if ( isset( $routes[$req[0]] ) ) {
                //the users is requesting an entire table
                return 1;
            }
            else if ( $req[0]=="columns" ) {
                    return 6;
                    //user is requesting to retrieve multiple columns
                }
            else if($req[0]=="getPrice"){
                    return 8;
                    //user is requesting price of an order
                }
            else if ( $req[0]=="join" ) {
                    $required=["from", "tables", "relations", "select"];

                    for ( $i=0;$i<count( $required );$i++ ) {
                        if ( !isset( $JSON[$required[$i]] ) ) {
                            return 0;
                        }
                        if ( is_string( $JSON[$required[$i]] )&&!isset( $routes[$JSON[$required[$i]]] ) ) {
                            return 0;
                        }
                        if ( is_array( $JSON[$required[$i]] ) ) {

                            if ( $required[$i]=="tables" ) {

                                for ( $c=0;$c<count( $JSON[$required[$i]] );$c++ ) {

                                    if ( !isset( $routes[$JSON[$required[$i]][$c]] ) ) {

                                        return 0;

                                    }

                                }
                            }
                            if ( $required[$i]=="select" ) {
                                $arr=$JSON[$required[$i]];

                                if ( !isset( $arr ) ) {

                                    return 0;
                                }

                                for ( $r=0;$r<count( $arr );$r++ ) {

                                    $cur=explode( ".", $arr[$r] );

                                    if ( !isset( $routes[$cur[0]] )||!isIdentifier( $cur[0], $cur[1] ) ) {

                                        return 0;
                                    }

                                }
                            }
                            if ( $required[$i]=="relations" ) {

                                for ( $r=0;$r<count( $JSON[$required[$i]] );$r++ ) {

                                    $arr=$JSON[$required[$i]][$r];

                                    if ( !isset( $arr ) ) {

                                        return 0;
                                    }

                                    for ( $r=0;$r<count( $arr );$r++ ) {

                                        $cur=explode( ".", $arr[$r] );

                                        if ( !isset( $routes[$cur[0]] )||!isIdentifier( $cur[0], $cur[1] ) ) {

                                            return 0;
                                        }

                                    }

                                }
                            }
                        }
                    }
                    return 7;
                    //user is requesting to join multiple columns
                }else {
                return 0;
            }
        }
        else {
            //the user is requesting a search
            //therefore anything after is a parameter to search by
            if ( isset( $req[1] )&&strtolower( $req[1] )=="search" ) {

                if ( isset( $req[2] )&&isIdentifier( $req[0], $req[2] ) ) {

                    if ( isset( $req[3] ) ) {
                        //user is searching for a row with req
                        return 2;
                    }
                    //user is searching for column
                    return 3;

                }

            }

            else if ( isset( $req[1] )&&strtolower( $req[1] )=="sortby" ) {

                    if ( isset( $req[2] )&&isIdentifier( $req[0], $req[2] ) ) {

                        if ( isset( $req[3] )&&( strtoupper( $req[3] )=="ASC"||strtoupper( $req[3] )=="DESC" ) ) {
                            //user wants entire table sorted by preference
                            return 4;
                        }
                        //user wants entire table sorted ASC
                        return 5;

                    }
                }
        }
    }
    if ( $http=="POST" ) {
        if ( count( $req )==3 ) {

            $table=$req[0];
            $col=$req[1];
            $id=$req[2];
            $keys=$routes[$table]['identifiers'];
            for ( $i=0;$i<count( $keys );$i++ ) {
                if ( !isset( $JSON[$keys[$i]] ) ) {
                    return 0;
                }
            }
            if ( isIdentifier( $table, $col )==false ) {
                return 0;
            }

            //count(sql_GET([$table,"search",$col,$id]))==1 checks if id exists in table
            if ( isset( $routes[$table] )&&count( sql_GET( [$table, "search", $routes[$table]['identifier'], $id] ) )==1&&$col==$routes[$table]['identifier']?count( sql_GET( [$table, "search", $col, $JSON[$col]] ) )==0:true ) {
                
                return 1;
            }
        }
        if ( count( $req )==2 ) {

            $table=$req[0];
            $col=$req[1];
            $keys=$routes[$table]['identifiers'];
            for ( $i=0;$i<count( $keys );$i++ ) {
                if ( !isset( $JSON[$keys[$i]] ) ) {
                    return 0;
                }
            }

            if ( isset( $routes[$table] )&&count( sql_GET( [$table, "search", $routes[$table]['identifier'], $JSON[$routes[$table]['identifier']]] ) )==1 ) {
                return 2;
            }
        }
    }
    if ( $http=="DELETE" ) {

        if ( count( $req )==2 ) {
            $table=$req[0];
            $id=$req[1];
            if ( isset( $routes[$table] )&&count( sql_GET( [$table, "search", $routes[$table]['identifier'], $id] ) )==1 ) {
                return 1;
            }
        }
    }
    if ( $http=="LOGIN" ) {
        if ( $req[0]=="logout" ) {
            unset( $_SESSION );
            session_destroy();
            session_write_close();

            return 2;
        }
        if ( $req[0]=="login" ) {

            return 1;
        }
    }
    if ( $http=="PUT" ) {

        $table=$req[0];

        if ( !isset( $routes[$table] ) ) {
            if ( $table=="placeOrder" ) {
                return 2;
            }
            return 0;
        }
        $keys=$routes[$table]['props'];
        array_push( $keys, $routes[$table]['identifier'] );
        for ( $i=0;$i<count( $keys );$i++ ) {
            if ( !isset( $JSON[$keys[$i]] ) ) {
                return 0;
            }
        }
        if ( isset( $routes[$table] )&&count( sql_GET( [$table, "search", $routes[$table]['identifier'], $JSON[$routes[$table]['identifier']]] ) )==0 ) {
            return 1;
        }
    }
    return 0;
}

//returns true of the table object supplied allows the nth$index http verb method
//[get,post,put,delete]
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
    return array_search( $test, $routes[$table]['identifiers'] )!==false;
}
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
function sql_POST( $req ) {
    $table=$req[0];
    $col=$req[1];
    $id=$req[2];
    global $routes;
    global $JSON;
    include '../../includes/database.php';
    $STR="UPDATE ".$table." SET ".$col."=:val WHERE ".$routes[$table]['identifier']."='".$id."'";
    $stmt = $db->prepare( $STR );
    $resul = $stmt->execute( [":val"=>$JSON[$col]] );
    return true;
}
function sql_POST_ALL( $req ) {
    $table=$req[0];
    $col=$req[1];
    global $routes;
    global $JSON;
    include '../../includes/database.php';

    $STR="UPDATE ".$table." SET ";

    $keys=$routes[$table]['identifiers'];
    $arr=[];
    for ( $i=0;$i<count( $keys );$i++ ) {
        $STR.=$keys[$i]."=:".$keys[$i].( $i+1<count( $keys )?",":"" );
        $arr[":".$keys[$i]]=$JSON[$keys[$i]];
    }
    $STR.=" WHERE ".$routes[$table]['identifier']."=:valu";
    //UPDATE settings SET keyKey=:keyKey,val=:val WHERE keyKey=:valu
    $stmt = $db->prepare( $STR );
    $resul = $stmt->execute( array_merge( [":valu"=>$col], $arr ) );
    //echo $STR;
    //print_r($arr);
    return true;
}

function sql_DELETE( $req ) {
    $table=$req[0];
    $id=$req[1];
    global $routes;
    global $JSON;
    include '../../includes/database.php';
    $STR="DELETE FROM ".$table." WHERE ".$routes[$table]['identifier']."=:val";
    $stmt = $db->prepare( $STR );
    $resul = $stmt->execute( [":val"=>$id] );
    return true;
}

function sql_PUT( $table ) {
    $str="INSERT INTO ".$table."(".buildProps( $table, false ).") VALUES(";

    for ( $i=0, $arr=buildProps( $table, true );$i<count( $arr );$i++ ) {
        $str.=":".$arr[$i].( ( $i!==( count( $arr )-1 ) )?",":"" );
    }

    $str.=")";

    return $str;
}
function getPrice(){
    include '../../includes/database.php';
    global $JSON;
    //json should contain: order(s) to be priced
    $orderName="orderName";
    if(isset($JSON[$orderName])==false){
        //return empty array to throw error
        return [];
    }
    $arr=[];
    $places=pow(10,5);
    $allPossibles=sql_GET_JOIN([
            "tables"=> ["symbols"],
            "from"=> "ingredients",
            "relations"=> [
                ["symbols.Name", "ingredients.Symbol"],
            ],
            "select"=> ["symbols.Symbol","ingredients.Price", "ingredients.Units"]
            ]);
    $order=explode(sql_GET(["settings","search","keyKey","dbdelimiter"])[0]["val"],$JSON[$orderName]);
    foreach ($order as $i => $ingrediant) {
        $num=isInside($allPossibles,"Symbol",$ingrediant);
        if($num==-1){
            return [];
        }
        $cur=$allPossibles[$num];
        array_push($arr,floor(($cur["Price"]*$places)/$cur["Units"])/$places);
    }
    return [array_reduce($arr,"add")];
}

function add($a,$b){
    return $a+$b;
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

//returns array for the spl executer and string with what is missing if the json obj does not have the property required
function buildJSONInput( $table, $JSON ) {
    $keys=buildIdentifiers( $table, true );
    $arr=[];
    for ( $i=0;$i<count( $keys );$i++ ) {
        if ( !isset( $JSON[$keys[$i]] ) ) {
            return $keys[$i];
        }
        $arr[":".$keys[$i]]=$JSON[$keys[$i]];
    }
    return $arr;
}
function buildJSONInputWProps( $table, $JSON ) {
    $keys=buildprops( $table, true );
    $arr=[];
    for ( $i=0;$i<count( $keys );$i++ ) {
        if ( !isset( $JSON[$keys[$i]] ) ) {
            return $keys[$i];
        }
        $arr[":".$keys[$i]]=$JSON[$keys[$i]];
    }
    return $arr;
}

/*

  _      ____   _____ _____ _   _       __  _      ____   _____  ____  _    _ _______            _____ _____
 | |    / __ \ / ____|_   _| \ | |     / / | |    / __ \ / ____|/ __ \| |  | |__   __|     /\   |  __ \_   _|
 | |   | |  | | |  __  | | |  \| |    / /  | |   | |  | | |  __| |  | | |  | |  | |       /  \  | |__) || |
 | |   | |  | | | |_ | | | | . ` |   / /   | |   | |  | | | |_ | |  | | |  | |  | |      / /\ \ |  ___/ | |
 | |___| |__| | |__| |_| |_| |\  |  / /    | |___| |__| | |__| | |__| | |__| |  | |     / ____ \| |    _| |_
 |______\____/ \_____|_____|_| \_| /_/     |______\____/ \_____|\____/ \____/   |_|    /_/    \_\_|   |_____|


*/
function checkPrivileges( $tableName ) {
    global $adminRequired;
    if ( in_array( $tableName, $adminRequired ) ) {
        if ( !isAdmin() ) {
            rest_error( "Invalid privileges, not an Admin", 401 );
            return false;
        }
    }
    return true;
}

function loginWJson() {
    global $JSON;
    $json=$JSON;
    //echo "json is";
    //echo json_encode($JSON);
    //echo (checkUser(@$json['login']['Email'],@$json['login']['password']))?"TRUE":"FALSE";
    return checkUser( @$json['login']['Email'], @$json['login']['password'] );
}

function checkUser( $userName, $password ) {
    if ( !isset( $userName )&& !isset( $password ) ) {
        return false;
    }

    include '../../includes/database.php';
    // Retrieve username and password from database according to user's input
    $stmt = $db->prepare( "SELECT * FROM "."users"." WHERE (`Email` = :Email)" );

    $resul = $stmt->execute( array( ':Email'=>$userName ) );
    $result = $stmt->fetch();
    $num_rows = $stmt->rowCount();
    // Check username and password match
    //echo $num_rows > 0 &&validate_password($password,$result['password'])?"pasword is real...\n":"not the right pass?\n";
    if ( $num_rows > 0 && validate_password( $password, $result['password'] ) ) {
        // Set username session variable
        $_SESSION['Email'] = $userName;
        $_SESSION['loggedin'] = true;
        $_SESSION['FName'] = $result['FName'];
        $_SESSION['LName'] = $result['LName'];
        $_SESSION['Index'] = $result['Index'];
        $_SESSION['verified'] = @$result['verified'];
        return true;
    }
    else {
        return false;
    }
}

function isAdmin() {
    if ( !isset( $_SESSION['Email'] )||!isset( $_SESSION['loggedin'] )||$_SESSION['loggedin']==false ) {
        return false;
    }
    global $db;
    $stmt = $db->prepare( "SELECT * FROM users WHERE (`Email` = :Email)" );

    $resul = $stmt->execute( array( ':Email'=>$_SESSION['Email'] ) );
    $result = $stmt->fetch();
    $num_rows = $stmt->rowCount();
    if ( $num_rows > 0&&$result['verified']=="1" ) {
        return true;
    }
    return false;
}




function create_hash( $password ) {
    // format: algorithm:iterations:salt:hash
    $salt = base64_encode( mcrypt_create_iv( PBKDF2_SALT_BYTE_SIZE, MCRYPT_DEV_URANDOM ) );
    return PBKDF2_HASH_ALGORITHM . ":" . PBKDF2_ITERATIONS . ":" .  $salt . ":" .
        base64_encode( pbkdf2(
            PBKDF2_HASH_ALGORITHM,
            $password,
            $salt,
            PBKDF2_ITERATIONS,
            PBKDF2_HASH_BYTE_SIZE,
            true
        ) );
}

function validate_password( $password, $correct_hash ) {
    $params = explode( ":", $correct_hash );
    if ( count( $params ) < HASH_SECTIONS )
        return false;
    $pbkdf2 = base64_decode( $params[HASH_PBKDF2_INDEX] );
    return slow_equals(
        $pbkdf2,
        pbkdf2(
            $params[HASH_ALGORITHM_INDEX],
            $password,
            $params[HASH_SALT_INDEX],
            (int)$params[HASH_ITERATION_INDEX],
            strlen( $pbkdf2 ),
            true
        )
    );
}

// Compares two strings $a and $b in length-constant time.
function slow_equals( $a, $b ) {
    $diff = strlen( $a ) ^ strlen( $b );
    for ( $i = 0; $i < strlen( $a ) && $i < strlen( $b ); $i++ ) {
        $diff |= ord( $a[$i] ) ^ ord( $b[$i] );
    }
    return $diff === 0;
}

function pbkdf2( $algorithm, $password, $salt, $count, $key_length, $raw_output = false ) {
    $algorithm = strtolower( $algorithm );
    if ( !in_array( $algorithm, hash_algos(), true ) )
        trigger_error( 'PBKDF2 ERROR: Invalid hash algorithm.', E_USER_ERROR );
    if ( $count <= 0 || $key_length <= 0 )
        trigger_error( 'PBKDF2 ERROR: Invalid parameters.', E_USER_ERROR );

    if ( function_exists( "hash_pbkdf2" ) ) {
        // The output length is in NIBBLES (4-bits) if $raw_output is false!
        if ( !$raw_output ) {
            $key_length = $key_length * 2;
        }
        return hash_pbkdf2( $algorithm, $password, $salt, $count, $key_length, $raw_output );
    }

    $hash_length = strlen( hash( $algorithm, "", true ) );
    $block_count = ceil( $key_length / $hash_length );

    $output = "";
    for ( $i = 1; $i <= $block_count; $i++ ) {
        // $i encoded as 4 bytes, big endian.
        $last = $salt . pack( "N", $i );
        // first iteration
        $last = $xorsum = hash_hmac( $algorithm, $last, $password, true );
        // perform the other $count - 1 iterations
        for ( $j = 1; $j < $count; $j++ ) {
            $xorsum ^= ( $last = hash_hmac( $algorithm, $last, $password, true ) );
        }
        $output .= $xorsum;
    }

    if ( $raw_output )
        return substr( $output, 0, $key_length );
    else
        return bin2hex( substr( $output, 0, $key_length ) );
}
/*

  ______ _   _ _____     ____  ______   _      ____   _____ _____ _   _       __  _      ____   _____  ____  _    _ _______            _____ _____
 |  ____| \ | |  __ \   / __ \|  ____| | |    / __ \ / ____|_   _| \ | |     / / | |    / __ \ / ____|/ __ \| |  | |__   __|     /\   |  __ \_   _|
 | |__  |  \| | |  | | | |  | | |__    | |   | |  | | |  __  | | |  \| |    / /  | |   | |  | | |  __| |  | | |  | |  | |       /  \  | |__) || |
 |  __| | . ` | |  | | | |  | |  __|   | |   | |  | | | |_ | | | | . ` |   / /   | |   | |  | | | |_ | |  | | |  | |  | |      / /\ \ |  ___/ | |
 | |____| |\  | |__| | | |__| | |      | |___| |__| | |__| |_| |_| |\  |  / /    | |___| |__| | |__| | |__| | |__| |  | |     / ____ \| |    _| |_
 |______|_| \_|_____/   \____/|_|      |______\____/ \_____|_____|_| \_| /_/     |______\____/ \_____|\____/ \____/   |_|    /_/    \_\_|   |_____|


*/

?>
