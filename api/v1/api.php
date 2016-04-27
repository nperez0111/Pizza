<?php
// curl -i --data {\"fname\":\"NICK\",\"lname\":\"POST\",\"Email\":\"rf@gh.co\",\"password\":\"test\"} -u nick@nickthesick.com:0046788285 -X PUT http://localhost/pizza/api/v1/users/
//curl -i -u nick@nickthesick.com:0046788285 -X GET http://localhost/pizza/api/v1/users/sortBy/Email/DESC
//curl -i -u nick@nickthesick.com:0046788285 -X DELETE http://localhost/pizza/api/v1/users/rf@gh.com
// curl -i --data {\"fname\":\"NICK\",\"lname\":\"POST\",\"Email\":\"rf@gh.com\",\"password\":\"test\"} -u nick@nickthesick.com:0046788285 -X POST http://localhost/pizza/api/v1/users/Email/rf@gh.o
// curl -i --data {\"Email\":\"nick@nickthesick.com\",\"password\":\"0046788285\"} -X LOGIN http://localhost/pizza/api/v1/logout
//curl -i --data {\"FName\":\"NICK\",\"LName\":\"POSTER\",\"Email\":\"Rf@Gh.Co\",\"password\":\"test\"} -u nick@nickthesick.com:0046788285 -X POST http://localhost/pizza/api/v1/users/Rf@Gh.Co
session_start();
header( 'Content-Type: application/json' );
$adminRequired=["users"];
$keyRoutes=["columns", "join", "placeOrder","getPrice","getByTime"];
include '../../includes/utilities.php';
include '../../includes/routes.php';
include '../../includes/hasher.php';
include '../../includes/login.php';
include '../../includes/cors.php';
include '../../includes/database.php';
include '../../includes/handleReq.php';
include '../../includes/paymentReq.php';
include '../../includes/reqRouter.php';
include '../../includes/sqlUtils.php';
include '../../includes/post.php';
include '../../includes/put.php';
include '../../includes/delete.php';
include '../../includes/get.php';


global $possibleRoutes;
$routes=$possibleRoutes;


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
?>