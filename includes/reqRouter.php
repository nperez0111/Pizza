<?PHP

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
            if($req[0]=="getByTime"){
                return 9;
                    //user is requesting a table between a given time
            }
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
                echo $keys[$i];
                return 0;
            }
        }
        if ( isset( $routes[$table] )&&count( sql_GET( [$table, "search", $routes[$table]['identifier'], $JSON[$routes[$table]['identifier']]] ) )==0 ) {
            return 1;
        }
    }
    return 0;
}

?>