<?PHP



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
    if ( checkPrivileges( $table )==false||checkTableReqs( $table, $JSON )==false ) {
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
            $allPossibles=sql_GET_JOIN([
            "tables"=> ["symbols"],
            "from"=> "ingredients",
            "relations"=> [
                ["symbols.Name", "ingredients.Symbol"],
            ],
            "select"=> ["symbols.Symbol"]
            ]);
            for($i=0;$i<count($orders);$i++){
                $ingredients=explode(" ",$orders[$i]);
                //from here we need to check that each ingrediant is valid and available?
                for($x=0;$x<count($ingredients);$x++){
                    $ingrediant=$ingredients[$x];
                    $num=isInside($allPossibles,"Symbol",$ingrediant);
                    if($num==-1){
                        rest_error($ingrediant." is not a valid ingredient!",406);
                        return;
                    }
                    $cur=$allPossibles[$num];
                }
                
            }
            $table="orders";

            $JSON["TransactionID"]=getTransaction();


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

function sql_PUT( $table ) {
    $str="INSERT INTO ".$table."(".buildProps( $table, false ).") VALUES(";

    for ( $i=0, $arr=buildProps( $table, true );$i<count( $arr );$i++ ) {
        $str.=":".$arr[$i].( ( $i!==( count( $arr )-1 ) )?",":"" );
    }

    $str.=")";

    return $str;
}

?>