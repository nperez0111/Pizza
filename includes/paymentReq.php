<? PHP

function getPrice( $JSON ) {
    include '../../includes/database.php';
    //json should contain: order(s) to be priced
    $orderName = "orderName";
    if ( isset( $JSON[ $orderName ] ) == false ) {
        //return empty array to throw error
        return [];
    }

    $price = isset( $JSON[ "actual" ] ) ? "Cost" : "Price";

    $arr = [];
    $places = pow( 10, 5 );
    $allPossibles = sql_GET_JOIN( [
        "tables" => [ "symbols" ],
        "from" => "ingredients",
        "relations" => [
            [ "symbols.Name", "ingredients.Symbol" ],
        ],
        "select" => [ "symbols.Symbol", "ingredients.".$price, "ingredients.Units" ]
    ] );
    $order = explode( sql_GET( [ "settings", "search", "keyKey", "dbdelimiter" ] )[ 0 ][ "val" ], $JSON[ $orderName ] );
    foreach( $order as $i => $ingrediant ) {
        $num = isInside( $allPossibles, "Symbol", $ingrediant );
        if ( $num == -1 ) {
            return [];
        }
        $cur = $allPossibles[ $num ];
        array_push( $arr, $cur[ $price ] / $cur[ "Units" ] );
    }
    return [ floor( array_reduce( $arr, "add" ) * $places ) / $places ];
}

function add( $a, $b ) {
    return $a + $b;
}

function getTransaction() {
    include '../../includes/database.php';
    $table = "transactions";
    $num = sql_GET_ALL( $table, [ "ID", "DESC" ] )[ 0 ][ "ID" ] + 1;

    $stmt = $db - > prepare( sql_PUT( $table ) );
    $ex = buildJSONInputWProps( $table, [ "Amount" => 4.5, "Type" => 1, "ID" => $num ] );
    $stmt - > execute( $ex );
    return $num;
}

?>
