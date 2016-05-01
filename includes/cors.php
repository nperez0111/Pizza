<?PHP

/*
   _____ ____  _____   _____
  / ____/ __ \|  __ \ / ____|
 | |   | |  | | |__) | (___
 | |   | |  | |  _  / \___ \
 | |___| |__| | | \ \ ____) |
  \_____\____/|_|  \_\_____/

  */

// curl "http://localhost/api/v1/users" -X OPTIONS -i
if ( isset( $_SERVER[ 'HTTP_ORIGIN' ] ) ) {
    header( 'Access-Control-Allow-Credentials: true' );
    header( 'Access-Control-Max-Age: 86400' ); // cache for 1 day
    header( "Access-Control-Allow-Headers: *" );
}

// Access-Control headers are received during OPTIONS requests
if ( $_SERVER[ 'REQUEST_METHOD' ] == 'OPTIONS' ) {

    if ( isset( $_SERVER[ 'HTTP_ACCESS_CONTROL_REQUEST_METHOD' ] ) ) {
        header( "Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, ADD, LOGIN, DELETE, LOGOUT" );
    }

    if ( isset( $_SERVER[ 'HTTP_ACCESS_CONTROL_REQUEST_HEADERS' ] ) ) {
        header( "Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}" );
    }
    http_response_code( 204 );
    exit( 0 );
}

?>
