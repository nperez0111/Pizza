<? PHP
$JSON = array();
$val = file_get_contents( 'php://input' );
//parse_str(file_get_contents('php://input'), $JSON);
if ( $_SERVER[ 'REQUEST_METHOD' ] == 'POST' ) {
    $JSON = ( json_decode( $val, true ) );
} else if ( $_SERVER[ 'REQUEST_METHOD' ] == 'GET' ) {
    $JSON = $_GET;
} else {
    parse_str( $val, $JSON );
}



if ( !( ( isset( $_SESSION[ 'loggedin' ] ) && $_SESSION[ 'loggedin' ] == true ) || ( loginWJson() ) || ( checkUser( @$_SERVER[ "PHP_AUTH_USER" ], @$_SERVER[ "PHP_AUTH_PW" ] ) ) ) ) {
    rest_error( "You must be logged in to use this API.", 401 );
    exit;
    die;
}

if ( isset( $_SERVER[ 'SCRIPT_URL' ] ) ) {
    $_SERVER[ 'PATH_INFO' ] = str_replace( '/api/v1', '', $_SERVER[ 'SCRIPT_URL' ] );
} else {
    $_SERVER[ 'PATH_INFO' ] = str_replace( '/pizza/api/v1', '', $_SERVER[ 'REDIRECT_URL' ] );
}

if ( @$_SERVER[ 'PATH_INFO' ] == null ) {
    rest_error( "You are requesting an empty set.", 400 );
    exit;
    die;
}
$method = $_SERVER[ 'REQUEST_METHOD' ];
$request = explode( "/", substr( @$_SERVER[ 'PATH_INFO' ], 1 ) ); ?>
