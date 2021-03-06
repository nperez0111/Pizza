<?PHP
$possibleRoutes = [
    'users' => [
        'methods' => [ 0, 0, 1, 0 ],
        'props' => [ 'FName', 'LName', 'Email' ],
        'identifier' => 'Email',
        'identifiers' => [ 'FName', 'LName', 'Email' ],
        'orderBy' => 'FName'
    ],
    'orders' => [
        'identifiers' => [ 'ID', 'OrderSymbols', 'DateOrdered', 'TransactionID' ],
        'methods' => [ 0, 0, 1, 0 ],
        'props' => [ 'OrderSymbols', 'TransactionID' ],
        'identifier' => 'ID',
        'time' => 'DateOrdered'
    ],
    'transactions' => [
        'identifiers' => [ 'ID', 'Amount', 'Type' ],
        'methods' => [ 0, 0, 1, 0 ],
        'props' => [ 'Amount', 'Type' ],
        'identifier' => 'ID'
    ],
    'quickOrdersPizza' => [
        'identifiers' => [ 'Name', 'OrderName' ],
        'methods' => [ 1, 0, 0, 0 ],
        'props' => [ 'Name', 'OrderName' ],
        'identifier' => 'OrderName'
    ],
    'quickOrdersSalad' => [
        'identifiers' => [ 'Name', 'OrderName' ],
        'methods' => [ 1, 0, 0, 0 ],
        'props' => [ 'Name', 'OrderName' ],
        'identifier' => 'OrderName'
    ],
    'quickOrdersWings' => [
        'identifiers' => [ 'Name', 'OrderName' ],
        'methods' => [ 1, 0, 0, 0 ],
        'props' => [ 'Name', 'OrderName' ],
        'identifier' => 'OrderName'
    ],
    'quickOrdersDrink' => [
        'identifiers' => [ 'Name', 'OrderName', 'image' ],
        'methods' => [ 1, 0, 0, 0 ],
        'props' => [ 'Name', 'OrderName', 'image' ],
        'identifier' => 'OrderName'
    ],
    'symbols' => [
        'identifiers' => [ 'ID', 'Name', 'Symbol' ],
        'methods' => [ 1, 0, 0, 0 ],
        'props' => [ 'Name', 'Symbol' ],
        'identifier' => 'ID'
    ],
    'tablesInfo' => [
        'identifiers' => [ 'tableName', 'primaryKeyArr', 'description' ],
        'methods' => [ 1, 0, 0, 0 ],
        'props' => [ 'tableName', 'primaryKeyArr', 'description' ],
        'identifier' => 'tableName'
    ],
    'possibleChoices' => [
        'identifiers' => [ 'SymbolID', 'HeadingID' ],
        'methods' => [ 1, 0, 0, 0 ],
        'props' => [ 'SymbolID', 'HeadingID' ],
        'identifier' => 'SymbolID'
    ],
    'choiceHeadings' => [
        'identifiers' => [ 'ID', 'Title' ],
        'methods' => [ 1, 0, 0, 0 ],
        'props' => [ 'ID', 'Title' ],
        'identifier' => 'ID'
    ],
    'pizzaHeadings' => [
        'identifiers' => [ 'Title', 'Name' ],
        'methods' => [ 1, 0, 0, 0 ],
        'props' => [ 'Title', 'Name' ],
        'identifier' => 'Name',
        'orderBy' => 'Title'
    ],
    'ingredients' => [
        'identifiers' => [ 'ID', 'Symbol', 'Priority', 'Price', 'Cost', 'Units', 'unitLabel' ],
        'methods' => [ 1, 0, 0, 0 ],
        'props' => [ 'Symbol', 'Priority', 'Price', 'Cost', 'Units', 'unitLabel' ],
        'identifier' => 'ID'
    ],
    'settings' => [
        'identifiers' => [ 'keyKey', 'val' ],
        'methods' => [ 1, 0, 0, 0 ],
        'props' => [ 'keyKey', 'val' ],
        'identifier' => 'keyKey'
    ],
    'toppingsSVG' => [
        'identifiers' => [ 'ID', 'title', 'svg', 'size' ],
        'methods' => [ 1, 0, 0, 0 ],
        'props' => [ 'title', 'svg', 'size' ],
        'identifier' => 'ID'
    ],
    'unavailableItems' => [
        'identifiers' => [ 'ingredient' ],
        'methods' => [ 1, 0, 0, 0 ],
        'props' => [ 'ingredient' ],
        'identifier' => 'ingredient'
    ],
    'teleSettings' => [
        'identifiers' => [ 'suffix', 'build' ],
        'methods' => [ 1, 0, 0, 0 ],
        'props' => [ 'suffix', 'build' ],
        'identifier' => 'suffix'
    ]
];
//methods refer to [get,post,put,delete]
//props are only for when the object is being added(PUT)
//identifier is default identifier
//identifiers are all possible identifiers
?>
